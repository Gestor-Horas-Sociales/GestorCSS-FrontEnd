import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Asegúrate de tener este componente
import { Checkbox } from "@/components/ui/checkbox"; // Asegúrate de tener este componente
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  UserPlus,
  Users,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { useAssignment } from "@/hooks/use-assignment";
import type { AssignmentStatus } from "@/Types/AssignmentType";
import Spinner from "@/components/Spinner";
import { useEstudiantes } from "@/hooks/use-estudiantes";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName: string;
  onUpdate?: () => void;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  onUpdate,
}: AssignmentModalProps) {
  const {
    assignments,
    isLoading: loadingAssignments,
    fetchAssignments,
    addAssignment,
    changeStatus,
    removeAssignment,
  } = useAssignment();

  const { estudiantes, loading: loadingStudents } = useEstudiantes();

  // --- NUEVOS ESTADOS ---
  const [globalFilter, setGlobalFilter] = useState(""); // Filtro de texto
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // IDs seleccionados para asignar
  const [isBulkAssigning, setIsBulkAssigning] = useState(false); // Loading local para el bulk

  useEffect(() => {
    if (isOpen && projectId) {
      fetchAssignments(projectId);
      // Limpiar selección al abrir
      setSelectedIds([]);
      setGlobalFilter("");
    }
  }, [isOpen, projectId, fetchAssignments]);

  // 1. Filtrar estudiantes: Que no estén asignados Y que coincidan con el texto de búsqueda
  const filteredCandidates = useMemo(() => {
    if (!estudiantes) return [];

    // Primero quitamos los que ya están asignados al proyecto
    const notAssigned = estudiantes.filter(
      (est) => !assignments.some((assigned) => assigned.student_id === est.id)
    );

    // Si no hay texto de filtro, devolvemos todos los disponibles
    if (!globalFilter) return notAssigned;

    const lowerFilter = globalFilter.toLowerCase();

    // Filtramos por Nombre, Apellido o Carnet
    return notAssigned.filter(
      (est) =>
        est.name.toLowerCase().includes(lowerFilter) ||
        est.lastname.toLowerCase().includes(lowerFilter) ||
        est.student_id_card.toLowerCase().includes(lowerFilter)
    );
  }, [estudiantes, assignments, globalFilter]);

  // Manejar selección individual de checkbox
  const toggleSelection = (studentId: number) => {
    setSelectedIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Seleccionar o Deseleccionar todos los visibles
  const toggleSelectAll = () => {
    if (
      selectedIds.length === filteredCandidates.length &&
      filteredCandidates.length > 0
    ) {
      setSelectedIds([]); // Deseleccionar todos
    } else {
      setSelectedIds(filteredCandidates.map((s) => s.id)); // Seleccionar todos los visibles
    }
  };

  // 2. Lógica de Asignación Masiva
  const handleBulkAssign = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkAssigning(true);
    try {
      // Creamos un array de promesas para ejecutarlas en paralelo
      const promises = selectedIds.map((studentId) =>
        addAssignment({
          project_id: projectId,
          student_id: studentId,
          status: "ACTIVE",
        })
      );

      await Promise.all(promises);

      // Limpieza tras éxito
      setSelectedIds([]);
      setGlobalFilter("");
      onUpdate?.(); // Actualizar datos en componente padre si es necesario
    } catch (error) {
      console.error("Error en asignación masiva", error);
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const isLoading = loadingAssignments || loadingStudents || isBulkAssigning;

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "ABANDONED":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-full max-w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <Users className="w-5 h-5 text-primary" />
            Gestionar Estudiantes
          </DialogTitle>
          <DialogDescription className="line-clamp-1 text-muted-foreground">
            Proyecto:{" "}
            <span className="font-medium text-foreground">{projectName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* --- SECCIÓN NUEVA: BÚSQUEDA Y SELECCIÓN MÚLTIPLE --- */}
          <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <h3 className="text-sm font-medium text-foreground">
                Agregar Estudiantes
              </h3>

              {/* Buscador */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o carnet..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 bg-background"
                />
              </div>
            </div>

            {/* Lista de candidatos con Checkboxes */}
            <div className="border rounded-md bg-background max-h-[200px] overflow-y-auto">
              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {globalFilter
                    ? "No se encontraron estudiantes con ese criterio."
                    : "Todos los estudiantes disponibles ya están asignados."}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {/* Header de la lista pequeña para "Seleccionar todos" */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="h-auto p-0 hover:bg-transparent text-xs text-muted-foreground font-normal flex items-center gap-2"
                    >
                      {selectedIds.length === filteredCandidates.length &&
                      filteredCandidates.length > 0 ? (
                        <>
                          <CheckSquare className="w-4 h-4 text-primary" />{" "}
                          Deseleccionar todos
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4" /> Seleccionar todos
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {selectedIds.length} seleccionados
                    </span>
                  </div>

                  {filteredCandidates.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 transition-colors hover:bg-muted/30 cursor-pointer ${
                        selectedIds.includes(student.id) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => toggleSelection(student.id)}
                    >
                      <Checkbox
                        checked={selectedIds.includes(student.id)}
                        onCheckedChange={() => toggleSelection(student.id)}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm flex-1">
                        <span className="font-semibold text-foreground min-w-[80px]">
                          {student.student_id_card}
                        </span>
                        <span className="text-muted-foreground">
                          {student.name} {student.lastname}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botón de Asignar Masivo */}
            <div className="flex justify-end">
              <Button
                onClick={handleBulkAssign}
                disabled={selectedIds.length === 0 || isLoading}
                className="w-full sm:w-auto"
              >
                {isBulkAssigning ? (
                  <>Asignando...</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Asignar{" "}
                    {selectedIds.length > 0 && `(${selectedIds.length})`}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* --- SECCIÓN ORIGINAL: TABLA DE ASIGNADOS --- */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground px-1">
              Estudiantes Asignados
            </h3>
            <div className="rounded-md border border-border overflow-hidden relative min-h-[200px] flex flex-col bg-background">
              {/* Spinner Overlay */}
              {loadingAssignments && (
                <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center backdrop-blur-sm">
                  <Spinner />
                </div>
              )}

              <div className="overflow-x-auto w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="whitespace-nowrap text-muted-foreground w-[30%]">
                        Estudiante
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-muted-foreground w-[15%]">
                        Carnet
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-muted-foreground w-[15%]">
                        Asignado
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-muted-foreground w-[25%]">
                        Estado
                      </TableHead>
                      <TableHead className="whitespace-nowrap text-right text-muted-foreground w-[15%]">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center h-32 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Users className="w-8 h-8 opacity-20" />
                            <p>No hay estudiantes asignados a este proyecto.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignments.map((assignment) => (
                        <TableRow
                          key={`${assignment.project_id}-${assignment.student_id}`}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="font-medium min-w-[140px] text-foreground">
                            {assignment.student
                              ? `${assignment.student.name} ${assignment.student.lastname}`
                              : "Cargando..."}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-foreground">
                            {assignment.student?.student_id_card || "N/A"}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {assignment.assignedAt
                              ? new Date(
                                  assignment.assignedAt
                                ).toLocaleDateString()
                              : new Date().toLocaleDateString()}
                          </TableCell>
                          <TableCell className="min-w-[140px]">
                            <Select
                              defaultValue={assignment.status}
                              onValueChange={(val) =>
                                changeStatus(
                                  projectId,
                                  assignment.student_id,
                                  val as AssignmentStatus
                                )
                              }
                            >
                              <SelectTrigger
                                className={`h-8 w-full text-xs font-semibold border transition-colors ${getStatusColorClass(
                                  assignment.status
                                )}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Activo</SelectItem>
                                <SelectItem value="COMPLETED">
                                  Finalizado
                                </SelectItem>
                                <SelectItem value="ABANDONED">
                                  Abandonado
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={async () => {
                                await removeAssignment(
                                  projectId,
                                  assignment.student_id
                                );
                                onUpdate?.(); // Refrescar lista de proyectos también
                              }}
                              title="Desvincular estudiante"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

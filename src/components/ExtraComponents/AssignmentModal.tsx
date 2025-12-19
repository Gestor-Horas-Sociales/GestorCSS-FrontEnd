import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Trash2, UserPlus, Users } from "lucide-react";
import { useAssignment } from "@/hooks/use-assignment";
import type { AssignmentStatus } from "@/Types/AssignmentType";
import Spinner from "@/components/Spinner";
import { useEstudiantes } from "@/hooks/use-estudiantes";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName: string;
}

export default function AssignmentModal({
  isOpen,
  onClose,
  projectId,
  projectName,
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  useEffect(() => {
    if (isOpen && projectId) {
      fetchAssignments(projectId);
    }
  }, [isOpen, projectId, fetchAssignments]);

  const availableStudents = useMemo(() => {
    if (!estudiantes) return [];
    return estudiantes.filter(
      (est) => !assignments.some((assigned) => assigned.student_id === est.id)
    );
  }, [estudiantes, assignments]);

  const handleAddStudent = async () => {
    if (!selectedStudentId) return;
    const success = await addAssignment({
      project_id: projectId,
      student_id: Number(selectedStudentId),
      status: "ACTIVE",
    });
    if (success) {
      setSelectedStudentId("");
    }
  };

  const isLoading = loadingAssignments || loadingStudents;

  // Función auxiliar para colores de estado
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
      {/* CAMBIO 1: sm:max-w-5xl para dar más ancho y w-[95vw] para móviles */}
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
          {/* SECCIÓN: AGREGAR ESTUDIANTE 
              CAMBIO 2: Layout flexible. En móvil (default) es columna, en sm es fila.
          */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 p-4 bg-muted/40 rounded-lg border border-border">
            <div className="w-full sm:flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground">
                Agregar Nuevo Estudiante
              </label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger className="bg-background text-foreground w-full border-input">
                  <SelectValue placeholder="Buscar por nombre o carnet..." />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      Todos los estudiantes disponibles ya han sido asignados.
                    </div>
                  ) : (
                    availableStudents.map((student) => (
                      <SelectItem
                        key={student.id}
                        value={student.id.toString()}
                      >
                        <span className="font-medium">
                          {student.student_id_card}
                        </span>
                        <span className="text-muted-foreground mx-1">-</span>
                        {student.name} {student.lastname}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Botón full width en móvil, auto en desktop */}
            <Button
              onClick={handleAddStudent}
              disabled={!selectedStudentId || isLoading}
              className="w-full sm:w-auto shrink-0"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Asignar
            </Button>
          </div>

          {/* SECCIÓN: TABLA DE ASIGNADOS */}
          <div className="rounded-md border border-border overflow-hidden relative min-h-[200px] flex flex-col bg-background">
            {loadingAssignments && (
              <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center backdrop-blur-sm">
                <Spinner />
              </div>
            )}

            {/* Scroll horizontal solo si es necesario */}
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
                            onClick={() =>
                              removeAssignment(projectId, assignment.student_id)
                            }
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
      </DialogContent>
    </Dialog>
  );
}

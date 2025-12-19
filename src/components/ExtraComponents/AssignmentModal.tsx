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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus } from "lucide-react";
import { useAssignment } from "@/hooks/use-assignment";
import type { AssignmentStatus } from "@/Types/AssignmentType";
import Spinner from "@/components/Spinner";

// 1. IMPORTAMOS EL HOOK REAL
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
  // Hook de asignaciones (logica de union)
  const {
    assignments,
    isLoading: loadingAssignments,
    fetchAssignments,
    addAssignment,
    changeStatus,
    removeAssignment,
  } = useAssignment();

  // 2. USAMOS EL HOOK DE ESTUDIANTES (Data real)
  const { estudiantes, loading: loadingStudents } = useEstudiantes();

  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Cargar asignaciones al abrir el modal
  useEffect(() => {
    if (isOpen && projectId) {
      fetchAssignments(projectId);
    }
  }, [isOpen, projectId, fetchAssignments]);

  // 3. FILTRO INTELIGENTE:
  // Calculamos qué estudiantes NO están asignados todavía a este proyecto.
  // Así evitas duplicados en el Select.
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
      status: "ACTIVE"
    });

    if (success) {
      setSelectedStudentId(""); // Limpiar select tras éxito
    }
  };

  const isLoading = loadingAssignments || loadingStudents;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestionar Estudiantes: {projectName}</DialogTitle>
          <DialogDescription>
            Agrega estudiantes, cambia su estado o elimínalos del proyecto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* SECCIÓN: AGREGAR ESTUDIANTE */}
          <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Agregar Estudiante</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Seleccionar estudiante..." />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No hay estudiantes disponibles o todos ya están asignados.
                    </div>
                  ) : (
                    // 4. MAPEAMOS LOS DATOS REALES
                    availableStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {/* Usamos las propiedades reales: student_id_card, name, lastname */}
                        {student.student_id_card} - {student.name} {student.lastname}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddStudent} disabled={!selectedStudentId || isLoading}>
              <UserPlus className="w-4 h-4 mr-2" />
              Asignar
            </Button>
          </div>

          {/* SECCIÓN: TABLA DE ASIGNADOS */}
          <div className="rounded-md border relative min-h-[200px]">
            {loadingAssignments && (
              <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Carnet</TableHead>
                  <TableHead>Fecha Asignación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No hay estudiantes asignados a este proyecto.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow key={`${assignment.project_id}-${assignment.student_id}`}>
                      <TableCell className="font-medium">
                        {/* Como en el backend incluimos 'student', aquí mostramos sus datos */}
                        {assignment.student ? `${assignment.student.name} ${assignment.student.lastname}` : "Cargando..."}
                      </TableCell>
                      <TableCell>
                         {assignment.student?.student_id_card || "N/A"}
                      </TableCell>
                      <TableCell>
                        {/* assignedAt viene del backend si la tabla tiene createdAt, si no usas new Date() */}
                        {assignment.assignedAt 
                            ? new Date(assignment.assignedAt).toLocaleDateString() 
                            : new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={assignment.status} 
                          onValueChange={(val) => changeStatus(projectId, assignment.student_id, val as AssignmentStatus)}
                        >
                          <SelectTrigger className={`h-8 w-[130px] text-xs font-medium border-none
                            ${assignment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                              assignment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Activo</SelectItem>
                            <SelectItem value="COMPLETED">Finalizado</SelectItem>
                            <SelectItem value="ABANDONED">Abandonado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeAssignment(projectId, assignment.student_id)}
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
      </DialogContent>
    </Dialog>
  );
}
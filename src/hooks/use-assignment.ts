/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import {
  getAssignmentsByProject,
  createAssignment,
  updateAssignmentStatus,
  deleteAssignment,
} from "@/api/assignment"; 
import type {
  AssignmentType,
  AssignmentSchemaType,
  AssignmentStatus,
} from "@/Types/AssignmentType";
import { toast } from "sonner"; 

export const useAssignment = () => {
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. CARGAR ASIGNACIONES
  const fetchAssignments = useCallback(async (projectId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssignmentsByProject(projectId);
      setAssignments(data);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar asignaciones: " + (err.response?.data?.error || ""));
      toast.error("Error al cargar asignaciones: " + (err.response?.data?.error || ""));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. AGREGAR ESTUDIANTE (Create)
  const addAssignment = async (data: AssignmentSchemaType) => {
    setIsLoading(true);
    try {
      // CORRECCIÓN: Quitamos 'const newAssignment = ...'
      // Solo esperamos a que se cree en la DB
      await createAssignment(data);

      // Inmediatamente recargamos la lista para obtener los datos del estudiante (nombre, foto, etc.)
      await fetchAssignments(data.project_id);
      
      toast.success("Estudiante asignado correctamente");
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Error al asignar estudiante";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. CAMBIAR ESTADO (Update)
  const changeStatus = async (projectId: number, studentId: number, newStatus: AssignmentStatus) => {
    // Optimistic Update
    const originalAssignments = [...assignments];
    setAssignments((prev) =>
      prev.map((a) =>
        a.project_id === projectId && a.student_id === studentId
          ? { ...a, status: newStatus }
          : a
      )
    );

    try {
      await updateAssignmentStatus(projectId, studentId, newStatus);
      toast.success(`Estado actualizado a ${newStatus}`);
    } catch (err: any) {
      setAssignments(originalAssignments);
      toast.error("Error al actualizar el estado: " + (err.response?.data?.error || ""));
    }
  };

  // 4. ELIMINAR ASIGNACIÓN (Delete)
  const removeAssignment = async (projectId: number, studentId: number) => {
    if (!confirm("¿Estás seguro de desvincular a este estudiante?")) return;

    setIsLoading(true);
    try {
      await deleteAssignment(projectId, studentId);
      
      setAssignments((prev) => 
        prev.filter((a) => !(a.project_id === projectId && a.student_id === studentId))
      );
      
      toast.success("Asignación eliminada");
    } catch (err: any) {
      toast.error("Error al eliminar asignación: " + (err.response?.data?.error || ""));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignments,
    isLoading,
    error,
    fetchAssignments,
    addAssignment,
    changeStatus,
    removeAssignment,
  };
};
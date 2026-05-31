import { api } from "./axios"; 
import type { 
  AssignmentType, 
  AssignmentSchemaType, 
  AssignmentStatus 
} from "@/Types/AssignmentType";

// 1. CREAR (Aquí estaba el error)
export const createAssignment = (data: AssignmentSchemaType) => {
  // TRANSFORMACIÓN: Convertimos snake_case (del form) a camelCase (para el backend)
  const payload = {
    projectId: data.project_id,
    studentId: data.student_id,
    status: data.status
  };

  return api.post<AssignmentType>("/assignments", payload);
};

// 2. OBTENER (GET)
export const getAssignmentsByProject = async (projectId: number) => {
  // Enviamos camelCase en los query params
  const response = await api.get(`/assignments?projectId=${projectId}`);
  return response.data as AssignmentType[];
};

// 3. ACTUALIZAR ESTADO (PATCH)
export const updateAssignmentStatus = (projectId: number, studentId: number, newStatus: AssignmentStatus) => {
  // El backend espera camelCase aquí también
  return api.patch<AssignmentType>("/assignments", {
    projectId,
    studentId,
    newStatus
  });
};

// 4. ELIMINAR (DELETE)
export const deleteAssignment = (projectId: number, studentId: number) => 
  // Enviamos camelCase en los query params
  api.delete(`/assignments?projectId=${projectId}&studentId=${studentId}`);
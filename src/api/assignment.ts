import { api } from "./axios"; // tu instancia centralizada
import type {
    AssignmentType,
    AssignmentSchemaType,
    AssignmentStatus
} from "@/Types/AssignmentType";

// Crear una nueva asignación (Vincular estudiante)
export const createAssignment = (data: AssignmentSchemaType) =>
    api.post<AssignmentType>("/assignments", data);

// Obtener todas las asignaciones de un proyecto específico
export const getAssignmentsByProject = async (projectId: number) => {
    // Nota: Enviamos el ID como Query Param (?projectId=1)
    const response = await api.get(`/assignments?projectId=${projectId}`);

    // Dependiendo de cómo tengas tu axios interceptor, podría ser response.data o response.data.data
    // Basado en el backend que hicimos, devuelve el array directo:
    return response.data as AssignmentType[];
};

// Actualizar el estado (Ej: de ACTIVE a COMPLETED)
export const updateAssignmentStatus = (projectId: number, studentId: number, newStatus: AssignmentStatus) => {
    return api.patch<AssignmentType>("/assignments", {
        projectId,
        studentId,
        newStatus
    });
};

// Eliminar una asignación (Desvincular estudiante)
export const deleteAssignment = (projectId: number, studentId: number) =>
    // Nota: Enviamos ambos IDs como Query Params
    api.delete(`/assignments?projectId=${projectId}&studentId=${studentId}`);
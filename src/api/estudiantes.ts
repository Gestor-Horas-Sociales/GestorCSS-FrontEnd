import { api } from "./axios"; // tu instancia centralizada
import type { StudentType } from "@/Types/Student"; // define el tipo si lo tienes

// Obtener todos los estudiantes
export const getEstudiantes = async () => {
  const response = await api.get("/students"); 
  return response.data.data as StudentType[];
}

// Obtener un estudiante por ID
export const getEstudianteById = (id: string) =>
  api.get<StudentType>(`/students/${id}`);

// Crear un nuevo estudiante
export const createEstudiante = (data: Omit<StudentType, "id">) =>
  api.post<StudentType>("/students", data);

// Actualizar un estudiante existente
export const updateEstudiante = (id: string, data: Partial<StudentType>) =>
  api.put<StudentType>(`/students/${id}`, data);

// Eliminar un estudiante por ID
export const deleteEstudiante = (id: string) =>
  api.delete(`/students/${id}`);
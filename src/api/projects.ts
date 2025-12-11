import { api } from "./axios";
import type { ProjectType, ProjectSchemaType } from "@/Types/ProyectType";

// Obtener todos: Retorna la estructura completa (lectura)
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.data as ProjectType[];
};

// Obtener por ID: Recibe number, retorna estructura completa
export const getProjectById = async (id: number) => {
  const response = await api.get<{ data: ProjectType }>(`/projects/${id}`);
  return response.data.data;
};

// Crear: Usa el Schema del formulario (asegura que institution_ids vaya incluido)
export const createProject = (data: ProjectSchemaType) =>
  api.post<{ data: ProjectType; message: string }>("/projects", data);

// Actualizar: Recibe ID number y parcial del Schema
export const updateProject = (id: number, data: Partial<ProjectSchemaType>) => {
  return api.patch<{ data: ProjectType; message: string }>(`/projects/${id}`, data);
};

// Eliminar: Recibe number
export const deleteProject = (id: number) => 
  api.delete<{ message: string }>(`/projects/${id}`);
import { api } from "./axios";
import type {
  ProjectType,
  ProjectSchemaType,
} from "@/Types/ProyectType";
import type { MapProject, ProjectMapDetails } from "@/Types/MapType";

// 1. OBTENER TODOS
// Usamos el genérico <{ data: ProjectType[] }> para mayor seguridad
export const getProjects = async () => {
  const response = await api.get<{ data: ProjectType[] }>("/projects");
  return response.data.data;
};

// 2. OBTENER POR ID
export const getProjectById = async (id: number) => {
  const response = await api.get<{ data: ProjectType }>(`/projects/${id}`);
  return response.data.data;
};

// 3. CREAR
// Nota: El Schema ya valida que institution_id (singular) vaya incluido
export const createProject = (data: ProjectSchemaType) =>
  api.post<{ data: ProjectType; message: string }>("/projects", data);

// 4. ACTUALIZAR
export const updateProject = (id: number, data: Partial<ProjectSchemaType>) => {
  return api.patch<{ data: ProjectType; message: string }>(
    `/projects/${id}`,
    data
  );
};

// 5. ELIMINAR
export const deleteProject = (id: number) =>
  api.delete<{ message: string }>(`/projects/${id}`);

// 6. PROYECTOS PARA EL MAPA (con coordenadas y métricas básicas)
export const getProjectsMap = async () => {
  const response = await api.get<{ data: MapProject[] }>("/projects/map");
  return response.data.data;
};

// 7. MÉTRICAS DE UN PROYECTO PARA EL MAPA
export const getProjectMapDetails = async (id: number) => {
  const response = await api.get<{ data: ProjectMapDetails }>(
    `/projects/${id}/map-details`
  );
  return response.data.data;
};
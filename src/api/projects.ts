import { api } from "./axios"; // tu instancia centralizada
import type { ProjectType } from '@/Types/ProyectType';


export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data.data as ProjectType[];
};

export const getProjectById = (id: string) =>
    api.get<ProjectType>(`/projects/${id}`);

export const createProject = (data: Omit<ProjectType, 'id'>) =>
    api.post<ProjectType>('/projects', data);

export const updateProject = (id: string, data: Partial<ProjectType>) => {
    delete data.id; // Asegúrate de no enviar el ID en la actualización
    return api.patch<ProjectType>(`/projects/${id}`, data);
}

export const deleteProject = (id: string) =>
    api.delete(`/projects/${id}`);

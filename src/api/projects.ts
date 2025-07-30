import { api } from "./axios"
import type { ProjectType } from "@/Types/ProyectType"

export const getProjects = async () => {
  const response = await api.get("/projects")
  return response.data.data as ProjectType[]
}

export const getProjectById = async (id: string) => {
  const response = await api.get<{ data: ProjectType }>(`/projects/${id}`)
  return response.data.data
}

export const createProject = (data: Omit<ProjectType, "id">) =>
  api.post<{ data: ProjectType; message: string }>("/projects", data)

export const updateProject = (id: string, data: Partial<Omit<ProjectType, "id">>) => {
  // Asegúrate de no enviar el ID en la actualización, ya que está en la URL
  // y el backend podría no esperarlo en el cuerpo.
  return api.patch<{ data: ProjectType; message: string }>(`/projects/${id}`, data)
}

export const deleteProject = (id: string) => api.delete<{ message: string }>(`/projects/${id}`)

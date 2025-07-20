import type { InstitutionType, InstitutionPayload } from "@/Types/InstitutionType";
import { api } from "./axios";

// Obtener todas las instituciones
export const getInstitutions = async () => {
  const response = await api.get("/institutions");
  return response.data.data as InstitutionType[];
};

// Obtener una institución por ID
export const getInstitutionById = (id: string) =>
  api.get<InstitutionType>(`/institutions/${id}`);

// Crear una nueva institución
export const createInstitution = (data: Omit<InstitutionPayload, "id">) =>
  api.post<InstitutionPayload>("/institutions", data);

// Actualizar una institución existente
export const updateInstitution = (id: number, data: Partial<InstitutionType>) =>
  api.patch<InstitutionType>(`/institutions/${id}`, data);

// Eliminar una institución por ID
export const deleteInstitution = (id: number) =>
  api.delete(`/institutions/${id}`);

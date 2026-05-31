import type { InstitutionType, InstitutionPayload } from "@/Types/InstitutionType";
import { api } from "./axios";

// Obtener todas las instituciones
export const getInstitutions = async () => {
  const response = await api.get("/institutions");
  return response.data.data as InstitutionType[];
};

// Obtener una institución por ID
// CAMBIO: id ahora es number para ser consistente con el resto
export const getInstitutionById = (id: number) =>
  api.get<InstitutionType>(`/institutions/${id}`);

// Crear una nueva institución
// NOTA: Typescript validará 'InstitutionPayload'. Asegúrate que email/district sean opcionales ahí.
export const createInstitution = (data: InstitutionPayload) =>
  api.post("/institutions", data);

// Actualizar una institución existente
export const updateInstitution = (id: number, data: Partial<InstitutionType>) =>
  api.patch<InstitutionType>(`/institutions/${id}`, data);

// Eliminar una institución por ID
export const deleteInstitution = (id: number) =>
  api.delete(`/institutions/${id}`);
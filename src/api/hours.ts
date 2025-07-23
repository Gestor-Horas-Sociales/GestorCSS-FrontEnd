import type { HoursRecordPayload, HoursRecordType } from "@/Types/HoursType";
import { api } from "./axios";

// Obtener todas las horas
export const getAllHoursRecord = async () => {
  const response = await api.get("/recordhours");
  return response.data.data as HoursRecordType[];
};

// Obtener horas por ID
export const getHoursRecordById = (id: string) =>
  api.get<HoursRecordType>(`/recordhours/${id}`);

//Crear una nuevo registro de horas
export const createHoursRecord = (data: Omit<HoursRecordType, "id">) =>
    api.post<HoursRecordPayload>("/recordhours", data);

// Actualizar un registro de horas existente
export const updateHoursRecord = (id: number, data: Partial<HoursRecordType>) =>
    api.patch<HoursRecordType>(`/recordhours/${id}`, data);

// Eliminar un registro de horas por ID
export const deleteHoursRecord = (id: number) =>
    api.delete(`/recordhours/${id}`);
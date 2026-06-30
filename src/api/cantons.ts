import type { Canton } from "@/Types/CantonType";
import { api } from "./axios";

// Obtener todos los cantones
export const getCantons = async () => {
  const response = await api.get<{ data: Canton[] }>("/cantons");
  return response.data.data;
};

// Obtener cantones por ID de distrito
export const getCantonsByDistrictId = async (id: number) => {
  const response = await api.get<{ data: Canton[] }>(`/cantons/district/${id}`);
  return response.data.data;
};

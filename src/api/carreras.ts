import { api } from "./axios"; 
import type { CareerType } from "@/Types/CareerType"; 

// Obtener todas las carreras
export const getCarreras = async () => {
  const response = await api.get("/careers");
  return response.data.data as CareerType[];
}
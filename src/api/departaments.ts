import type { Departament } from "@/Types/DepartamentType";
import { api } from "./axios";

// Obtener todos los departamentos
export const getDepartaments = async () => {
  const response = await api.get("/departaments");
  return response.data.data as Departament[];
}
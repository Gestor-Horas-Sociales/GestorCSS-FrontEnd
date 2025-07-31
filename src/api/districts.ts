import type { District } from "@/Types/DistrictType";
import type { Departament } from "@/Types/DepartamentType";
import { api } from "./axios";

// Obtener todos los distritos
export const getDistricts = async () => {
  const response = await api.get("/districts");
  return response.data.data as District[];
};

// Obtener un distrito por ID Departamento
export const getDistrictByIdDepartament = async (id: number) => {
    const response = await api.get<Departament[]>(`/districts/department/${id}`);
    return response.data as Departament[];
}

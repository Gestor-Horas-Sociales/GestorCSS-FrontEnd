import { api } from "./axios";
import type { DepartamentoType } from "@/Types/DepartamentoType";

// Obtener todos los departamentos
export const getDepartamentos = async () => {
    const response = await api.get("/departments");
    return response.data.data as DepartamentoType[];
}
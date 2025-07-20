import type { DepartamentoType } from "@/Types/DepartamentoType";
import { getDepartamentos } from "@/api/departamentos";
import { useEffect, useState } from "react";

export const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        setError("Error al cargar departamentos");
        console.error("Error al cargar departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  return { departamentos, error };
};
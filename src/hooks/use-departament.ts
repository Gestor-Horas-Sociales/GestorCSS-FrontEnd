import type { Departament } from "@/Types/DepartamentType";
import { useState, useEffect, useCallback } from "react";
import { getDepartaments } from "@/api/departaments";

export const useDepartament = () => {
  const [departaments, setDepartaments] = useState<Departament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllDepartaments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDepartaments();
      setDepartaments(data);
    } catch (error) {
      console.error("Error fetching departaments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllDepartaments();
  }, [getAllDepartaments]);

  return {
    departaments,
    loading,
  };
}

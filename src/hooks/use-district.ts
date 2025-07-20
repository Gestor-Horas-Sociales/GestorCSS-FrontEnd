import type { District } from "@/Types/DistrictType";
import { useState, useEffect, useCallback } from "react";
import type { Departament } from "@/Types/DepartamentType";
import { getDistricts, getDistrictByIdDepartament } from "@/api/districts";

export const useDistrict = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [departamentsDistrict, setDepartamentsDistrict] = useState<Departament[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDepartaments, setLoadingDepartaments] = useState<boolean>(false);

  const getAllDepartamentsByDistrict = useCallback(async (id: number) => {
    setLoadingDepartaments(true);
    try {
      const response = await getDistrictByIdDepartament(id);
      setDepartamentsDistrict(response);
    } catch (error) {
      console.error("Error fetching departaments:", error);
    } finally {
      setLoadingDepartaments(false);
    }
  }, []);

  const getAllDistricts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDistricts();
      setDistricts(response);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllDistricts();
  }, [getAllDistricts]);

  return {
    districts,
    loading,
    departamentsDistrict,
    getAllDepartamentsByDistrict,
    loadingDepartaments,
  };
}

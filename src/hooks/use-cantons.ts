import { useState, useCallback } from "react";
import type { Canton } from "@/Types/CantonType";
import { getCantonsByDistrictId } from "@/api/cantons";

export const useCantons = () => {
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [loadingCantons, setLoadingCantons] = useState<boolean>(false);

  const getAllCantonsByDistrict = useCallback(async (districtId: number) => {
    setLoadingCantons(true);
    try {
      const response = await getCantonsByDistrictId(districtId);
      setCantons(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching cantons:", error);
      setCantons([]);
    } finally {
      setLoadingCantons(false);
    }
  }, []);

  const clearCantons = useCallback(() => setCantons([]), []);

  return {
    cantons,
    loadingCantons,
    getAllCantonsByDistrict,
    clearCantons,
  };
};

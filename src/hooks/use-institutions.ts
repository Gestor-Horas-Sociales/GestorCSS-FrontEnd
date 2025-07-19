import type {
  InstitutionType,
  InstitutionSchema,
} from "@/Types/InstitutionType";
import { getInstitutions, deleteInstitution } from "@/api/institutions";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";

export const useInstitutions = () => {
  const [institutions, setInstitutions] = useState<InstitutionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);

  const handleDeleteInstitution = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteInstitution(id);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error al eliminar la institución:", error);
      toast.error("Error al eliminar la institución");
    } finally {
      setLoading(false);
      getAllInstitutions();
    }
  };

  const insertInstitution = async (data: z.infer<typeof InstitutionSchema>) => {
    setLoading(true);

    console.log("Insertando institución:", data);
    console.log("Active Edit:", activeEdit);
    try {
      toast.success("Institución creada exitosamente");
    } catch (error: unknown) {
      console.error("Error al crear la institución:", error);
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
      getAllInstitutions();
    }
  };

  const getAllInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInstitutions();
      setInstitutions(data);
    } catch (error) {
      console.error("Error al cargar instituciones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllInstitutions();
  }, [getAllInstitutions]);

  return {
    institutions,
    loading,
    handleDeleteInstitution,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertInstitution,
  };
};

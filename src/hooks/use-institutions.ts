import type {
  InstitutionType,
  InstitutionSchema,
} from "@/Types/InstitutionType";
import {
  getInstitutions,
  deleteInstitution,
  updateInstitution,
  createInstitution,
} from "@/api/institutions";
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
    try {
      if (activeEdit) {
        const response = await updateInstitution(Number(data.id), {
          name: data.name,
          email: data.email,
          district_id: data.district_id,
          address: data.address,
          phone: data.phone,
        });
        setActiveEdit(false);
        setOpen(false);
        toast.success(response.data.message);
      } else {
        const response = await createInstitution({
          name: data.name,
          email: data.email,
          district_id: data.district_id,
          address: data.address ? data.address : "",
          phone: data.phone ? data.phone : "",
        });

        toast.success(response.data.message);
        setOpen(false);
      }
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

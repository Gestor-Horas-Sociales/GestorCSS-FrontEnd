"use client";

import type {
  HoursRecordType,
  HoursRecordSchema
} from "@/Types/HoursType";
import {
  getAllHoursRecord as fetchAllHoursRecord,
  deleteHoursRecord,
  updateHoursRecord,
  createHoursRecord,
} from "@/api/hours";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import type { AxiosError } from "axios";

export const useHoursRecord = () => {
  const [hours, setHours] = useState<HoursRecordType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);

  const handleDeleteHoursRecord = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteHoursRecord(id);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error al eliminar el registro de horas:", error);
      toast.error("Error al eliminar el registro de horas");
    } finally {
      setLoading(false);
      fetchAllHours();
    }
  };

  const insertHoursRecord = async (data: z.infer<typeof HoursRecordSchema>) => {
    setLoading(true);
    try {
      // Convertir el objeto Date a string ISO para el payload de la API
      const payload = {
        student_id: data.student_id,
        project_id: data.project_id,
        date_register: data.date_register.toISOString(), // Convertir a string ISO
        description: data.description || "",
        hours: data.hours,
        type_hours_id: data.type_hours_id,
      };

      if (activeEdit) {
        const response = await updateHoursRecord(Number(data.id), {
          ...payload,
          date_register: new Date(payload.date_register), // Convert back to Date
        });
        setActiveEdit(false);
        payload.date_register = payload.date_register.toString(); // Ensure it's a string in ISO format
        setOpen(false);
        toast.success(response.data.message);
      } else {
        const response = await createHoursRecord({
          ...payload,
          date_register: new Date(payload.date_register), // Convert to Date
        });
        toast.success(response.data.message);
        payload.date_register = payload.date_register.toString(); // Ensure it's a string in ISO format
        setOpen(false);
      }
    } catch (error: unknown) {
      console.error("Error al crear el registro de horas:", error);
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message;
      toast.error(message || "Error al crear el registro de horas");
    } finally {
      setLoading(false);
      fetchAllHours();
    }
  };

  const fetchAllHours = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllHoursRecord();
      setHours(data);
    } catch (error) {
      console.error("Error al obtener los registros de horas:", error);
      toast.error("Error al cargar los registros de horas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHours();
  }, [fetchAllHours]);

  const getHoursByType = useCallback(
    (typeId: number) => {
      return hours.filter((hour) => hour.type_hours_id === typeId);
    },
    [hours]
  );

  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return "";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return {
    hours,
    loading,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    handleDeleteHoursRecord,
    insertHoursRecord,
    getAllHoursRecord: fetchAllHours,
    getHoursByType,
    formatDateForInput,
  };
};

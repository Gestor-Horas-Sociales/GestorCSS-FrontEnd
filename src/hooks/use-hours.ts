import {
    type HoursRecordType,
    HoursRecordSchema,
} from "@/Types/HoursType";
import {
    getAllHoursRecord as fetchAllHoursRecord, // Renombramos la importación
    deleteHoursRecord,
    updateHoursRecord,
    createHoursRecord,
} from "@/api/hours";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";

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
            fetchAllHours(); // Usamos la función renombrada
        }
    };

    const insertHoursRecord = async (data: z.infer<typeof HoursRecordSchema>) => {
        setLoading(true);
        try {
            if (activeEdit) {
                const response = await updateHoursRecord(Number(data.id), {
                    student_id: data.student_id,
                    project_id: data.project_id,
                    date_register: data.date_register,
                    description: data.description,
                    hours: data.hours,
                    typeHours_id: data.typeHours_id,
                });
                setActiveEdit(false);
                setOpen(false);
                toast.success(response.data.message);
            } else {
                const response = await createHoursRecord({
                    student_id: data.student_id,
                    project_id: data.project_id,
                    date_register: data.date_register,
                    description: data.description,
                    hours: data.hours,
                    typeHours_id: data.typeHours_id,
                });
                toast.success(response.data.message);
                setOpen(false);
            }
        } catch (error: unknown) {
            console.error("Error al crear el registro de horas:", error);
            const err = error as AxiosError<{ message?: string }>;
            const message = err.response?.data?.message;
            toast.error(message || "Error al crear el registro de horas");
        } finally {
            setLoading(false);
            fetchAllHours(); // Usamos la función renombrada
        }
    };

    // Función renombrada para evitar conflicto
    const fetchAllHours = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllHoursRecord(); // Ahora usa la función importada
            setHours(data); // data ya es HoursRecordType[] (gracias al "as" en la API)
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

    return {
        hours,
        loading,
        open,
        setOpen,
        activeEdit,
        setActiveEdit,
        handleDeleteHoursRecord,
        insertHoursRecord,
        getAllHoursRecord: fetchAllHours, // Opcional: si necesitas exponer esta función
    };
};
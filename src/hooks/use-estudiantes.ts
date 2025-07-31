import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";
import { StudentSchema } from "@/Types/StudentType";
import type { StudentType, StudentExcel } from "@/Types/StudentType";
import {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  deleteEstudiante,
  updateEstudiante,
  createEstudiantesFromExcel,
} from "@/api/estudiantes";

export const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState<StudentType[]>([]);
  const [currentEstudiante, setCurrentEstudiante] =
    useState<StudentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);

  const insertStudentsFromExcel = async (students: StudentExcel[]) => {
    if (!students.length) {
      toast.error("No hay estudiantes para insertar");
      return;
    }

    console.log("Insertando estudiantes desde Excel:", students);

    setLoading(true);
    try {
      const response = await createEstudiantesFromExcel({ students });
      console.log("Respuesta de insertar estudiantes desde Excel:", response.data);
      toast.success(`Se insertaron ${response.data.inserted} estudiantes`);
      if (response.data.errors?.length) {
        console.warn("Errores en algunos registros:", response.data.errors);
      }
      await getAllStudents();
    } catch (err) {
      console.error("Error al insertar estudiantes desde Excel:", err);
      const error = err as AxiosError<{ message?: string }>;
      toast.error(
        error.response?.data?.message || "Error al insertar estudiantes"
      );
    } finally {
      setLoading(false);
    }
  };
  // Cargar todos los estudiantes
  const getAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEstudiantes();
      setEstudiantes(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      toast.error("Error al cargar la lista de estudiantes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar un estudiante específico por ID
  const loadEstudiante = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await getEstudianteById(id.toString());
      setCurrentEstudiante(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cargar estudiante:", error);
      toast.error("Error al cargar datos del estudiante");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar estudiante
  const handleDeleteEstudiante = async (id: number) => {
    setLoading(true);
    try {
      await deleteEstudiante(id.toString());
      toast.success("Estudiante eliminado correctamente");
      await getAllStudents();
    } catch (err) {
      console.error("Error al eliminar el estudiante:", err);
      toast.error("Error al eliminar el estudiante");
    } finally {
      setLoading(false);
    }
  };

  // Preparar formulario para edición
  const prepareEdit = async (id: number) => {
    const estudiante = await loadEstudiante(id);
    if (estudiante) {
      setOpen(true);
      setActiveEdit(true);
    }
  };

  // Insertar o actualizar estudiante
  const insertStudent = async (data: z.infer<typeof StudentSchema>) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        career_year: data.career_year,
        gender: data.gender || "",
        active: data.active ?? false,
        internal_hours: data.internal_hours ?? 0,
        external_hours: data.external_hours ?? 0,
        address: data.address ?? "",
        district_id: data.district_id,
        student_id_card: data.student_id_card ?? "",
        career_id: data.career?.career_id ?? 0,
      };

      if (activeEdit && data.id) {
        await updateEstudiante(data.id.toString(), payload);
        toast.success("Estudiante actualizado correctamente");
      } else {
        await createEstudiante(payload);
        toast.success("Estudiante creado correctamente");
      }

      setOpen(false);
      setActiveEdit(false);
      await getAllStudents();
    } catch (err: unknown) {
      console.error("Error al insertar o actualizar el estudiante:", err);
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  // Resetear el estado al cerrar el modal
  const handleCloseModal = () => {
    setOpen(false);
    setActiveEdit(false);
    setCurrentEstudiante(null);
  };

  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  const calcularHoras = (estudiante: StudentType) => {
    const horasInternas = estudiante.internal_hours || 0;
    const horasExternas = estudiante.external_hours || 0;
    const horasCompletadas = horasInternas + horasExternas;
    const horasRequeridas = 600;
    const porcentaje = Math.min(
      100,
      Math.round((horasCompletadas / horasRequeridas) * 100)
    );
    return { horasCompletadas, horasRequeridas, porcentaje };
  };

  return {
    estudiantes,
    currentEstudiante,
    loading,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    handleDeleteEstudiante,
    insertStudent,
    prepareEdit,
    handleCloseModal,
    calcularHoras,
    insertStudentsFromExcel,
  };
};

import { useEffect, useState } from "react";
import {
  getEstudiantes,
  createEstudiante,
  deleteEstudiante,
} from "@/api/estudiantes";
import type { StudentType } from "@/Types/StudentType";
import { getEstudianteById, updateEstudiante } from "@/api/estudiantes";

export const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState<StudentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCarrera, setFilterCarrera] = useState("all");
  const [filterAño, setFilterAño] = useState("all");
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [error, setError] = useState("");

  // FormData con career_id explícito, sin career ni location
  type FormDataType = Omit<StudentType, "id" | "career"> & { career_id: number; id?: number };

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    lastname: "",
    email: "",
    career_year: new Date().getFullYear(),
    gender: "",
    active: true,
    internal_hours: 0,
    external_hours: 0,
    student_id_card: 0,
    district_id: 1,
    address: "",
    career_id: 1,
  });

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await getEstudiantes();
        setEstudiantes(data);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      }
    };
    fetchEstudiantes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]:
        name === "career_id" || name === "district_id" || name === "career_year"
          ? Number(value)
          : value,
    });
  };

  // Reset form limpio
  const resetForm = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      career_year: new Date().getFullYear(),
      gender: "",
      active: true,
      internal_hours: 0,
      external_hours: 0,
      student_id_card: 0,
      district_id: 1,
      address: "",
      career_id: 1,
      id: undefined,
    });
    setError("");
  };

  const prepararDatosEstudiante = (formData: FormDataType) => ({
    id: formData.id && formData.id > 0 ? formData.id : undefined,
    name: formData.name || "",
    lastname: formData.lastname || "",
    email: formData.email || "",
    internal_hours: Number(formData.internal_hours) || 0,
    external_hours: Number(formData.external_hours) || 0,
    student_id_card: Number(formData.student_id_card) || 0,
    gender: formData.gender,
    career_year: Number(formData.career_year) || 1,
    career_id: Number(formData.career_id) || 1,
    active: Boolean(formData.active),
    address: formData.address || "",
    district_id: Number(formData.district_id) || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const esEdicion = !!formData.id && formData.id > 0;

      let response;

      if (esEdicion) {
        console.log("Editando estudiante:", formData);
        // PUT si es edición
        if (formData.id !== undefined) {
          response = await updateEstudiante(formData.id.toString(), formData);
        } else {
          throw new Error("formData.id is undefined");
        }
      } else {
        // POST si es nuevo
        response = await createEstudiante(prepararDatosEstudiante(formData));
      }

      const estudianteActualizado = response.data;

      setEstudiantes((prev) =>
        esEdicion
          ? prev.map((est) =>
            est.id === formData.id ? estudianteActualizado : est
          )
          : [...prev, estudianteActualizado]
      );

      setIsNewUserModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Fallo en el registro:", err);
      setError("Ocurrió un error al registrar o actualizar el estudiante");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      return;
    }
    try {
      await deleteEstudiante(id.toString());
      setEstudiantes(estudiantes.filter((estudiante) => estudiante.id !== id));
    } catch (error) {
      console.error("Error al eliminar estudiante:", error);
      setError("Ocurrió un error al eliminar el estudiante");
    }
  };

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

  const fetchEstudianteById = async (id: number) => {
    try {
      const estudiante = await getEstudianteById(id.toString());
      return estudiante;
    } catch (error) {
      console.error("Error al obtener estudiante:", error);
      return null;
    }
  };

  // Carga datos en formData para editar
  const startEdit = (estudiante: StudentType) => {
    setFormData({
      id: estudiante.id,
      name: estudiante.name,
      lastname: estudiante.lastname,
      email: estudiante.email,
      student_id_card: estudiante.student_id_card,
      gender: estudiante.gender || "",
      active: estudiante.active,
      internal_hours: estudiante.internal_hours,
      external_hours: estudiante.external_hours,
      address: estudiante.address || "",
      district_id: estudiante.district_id || 1,
      career_year: estudiante.career_year,
      career_id: estudiante.career?.id || 1,
    });
    setIsNewUserModalOpen(true);
  };

  return {
    estudiantes,
    searchTerm,
    setSearchTerm,
    filterCarrera,
    setFilterCarrera,
    filterAño,
    setFilterAño,
    isNewUserModalOpen,
    setIsNewUserModalOpen,
    formData,
    setFormData,
    error,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleDelete,
    calcularHoras,
    fetchEstudianteById,
    startEdit,
    prepararDatosEstudiante,
    resetForm
  };
};
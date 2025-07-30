"use client"

import type { ProjectType, ProjectSchema } from "../Types/ProyectType" // Usar ProjectSchemaType
import { getProjects, createProject, updateProject, deleteProject, getProjectById } from "../api/projects"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import type { AxiosError } from "axios"

export const useProjects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [currentProject, setCurrentProject] = useState<ProjectType | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProject, setLoadingProject] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeEdit, setActiveEdit] = useState(false)

  const handleDeleteProject = async (id: number) => {
    setLoading(true)
    try {
      const response = await deleteProject(String(id))
      toast.success(response.data.message || "Proyecto eliminado correctamente")
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || "Error al eliminar el proyecto"
      toast.error(message)
    } finally {
      setLoading(false)
      getAllProjects()
    }
  }

  const getProjectDetails = async (id: number) => {
    setLoadingProject(true)
    try {
      const project = await getProjectById(String(id))
      setCurrentProject(project)
      return project
    } catch (error) {
      console.error("Error al obtener detalles del proyecto:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || "Error al cargar el proyecto"
      toast.error(message)
      return null
    } finally {
      setLoadingProject(false)
    }
  }

  const insertProject = async (data: z.infer<typeof ProjectSchema>) => {
    // Usar ProjectSchemaType
    setLoading(true)
    try {
      console.log("Datos recibidos en insertProject:", data)

      // Construir el payload para el API
      const apiPayload = {
        name: data.name.trim(),
        description: data.description.trim(),
        social_impact: data.social_impact?.trim() || "",
        type_hours_id: Number(data.type_hours_id),
        req_hours: Number(data.req_hours),
        maximum_students: Number(data.maximum_students),
        req_min_year: Number(data.req_min_year),
        req_gender: data.req_gender,
        // Aseguramos que req_career siempre sea un número para el API
        req_career: Number(data.req_career),
        number_beneficiaries: Number(data.number_beneficiaries),
        district_id: Number(data.district_id),
        start_date: data.start_date,
        end_date: data.end_date,
        active: Boolean(data.active),
        institution_id: Number(data.institution_id),
        // Los campos departament_id y message no se incluyen en el payload para el backend
      }

      // Validaciones adicionales antes de enviar al API
      if (!apiPayload.name) {
        toast.error("El nombre del proyecto es requerido")
        return
      }
      if (!apiPayload.description) {
        toast.error("La descripción del proyecto es requerida")
        return
      }
      if (!apiPayload.req_gender) {
        toast.error("El género requerido es necesario")
        return
      }
      if (!apiPayload.start_date) {
        toast.error("La fecha de inicio es requerida")
        return
      }
      if (!apiPayload.end_date) {
        toast.error("La fecha de fin es requerida")
        return
      }
      if (isNaN(apiPayload.req_career) || apiPayload.req_career <= 0) {
        toast.error("La carrera requerida debe ser un ID numérico válido")
        return
      }

      // Validar campos numéricos
      if (isNaN(apiPayload.type_hours_id) || apiPayload.type_hours_id <= 0) {
        toast.error("El tipo de horas debe ser válido")
        return
      }
      if (isNaN(apiPayload.req_hours) || apiPayload.req_hours <= 0) {
        toast.error("Las horas requeridas deben ser válidas")
        return
      }
      if (isNaN(apiPayload.maximum_students) || apiPayload.maximum_students <= 0) {
        toast.error("El número máximo de estudiantes debe ser válido")
        return
      }
      if (isNaN(apiPayload.req_min_year) || apiPayload.req_min_year <= 0) {
        toast.error("El año mínimo requerido debe ser válido")
        return
      }
      if (isNaN(apiPayload.number_beneficiaries) || apiPayload.number_beneficiaries <= 0) {
        toast.error("El número de beneficiarios debe ser válido")
        return
      }
      if (isNaN(apiPayload.district_id) || apiPayload.district_id <= 0) {
        toast.error("El distrito debe ser válido")
        return
      }
      if (isNaN(apiPayload.institution_id) || apiPayload.institution_id <= 0) {
        toast.error("La institución debe ser válida")
        return
      }

      // Validar fechas
      const startDate = new Date(apiPayload.start_date)
      const endDate = new Date(apiPayload.end_date)

      if (isNaN(startDate.getTime())) {
        toast.error("La fecha de inicio no es válida")
        return
      }
      if (isNaN(endDate.getTime())) {
        toast.error("La fecha de fin no es válida")
        return
      }
      if (endDate <= startDate) {
        toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
        return
      }

      console.log("Payload final que se enviará:", JSON.stringify(apiPayload, null, 2))

      if (activeEdit && data.id) {
        console.log("Actualizando proyecto con ID:", data.id)
        const response = await updateProject(String(data.id), apiPayload)
        console.log("Respuesta de actualización:", response.data)
        setActiveEdit(false)
        setOpen(false)
        toast.success(response.data.message || "Proyecto actualizado correctamente")
      } else {
        console.log("Creando nuevo proyecto")
        const response = await createProject(apiPayload)
        console.log("Respuesta de creación:", response.data)
        toast.success(response.data.message || "Proyecto creado correctamente")
        setOpen(false)
      }
    } catch (error: unknown) {
      console.error("Error completo al crear/actualizar el proyecto:", error)
      const err = error as AxiosError<{
        message?: string
        errors?: Record<string, string[]>
        error?: string
        details?: any
      }>

      console.log("Error response data:", err.response?.data)
      console.log("Error status:", err.response?.status)
      console.log("Error headers:", err.response?.headers)
      console.log("Error config:", err.config)

      let errorMessage = "Error al procesar el proyecto"

      if (err.response?.data) {
        const errorData = err.response.data

        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ")
          errorMessage = `Errores de validación: ${validationErrors}`
        }

        if (errorData.details) {
          console.log("Error details:", errorData.details)
        }
      }

      if (err.response?.status === 500) {
        errorMessage = "Error interno del servidor. Por favor, contacta al administrador."
        console.error("Error 500 - Posibles causas:")
        console.error("1. Problema con la base de datos (ej. clave foránea no existente)")
        console.error("2. Error en la validación del backend (ej. tipo de dato inesperado)")
        console.error("3. Problema con las relaciones de datos (foreign keys)")
        console.error("4. Error en el procesamiento de fechas")
        console.error("5. Un campo que se envía es nulo o vacío cuando el backend espera un valor")
      } else if (err.response?.status === 422) {
        errorMessage = "Datos de entrada inválidos. Verifica todos los campos."
      } else if (err.response?.status === 401) {
        errorMessage = "No autorizado. Por favor, inicia sesión nuevamente."
      } else if (err.response?.status === 403) {
        errorMessage = "No tienes permisos para realizar esta acción."
      } else if (err.response?.status === 400) {
        errorMessage = "Solicitud incorrecta. Verifica los datos enviados."
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
      getAllProjects()
    }
  }

  const getAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || "Error al cargar proyectos"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getAllProjects()
  }, [getAllProjects])

  return {
    projects,
    currentProject,
    loading,
    loadingProject,
    handleDeleteProject,
    getProjectDetails,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertProject,
    getAllProjects,
  }
}

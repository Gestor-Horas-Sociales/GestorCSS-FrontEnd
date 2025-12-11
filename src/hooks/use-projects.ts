"use client"

import type { ProjectType, ProjectSchema } from "../Types/ProyectType" 
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
      // La API ahora espera number
      const response = await deleteProject(id)
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
      // La API ahora espera number
      const project = await getProjectById(id)
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
        req_career: data.req_career,
        number_beneficiaries: Number(data.number_beneficiaries),
        district_id: Number(data.district_id),
        start_date: data.start_date,
        end_date: data.end_date,
        active: Boolean(data.active),
        
        // --- CAMBIO CRÍTICO: Enviar el array de IDs ---
        institution_ids: data.institution_ids, 
      }

      // Validaciones básicas
      if (!apiPayload.name) {
        toast.error("El nombre del proyecto es requerido")
        return
      }
      
      // Validación de array de instituciones
      if (!apiPayload.institution_ids || apiPayload.institution_ids.length === 0) {
        toast.error("Debe seleccionar al menos una institución")
        return
      }

      // Validar fechas
      const startDate = new Date(apiPayload.start_date)
      const endDate = new Date(apiPayload.end_date)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error("Las fechas no son válidas")
        return
      }
      if (endDate <= startDate) {
        toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
        return
      }

      console.log("Payload final que se enviará:", JSON.stringify(apiPayload, null, 2))

      if (activeEdit && data.id) {
        console.log("Actualizando proyecto con ID:", data.id)
        // La API espera number en el ID
        const response = await updateProject(Number(data.id), apiPayload)
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
      }>

      let errorMessage = "Error al procesar el proyecto"

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.status === 500) {
        errorMessage = "Error interno del servidor (Revise logs del backend)"
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
      // Si el error es 500, probablemente es desincronización backend/DB
      const message = err.response?.status === 500 
        ? "Error del servidor. Verifique que el backend esté actualizado." 
        : err.response?.data?.message || "Error al cargar proyectos"
      
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
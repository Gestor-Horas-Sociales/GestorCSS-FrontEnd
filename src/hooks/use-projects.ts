"use client"

import type { ProjectType } from "../Types/ProyectType" 
// Asegúrate de importar el ProjectSchemaType inferido o el Schema de Zod
import { ProjectSchema } from "../Types/ProyectType" 
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

  // Función para obtener todos los proyectos
  const getAllProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.status === 500 
        ? "Error del servidor. Verifique conexión." 
        : err.response?.data?.message || "Error al cargar proyectos"
      
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteProject = async (id: number) => {
    setLoading(true)
    try {
      const response = await deleteProject(id)
      // Usamos optional chaining por si el mensaje no viene
      toast.success(response.data?.message || "Proyecto eliminado correctamente")
      await getAllProjects() // Recargar lista
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || "Error al eliminar el proyecto"
      toast.error(message)
      setLoading(false) // Asegurar false si falla
    }
  }

  const getProjectDetails = async (id: number) => {
    setLoadingProject(true)
    try {
      const project = await getProjectById(id)
      setCurrentProject(project)
      return project
    } catch (error) {
      console.error("Error al obtener detalles del proyecto:", error)
      toast.error("Error al cargar el proyecto")
      return null
    } finally {
      setLoadingProject(false)
    }
  }

  const insertProject = async (data: z.infer<typeof ProjectSchema>) => {
    setLoading(true)
    try {
      // Construir el payload
      // Usamos ?.trim() || "" para evitar crash si el campo es undefined
      const apiPayload = {
        name: data.name.trim(),
        description: data.description?.trim() || "", 
        social_impact: data.social_impact?.trim() || "",
        
        // Zod.coerce ya convirtió esto, pero Number() es doble seguridad (está bien)
        type_hours_id: Number(data.type_hours_id),
        req_hours: Number(data.req_hours),
        maximum_students: Number(data.maximum_students),
        req_min_year: Number(data.req_min_year),
        
        req_gender: data.req_gender,
        req_career: data.req_career,
        
        number_beneficiaries: Number(data.number_beneficiaries),
        
        // Manejo de opcionales numéricos
        departament_id: data.departament_id ? Number(data.departament_id) : undefined,
        district_id: data.district_id ? Number(data.district_id) : undefined,
        
        start_date: data.start_date,
        end_date: data.end_date, // Puede ser null
        
        active: Boolean(data.active),
        
        // --- CAMBIO: Singular y obligatorio ---
        institution_id: Number(data.institution_id), 
      }

      // Validaciones extra (aunque Zod ya cubre la mayoría)
      if (!apiPayload.institution_id) {
        toast.error("Debe seleccionar una institución")
        setLoading(false)
        return
      }

      // Validar fechas (solo si existe fecha fin)
      const startDate = new Date(apiPayload.start_date)
      
      if (apiPayload.end_date) {
        const endDate = new Date(apiPayload.end_date)
        if (endDate <= startDate) {
            toast.error("La fecha de fin debe ser posterior a la fecha de inicio")
            setLoading(false)
            return
        }
      }

      if (activeEdit && data.id) {
        // UPDATE
        const response = await updateProject(Number(data.id), apiPayload)
        toast.success(response.data?.message || "Proyecto actualizado correctamente")
      } else {
        // CREATE
        const response = await createProject(apiPayload)
        toast.success(response.data?.message || "Proyecto creado correctamente")
      }

      setOpen(false)
      setActiveEdit(false)
      await getAllProjects() // Recargar lista
      
    } catch (error: unknown) {
      console.error("Error en insertProject:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message || "Error al guardar el proyecto"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Cargar proyectos al montar el hook
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
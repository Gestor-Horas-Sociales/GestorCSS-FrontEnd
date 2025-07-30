"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { createHoursRecord, deleteHoursRecord, getAllHoursRecord, updateHoursRecord } from "@/api/hours"
import type { HoursRecordPayload, HoursRecordType } from "@/Types/HoursType"
import type { z } from "zod"
import type { HoursRecordSchema } from "@/Types/HoursType"
import type { AxiosError } from "axios"

export const useHoursRecord = () => {
  const [hours, setHours] = useState<HoursRecordType[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeEdit, setActiveEdit] = useState(false)

  const fetchAllHours = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllHoursRecord()
      setHours(data)
    } catch (error) {
      console.error("Error al obtener los registros de horas:", error)
      toast.error("Error al cargar los registros de horas")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllHours()
  }, [fetchAllHours])

  const handleDeleteHoursRecord = async (id: number) => {
    setLoading(true)
    try {
      const response = await deleteHoursRecord(id)
      toast.success(response.data.message)
    } catch (error) {
      console.error("Error al eliminar el registro de horas:", error)
      toast.error("Error al eliminar el registro de horas")
    } finally {
      setLoading(false)
      fetchAllHours()
    }
  }

  const insertHoursRecord = async (data: z.infer<typeof HoursRecordSchema>) => {
    setLoading(true)
    try {
      // Log para depuración
      console.log("Datos recibidos en insertHoursRecord:", data)

      // Construir el payload RE-INCLUYENDO typeHours_id
      const payload: HoursRecordPayload = {
        student_id: data.student_id,
        project_id: data.project_id,
        date_register: data.date_register, // Ya es un objeto Date, Axios lo serializará a ISO string
        description: data.description,
        hours: data.hours,
        typeHours_id: data.typeHours_id, // RE-INCLUIDO: El backend podría necesitarlo
      }

      console.log("Payload final que se enviará:", payload)

      if (activeEdit) {
        console.log("Actualizando registro de horas con ID:", data.id)
        const response = await updateHoursRecord(Number(data.id), payload)
        setActiveEdit(false)
        setOpen(false)
        toast.success(response.data.message)
      } else {
        console.log("Creando nuevo registro de horas")
        const response = await createHoursRecord(payload)
        toast.success(response.data.message)
        setOpen(false)
      }
    } catch (error: unknown) {
      console.error("Error al crear/actualizar el registro de horas:", error)
      const err = error as AxiosError<{ message?: string }>
      const message = err.response?.data?.message
      const status = err.response?.status
      const headers = err.response?.headers
      const config = err.response?.config
      const responseData = err.response?.data

      // Mejorar el log para mostrar el contenido del objeto de datos de error
      console.error("Error response data (full object):", responseData)
      console.error("Error status:", status)
      console.error("Error headers:", headers)
      console.error("Error config:", config)

      if (status === 400) {
        toast.error(message || "Error de validación: Verifique los datos ingresados.")
      } else if (status === 401 || status === 403) {
        toast.error(message || "No autorizado para realizar esta acción.")
      } else if (status === 422) {
        toast.error(message || "Datos inválidos: Verifique los campos.")
      } else if (status === 500) {
        toast.error(message || "Error interno del servidor. Intente de nuevo más tarde.")
        console.error("Error 500 - Posibles causas:")
        console.error("1. Problema con la base de datos (ej. clave foránea no existente)")
        console.error("2. Error en la validación del backend (ej. tipo de dato inesperado)")
        console.error("3. Problema con las relaciones de datos (foreign keys)")
        console.error("4. Error en el procesamiento de fechas")
        console.error("5. Un campo que se envía es nulo o vacío cuando el backend espera un valor")
      } else {
        toast.error(message || "Error al crear/actualizar el registro de horas")
      }
    } finally {
      setLoading(false)
      fetchAllHours()
    }
  }

  //Obtener horas por tipo de horas
  const getHoursByType = useCallback(
    (typeId: number) => {
      return hours.filter((hour) => hour.typeHours_id === typeId)
    },
    [hours],
  )

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
    getHoursByType,
  }
}

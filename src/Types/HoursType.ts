import { z } from "zod"
import type { StudentType } from "./StudentType"
import type { ProjectType } from "./ProyectType"

export interface HoursRecordType {
  id: number
  student_id: number
  project_id: number
  date_register: Date // Para el uso en el frontend (Date object)
  description: string
  hours: number
  type_hours_id: number
  student?: StudentType
  project?: ProjectType
  message?: string
}

export type HoursRecordPayload = {
  student_id: number
  project_id: number
  date_register: string // Para el envío a la API (ISO string)
  description?: string
  hours: number
  type_hours_id: number
  message?: string
}

export const HoursRecordSchema = z.object({
  id: z.number().optional(),
  student_id: z.number({ message: "El estudiante es requerido" }),
  project_id: z.number({ message: "El proyecto es requerido" }),
  date_register: z.date({ message: "La fecha es requerida" }), // El formulario valida un Date object
  description: z.string().optional(),
  hours: z.number().min(0, { message: "Las horas deben ser un número positivo" }),
  type_hours_id: z.number({ message: "El tipo de horas es requerido" }),
  student: z
    .object({
      id: z.number(),
      name: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      student_id_card: z.string().optional(),
    })
    .optional(),
  project: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().optional(),
      start_date: z.date().optional(),
      end_date: z.date().optional(),
    })
    .optional(),
})

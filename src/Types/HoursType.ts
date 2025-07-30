import { z } from "zod"
import type { StudentType } from "./StudentType"
import type { ProjectType } from "./ProyectType"

export interface HoursRecordType {
  id: number
  student_id: number
  project_id: number
  date_register: Date
  description: string
  hours: number
  typeHours_id: number // Mantener esto en la definición de tipo para el frontend y la tabla
  student?: StudentType
  project?: ProjectType
  message?: string
}

export type HoursRecordPayload = {
  student_id: number
  project_id: number
  date_register: Date
  description: string
  hours: number
  typeHours_id: number // Mantener esto en la definición de tipo para el frontend y la tabla
  message?: string
}

export const HoursRecordSchema = z.object({
  id: z.number().optional(),
  student_id: z
    .number({ message: "El estudiante es requerido" })
    .min(1, { message: "Seleccione un estudiante válido" }),
  project_id: z.number({ message: "El proyecto es requerido" }).min(1, { message: "Seleccione un proyecto válido" }),
  date_register: z.date({ message: "La fecha es requerida" }),
  description: z.string().nonempty({ message: "La descripción es requerida" }),
  hours: z
    .number({ message: "Las horas son requeridas" })
    .min(1, { message: "Las horas deben ser un número positivo" }),
  typeHours_id: z
    .number({ message: "El tipo de horas es requerido" })
    .min(1, { message: "Seleccione un tipo de horas válido" }),
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

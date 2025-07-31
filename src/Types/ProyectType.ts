import { z } from "zod"
import type { CareerType } from "./CareerType"
import type { DepartamentoType } from "./DepartamentoType"
import type { District } from "./DistrictType"

// Zod Schema para validación de formularios o inputs de la API
export const ProjectSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, { message: "Nombre es requerido" }),
  description: z.string().min(1, { message: "Descripción es requerida" }),
  social_impact: z.string().optional(),

  type_hours_id: z.number().int().min(1, { message: "Tipo de horas es requerido" }),
  req_hours: z.number().int().min(1, { message: "Horas requeridas deben ser al menos 1" }),
  maximum_students: z.number().int().min(1, { message: "Número máximo de estudiantes debe ser al menos 1" }),
  req_min_year: z.number().int().min(1, { message: "Años mínimos requeridos debe ser al menos 1" }),

  req_gender: z.string().min(1, { message: "Género requerido" }),
  // Usamos z.coerce.string() para que Zod convierta automáticamente a string si recibe un número
  req_career: z.coerce.string().min(1, { message: "Carrera requerida es requerida" }),

  number_beneficiaries: z.number().int().min(1, { message: "Número de beneficiarios debe ser al menos 1" }),

  departament_id: z.number().int().optional(), // Opcional para el frontend, no se envía al backend
  district_id: z.number().int().min(1, { message: "Distrito es requerido" }),

  // Date fields as strings (ISO format expected)
  start_date: z.string().min(1, { message: "Fecha de inicio es requerida" }),
  end_date: z.string().min(1, { message: "Fecha de fin es requerida" }),

  active: z.boolean(),

  institution_id: z.number().int().min(1, { message: "Institución es requerida" }),
  message: z.string().optional(), // Opcional para el frontend, no se envía al backend
})

// Type inference from Zod schema
export type ProjectSchemaType = z.infer<typeof ProjectSchema>

// Interface for internal use in frontend or backend
export interface ProjectType {
  id?: number
  name: string
  description: string
  social_impact?: string

  type_hours_id: number
  req_hours: number
  maximum_students: number
  req_min_year: number

  req_gender: string
  // Puede ser string (ID) o CareerType (objeto completo)
  req_career: string | CareerType

  number_beneficiaries: number

  departament_id?: number | DepartamentoType
  district_id: number | District

  start_date: string
  end_date: string

  active: boolean
  institution_id: number
  message?: string
}

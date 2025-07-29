import { z } from "zod";
import type { CareerType } from "./CareerType";
import type { DepartamentoType } from "./DepartamentoType";
import type { District } from "./DistrictType";

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
  req_career: z.number().min(1, { message: "Carrera requerida" }),

  number_beneficiaries: z.number().int().min(1, { message: "Número de beneficiarios debe ser al menos 1" }),

  departament_id: z.number().int().optional(),
  district_id: z.number().int().min(1, { message: "Distrito es requerido" }),

  start_date: z.string().refine(dateStr => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date <= new Date();
  }, { message: "Fecha de inicio no puede ser futura" }),

  end_date: z.string().refine(dateStr => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date > new Date();
  }, { message: "Fecha de fin debe ser futura" }),

  active: z.boolean(),

  institution_id: z.number().int().min(1, { message: "Institución es requerida" }),
  message: z.string().optional(),
});

// Inferencia de tipo a partir del schema de Zod
export type ProjectSchema = z.infer<typeof ProjectSchema>;

// Interfaz para uso interno en el frontend o backend
export interface ProjectType {
  id?: number;
  name: string;
  description: string;
  social_impact?: string;

  type_hours_id: number;
  req_hours: number;
  maximum_students: number;
  req_min_year: number;

  req_gender: string;
  req_career: number | CareerType;

  number_beneficiaries: number;

  departament_id?: number | DepartamentoType;
  district_id: number | District;

  start_date: string | Date;
  end_date: string | Date;

  active: boolean;
  institution_id: number;
  message?: string;
}

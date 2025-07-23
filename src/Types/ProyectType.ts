import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nombre es requerido" }),
  description: z.string().min(1, { message: "Descripción es requerida" }),
  social_ipact: z.string().optional(),
  type_hours_id: z.number().int().min(1, { message: "Tipo de horas es requerido" }),
  req_hours: z.number().int().min(1, { message: "Horas requeridas deben ser al menos 1" }),
  maximun_students: z.number().int().min(1, { message: "Número máximo de estudiantes debe ser al menos 1" }),
  req_min_year: z.number().int().min(1, { message: "Años mínimos requeridos debe ser al menos 1" }),
  req_gender: z.string().min(1, { message: "Género requerido" }),
  req_career: z.string().min(1, { message: "Carrera requerida" }),
  number_beneficaries: z.number().int().min(1, { message: "Número de beneficiarios debe ser al menos 1" }),
  departament_id: z.number().int().optional(),
  district_id: z.number().int().min(1, { message: "Distrito es requerido" }),
  start_date: z.date().refine(date => date <= new Date(), { message: "Fecha de inicio no puede ser futura" }),
  end_date: z.date().refine(date => date > new Date(), { message: "Fecha de fin debe ser futura" }),
  active: z.boolean(),
  institution_id: z.number().int().min(1, { message: "Institución es requerida" }),
  message: z.string().optional(),
});

export type ProjectSchema = z.infer<typeof ProjectSchema>;

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  social_ipact: string;
  type_hours_id: number;
  req_hours: number;
  maximun_students: number;
  req_min_year: number;
  req_gender: string
  req_career: string;
  number_beneficaries: number;
  departament_id?: number;
  district_id: number;
  start_date: Date;
  end_date: Date;
  active: boolean;
  institution_id: number;
  message?: string;
}
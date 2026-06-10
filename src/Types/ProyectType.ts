import { z } from "zod";
import type { CareerType } from "./CareerType";
import type { DepartamentoType } from "./DepartamentoType";
import type { District } from "./DistrictType";
import type { InstitutionType } from "./InstitutionType";

// ==========================================
// SCHEMAS (Para Validación de Formularios)
// ==========================================
// Nota: Dejamos req_career aquí porque tu formulario de "Crear" 
// seguramente todavía envía ese campo. 

export const ProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nombre es requerido" }),
  description: z.string().optional(),
  social_impact: z.string().optional(),
  type_hours_id: z.coerce
    .number()
    .int()
    .min(1, { message: "Selecciona un tipo de horas" }),
  req_hours: z.coerce
    .number()
    .int()
    .min(1, { message: "Horas requeridas deben ser al menos 1" }),
  maximum_students: z.coerce
    .number()
    .int()
    .min(1, { message: "Máximo de estudiantes debe ser al menos 1" }),
  req_min_year: z.coerce
    .number()
    .int()
    .min(1, { message: "Año mínimo debe ser al menos 1" }),
  req_gender: z.string().min(1, { message: "Género requerido" }),
  
  // Este es el campo manual (String) para el formulario
  req_career: z.coerce.string().min(1, { message: "Carrera es requerida" }),
  
  number_beneficiaries: z.coerce
    .number()
    .int()
    .min(0, { message: "Número de beneficiarios inválido" }),
  department_id: z.number().int().optional(),
  district_id: z.coerce.number().int().optional().nullable(),
  canton_id: z.coerce.number().int().optional().nullable(),
  start_date: z.string().min(1, { message: "Fecha de inicio es requerida" }),
  end_date: z.string().optional().nullable(),
  active: z.boolean(),
  institution_id: z.coerce
    .number()
    .int()
    .min(1, { message: "Selecciona una institución" }),
  message: z.string().optional(),
});

// Inferencia del tipo para formularios
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;

// ==========================================
// TYPES (Para Lectura / API Responses)
// ==========================================
export interface ProjectAssignment {
  student_id: number;
}

export interface ProjectType {
  id: number;
  name: string;
  description?: string | null;
  social_impact?: string | null;
  type_hours_id: number;
  req_hours: number;
  maximum_students: number;
  req_min_year: number;
  req_gender: string;
  
  // Campo Legacy (Manual)
  req_career: string | CareerType; 
  
  // --- NUEVO: Array real de carreras (Desde la BD) ---
  careers?: CareerType[]; 

  number_beneficiaries: number;
  department_id?: number | DepartamentoType;
  district_id?: number | District | null;
  canton_id?: number | { id: number; name: string } | null;
  latitude?: number | null;
  longitude?: number | null;
  start_date: string;
  end_date?: string | null;
  active: boolean;
  institution?: InstitutionType;
  institution_id: number;
  message?: string;
  assignments?: ProjectAssignment[]; 
}
import { z } from "zod";
import type { CareerType } from "./CareerType";
import type { DepartamentoType } from "./DepartamentoType";
import type { District } from "./DistrictType";
import type { InstitutionType } from "./InstitutionType";

// Zod Schema para validación de formularios (Envío de datos)
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
  req_career: z.coerce.string().min(1, { message: "Carrera requerida es requerida" }),

  number_beneficiaries: z.number().int().min(1, { message: "Número de beneficiarios debe ser al menos 1" }),

  departament_id: z.number().int().optional(),
  district_id: z.number().int().min(1, { message: "Distrito es requerido" }),

  start_date: z.string().min(1, { message: "Fecha de inicio es requerida" }),
  end_date: z.string().min(1, { message: "Fecha de fin es requerida" }),

  active: z.boolean(),

  // CORRECTO: Array de IDs para el formulario
  institution_ids: z.array(z.number()).min(1, { message: "Selecciona al menos una institución" }),

  message: z.string().optional(),
});

// Inferencia del tipo desde Zod
export type ProjectSchemaType = z.infer<typeof ProjectSchema>;

// Interface para uso interno en frontend (Lectura de API / Tablas)
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
  req_career: string | CareerType;

  number_beneficiaries: number;

  departament_id?: number | DepartamentoType;
  district_id: number | District;

  start_date: string;
  end_date: string;

  active: boolean;

  // CAMBIO: Se eliminó 'institution_id' singular que sobraba.

  // Array de objetos (para mostrar nombres en la tabla)
  institutions?: InstitutionType[];

  // Array de IDs (para rellenar el formulario al editar)
  institution_ids?: number[];

  message?: string;
}
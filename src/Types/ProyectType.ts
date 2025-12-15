import { z } from "zod";
import type { CareerType } from "./CareerType";
import type { DepartamentoType } from "./DepartamentoType";
import type { District } from "./DistrictType";
import type { InstitutionType } from "./InstitutionType";

// Zod Schema para validación de formularios (Envío de datos)
export const ProjectSchema = z.object({
  id: z.number().optional(),

  name: z.string().min(1, { message: "Nombre es requerido" }),

  // CAMBIO 1: Descripción opcional (acepta string vacío)
  description: z.string().optional(),

  social_impact: z.string().optional(),

  type_hours_id: z.number().int().min(1, { message: "Tipo de horas es requerido" }),
  req_hours: z.number().int().min(1, { message: "Horas requeridas deben ser al menos 1" }),
  maximum_students: z.number().int().min(1, { message: "Número máximo de estudiantes debe ser al menos 1" }),
  req_min_year: z.number().int().min(1, { message: "Años mínimos requeridos debe ser al menos 1" }),

  req_gender: z.string().min(1, { message: "Género requerido" }),
  req_career: z.coerce.string().min(1, { message: "Carrera requerida es requerida" }),

  number_beneficiaries: z.number().int().min(1, { message: "Número de beneficiarios debe ser al menos 1" }),

  departament_id: z.number().int().optional(),

  // CAMBIO 2: Distrito opcional/nullable (según tu modelo Prisma Int?)
  district_id: z.number().int().optional().nullable(),

  start_date: z.string().min(1, { message: "Fecha de inicio es requerida" }),

  // CAMBIO 3: Fecha final opcional y nullable
  end_date: z.string().optional().nullable(),

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

  // CAMBIO 4: Refleja que puede venir nulo de la BD
  description?: string | null;
  social_impact?: string | null;

  type_hours_id: number;
  req_hours: number;
  maximum_students: number;
  req_min_year: number;

  req_gender: string;
  req_career: string | CareerType;

  number_beneficiaries: number;

  departament_id?: number | DepartamentoType;

  // CAMBIO 5: Refleja que puede venir nulo de la BD
  district_id?: number | District | null;

  start_date: string;
  end_date?: string | null;

  active: boolean;

  // Array de objetos (para mostrar nombres en la tabla)
  institutions?: InstitutionType[];

  // Array de IDs (para rellenar el formulario al editar)
  institution_ids?: number[];

  message?: string;
}
import { z } from "zod";

export interface StudentExcel {
  card: string;
  lastName: string;
  name: string;
  career: string;
  hoursType: string;
  socialHours: string;
  email: string;
}

export interface StudentType {
  id: number;
  name: string;
  lastname: string;
  student_id_card: string;
  career_year: number;
  gender: string;
  email?: string;
  message?: string;
  active: boolean;
  career?: {
    id: number;
    name: string;
  };
  internal_hours?: number;
  external_hours?: number;
}

export type StudentSchemaType = z.infer<typeof StudentSchema>;

export const StudentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nombre es requerido" }),
  lastname: z.string().min(1, { message: "Apellido es requerido" }),
  student_id_card: z
    .string()
    .min(1, { message: "Carnet de estudiante es requerido" }),
  career_year: z
    .number()
    .min(1, { message: "Año de carrera debe ser al menos 1" }),
  gender: z.string().min(1, { message: "Género es requerido" }),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  active: z.boolean(),
  internal_hours: z.number().int().optional(),
  external_hours: z.number().int().optional(),
  career: z.object({
    career_id: z
      .number({
        required_error: "Debe seleccionar una carrera",
        invalid_type_error: "Debe seleccionar una carrera",
      })
      .min(1, "Debe seleccionar una carrera"),
    career_name: z.string().optional(),
  }),
});

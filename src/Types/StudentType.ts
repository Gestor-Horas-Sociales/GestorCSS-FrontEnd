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
  email: string;
  message?: string;
  departmet_id?: number;
  district_id: number;
  active: boolean;
  address: string;
  career?: {
    id: number;
    name: string;
  };
  internal_hours?: number;
  external_hours?: number;
};


export type StudentSchemaType = z.infer<typeof StudentSchema>;

export const StudentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nombre es requerido" }),
  lastname: z.string().min(1, { message: "Apellido es requerido" }),
  student_id_card: z.string().min(1, { message: "Carnet de estudiante es requerido" }),
  career_year: z.number().int().min(1, { message: "Año de carrera debe ser al menos 1" }),
  gender: z.string().min(1, { message: "Género es requerido" }),
  email: z.string().min(1, { message: "Correo es requerido" }).email({ message: "Correo inválido" }),
  departmet_id: z.number().int().optional(),
  district_id: z.number().int().min(1, { message: "Distrito es requerido" }),
  active: z.boolean(),
  address: z.string(),
  internal_hours: z.number().int().optional(),
  external_hours: z.number().int().optional(),
  career: z
    .object({
      career_id: z.number(),
      career_name: z.string().optional(),
    }),
});




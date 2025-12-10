import type { District } from "./DistrictType";
import { z } from "zod";

export interface InstitutionType {
  id: number;
  name: string;
  // CAMBIOS: Ahora pueden ser null o undefined
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  district_id?: number | null;
  district?: District;
}

export type InstitutionPayload = {
  name: string;
  // CAMBIOS: Opcionales para el envío
  email?: string | null;
  district_id?: number | null;
  address?: string | null;
  phone?: string | null;
  message?: string;
};

export const InstitutionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Nombre es requerido" }), // .min(1) es mejor que .nonempty()
  
  address: z.string().optional().nullable(),
  
  // CAMBIO CRÍTICO: Permitir string vacío, null o undefined
  email: z.union([z.string().email({ message: "Formato inválido" }), z.literal(""), z.null(), z.undefined()]), 
  
  phone: z.string().optional().nullable(),
  
  // Estos ahora son opcionales en el formulario
  departament_id: z.number().optional().nullable(),
  district_id: z.number().optional().nullable(),
});
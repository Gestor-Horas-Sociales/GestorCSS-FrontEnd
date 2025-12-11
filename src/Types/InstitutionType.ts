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
  email: string;
  district_id: number;
  address?: string;
  phone?: string;
  message?: string;
};

export const InstitutionSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty({ message: "Nombre es requerido" }),
  address: z.string().optional(),
  email: z
    .string()
    .nonempty({ message: "Correo es requerido" })
    .email({ message: "Correo inválido" }),
  phone: z.string().optional(),
  departament_id: z.number({ message: "Departamento es requerido" }),
  district_id: z.number({ message: "Distrito es requerido" }),
});
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
  district?: District | null;
  projectsCount?: number;
  studentsCount?: number;
}

export type InstitutionPayload = {
  id: number;
  name: string;
  email: string;
  district_id?: number;
  address?: string;
  phone?: string;
  message?: string;
};

export const InstitutionSchema = z.object({
  id: z.number({ message: "ID es requerido" }),
  name: z.string().nonempty({ message: "Nombre es requerido" }),
  address: z.string().optional(),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  departament_id: z.number().optional(),
  district_id: z.number().optional(),
});

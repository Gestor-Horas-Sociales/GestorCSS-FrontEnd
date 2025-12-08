import type { District } from "./DistrictType";
import { z } from "zod";

export interface InstitutionType {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  district_id: number;
  district: District;
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
  email: z.string().optional(),
  phone: z.string().optional(),
  departament_id: z.number().optional(),
  district_id: z.number().optional(),
});

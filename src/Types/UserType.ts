import type { StudentType } from "./StudentType";
import { z } from "zod";

export type UserType = {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  role: number;
  message?: string;
  student?: StudentType;
};

export type UserCreateType = {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  role_id: number;
  message?: string;
};

export type UserPayload = {
  id?: number;
  name: string;
  lastname: string;
  email: string;
  message?: string;
  role?: role;
};

type role = {
  id: number;
  name: string;
};

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty({ message: "Nombre es requerido" }),
  lastname: z.string().nonempty({ message: "Apellido es requerido" }),
  email: z
    .string()
    .nonempty({ message: "Correo es requerido" })
    .email({ message: "Correo inválido" }),
  role: z.number({
    message: "Rol es requerido",
  }),
});

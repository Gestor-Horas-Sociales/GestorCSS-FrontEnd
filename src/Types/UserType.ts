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

export const UserBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty("Nombre es requerido"),
  lastname: z.string().nonempty("Apellido es requerido"),
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener una mayúscula")
    .regex(/[0-9]/, "Debe tener un número")
    .optional(),
  role: z.number(),
});

export const CreateUserSchema = UserBaseSchema.extend({
    password: z
    .string({
      required_error: "Contraseña es requerida",
    })
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener una mayúscula")
    .regex(/[0-9]/, "Debe tener un número"),
});

export const UpdateUserSchema = UserBaseSchema; // password opcional

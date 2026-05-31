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
  name: z.string().min(1, "Nombre es requerido"),
  lastname: z.string().min(1, "Apellido es requerido"),
  email: z.string().email("Correo inválido"),
  role: z.number({
    required_error: "Rol es requerido",
  }),
  password: z.string().optional().or(z.literal("")),
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

export const UpdateUserSchema = UserBaseSchema.extend({
  password: z
    .string()
    .refine((val) => val === "" || val.length >= 8, {
      message: "Mínimo 8 caracteres",
    })
    .refine((val) => val === "" || /[A-Z]/.test(val), {
      message: "Debe tener una mayúscula",
    })
    .refine((val) => val === "" || /[0-9]/.test(val), {
      message: "Debe tener un número",
    })
    .optional()
    .or(z.literal("")),
});

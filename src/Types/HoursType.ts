import { z } from "zod";
import type { StudentType } from "./StudentType";
import type { ProjectType } from "./ProyectType";

export interface HoursRecordType {
    id: number,
    student_id: number,
    project_id: number,
    date_register: Date,
    description: string,
    hours: number,
    typeHours_id: number,
    student?: StudentType,
    project?: ProjectType,
    message?: string,
}

export type HoursRecordPayload = {
    student_id: number,
    project_id: number,
    date_register: Date,
    description: string,
    hours: number,
    typeHours_id: number,
    message?: string,
}


export const HoursRecordSchema = z.object({
    id: z.number().optional(),
    student_id: z.number({ message: "El estudiante es requerido" }),
    project_id: z.number({ message: "El proyecto es requerido" }),
    date_register: z.date({ message: "La fecha es requerida" }),
    description: z.string().nonempty({ message: "La descripción es requerida" }),
    hours: z.number().min(0, { message: "Las horas deben ser un número positivo" }),
    typeHours_id: z.number({ message: "El tipo de horas es requerido" }), 
})
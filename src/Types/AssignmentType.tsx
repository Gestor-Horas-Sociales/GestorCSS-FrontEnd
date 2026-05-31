import { z } from "zod";
import type { StudentType } from "./StudentType";
import type { ProjectType } from "./ProyectType";

// ==========================================
// SCHEMAS (Para Validación y Escritura)
// ==========================================

// Schema para crear/editar una asignación
export const AssignmentSchema = z.object({
  project_id: z.coerce
    .number()
    .int()
    .min(1, { message: "El proyecto es requerido" }),
  student_id: z.coerce
    .number()
    .int()
    .min(1, { message: "El estudiante es requerido" }),
  status: z
    .enum(["ACTIVE", "COMPLETED", "ABANDONED"], {
      errorMap: () => ({ message: "Estado inválido" }),
    })
    .default("ACTIVE"),
});

// Inferencia del tipo para formularios
export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>;

// ==========================================
// TYPES (Para Lectura / API Responses)
// ==========================================

// Definición de los estados posibles para uso en UI
export type AssignmentStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

export interface AssignmentType {
  project_id: number;
  student_id: number;
  status: AssignmentStatus;

  // Agregamos el campo faltante
  assignedAt?: string;

  student?: StudentType;
  project?: ProjectType;
}

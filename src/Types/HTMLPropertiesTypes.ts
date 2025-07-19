import type { ComponentPropsWithoutRef } from "react";

// Properties
export type InputProperties = ComponentPropsWithoutRef<"input">;
export type ButtonProperties = ComponentPropsWithoutRef<"button">;
export type AreaProperties = ComponentPropsWithoutRef<"area">;

// Events
export type FormEvent = React.FormEvent<HTMLFormElement>;
export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type AnchorEvent = React.MouseEvent<HTMLAnchorElement>;

import { z } from "zod";

// Tipo genérico para inferir valores de cualquier esquema Zod
export type InferFormValues<T extends z.ZodType<any, any>> = z.infer<T>;

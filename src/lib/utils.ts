import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const carrerasConTilde: Record<string, string> = {
  // Arquitectura e Ingenierías
  "ingenieria de alimentos": "Ingeniería de Alimentos",
  "ingenieria civil": "Ingeniería Civil",
  "ingenieria electrica": "Ingeniería Eléctrica",
  "ingenieria energetica": "Ingeniería Energética",
  "ingenieria industrial": "Ingeniería Industrial",
  "ingenieria informatica": "Ingeniería Informática",
  "ingenieria mecanica": "Ingeniería Mecánica",
  "ingenieria quimica": "Ingeniería Química",

  // Ciencias Sociales y Humanidades
  "licenciatura en filosofia": "Licenciatura en Filosofía",
  "licenciatura en psicologia": "Licenciatura en Psicología",
  "licenciatura en teologia": "Licenciatura en Teología",

  // Comunicaciones y Mercadeo
  "licenciatura en comunicacion social": "Licenciatura en Comunicación Social",

  // Educación
  "profesorado en teologia": "Profesorado en Teología",

  // Gestión Empresarial y Economía
  "licenciatura en economia": "Licenciatura en Economía",
  "licenciatura en finanzas": "Licenciatura en Finanzas"
};

export const normalizarCarrera = (valor?: string) => {
  if (!valor) return "";
  const limpio = valor.toLowerCase().trim();
  return carrerasConTilde[limpio] || 
         limpio.charAt(0).toUpperCase() + limpio.slice(1);
};
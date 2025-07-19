import type { Departament } from './DepartamentType';

export interface District {
  id: number;
  name: string;
  createdAt?: string;
  departament_id: number;
  departament: Departament;
}
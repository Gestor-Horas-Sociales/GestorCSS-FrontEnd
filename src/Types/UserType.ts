import type { StudentType } from './StudentType';

export type UserType = {
    id?: number;                    
    name: string;
    lastname: string;
    email: string;
    role: number;
    student?: StudentType;         
  };
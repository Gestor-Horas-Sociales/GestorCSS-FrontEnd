import type { StudentType } from './Student';

export type UserType = {
    id: number;                    
    name: string;
    email: string;
    role: 'SuperUser' | 'Cordinator' | 'Admin'; 
    student?: StudentType;         
  };
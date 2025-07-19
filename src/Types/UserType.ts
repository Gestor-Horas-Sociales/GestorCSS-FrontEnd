import type { StudentType } from './StudentType';

export type UserType = {
    id: number;                    
    name: string;
    email: string;
    role: 'SuperUser' | 'Cordinator' | 'Admin'; 
    student?: StudentType;         
  };
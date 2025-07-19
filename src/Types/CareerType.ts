export type FacultyType = {
    id: number;
    name: string;
    createdAt: string;
  };
  
  export type CareerType = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    faculty_id: number;
    faculty: FacultyType;
  };
export interface MapProject {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  students_count: number;
  maximum_students: number | null;
  institution: string | null;
  type_hours: string | null;
  canton: string | null;
  district: string | null;
  departament: string | null;
}

export interface CareerCount {
  name: string;
  count: number;
}

export interface StudentMapInfo {
  id?: number;
  name: string;
  career: string;
}

export interface ProjectMapDetails {
  id: number;
  name: string;
  description: string | null;
  institution: string | null;
  type_hours: string | null;
  canton: string | null;
  district: string | null;
  departament: string | null;
  start_date: string | null;
  end_date: string | null;
  students_count: number;
  maximum_students: number | null;
  number_beneficiaries: number | null;
  careers: CareerCount[];
  genders: CareerCount[];
  students?: StudentMapInfo[];
}

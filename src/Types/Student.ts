export type StudentType = {
  id: number
  name: string
  last_name: string
  email: string
  start_year: number
  gender: string
  carnet: string
  status: string
  hours_type: "Internas" | "Externas";
  internal_hours: number
  external_hours: number
  career_id: number
  location_id: number
  career?: {
    id: number
    name: string
  }
  location?: {
    id: number
    name: string
  }
}
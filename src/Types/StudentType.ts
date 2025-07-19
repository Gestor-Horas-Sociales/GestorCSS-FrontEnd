export type StudentType = {
  id: number
  name: string
  lastname: string
  student_id_card: string
  career_year: number
  gender: string
  email: string
  district_id: number
  active: boolean
  address: string
  career?: {
    id: number
    name: string
  }
  internal_hours: number
  external_hours: number
}
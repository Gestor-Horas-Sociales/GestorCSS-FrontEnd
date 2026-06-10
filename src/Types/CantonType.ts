export interface Canton {
  id: number;
  name: string;
  code?: string | null;
  district_id: number;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string;
}

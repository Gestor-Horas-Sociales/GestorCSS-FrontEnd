export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "student" | "coordinator";
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  hours: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

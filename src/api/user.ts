import type { UserType, UserPayload, UserCreateType } from "@/Types/UserType";
import { api } from "./axios";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data.data as UserPayload[];
};

export const getUserById = (id: number) => api.get<UserType>(`/users/${id}`);

export const createUser = (data: Omit<UserCreateType, "id">) =>
  api.post<UserCreateType>("/users", data);

export const updateUser = (id: number, data: Partial<UserCreateType>) => {
  delete data.id;
  return api.patch<UserCreateType>(`/users/${id}`, data);
};

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

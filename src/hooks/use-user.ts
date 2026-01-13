import type { UserBaseSchema, UserPayload } from "@/Types/UserType";
import { useState, useEffect, useCallback } from "react";
import { getUsers, deleteUser, updateUser, createUser } from "@/api/user";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";

export const useUser = () => {
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleDeleteUser = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteUser(id);
      toast.success(response.data.message);
      fetchAllUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const insertUser = async (data: z.infer<typeof UserBaseSchema>) => {
    setLoading(true);

    // Cambiando nombre al campo role
    const { role, ...rest } = data;
    const payload = {
      ...rest,
      role_id: Number(role), // renombramos role -> role_id
    };

    try {
      if (activeEdit) {
        const response = await updateUser(Number(data.id), payload);
        setActiveEdit(false);
        setOpen(false);
        toast.success(response.data.message);
      } else {
        const response = await createUser(payload);
        toast.success(response.data.message);
        setOpen(false);
      }
      fetchAllUsers();
    } catch (error) {
      console.error("Error inserting/updating user:", error);
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    handleDeleteUser,
    insertUser,
  };
};

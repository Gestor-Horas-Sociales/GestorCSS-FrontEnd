import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import Spinner from "@/components/Spinner";
import type { ColumnDef } from "@tanstack/react-table";
import type { UserPayload } from "@/Types/UserType";
import { UpdateUserSchema, CreateUserSchema } from "@/Types/UserType";
import { useTable } from "@/hooks/useTable";
import TableStructure from "@/components/TableStructure";
import { Trash2, FilePenLine } from "lucide-react";
import GeneralAlert from "@/components/GeneralAlert";
import { useState, useCallback } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import FormSelectField from "@/components/FormSelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import FormPasswordField from "@/components/FormPasswordField";

const INITIAL_VALUES_ROLE = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Estudiante" },
  { id: 3, name: "Coordinador" },
];

export default function User() {
  const {
    users,
    loading,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    handleDeleteUser,
    insertUser,
  } = useUser();

  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(0);

  type UserFormValues =
  | z.infer<typeof CreateUserSchema>
  | z.infer<typeof UpdateUserSchema>;


  const form = useForm<UserFormValues>({
  resolver: zodResolver(
    activeEdit ? UpdateUserSchema : CreateUserSchema
  ),
  defaultValues: {
    name: "",
    lastname: "",
    email: "",
    password: "",
    role: undefined,
  },
});

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const handleEditUser = useCallback(
    (
      id: number,
      name: string,
      lastname: string,
      email: string,
      role: number
    ) => {
      form.reset({
        id,
        name,
        lastname,
        email,
        password: "",
        role,
      });
      setActiveEdit(true);
      setOpen(true);
    },
    [form, setActiveEdit, setOpen]
  );

  const columns: ColumnDef<UserPayload>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: {
        label: "ID",
      },
    },
    {
      accessorKey: "name",
      header: "Nombre",
      meta: {
        label: "Nombre",
      },
    },
    {
      accessorKey: "lastname",
      header: "Apellido",
      meta: {
        label: "Apellido",
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: {
        label: "Email",
      },
    },
    {
      accessorKey: "role.name",
      header: "Rol",
      meta: {
        label: "Rol",
      },
      cell: ({ row }) => (
        <Badge variant={"outline"}>{row.original?.role?.name}</Badge>
      ),
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              handleEditUser(
                Number(row.original.id),
                row.original.name,
                row.original.lastname,
                row.original.email,
                row.original.role?.id || 0
              );
            }}
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => openDialogDelete(Number(row.original.id))}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: users,
    columns,
  });

  const cancelDelete = () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  const confirmDelete = async () => {
    await handleDeleteUser(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administrar usuarios de la plataforma.
            </p>
          </div>
          <Button
            className="rounded-md shadow-sm cursor-pointer"
            onClick={() => {
              setOpen(true);
              setActiveEdit(false);
              form.reset({
                name: "",
                lastname: "",
                email: "",
                role: undefined,
              });
            }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </Button>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setActiveEdit(false);
              form.reset({
                name: "",
                lastname: "",
                email: "",
                password: "",
                role: undefined,
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {activeEdit ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
              <DialogDescription>
                {activeEdit
                  ? "Editar los detalles del usuario."
                  : "Ingrese los detalles del nuevo usuario."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(insertUser)}>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormTextField
                      nameField="name"
                      label="Nombre"
                      placeholder="Ingrese el nombre"
                      formField={form}
                    />
                    <FormTextField
                      nameField="lastname"
                      label="Apellido"
                      placeholder="Ingrese el apellido"
                      formField={form}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormTextField
                      nameField="email"
                      label="Email"
                      placeholder="Ingrese el email"
                      formField={form}
                    />
                    <FormPasswordField
                      nameField="password"
                      label={
                        activeEdit
                          ? "Nueva contraseña (opcional)"
                          : "Contraseña"
                      }
                      placeholder={
                        activeEdit
                          ? "Solo si desea cambiarla"
                          : "Ingrese la contraseña"
                      }
                      formField={form}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <FormSelectField
                      nameField="role"
                      label="Rol"
                      placeholder="Seleccione el rol"
                      formField={form}
                      listRender={INITIAL_VALUES_ROLE.map((role) => ({
                        key: role.id.toString(),
                        textRender: role.name,
                      }))}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <Button type="submit" className="mt-8">
                    {activeEdit ? "Actualizar Usuario" : "Nuevo Usuario"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <TableStructure
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columns={columns}
          table={table}
        />
      </div>
      <GeneralAlert
        title="¿Estás seguro de eliminar este usuario?"
        description="Esta acción no se puede deshacer."
        openAlert={openAlertDelete}
        setOpenAlert={setOpenAlertDelete}
        confirmText="Confirmar"
        onConfirm={() => confirmDelete()}
        onCancel={() => cancelDelete()}
      />
      <Toaster position="top-right" />
    </>
  );
}

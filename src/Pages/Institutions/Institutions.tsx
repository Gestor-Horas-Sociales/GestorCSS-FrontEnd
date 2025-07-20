import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInstitutions } from "@/hooks/use-institutions";
import Spinner from "@/components/Spinner";
import type { ColumnDef } from "@tanstack/react-table";
import type { InstitutionType } from "@/Types/InstitutionType";
import { InstitutionSchema } from "@/Types/InstitutionType";
import { useTable } from "@/hooks/useTable";
import TableStructure from "@/components/TableStructure";
import { Trash2, FilePenLine } from "lucide-react";
import GeneralAlert from "@/components/GeneralAlert";
import { useCallback, useState, useEffect } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import { useDepartament } from "@/hooks/use-departament";
import FormSelectField from "@/components/FormSelectField";
import { z } from "zod";
import { useDistrict } from "@/hooks/use-district";

export default function Institutions() {
  const {
    institutions,
    loading,
    handleDeleteInstitution,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertInstitution,
  } = useInstitutions();

  const { departaments } = useDepartament();
  const { departamentsDistrict, getAllDepartamentsByDistrict } = useDistrict();

  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const [idDepartament, setIdDepartment] = useState<number>(0);

  const form = useForm<z.infer<typeof InstitutionSchema>>({
    resolver: zodResolver(InstitutionSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIdDepartment(value.departament_id ?? 0); // Si es undefined, usa 0
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const editInstitution = useCallback(
    (
      id: number,
      name: string,
      email: string,
      district_id: number,
      address: string,
      phone: string,
      departament_id: number
    ) => {
      setOpen(true);
      setActiveEdit(true);

      form.reset({
        id,
        name,
        email,
        district_id,
        address,
        phone,
        departament_id,
      });
    },
    [form, setOpen, setActiveEdit]
  );
  const columns: ColumnDef<InstitutionType>[] = [
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
      accessorKey: "email",
      header: "Email",
      meta: {
        label: "Email",
      },
    },
    {
      accessorKey: "district.name",
      header: "Distrito",
      meta: {
        label: "Distrito",
      },
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      meta: {
        label: "Teléfono",
      },
    },
    {
      accessorKey: "address",
      header: "Dirección",
      meta: {
        label: "Dirección",
      },
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
              editInstitution(
                row.original.id,
                row.original.name,
                row.original.email,
                row.original.district.id,
                row.original.address,
                row.original.phone,
                row.original.district.departament_id
              );
            }}
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => openDialogDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: institutions,
    columns,
  });

  const cancelDelete = () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  const confirmDelete = async () => {
    await handleDeleteInstitution(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de instituciones</h1>
            <p className="text-muted-foreground">
              Administrar las instituciones de la plataforma.
            </p>
          </div>
          <Button
            className="rounded-md shadow-sm cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nueva institución
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
                email: "",
                address: "",
                phone: "",
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {activeEdit ? "Editar Institución" : "Nueva Institución"}
              </DialogTitle>
              <DialogDescription>
                {activeEdit
                  ? "Editar los detalles de la institución."
                  : "Ingrese los detalles de la nueva institución."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(insertInstitution)}>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex flex-col">
                      <FormTextField
                        formField={form}
                        nameField="name"
                        label="Nombre"
                        placeholder="Ingrese el nombre de la institución"
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormTextField
                        formField={form}
                        nameField="email"
                        label="Correo electrónico"
                        placeholder="Ingrese correo electrónico"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex flex-col">
                      <FormSelectField
                        formField={form}
                        nameField="departament_id"
                        label="Departamento"
                        placeholder="Seleccione departamento"
                        listRender={departaments.map((departament) => ({
                          key: departament.id.toString(),
                          textRender: departament.name,
                        }))}
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormSelectField
                        formField={form}
                        disabled={idDepartament === 0}
                        nameField="district_id"
                        label="Distrito"
                        placeholder="Seleccione distrito"
                        listRender={departamentsDistrict.map((district) => ({
                          key: district.id.toString(),
                          textRender: district.name,
                        }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex flex-col">
                      <FormTextField
                        formField={form}
                        nameField="address"
                        label="Dirección (opcional)"
                        placeholder="Ingrese la dirección de la institución"
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormTextField
                        formField={form}
                        nameField="phone"
                        label="Teléfono (opcional)"
                        placeholder="Ingrese el teléfono de la institución"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <Button type="submit" className="mt-4">
                    {activeEdit
                      ? "Actualizar Institución"
                      : "Nueva Institución"}
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
        title="¿Estás seguro que deseas cancelar la referencia?"
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

import { Button } from "@/components/ui/button";
import { Plus, Edit, XCircle, CalendarIcon } from "lucide-react";
import { useHoursRecord } from "@/hooks/use-hours";
import Spinner from "@/components/Spinner";
import type { ColumnDef } from "@tanstack/react-table";
import type { HoursRecordType } from "@/Types/HoursType";
import { HoursRecordSchema } from "@/Types/HoursType";
import { useTable } from "@/hooks/useTable";
import TableStructure from "@/components/TableStructure";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import FormSelectField from "@/components/FormSelectField"; // Mantener para el select simple de Tipo de Horas
import type { z } from "zod";
import GeneralAlert from "@/components/GeneralAlert";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// 1. IMPORTAR EL NUEVO COMPONENTE
import SearchableSelect from "@/components/SearchableSelect";

export default function HoursPage() {
  const {
    hours,
    loading,
    handleDeleteHoursRecord,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertHoursRecord,
  } = useHoursRecord();

  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();

  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);

  const dateRegisterInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof HoursRecordSchema>>({
    resolver: zodResolver(HoursRecordSchema),
    defaultValues: {
      id: undefined,
      date_register: new Date(),
      description: "",
      hours: 0,
      student_id: 0,
      project_id: 0,
    },
  });

  const selectedStudentId = form.watch("student_id");

  const filteredProjects = useMemo(() => {
    if (!selectedStudentId || selectedStudentId === 0) return [];

    return projects.filter((project) =>
      project.assignments?.some(
        (assignment) => assignment.student_id === selectedStudentId
      )
    );
  }, [projects, selectedStudentId]);

  // Efecto para resetear el proyecto si cambia el estudiante
  useEffect(() => {
    // Solo reseteamos si el proyecto seleccionado actual NO está en la lista filtrada
    // Esto evita reseteos innecesarios al abrir el modal de edición
    const currentProject = form.getValues("project_id");
    if (currentProject !== 0) {
      const isValid = filteredProjects.some((p) => p.id === currentProject);
      if (!isValid) {
        form.setValue("project_id", 0);
      }
    }
  }, [selectedStudentId, filteredProjects, form]);

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const editHoursRecord = useCallback(
    (
      id: number,
      student_id: number,
      project_id: number,
      date_register: Date,
      description: string,
      hours: number,
      type_hours_id: number
    ) => {
      setOpen(true);
      setActiveEdit(true);
      // Usamos un timeout mínimo para asegurar que el formulario se renderice antes de resetear
      setTimeout(() => {
        form.reset({
          id,
          student_id,
          project_id,
          date_register: new Date(date_register),
          description,
          hours,
          type_hours_id,
        });
      }, 0);
    },
    [form, setOpen, setActiveEdit]
  );

  const columns: ColumnDef<HoursRecordType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { label: "ID" },
    },
    {
      accessorKey: "student",
      header: "Estudiante",
      cell: ({ row }) => {
        const student = row.original.student;
        return student ? (
          <div>
            <div className="font-medium">
              {student.name} {student.lastname}
            </div>
            <div className="text-sm text-muted-foreground">
              {student.student_id_card ?? "Sin carnet"} • {student.email}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">No asignado</span>
        );
      },
    },
    {
      accessorKey: "project",
      header: "Proyecto",
      cell: ({ row }) => {
        const project = row.original.project;
        return project ? (
          <div>
            <div className="font-medium">{project.name}</div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">No asignado</span>
        );
      },
    },
    {
      accessorKey: "hours",
      header: "Horas",
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-bold">{row.original.hours}</div>
          <div className="text-xs text-muted-foreground">horas</div>
        </div>
      ),
    },
    {
      accessorKey: "date_register",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.original.date_register);
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      accessorKey: "type_hours_id",
      header: "Tipo de Horas",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type_hours_id === 1 ? "default" : "secondary"}
        >
          {row.original.type_hours_id === 1 ? "Internas" : "Externas"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() =>
              editHoursRecord(
                row.original.id,
                row.original.student_id,
                row.original.project_id,
                row.original.date_register,
                row.original.description,
                row.original.hours,
                row.original.type_hours_id
              )
            }
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer bg-transparent"
            onClick={() => openDialogDelete(row.original.id)}
          >
            <XCircle className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: hours,
    columns,
  });

  const cancelDelete = () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  const confirmDelete = async () => {
    await handleDeleteHoursRecord(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  // Preparar opciones para el componente SearchableSelect
  const studentOptions = useMemo(
    () =>
      estudiantes.map((est) => ({
        label: `${est.student_id_card} - ${est.name} ${est.lastname}`,
        value: est.id,
      })),
    [estudiantes]
  );

  const projectOptions = useMemo(
    () =>
      filteredProjects.map((proj) => ({
        label: proj.name,
        value: proj.id,
      })),
    [filteredProjects]
  );

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Seguimiento de Horas</h1>
            <p className="text-muted-foreground">
              Registro, validación y seguimiento de horas sociales y
              profesionales
            </p>
          </div>
          <Button
            className="rounded-md shadow-sm cursor-pointer"
            onClick={() => {
              setOpen(true);
              setActiveEdit(false);
              form.reset({
                student_id: 0,
                project_id: 0,
                date_register: new Date(),
                description: "",
                hours: 0,
                type_hours_id: 0,
              });
            }}
          >
            <Plus className="w-4 h-4" />
            Registrar Horas
          </Button>
        </div>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setActiveEdit(false);
              form.reset(); // Limpieza completa al cerrar
            }
          }}
        >
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full overflow-y-visible">
            {/* NOTA: overflow-y-visible es clave para que el Popover no se corte si sale del Dialog, aunque SearchableSelect lo maneja internamente */}
            <DialogHeader>
              <DialogTitle>
                {activeEdit ? "Editar Registro" : "Nuevo Registro"}
              </DialogTitle>
              <DialogDescription>
                Complete los detalles del registro de horas.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(insertHoursRecord)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* CAMPO ESTUDIANTE CON FILTRO */}
                  <FormField
                    control={form.control}
                    name="student_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Estudiante</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={studentOptions}
                            value={field.value}
                            onChange={(val) => field.onChange(Number(val))}
                            placeholder="Buscar estudiante..."
                            searchPlaceholder="Filtrar por nombre o carnet..."
                            emptyMessage="No se encontraron estudiantes."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAMPO PROYECTO CON FILTRO */}
                  <FormField
                    control={form.control}
                    name="project_id"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Proyecto</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={projectOptions}
                            value={field.value}
                            onChange={(val) => field.onChange(Number(val))}
                            placeholder={
                              !selectedStudentId
                                ? "Seleccione estudiante primero"
                                : "Seleccionar proyecto..."
                            }
                            searchPlaceholder="Buscar proyecto..."
                            emptyMessage={
                              !selectedStudentId
                                ? "Seleccione un estudiante."
                                : "Este estudiante no tiene proyectos asignados."
                            }
                            disabled={!selectedStudentId}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col">
                    <FormTextField
                      formField={form}
                      nameField="hours"
                      label="Horas"
                      placeholder="Cantidad"
                      type="number"
                      className="min-w-0"
                    />
                  </div>

                  {/* TIPO DE HORAS (SELECT SIMPLE ESTÁ BIEN AQUÍ PORQUE SON POCAS OPCIONES) */}
                  <div className="flex flex-col">
                    <FormSelectField
                      formField={form}
                      nameField="type_hours_id"
                      label="Tipo de Horas"
                      placeholder="Seleccione tipo"
                      valueType="number"
                      listRender={[
                        { key: "1", textRender: "Internas" },
                        { key: "2", textRender: "Externas" },
                      ]}
                      className="min-w-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <FormField
                    control={form.control}
                    name="date_register"
                    render={({ field }) => {
                      const dateValue =
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
                          ? field.value
                          : new Date();

                      return (
                        <FormItem>
                          <FormLabel
                            className={cn(
                              form.formState.errors.date_register
                                ? "text-red-600"
                                : ""
                            )}
                          >
                            Fecha
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="date"
                                ref={dateRegisterInputRef}
                                className="w-full"
                                value={dateValue.toISOString().split("T")[0]}
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                              <CalendarIcon
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer"
                                onClick={() =>
                                  dateRegisterInputRef.current?.showPicker()
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <FormTextField
                    formField={form}
                    nameField="description"
                    label="Descripción"
                    placeholder="Detalles de la actividad realizada..."
                    isTextArea={true}
                    rows={3}
                  />
                </div>

                <div className="w-full flex justify-end pt-4">
                  <Button type="submit" className="w-full sm:w-auto">
                    {activeEdit ? "Actualizar Registro" : "Registrar Horas"}
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
        title="¿Eliminar registro?"
        description="Esta acción es irreversible."
        openAlert={openAlertDelete}
        setOpenAlert={setOpenAlertDelete}
        confirmText="Eliminar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <Toaster position="top-right" />
    </>
  );
}

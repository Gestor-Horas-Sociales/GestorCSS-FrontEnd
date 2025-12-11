"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  BookOpen,
  Plus,
  MapPin,
  Users,
  Target,
  Building,
  FilePenLine,
  Trash2,
  CalendarIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, type ProjectType } from "@/Types/ProyectType";
import { useForm } from "react-hook-form";
import { useProjects } from "@/hooks/use-projects";
import { useDistrict } from "@/hooks/use-district";
import type z from "zod";
import Spinner from "@/components/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import FormSelectField from "@/components/FormSelectField";
import { useDepartament } from "@/hooks/use-departament";
import type { ColumnDef } from "@tanstack/react-table";
import GeneralAlert from "@/components/GeneralAlert";
import { Toaster, toast } from "sonner";
import TableStructure from "@/components/TableStructure";
import { useTable } from "@/hooks/useTable";
import { useCarrera } from "@/hooks/use-carrera";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInstitutions } from "@/hooks/use-institutions";

// Imports para el Select Manual
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectsPage() {
  const {
    projects,
    loading,
    loadingProject,
    handleDeleteProject,
    getProjectDetails,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertProject,
  } = useProjects();

  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);

  const { departaments } = useDepartament();
  const { districts, getAllDepartamentsByDistrict, departamentsDistrict } =
    useDistrict();
  const { institutions } = useInstitutions();
  const { carreras } = useCarrera();

  const [idDepartament, setIdDepartment] = useState<number>(0);

  const initialDateInputRef = useRef<HTMLInputElement | null>(null);
  const finalDateInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      social_impact: "",
      type_hours_id: 1,
      req_hours: 1,
      maximum_students: 1,
      req_min_year: 1,
      req_gender: "",
      req_career: "",
      number_beneficiaries: 1,
      departament_id: 1,
      district_id: 1,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      active: true,
      institution_ids: [0], // Inicializamos con 0 para mostrar un select vacío
    },
  });

  const selectedInstitutionIds = form.watch("institution_ids");

  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIdDepartment(value.departament_id ?? 0);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // --- LÓGICA DE LISTA DINÁMICA ---
  const addInstitutionSlot = () => {
    const current = form.getValues("institution_ids");
    form.setValue("institution_ids", [...current, 0]);
  };

  const removeInstitutionSlot = (index: number) => {
    const current = form.getValues("institution_ids");
    // Evitar dejar el array vacío, si borran el último dejamos uno vacío [0]
    if (current.length === 1) {
      form.setValue("institution_ids", [0]);
      return;
    }
    const newArray = current.filter((_, i) => i !== index);
    form.setValue("institution_ids", newArray);
  };

  const updateInstitutionSlot = (index: number, newValue: string) => {
    const current = form.getValues("institution_ids");
    const newArray = [...current];
    newArray[index] = Number(newValue);
    form.setValue("institution_ids", newArray);
  };

  // --- MANEJO DEL SUBMIT (Limpieza de datos) ---
  const handleFormSubmit = (data: z.infer<typeof ProjectSchema>) => {
    // 1. Filtramos los ceros (selects no seleccionados)
    const validInstitutionIds = data.institution_ids.filter((id) => id !== 0);

    // 2. Validamos que quede al menos uno
    if (validInstitutionIds.length === 0) {
      toast.error("Debe seleccionar al menos una institución válida.");
      return;
    }

    // 3. Enviamos los datos limpios
    insertProject({
      ...data,
      institution_ids: validInstitutionIds,
    });
  };

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const editProject = useCallback(
    async (id: number) => {
      setOpen(true);
      setActiveEdit(true);

      const projectDetails = await getProjectDetails(id);

      if (projectDetails) {
        let departmentId = 1;
        let districtId = 1;

        if (
          typeof projectDetails.district_id === "object" &&
          projectDetails.district_id !== null
        ) {
          districtId = projectDetails.district_id.id;
          if (
            "departament" in projectDetails.district_id &&
            projectDetails.district_id.departament
          ) {
            departmentId = projectDetails.district_id.departament.id;
          }
        } else if (typeof projectDetails.district_id === "number") {
          districtId = projectDetails.district_id;
          const district = districts.find((d) => d.id === districtId);
          if (district && typeof district.departament_id === "number") {
            departmentId = district.departament_id;
          }
        }

        let careerId = 0;
        if (
          typeof projectDetails.req_career === "object" &&
          projectDetails.req_career?.id
        ) {
          careerId = projectDetails.req_career.id;
        } else {
          careerId = Number(projectDetails.req_career);
        }

        // Recuperar instituciones asignadas
        const currentInstitutionIds =
          projectDetails.institutions && projectDetails.institutions.length > 0
            ? projectDetails.institutions.map((i) => i.id)
            : [0];

        setIdDepartment(departmentId);

        setTimeout(() => {
          form.reset({
            id: projectDetails.id,
            name: projectDetails.name || "",
            description: projectDetails.description || "",
            social_impact: projectDetails.social_impact || "",
            type_hours_id: projectDetails.type_hours_id || 1,
            req_hours: projectDetails.req_hours || 1,
            maximum_students: projectDetails.maximum_students || 1,
            req_min_year: projectDetails.req_min_year || 1,
            req_gender: projectDetails.req_gender || "",
            req_career: careerId.toString(),
            number_beneficiaries: projectDetails.number_beneficiaries || 1,
            departament_id: departmentId,
            district_id: districtId,
            start_date: projectDetails.start_date
              ? new Date(projectDetails.start_date).toISOString().split("T")[0]
              : "",
            end_date: projectDetails.end_date
              ? new Date(projectDetails.end_date).toISOString().split("T")[0]
              : "",
            active: projectDetails.active ?? true,
            institution_ids: currentInstitutionIds,
          });
        }, 100);
      }
    },
    [form, setOpen, setActiveEdit, getProjectDetails, districts]
  );

  const columns: ColumnDef<ProjectType>[] = [
    {
      accessorKey: "name",
      header: "Proyecto",
      cell: ({ row }) => (
        <div className="min-w-[150px]">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {row.original.institutions &&
            row.original.institutions.length > 0 ? (
              <div className="flex gap-1 mt-1 flex-wrap">
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                  {row.original.institutions.length}{" "}
                  {row.original.institutions.length === 1
                    ? "Institución"
                    : "Instituciones"}
                </span>
              </div>
            ) : (
              <span className="text-xs text-red-400">Sin institución</span>
            )}
          </div>
        </div>
      ),
      size: 200,
    },
    {
      id: "hours",
      header: "Horas",
      cell: ({ row }) => (
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1">
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {row.original.type_hours_id === 1
                ? "Internas"
                : row.original.type_hours_id === 2
                ? "Externas"
                : "Ambas"}
            </span>
          </div>
          <div className="text-sm">{row.original.req_hours} hrs</div>
        </div>
      ),
      size: 100,
    },
    {
      id: "requirements",
      header: "Requisitos",
      cell: ({ row }) => (
        <div className="text-center space-y-1">
          <div className="text-sm">{row.original.req_min_year}° año</div>
          <div className="text-xs capitalize">
            {row.original.req_gender === "M"
              ? "♂ Masc"
              : row.original.req_gender === "F"
              ? "♀ Fem"
              : "⚥ Todos"}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      id: "location",
      header: "Ubicación",
      cell: ({ row }) => {
        if (
          row.original.district_id &&
          typeof row.original.district_id === "object" &&
          "departament" in row.original.district_id
        ) {
          return (
            <div className="min-w-[120px]">
              <div className="text-sm">
                {row.original.district_id.departament?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.original.district_id.name}
              </div>
            </div>
          );
        }
        return (
          <div className="text-xs text-muted-foreground">
            ID:{" "}
            {typeof row.original.district_id === "object"
              ? row.original.district_id
              : row.original.district_id}
          </div>
        );
      },
      size: 150,
    },
    {
      id: "details",
      header: "Cupos",
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.original.maximum_students}</span>
        </div>
      ),
      size: 80,
    },
    {
      accessorKey: "active",
      header: "Estado",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.original.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.active ? "Activo" : "Inactivo"}
        </span>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editProject(row.original.id ?? 0)}
            disabled={loadingProject}
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => openDialogDelete(row.original.id ?? 0)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      size: 80,
    },
  ];

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: projects,
    columns,
  });

  const cancelDelete = () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };
  const confirmDelete = () => {
    handleDeleteProject(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  return (
    <>
      {(loading || loadingProject) && <Spinner />}
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="rounded-xl px-6 py-2 shadow"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
            </Button>

            <Dialog
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                  setActiveEdit(false);
                  form.reset({
                    name: "",
                    description: "",
                    social_impact: "",
                    type_hours_id: 1,
                    req_hours: 1,
                    maximum_students: 1,
                    req_min_year: 1,
                    req_gender: "",
                    req_career: "0",
                    number_beneficiaries: 1,
                    departament_id: 1,
                    district_id: 1,
                    start_date: new Date().toISOString().split("T")[0],
                    end_date: new Date().toISOString().split("T")[0],
                    active: true,
                    institution_ids: [0],
                  });
                }
              }}
            >
              <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto px-4 sm:px-6 lg:px-8">
                <DialogHeader>
                  <DialogTitle>
                    {activeEdit ? "Editar Proyecto" : "Crear Proyecto"}
                  </DialogTitle>
                  <DialogDescription>
                    Asigna una o más instituciones al proyecto.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  {/* AQUÍ EL CAMBIO CLAVE: Usamos handleFormSubmit en lugar de pasarlo directo */}
                  <form
                    onSubmit={form.handleSubmit(handleFormSubmit, (e) =>
                      console.log(e)
                    )}
                  >
                    <div className="grid gap-6 py-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Información Básica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="name"
                              label="Nombre del Proyecto"
                              placeholder="Nombre descriptivo"
                            />
                          </div>

                          {/* --- SECCIÓN DINÁMICA DE INSTITUCIONES --- */}
                          <div className="md:col-span-2 space-y-3">
                            <FormLabel
                              className={cn(
                                form.formState.errors.institution_ids &&
                                  "text-red-600"
                              )}
                            >
                              Instituciones Responsables
                            </FormLabel>

                            {selectedInstitutionIds &&
                              selectedInstitutionIds.map((instId, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center"
                                >
                                  <div className="flex-1">
                                    <Select
                                      // Fix: Si es 0 (vacío), pasamos string vacío para que salga el placeholder
                                      value={
                                        instId === 0 ? "" : instId.toString()
                                      }
                                      onValueChange={(val) =>
                                        updateInstitutionSlot(index, val)
                                      }
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar institución..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {institutions.map((inst) => (
                                          <SelectItem
                                            key={inst.id}
                                            value={inst.id.toString()}
                                          >
                                            {inst.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeInstitutionSlot(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addInstitutionSlot}
                              className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar otra institución
                            </Button>
                            <FormMessage>
                              {form.formState.errors.institution_ids?.message}
                            </FormMessage>
                          </div>
                          {/* ------------------------------------------- */}

                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="description"
                              label="Descripción"
                              isTextArea={true}
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="social_impact"
                              label="Impacto Social"
                              isTextArea={true}
                              rows={2}
                            />
                          </div>
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="type_hours_id"
                              label="Tipo de Horas"
                              placeholder="Seleccionar..."
                              listRender={[
                                { key: "1", textRender: "Internas" },
                                { key: "2", textRender: "Externas" },
                                { key: "3", textRender: "Ambas" },
                              ]}
                            />
                          </div>
                          <div>
                            <FormTextField
                              formField={form}
                              nameField="req_hours"
                              label="Horas Requeridas"
                              placeholder="Ej: 60"
                              type="number"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Requisitos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <FormTextField
                              formField={form}
                              nameField="maximum_students"
                              label="Cupos"
                              type="number"
                            />
                          </div>
                          <div>
                            <FormTextField
                              formField={form}
                              nameField="req_min_year"
                              label="Año Mínimo"
                              type="number"
                            />
                          </div>
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name="req_gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Género Requerido</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar género" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="M">Masculino</SelectItem>
                                    <SelectItem value="F">Femenino</SelectItem>
                                    <SelectItem value="O">Otro</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <FormSelectField
                            formField={form}
                            nameField="req_career"
                            label="Carrera"
                            placeholder="Seleccionar..."
                            listRender={carreras.map((c) => ({
                              key: c.id.toString(),
                              textRender: c.name,
                            }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <FormSelectField
                              formField={form}
                              nameField="departament_id"
                              label="Departamento"
                              placeholder="Seleccionar..."
                              listRender={departaments.map((d) => ({
                                key: d.id.toString(),
                                textRender: d.name,
                              }))}
                            />
                          </div>
                          <div className="flex flex-col">
                            <FormSelectField
                              formField={form}
                              disabled={idDepartament === 0}
                              nameField="district_id"
                              label="Distrito"
                              placeholder="Seleccionar..."
                              listRender={(departamentsDistrict || []).map(
                                (d) => ({
                                  key: d.id.toString(),
                                  textRender: d.name,
                                })
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <FormTextField
                            formField={form}
                            nameField="number_beneficiaries"
                            label="Beneficiarios"
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Configuración</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="active"
                              label="Estado"
                              valueType="boolean"
                              listRender={[
                                { key: "true", textRender: "Activo" },
                                { key: "false", textRender: "Inactivo" },
                              ]}
                            />
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={cn(
                                  form.formState.errors.start_date
                                    ? "text-red-600"
                                    : ""
                                )}
                              >
                                Fecha Inicial
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="date"
                                    {...field}
                                    ref={initialDateInputRef}
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                            .toISOString()
                                            .split("T")[0]
                                        : ""
                                    }
                                  />
                                  <CalendarIcon
                                    className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer"
                                    onClick={() =>
                                      initialDateInputRef.current?.showPicker()
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={cn(
                                  form.formState.errors.end_date
                                    ? "text-red-600"
                                    : ""
                                )}
                              >
                                Fecha Final
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="date"
                                    {...field}
                                    ref={finalDateInputRef}
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                            .toISOString()
                                            .split("T")[0]
                                        : ""
                                    }
                                  />
                                  <CalendarIcon
                                    className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer"
                                    onClick={() =>
                                      finalDateInputRef.current?.showPicker()
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {activeEdit ? "Actualizar" : "Crear"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <MapPin className="w-4 h-4 mr-2" /> Ver Mapa
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Proyectos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activos</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cupos Totales</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((a, b) => a + (b.maximum_students || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Beneficiarios</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects
                  .reduce((a, b) => a + (b.number_beneficiaries || 0), 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <TableStructure
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columns={columns}
          table={table}
        />
      </div>
      <GeneralAlert
        openAlert={openAlertDelete}
        setOpenAlert={setOpenAlertDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="¿Eliminar proyecto?"
        description="Esta acción es irreversible."
        confirmText="Eliminar"
      />
      <Toaster position="top-right" />
    </>
  );
}

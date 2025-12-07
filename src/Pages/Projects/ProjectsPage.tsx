"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { DialogDescription } from "@radix-ui/react-dialog";
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
import { Toaster } from "sonner";
import TableStructure from "@/components/TableStructure";
import { useTable } from "@/hooks/useTable";
import { useCarrera } from "@/hooks/use-carrera";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  // Asegúrate de que en tu hook useDistrict, departamentsDistrict se inicialice como []
  const { districts, getAllDepartamentsByDistrict, departamentsDistrict } =
    useDistrict();
  const [idDepartament, setIdDepartment] = useState<number>(0);
  const { carreras } = useCarrera();

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
      institution_id: 1,
    },
  });

  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Usamos coalescencia nula (??) para evitar undefined
      setIdDepartment(value.departament_id ?? 0);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const editProject = useCallback(
    async (id: number) => {
      setOpen(true);
      setActiveEdit(true);

      // Obtener los detalles completos del proyecto
      const projectDetails = await getProjectDetails(id);

      if (projectDetails) {
        // Extraer el ID del departamento si district_id es un objeto
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
          // Buscar el departamento basado en el distrito
          const district = districts.find((d) => d.id === districtId);
          if (district && typeof district.departament_id === "number") {
            departmentId = district.departament_id;
          }
        }

        // Extraer el ID de la carrera si req_career es un objeto
        let careerId = 0;
        if (
          typeof projectDetails.req_career === "object" &&
          projectDetails.req_career !== null &&
          "id" in projectDetails.req_career
        ) {
          careerId = projectDetails.req_career.id;
        } else if (typeof projectDetails.req_career === "number") {
          careerId = projectDetails.req_career;
        }

        // Establecer el departamento para cargar los distritos
        setIdDepartment(departmentId);

        // Esperar un poco para que se carguen los distritos
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
            start_date:
              typeof projectDetails.start_date === "string"
                ? projectDetails.start_date.split("T")[0]
                : new Date(projectDetails.start_date)
                    .toISOString()
                    .split("T")[0],
            end_date:
              typeof projectDetails.end_date === "string"
                ? projectDetails.end_date.split("T")[0]
                : new Date(projectDetails.end_date).toISOString().split("T")[0],
            active: projectDetails.active ?? true,
            institution_id: projectDetails.institution_id || 1,
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
            {row.original.description}
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
              ? "♂ Masculino"
              : row.original.req_gender === "F"
              ? "♀ Femenino"
              : "⚥ Cualquiera"}
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
                {row.original.district_id.departament?.name ||
                  `ID: ${row.original.district_id.departament?.id}`}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.original.district_id.name ||
                  `ID: ${row.original.district_id.id}`}
              </div>
            </div>
          );
        }

        const depto = departaments.find(
          (d) =>
            d.id ===
            (typeof row.original.departament_id === "object"
              ? row.original.departament_id.id
              : row.original.departament_id)
        );
        const district = districts.find(
          (d) =>
            d.id ===
            (typeof row.original.district_id === "object"
              ? row.original.district_id.id
              : row.original.district_id)
        );

        return (
          <div className="min-w-[120px]">
            <div className="text-sm">
              {depto?.name || `ID: ${row.original.departament_id}`}
            </div>
            <div className="text-xs text-muted-foreground">
              {district?.name || `ID: ${row.original.district_id}`}
            </div>
          </div>
        );
      },
      size: 150,
    },
    {
      id: "details",
      header: "Detalles",
      cell: ({ row }) => (
        <div className="text-center space-y-1">
          <div className="text-sm">
            <span className="font-medium">{row.original.maximum_students}</span>{" "}
            cupos
          </div>
          <div className="text-sm">
            <span className="font-medium">
              {row.original.number_beneficiaries}
            </span>{" "}
            beneficiarios
          </div>
        </div>
      ),
      size: 120,
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
            className="h-8 w-8 p-0"
            onClick={() => editProject(row.original.id ?? 0)}
            disabled={loadingProject}
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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

  const cancelDelete = async () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  const confirmDelete = () => {
    handleDeleteProject(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  useEffect(() => {
    if (idDepartament > 0) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Agregada verificación para evitar cambios innecesarios
      if (value.departament_id && value.departament_id !== idDepartament) {
        setIdDepartment(value.departament_id);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, idDepartament]);

  return (
    <>
      {(loading || loadingProject) && <Spinner />}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
            <p className="text-muted-foreground">
              Administración de proyectos de horas sociales y profesionales
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="rounded-xl px-6 py-2 shadow"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
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
                    institution_id: 1,
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
                    {activeEdit
                      ? "Actualiza la información del proyecto"
                      : "Completa el formulario para registrar un nuevo proyecto"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(insertProject, (errors) => {
                      console.log("Errores del formulario:", errors);
                    })}
                  >
                    <div className="grid gap-6 py-4">
                      {/* Información básica */}
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
                              placeholder="Nombre descriptivo del proyecto"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="description"
                              label="Descripción del Proyecto"
                              placeholder="Descripción detallada del trabajo a realizar"
                              isTextArea={true}
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="social_impact"
                              label="Impacto Social Cuantificado"
                              placeholder="Describe el impacto social cuantificado (beneficiarios, área geográfica, etc.)"
                              isTextArea={true}
                              rows={2}
                            />
                          </div>
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="type_hours_id"
                              label="Tipo de Horas"
                              placeholder="Seleccionar tipo de horas"
                              listRender={[
                                { key: "1", textRender: "Horas Internas" },
                                { key: "2", textRender: "Horas Externas" },
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

                      {/* Requisitos */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Requisitos para Estudiantes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <FormTextField
                              formField={form}
                              nameField="maximum_students"
                              label="Cupos Disponibles"
                              placeholder="Ej: 20"
                              type="number"
                            />
                          </div>
                          <div>
                            <FormTextField
                              formField={form}
                              nameField="req_min_year"
                              label="Año Mínimo Requerido"
                              placeholder="Ej: 2"
                              type="number"
                            />
                          </div>
                        </div>
                        <div>
                          <FormSelectField
                            formField={form}
                            nameField="req_gender"
                            label="Género Requerido"
                            valueType="string"
                            placeholder="Seleccionar género"
                            listRender={[
                              { key: "M", textRender: "Masculino" },
                              { key: "F", textRender: "Femenino" },
                              { key: "O", textRender: "Otro" },
                            ]}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <FormSelectField
                            formField={form}
                            nameField="req_career"
                            label="Carrera"
                            placeholder="Carrera"
                            valueType="number"
                            listRender={carreras.map((carrera) => ({
                              key: carrera.id.toString(),
                              textRender: carrera.name,
                            }))}
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {/* AQUÍ ESTABA EL ERROR: Agregamos protección || [] */}
                            <FormSelectField
                              formField={form}
                              disabled={idDepartament === 0}
                              nameField="district_id"
                              label="Distrito"
                              placeholder="Seleccione distrito"
                              listRender={(departamentsDistrict || []).map(
                                (district) => ({
                                  key: district.id.toString(),
                                  textRender: district.name,
                                })
                              )}
                            />
                          </div>
                        </div>
                        <div>
                          <FormTextField
                            formField={form}
                            nameField="number_beneficiaries"
                            label="Número de Beneficiarios"
                            placeholder="Ej: 150"
                            type="number"
                          />
                        </div>
                      </div>

                      {/* Configuración */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Configuración</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="active"
                              label="Estado"
                              placeholder="Seleccionar estado"
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
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel
                                  htmlFor="input-fechaInicial"
                                  className={cn(
                                    form.formState.errors.start_date
                                      ? "text-red-600"
                                      : "dark:text-secondary"
                                  )}
                                >
                                  Fecha inicial
                                </FormLabel>
                                <FormControl>
                                  <div className="relative dark:border-primary-dark">
                                    <Input
                                      type="date"
                                      id="fechaInicial"
                                      ref={initialDateInputRef}
                                      className="w-full focus-visible:ring-primary dark:border-primary-dark"
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                              .toISOString()
                                              .split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                    <span
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-white cursor-pointer"
                                      onClick={() =>
                                        initialDateInputRef.current?.showPicker()
                                      }
                                    >
                                      <CalendarIcon className="h-5 w-5" />
                                    </span>
                                  </div>
                                </FormControl>

                                <FormMessage className="text-red-600" />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel
                                  htmlFor="input-fechaFinal"
                                  className={cn(
                                    form.formState.errors.end_date
                                      ? "text-red-600"
                                      : "dark:text-secondary"
                                  )}
                                >
                                  Fecha Final
                                </FormLabel>
                                <FormControl>
                                  <div className="relative dark:border-primary-dark">
                                    <Input
                                      type="date"
                                      id="fechaFinal"
                                      ref={finalDateInputRef}
                                      className="w-full focus-visible:ring-primary dark:border-primary-dark"
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                              .toISOString()
                                              .split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                    <span
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-white cursor-pointer"
                                      onClick={() =>
                                        finalDateInputRef.current?.showPicker()
                                      }
                                    >
                                      <CalendarIcon className="h-5 w-5" />
                                    </span>
                                  </div>
                                </FormControl>

                                <FormMessage className="text-red-600" />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {activeEdit ? "Actualizar Proyecto" : "Crear Proyecto"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Ver Mapa
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Proyectos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">+3 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Proyectos Activos
              </CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter((p) => p.active).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (projects.filter((p) => p.active).length / projects.length) *
                    100
                ) || 0}
                % del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estudiantes Asignados
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce(
                  (acc, p) => acc + (p.maximum_students || 0),
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio{" "}
                {Math.round(
                  projects.reduce(
                    (acc, p) => acc + (p.maximum_students || 0),
                    0
                  ) / projects.length
                ) || 0}{" "}
                por proyecto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Beneficiarios
              </CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects
                  .reduce((acc, p) => acc + (p.number_beneficiaries || 0), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Impacto acumulado</p>
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
        title="¿Estás seguro que deseas eliminar este proyecto?"
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

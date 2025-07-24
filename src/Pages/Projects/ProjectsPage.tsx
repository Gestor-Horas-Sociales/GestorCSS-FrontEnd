import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, type ProjectType } from "@/Types/ProyectType";
import { useForm } from "react-hook-form";
import { useProjects } from "@/hooks/use-projects";
import { useDistrict } from "@/hooks/use-district";
import type z from "zod";
import Spinner from "@/components/Spinner";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Form } from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import FormSelectField from "@/components/FormSelectField";
import { useDepartament } from "@/hooks/use-departament";
import type { ColumnDef } from "@tanstack/react-table";
import GeneralAlert from "@/components/GeneralAlert";
import { Toaster } from "sonner";
import TableStructure from "@/components/TableStructure";
import { useTable } from "@/hooks/useTable";
import { FormDatePicker } from "@/components/FormDatePicker";

export default function ProjectsPage() {
  const {
    projects,
    loading,
    handleDeleteProject,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    insertProject,
  } = useProjects();

  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const { departaments } = useDepartament();
  const { districts, getAllDepartamentsByDistrict } = useDistrict();
  const [idDepartament, setIdDepartment] = useState<number>(0);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      social_ipact: "",
      type_hours_id: 1,
      req_hours: 1,
      maximun_students: 1,
      req_min_year: 1,
      req_gender: "",
      req_career: "",
      number_beneficaries: 1,
      departament_id: 1,
      district_id: 1,
      start_date: new Date(),
      end_date: new Date(),
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
      setIdDepartment(value.departament_id ?? 0); // Si es undefined, usa 0
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const editProject = useCallback(
    (
      id: number,
      name: string,
      description: string,
      social_ipact: string,
      type_hours_id: number,
      req_hours: number,
      maximun_students: number,
      req_min_year: number,
      req_gender: string,
      req_career: string,
      number_beneficaries: number,
      departament_id: number,
      district_id: number,
      start_date: Date,
      end_date: Date,
      active: boolean,
      institution_id: number
    ) => {
      setOpen(true);
      setActiveEdit(true);
      setIdDepartment(departament_id);

      form.reset({
        id,
        name,
        description,
        social_ipact,
        type_hours_id,
        req_hours,
        maximun_students,
        req_min_year,
        req_gender,
        req_career,
        number_beneficaries,
        departament_id,
        district_id,
        start_date,
        end_date,
        active,
        institution_id,
      });
    },
    [form, setOpen, setActiveEdit]
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
        // Verifica si tienes datos anidados como en Instituciones
        if (row.original.district_id) {
          return (
            <div className="min-w-[120px]">
              <div className="text-sm">
                {districts.find(d => d.id === row.original.district_id)?.departament?.name || `ID: ${row.original.district_id}`}
              </div>
              <div className="text-xs text-muted-foreground">
                {districts.find(d => d.id === row.original.district_id)?.name || `ID: ${row.original.district_id}`}
              </div>
            </div>
          );
        }
    
        // Fallback a la búsqueda manual si no hay datos anidados
        const depto = departaments.find(d => d.id === row.original.departament_id);
        const district = districts.find(d => d.id === row.original.district_id);
    
        return (
          <div className="min-w-[120px]">
            <div className="text-sm">{depto?.name || `ID: ${row.original.departament_id}`}</div>
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
            <span className="font-medium">{row.original.maximun_students}</span>{" "}
            cupos
          </div>
          <div className="text-sm">
            <span className="font-medium">
              {row.original.number_beneficaries}
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
            onClick={() => {
              editProject(
                row.original.id,
                row.original.name,
                row.original.description,
                row.original.social_ipact,
                row.original.type_hours_id,
                row.original.req_hours,
                row.original.maximun_students,
                row.original.req_min_year,
                row.original.req_gender,
                row.original.req_career,
                row.original.number_beneficaries,
                row.original.departament_id ?? 0,
                row.original.district_id,
                row.original.start_date,
                row.original.end_date,
                row.original.active,
                row.original.institution_id
              );
            }}
          >
            <FilePenLine className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => openDialogDelete(row.original.id)}
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
      if (value.departament_id && value.departament_id !== idDepartament) {
        setIdDepartment(value.departament_id);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, idDepartament]);

  return (
    <>
      {loading && <Spinner />}
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
                    social_ipact: "",
                    type_hours_id: 1,
                    req_hours: 1,
                    maximun_students: 1,
                    req_min_year: 1,
                    req_gender: "",
                    req_career: "",
                    number_beneficaries: 1,
                    departament_id: 1,
                    district_id: 1,
                    start_date: new Date(),
                    end_date: new Date(),
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
                    onSubmit={form.handleSubmit(insertProject)}
                    className="space-y-4"
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
                              nameField="social_ipact"
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
                              nameField="maximun_students"
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
                          <FormTextField
                            formField={form}
                            nameField="req_career"
                            label="Carrera Requerida"
                            placeholder="Ej: Ingeniería Civil"
                          />
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="departament_id"
                              label="Departamento"
                              placeholder="Seleccione departamento"
                              valueType="number"
                              listRender={departaments.map((d) => ({
                                key: d.id.toString(),
                                textRender: d.name,
                              }))}
                            />
                          </div>
                          <div>
                            <FormSelectField
                              formField={form}
                              nameField="district_id"
                              label="Distrito"
                              placeholder="Seleccione distrito"
                              valueType="number"
                              disabled={idDepartament === 0}
                              listRender={districts.map((d) => ({
                                key: d.id.toString(),
                                textRender: d.name,
                              }))}
                            />
                          </div>
                        </div>
                        <div>
                          <FormTextField
                            formField={form}
                            nameField="number_beneficaries"
                            label="Número de Beneficiarios"
                            placeholder="Ej: 150"
                            type="number"
                          />
                        </div>
                      </div>

                      {/* Configuración */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Configuración</h3>
                        <div className="md:col-span-1">
                          <FormSelectField
                            formField={form}
                            nameField="active"
                            label="Estado"
                            placeholder="Seleccionar estado"
                            valueType="string"
                            listRender={[
                              { key: "true", textRender: "Activo" },
                              { key: "false", textRender: "Inactivo" },
                            ]}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormDatePicker
                              formField={form}
                              nameField="start_date"
                              label="Fecha Inicio"
                              placeholder="Selecciona fecha de inicio"
                            />
                            <FormDatePicker
                              formField={form}
                              nameField="end_date"
                              label="Fecha Fin"
                              placeholder="Selecciona fecha de fin"
                              fromDate={form.watch("start_date")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          {activeEdit
                            ? "Actualizar Proyecto"
                            : "Crear Proyecto"}
                        </Button>
                      </div>
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
              <div className="text-2xl font-bold">45</div>
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
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">71% del total</p>
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
              <div className="text-2xl font-bold">287</div>
              <p className="text-xs text-muted-foreground">
                Promedio 9 por proyecto
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
              <div className="text-2xl font-bold">12,500</div>
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

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
  Users,
  Target,
  Building,
  FilePenLine,
  Trash2,
  CalendarIcon,
  GraduationCap,
  UserCog,
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
import { Toaster } from "sonner";
import TableStructure from "@/components/TableStructure";
import { useTable } from "@/hooks/useTable";
import { useCarrera } from "@/hooks/use-carrera";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInstitutions } from "@/hooks/use-institutions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AssignmentModal from "@/components/ExtraComponents/AssignmentModal";
import SearchableSelect from "@/components/SearchableSelect";

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

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] =
    useState<{ id: number; name: string } | null>(null);

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
      req_career: "0",
      number_beneficiaries: 1,
      department_id: 1,
      district_id: 1,
      start_date: new Date().toISOString().split("T")[0],
      end_date: undefined,
      active: true,
      institution_id: 0,
    },
  });

  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIdDepartment(value.department_id ?? 0);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = (data: z.infer<typeof ProjectSchema>) => {
    const { department_id, ...dataToSend } = data;

    insertProject({
      ...dataToSend,
      description: dataToSend.description || "",
      end_date: dataToSend.end_date || null,
    });
  };

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  const handleOpenAssignments = useCallback((project: ProjectType) => {
    if (project.id) {
      setSelectedProjectForAssignment({ id: project.id, name: project.name });
      setOpenAssignmentModal(true);
    }
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
          if (isNaN(careerId)) {
            const found = carreras.find(
              (c) => c.name === projectDetails.req_career
            );
            if (found) careerId = found.id;
          }
        }

        const instId =
          projectDetails.institution?.id || projectDetails.institution_id || 0;

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
            department_id: departmentId,
            district_id: districtId,
            start_date: projectDetails.start_date
              ? new Date(projectDetails.start_date).toISOString().split("T")[0]
              : "",
            end_date: projectDetails.end_date
              ? new Date(projectDetails.end_date).toISOString().split("T")[0]
              : undefined,
            active: projectDetails.active ?? true,
            institution_id: instId,
          });
        }, 100);
      }
    },
    [form, setOpen, setActiveEdit, getProjectDetails, districts, carreras]
  );

  const columns: ColumnDef<ProjectType>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Proyecto",
        cell: ({ row }) => (
          <div className="min-w-[150px]">
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground line-clamp-1 flex items-center gap-1">
              <Building className="w-3 h-3" />
              {row.original.institution?.name || "Sin institución asignada"}
            </div>
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "req_career",
        header: "Carrera",
        cell: ({ row }) => {
          const val = row.original.req_career;
          let careerName = "General";

          if (typeof val === "object" && val !== null && "name" in val) {
            careerName = val.name;
          } else if (
            (typeof val === "string" && !isNaN(Number(val))) ||
            typeof val === "number"
          ) {
            const found = carreras.find((c) => c.id === Number(val));
            if (found) careerName = found.name;
          } else if (typeof val === "string") {
            careerName = val;
          }

          return (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{careerName}</span>
            </div>
          );
        },
        size: 140,
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
        size: 100,
      },
      {
        id: "location",
        header: "Ubicación",
        cell: ({ row }) => {
          let deptName = "N/A";
          let distName = "";

          if (
            typeof row.original.district_id === "object" &&
            row.original.district_id !== null &&
            "departament" in row.original.district_id
          ) {
            deptName = row.original.district_id.departament?.name || "N/A";
            distName = row.original.district_id.name;
          } else {
            const distId = Number(row.original.district_id);
            const foundDist = districts.find((d) => d.id === distId);
            if (foundDist) {
              distName = foundDist.name;
              const foundDept = departaments.find(
                (d) => d.id === foundDist.departament_id
              );
              if (foundDept) deptName = foundDept.name;
            }
          }

          return (
            <div className="min-w-[120px]">
              <div className="text-sm font-medium">{deptName}</div>
              <div className="text-xs text-muted-foreground">{distName}</div>
            </div>
          );
        },
        size: 150,
      },
      {
        id: "cupos_vs_asignados",
        header: "Asignación",
        cell: ({ row }) => {
          const asignados = row.original.assignments?.length || 0;
          const cupos = row.original.maximum_students;
          const porcentaje = Math.min(
            100,
            Math.round((asignados / cupos) * 100)
          );

          return (
            <div className="flex flex-col gap-1 w-full max-w-[100px]">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-blue-600">
                  {asignados} Asig.
                </span>
                <span className="text-muted-foreground">/ {cupos} Cupos</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
            </div>
          );
        },
        size: 130,
      },
      {
        accessorKey: "active",
        header: "Estado",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs border ${
              row.original.active
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-red-600 border-red-200"
            }`}
          >
            {row.original.active ? "Activo" : "Finalizado"}
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
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Gestionar Estudiantes"
              onClick={() => handleOpenAssignments(row.original)}
            >
              <UserCog className="w-4 h-4" />
            </Button>

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
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => openDialogDelete(row.original.id ?? 0)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
        size: 100,
      },
    ],
    [
      districts,
      departaments,
      carreras,
      editProject,
      loadingProject,
      openDialogDelete,
      handleOpenAssignments,
    ]
  );

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
                    department_id: 1,
                    district_id: 1,
                    start_date: new Date().toISOString().split("T")[0],
                    end_date: undefined,
                    active: true,
                    institution_id: 0,
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
                    Complete la información detallada del proyecto.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
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

                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="institution_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institución Responsable</FormLabel>
                                  <FormControl>
                                    <SearchableSelect
                                      options={institutions.map((inst) => ({
                                        label: inst.name,
                                        value: inst.id,
                                      }))}
                                      value={field.value || 0}
                                      onChange={(value) =>
                                        field.onChange(Number(value))
                                      }
                                      placeholder="Seleccionar institución..."
                                      searchPlaceholder="Buscar institución..."
                                      emptyMessage="No se encontró ninguna institución"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <FormTextField
                              formField={form}
                              nameField="description"
                              label="Descripción (Opcional)"
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
                                    <SelectItem value="O">
                                      Indiferente
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <FormField
                            control={form.control}
                            name="req_career"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carrera</FormLabel>
                                <FormControl>
                                  <SearchableSelect
                                    options={carreras.map((c) => ({
                                      label: c.name,
                                      value: c.id,
                                    }))}
                                    value={field.value || "0"}
                                    onChange={(value) =>
                                      field.onChange(value.toString())
                                    }
                                    placeholder="Seleccionar carrera..."
                                    searchPlaceholder="Buscar carrera..."
                                    emptyMessage="No se encontró ninguna carrera"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Ubicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <FormSelectField
                              formField={form}
                              nameField="department_id"
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
                                { key: "false", textRender: "Finalizado" },
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
                                Fecha Final (Opcional)
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

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto w-full">
            <TableStructure
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              columns={columns}
              table={table}
            />
          </div>
        </div>
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

      {selectedProjectForAssignment && (
        <AssignmentModal
          isOpen={openAssignmentModal}
          onClose={() => setOpenAssignmentModal(false)}
          projectId={selectedProjectForAssignment.id}
          projectName={selectedProjectForAssignment.name}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}

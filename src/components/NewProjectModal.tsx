"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectSchema, type ProjectType, type ProjectSchemaType } from "@/Types/ProyectType"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import FormTextField from "@/components/FormTextField"
import FormSelectField from "@/components/FormSelectField"
import { useDepartament } from "@/hooks/use-departament"
import { useDistrict } from "@/hooks/use-district"
import { useCarrera } from "@/hooks/use-carrera"
import { useProjects } from "@/hooks/use-projects"
// 1. Agregamos useCallback al import
import { useEffect, useState, useCallback } from "react"

interface NewProyectoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectToEdit?: ProjectType | null
}

export default function NuevoProyectoModal({ open, onOpenChange, projectToEdit = null }: NewProyectoModalProps) {
  const { departaments } = useDepartament()
  const { districts, getAllDepartamentsByDistrict, departamentsDistrict } = useDistrict()
  const { carreras } = useCarrera()
  const { insertProject, getProjectDetails } = useProjects()
  const [idDepartament, setIdDepartment] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<ProjectSchemaType>({
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
      departament_id: 1,
      district_id: 1,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      active: true,
      institution_ids: [1],
    },
  })

  // 2. Definimos resetForm ANTES del useEffect y con useCallback
  const resetForm = useCallback(() => {
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
      institution_ids: [1],
    })
    setIdDepartment(0)
  }, [form])

  // 3. Definimos loadProjectData ANTES del useEffect y con useCallback
  const loadProjectData = useCallback(async (project: ProjectType) => {
    // If we have an ID, get fresh data from the server
    if (project.id) {
      const freshProject = await getProjectDetails(project.id)
      if (freshProject) {
        project = freshProject
      }
    }

    // Extract department and district IDs
    let departmentId = 1
    let districtId = 1

    if (typeof project.district_id === "object" && project.district_id !== null) {
      districtId = project.district_id.id
      if ("departament" in project.district_id && project.district_id.departament) {
        departmentId = project.district_id.departament.id
      }
    } else if (typeof project.district_id === "number") {
      districtId = project.district_id
      // Find department based on district
      const district = districts.find((d) => d.id === districtId)
      if (district && typeof district.departament_id === "number") {
        departmentId = district.departament_id
      }
    }

    // Extract career ID
    let careerId = 0
    if (typeof project.req_career === "object" && project.req_career !== null && "id" in project.req_career) {
      careerId = project.req_career.id
    } else if (typeof project.req_career === "number") {
      careerId = project.req_career
    } else if (typeof project.req_career === "string") {
      const foundCareer = carreras.find((c) => c.name === project.req_career)
      if (foundCareer) {
        careerId = foundCareer.id
      } else {
        console.warn(`Carrera '${project.req_career}' no encontrada. Estableciendo a 0.`)
        careerId = 0
      }
    }

    // Set department to load districts
    setIdDepartment(departmentId)

    // Wait for districts to load, then set form values
    setTimeout(() => {
      form.reset({
        id: project.id,
        name: project.name || "",
        description: project.description || "",
        social_impact: project.social_impact || "",
        type_hours_id: project.type_hours_id || 1,
        req_hours: project.req_hours || 1,
        maximum_students: project.maximum_students || 1,
        req_min_year: project.req_min_year || 1,
        req_gender: project.req_gender || "",
        req_career: careerId.toString(),
        number_beneficiaries: project.number_beneficiaries || 1,
        departament_id: departmentId,
        district_id: districtId,
        start_date:
          typeof project.start_date === "string"
            ? project.start_date.split("T")[0]
            : new Date(project.start_date).toISOString().split("T")[0],
        end_date:
          typeof project.end_date === "string"
            ? project.end_date.split("T")[0]
            : new Date(project.end_date).toISOString().split("T")[0],
        active: project.active ?? true,
        institution_ids: Array.isArray(project.institution_ids) ? project.institution_ids : [project.institution_ids || 1],
      })
    }, 100)
  }, [getProjectDetails, districts, carreras, form]) // Dependencias del useCallback

  // 4. Ahora el useEffect puede usar las funciones porque ya están declaradas
  useEffect(() => {
    if (projectToEdit && open) {
      setIsEditing(true)
      loadProjectData(projectToEdit)
    } else if (open && !projectToEdit) {
      setIsEditing(false)
      resetForm()
    }
  }, [projectToEdit, open, loadProjectData, resetForm])

  // Watch for department changes to load districts
  useEffect(() => {
    if (idDepartament > 0) {
      getAllDepartamentsByDistrict(idDepartament)
    }
  }, [idDepartament, getAllDepartamentsByDistrict])

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.departament_id && value.departament_id !== idDepartament) {
        setIdDepartment(value.departament_id)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, idDepartament])

  const onSubmit = async (data: ProjectSchemaType) => {
    await insertProject(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Proyecto" : "Crear nuevo proyecto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del proyecto"
              : "Registro de proyectos con datos completos para evaluación."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
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
                    label="Descripción"
                    placeholder="Descripción detallada del proyecto"
                    isTextArea={true}
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormTextField
                    formField={form}
                    nameField="social_impact"
                    label="Impacto Social"
                    placeholder="Describe el impacto social esperado"
                    isTextArea={true}
                    rows={2}
                  />
                </div>
                <div>
                  <FormSelectField
                    formField={form}
                    nameField="type_hours_id"
                    label="Tipo de Horas"
                    placeholder="Seleccionar tipo"
                    valueType="number"
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

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Requisitos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormTextField
                    formField={form}
                    nameField="maximum_students"
                    label="Máximo de Estudiantes"
                    placeholder="Ej: 20"
                    type="number"
                  />
                </div>
                <div>
                  <FormTextField
                    formField={form}
                    nameField="req_min_year"
                    label="Año Mínimo"
                    placeholder="Ej: 2"
                    type="number"
                  />
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
              </div>
              <div>
                <FormSelectField
                  formField={form}
                  nameField="req_career"
                  label="Carrera Requerida"
                  placeholder="Seleccionar carrera"
                  valueType="number"
                  listRender={carreras.map((carrera) => ({
                    key: carrera.id.toString(),
                    textRender: carrera.name,
                  }))}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormSelectField
                    formField={form}
                    nameField="departament_id"
                    label="Departamento"
                    placeholder="Seleccionar departamento"
                    valueType="number"
                    listRender={departaments.map((dept) => ({
                      key: dept.id.toString(),
                      textRender: dept.name,
                    }))}
                  />
                </div>
                <div>
                  <FormSelectField
                    formField={form}
                    nameField="district_id"
                    label="Distrito"
                    placeholder="Seleccionar distrito"
                    disabled={idDepartament === 0}
                    valueType="number"
                    listRender={departamentsDistrict.map((district) => ({
                      key: district.id.toString(),
                      textRender: district.name,
                    }))}
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

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Fin</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? "Actualizar Proyecto" : "Crear Proyecto"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit, XCircle, CalendarIcon } from "lucide-react" // Importar CalendarIcon
import { useHoursRecord } from "@/hooks/use-hours"
import Spinner from "@/components/Spinner"
import type { ColumnDef } from "@tanstack/react-table"
import type { HoursRecordType } from "@/Types/HoursType"
import { HoursRecordSchema } from "@/Types/HoursType"
import { useTable } from "@/hooks/useTable"
import TableStructure from "@/components/TableStructure"
import { useCallback, useState, useEffect, useRef } from "react" // Importar useRef
import { Toaster } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form" // Importar FormField, etc.
import FormTextField from "@/components/FormTextField"
import { useEstudiantes } from "@/hooks/use-estudiantes"
import FormSelectField from "@/components/FormSelectField"
import type { z } from "zod"
import GeneralAlert from "@/components/GeneralAlert"
import { Badge } from "@/components/ui/badge"
import { useProjects } from "@/hooks/use-projects"
import { Input } from "@/components/ui/input" // Importar Input
import { cn } from "@/lib/utils" // Importar cn

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
    getAllHoursRecord,
  } = useHoursRecord()

  const { estudiantes } = useEstudiantes()
  const { projects, getAllProjects } = useProjects()

  const [openAlertDelete, setOpenAlertDelete] = useState(false)
  const [idDelete, setIdDelete] = useState<number>(0)

  // Ref para el input de fecha
  const dateRegisterInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    getAllHoursRecord() // Asegúrate de cargar los registros al inicio
    getAllProjects()
  }, [getAllHoursRecord, getAllProjects])

  const form = useForm<z.infer<typeof HoursRecordSchema>>({
    resolver: zodResolver(HoursRecordSchema),
    defaultValues: {
      id: undefined,
      student_id: 0,
      project_id: 0,
      date_register: undefined,
      description: "",
      hours: 0,
      typeHours_id: 0,
    },
  })

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true)
    setIdDelete(id)
  }, [])

  const editHoursRecord = useCallback(
    (
      id: number,
      student_id: number,
      project_id: number,
      date_register: Date,
      description: string,
      hours: number,
      typeHours_id: number,
    ) => {
      setOpen(true)
      setActiveEdit(true)
      form.reset({
        id,
        student_id,
        project_id,
        date_register: new Date(date_register), // Asegura que sea un objeto Date
        description,
        hours,
        typeHours_id,
      })
    },
    [form, setOpen, setActiveEdit],
  )

  const columns: ColumnDef<HoursRecordType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: {
        label: "ID",
      },
    },
    {
      accessorKey: "student",
      header: "Estudiante",
      cell: ({ row }) => {
        const student = row.original.student
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
        )
      },
    },
    {
      accessorKey: "project",
      header: "Proyecto",
      cell: ({ row }) => {
        const project = row.original.project
        return project ? (
          <div>
            <div className="font-medium">{project.name}</div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">No asignado</span>
        )
      },
    },
    {
      accessorKey: "hours",
      header: "Horas",
      cell: ({ row }) => {
        const hours = row.original.hours
        return (
          <div className="text-center">
            <div className="text-lg font-bold">{hours}</div>
            <div className="text-xs text-muted-foreground">horas</div>
          </div>
        )
      },
    },
    {
      accessorKey: "date_register",
      header: "Fecha",
      cell: ({ row }) => {
        const date = new Date(row.original.date_register)
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      },
    },
    {
      accessorKey: "typeHours_id",
      header: "Tipo de Horas",
      cell: ({ row }) => {
        const typeHours = row.original.typeHours_id
        return (
          <Badge variant={typeHours === 1 ? "default" : "secondary"}>{typeHours === 1 ? "Internas" : "Externas"}</Badge>
        )
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.project?.active
        return (
          <div className="flex items-center">
            {estado === true && <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>}
            {estado === false && <Badge className="bg-green-100 text-green-800">Aprobado</Badge>}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const registro = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="cursor-pointer bg-transparent"
              onClick={() =>
                editHoursRecord(
                  registro.id,
                  registro.student_id,
                  registro.project_id,
                  registro.date_register,
                  registro.description,
                  registro.hours,
                  registro.typeHours_id,
                )
              }
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer bg-transparent"
              onClick={() => openDialogDelete(registro.id)}
            >
              <XCircle className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        )
      },
    },
  ]

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: hours,
    columns,
  })

  const cancelDelete = () => {
    setOpenAlertDelete(false)
    setIdDelete(0)
  }

  const confirmDelete = async () => {
    await handleDeleteHoursRecord(idDelete)
    setOpenAlertDelete(false)
    setIdDelete(0)
  }

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Seguimiento de Horas</h1>
            <p className="text-muted-foreground">
              Registro, validación y seguimiento de horas sociales y profesionales
            </p>
          </div>
          <Button
            className="rounded-md shadow-sm cursor-pointer"
            onClick={() => {
              setOpen(true)
              setActiveEdit(false)
              form.reset({
                student_id: 0,
                project_id: 0,
                date_register: undefined,
                description: "",
                hours: 0,
                typeHours_id: 0,
              })
            }}
          >
            <Plus className="w-4 h-4" />
            Registrar Horas
          </Button>
        </div>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
              setActiveEdit(false)
              form.reset({
                student_id: 0,
                project_id: 0,
                date_register: undefined,
                description: "",
                hours: 0,
                typeHours_id: 0,
              })
            }
          }}
        >
          <DialogContent className="max-w-2xl w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>{activeEdit ? "Editar Registro de Horas" : "Nuevo Registro de Horas"}</DialogTitle>
              <DialogDescription>
                {activeEdit
                  ? "Editar los detalles del registro de horas."
                  : "Ingrese los detalles del nuevo registro de horas."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(insertHoursRecord)}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                      <FormSelectField
                        formField={form}
                        nameField="student_id"
                        label="Estudiante"
                        placeholder="Seleccione estudiante"
                        listRender={estudiantes.map((estudiante) => ({
                          key: estudiante.id.toString(),
                          textRender: `${estudiante.name} ${estudiante.lastname} - ${estudiante.student_id_card}`,
                          value: estudiante.id, // Asegura que el valor sea el ID numérico
                        }))}
                        className="min-w-0"
                        valueType="number" // Asegura que el valor se maneje como número
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormSelectField
                        formField={form}
                        nameField="project_id"
                        label="Proyecto"
                        placeholder="Seleccione proyecto"
                        listRender={projects.map((project) => ({
                          key: (project.id ?? "").toString(),
                          textRender: `${project.name}${project.description ? ` - ${project.description.substring(0, 20)}...` : ""}`,
                          value: project.id, // Asegura que el valor sea el ID numérico
                        }))}
                        className="min-w-0"
                        valueType="number" // Asegura que el valor se maneje como número
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col">
                      <FormTextField
                        formField={form}
                        nameField="hours"
                        label="Horas"
                        placeholder="Ingrese cantidad de horas"
                        type="number"
                        className="min-w-0"
                      />
                    </div>
                    <div className="flex flex-col">
                      {/* Implementación del input de fecha con useRef y CalendarIcon */}
                      <FormField
                        control={form.control}
                        name="date_register"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel
                                htmlFor="date_register"
                                className={cn(
                                  form.formState.errors.date_register ? "text-red-600" : "dark:text-secondary",
                                )}
                              >
                                Fecha de Registro
                              </FormLabel>
                              <FormControl>
                                <div className="relative dark:border-primary-dark">
                                  <Input
                                    type="date"
                                    id="date_register"
                                    ref={dateRegisterInputRef}
                                    className="w-full focus-visible:ring-primary dark:border-primary-dark"
                                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                    onChange={(e) => {
                                      const dateString = e.target.value
                                      if (dateString) {
                                        field.onChange(new Date(dateString)) // Convertir YYYY-MM-DD a objeto Date
                                      } else {
                                        field.onChange(undefined) // Manejar el caso de limpiar la fecha
                                      }
                                    }}
                                    min={new Date().toISOString().split("T")[0]} // Fecha mínima: hoy
                                  />
                                  <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-white cursor-pointer"
                                    onClick={() => dateRegisterInputRef.current?.showPicker()}
                                  >
                                    <CalendarIcon className="h-5 w-5" />
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-600" />
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormSelectField
                        formField={form}
                        nameField="typeHours_id"
                        label="Tipo de Horas"
                        placeholder="Seleccione tipo"
                        listRender={[
                          { key: "1", textRender: "Internas", value: 1 },
                          { key: "2", textRender: "Externas", value: 2 },
                        ]}
                        className="min-w-0"
                        valueType="number" // Asegura que el valor se maneje como número
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <FormTextField
                      formField={form}
                      nameField="description"
                      label="Descripción"
                      placeholder="Ingrese descripción de las actividades"
                      isTextArea={true}
                      rows={3}
                      className="min-w-0"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <Button type="submit" className="mt-4 w-full sm:w-auto">
                    {activeEdit ? "Actualizar Registro" : "Registrar Horas"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <TableStructure globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} columns={columns} table={table} />
      </div>
      <GeneralAlert
        title="¿Estás seguro de eliminar este registro de horas?"
        description="Esta acción no se puede deshacer."
        openAlert={openAlertDelete}
        setOpenAlert={setOpenAlertDelete}
        confirmText="Confirmar"
        onConfirm={() => confirmDelete()}
        onCancel={() => cancelDelete()}
      />
      <Toaster position="top-right" />
    </>
  )
}

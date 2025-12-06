import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Download, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useCarrera } from "@/hooks/use-carrera";
import { useForm } from "react-hook-form";
import { useTable } from "@/hooks/useTable";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StudentSchema,
  type StudentType,
  type StudentExcel,
} from "@/Types/StudentType";
import type { ColumnDef } from "@tanstack/react-table";
import { Form } from "@/components/ui/form";
import FormTextField from "@/components/FormTextField";
import FormSelectField from "@/components/FormSelectField";
import TableStructure from "@/components/TableStructure";
import { toast, Toaster } from "sonner";
import GeneralAlert from "@/components/GeneralAlert";
import type z from "zod";
import { useDepartament } from "@/hooks/use-departament";
import { useDistrict } from "@/hooks/use-district";
import Spinner from "@/components/Spinner";
import * as XLSX from "xlsx";
import * as Papa from "papaparse";
import { normalizarCarrera } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function UsersPage() {
  // Hooks originales sin modificar
  const {
    estudiantes,
    loading,
    open,
    setOpen,
    activeEdit,
    setActiveEdit,
    handleDeleteEstudiante,
    insertStudent,
    calcularHoras,
    insertStudentsFromExcel,
  } = useEstudiantes();

  const { carreras } = useCarrera();
  const { departaments } = useDepartament();
  const { departamentsDistrict, getAllDepartamentsByDistrict } = useDistrict();
  const [idDepartament, setIdDepartment] = useState<number>(0);
  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openProgress, setOpenProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  // Formulario original intacto
  const form = useForm<z.infer<typeof StudentSchema>>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      career_year: 1,
      student_id_card: "",
      gender: "",
      active: false,
      district_id: 0,
      address: "",
      internal_hours: 0,
      external_hours: 0,
      career: {
        career_id: 1,
        career_name: "",
      },
    },
  });
  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIdDepartment(value.departmet_id ?? 0); // Si es undefined, usa 0
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  // Función editEstudiante intacta con departamentos/distritos
  // En la función editEstudiante
  const editEstudiante = useCallback(
    (
      id: number,
      name: string,
      lastname: string,
      email: string,
      career_year: number,
      student_id_card: string,
      gender: string,
      district_id: number,
      active: boolean,
      internal_hours: number,
      external_hours: number,
      address: string,
      career: { id: number; name: string } | null,
      departament_id?: number // Nuevo parámetro
    ) => {
      setOpen(true);
      setActiveEdit(true);

      // Primero establecer el departamento para cargar los distritos
      setIdDepartment(departament_id || 0);

      form.reset({
        id,
        name,
        lastname,
        email,
        career_year,
        student_id_card,
        gender,
        active,
        internal_hours,
        external_hours,
        address,
        departmet_id: departament_id, // Usamos el nombre consistente
        district_id,
        career: career
          ? { career_id: career.id, career_name: career.name }
          : { career_id: 1, career_name: "" },
      });
    },
    [form, setOpen, setActiveEdit]
  );

  // Columnas de la tabla (versión simplificada como en el código viejo)
  const columns: ColumnDef<StudentType>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },

    {
      accessorKey: "name",
      header: "Estudiante",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.name} {row.original.lastname}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.student_id_card} • {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "career.career_name",
      header: "Carrera",
      cell: ({ row }) => (
        <span>
          {row.original.career?.name
            ? row.original.career.name
            : "Sin Carrera Asignada"}
        </span>
      ),
    },
    {
      accessorKey: "career_year",
      header: "Año",
      cell: ({ row }) => <span>{row.original.career_year}° Año</span>,
    },
    {
      id: "progress",
      header: "Progreso",
      cell: ({ row }) => {
        const { horasCompletadas, horasRequeridas, porcentaje } = calcularHoras(
          row.original
        );
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                {horasCompletadas} / {horasRequeridas} hrs
              </span>
              <span>{porcentaje}%</span>
            </div>
            <Progress value={porcentaje} className="h-2" />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editEstudiante(
                row.original.id,
                row.original.name,
                row.original.lastname,
                row.original.email,
                row.original.career_year,
                row.original.student_id_card,
                row.original.gender,
                row.original.district_id,
                row.original.active,
                row.original.internal_hours ?? 0,
                row.original.external_hours ?? 0,
                row.original.address,
                row.original.career
                  ? {
                      id: row.original.career.id,
                      name: row.original.career.name,
                    }
                  : null
              )
            }
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => openDialogDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const { globalFilter, setGlobalFilter, table } = useTable({
    data: estudiantes,
    columns,
  });

  const cancelDelete = async () => {
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  const confirmDelete = () => {
    handleDeleteEstudiante(idDelete);
    setOpenAlertDelete(false);
    setIdDelete(0);
  };

  // Efectos para departamentos/distritos (intactos)
  useEffect(() => {
    if (idDepartament) {
      getAllDepartamentsByDistrict(idDepartament);
    }
  }, [idDepartament, getAllDepartamentsByDistrict]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIdDepartment(value.departmet_id ?? 0);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const procesarImportacion = async (rows: StudentExcel[]) => {
    try {
      for (let i = 0; i < rows.length; i++) {
        const student = rows[i];

        // Aquí mandas a tu API
        await insertStudentsFromExcel([student]);

        // Actualizas la barra de progreso
        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }

      toast.success("Importación completada");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error durante la importación");
    } finally {
      setTimeout(() => {
        setOpenProgress(false);
      }, 800);
    }
  };

  /**
   * Lee un archivo Excel (xls, xlsx) y lo transforma en JSON
   * usando los encabezados de la primera fila.
   */
  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) {
        toast.error("No se pudo leer el archivo");
        return;
      }

      try {
        const workbook = XLSX.read(result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData =
          XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

        const formattedData: StudentExcel[] = jsonData.map((row) => ({
          card: row["Carnet"] || "",
          lastName: row["Apellidos"] || "",
          name: row["Nombres"] || "",
          career: row["Carrera"]
            ? normalizarCarrera(row["Carrera"].toString())
            : "",
          hoursType: row["Tipo Horas"]
            ? row["Tipo Horas"]
                .toString()
                .replace(/^\w/, (c) => c.toUpperCase())
            : "",
          socialHours: row["Horas sociales"] || "",
          email: row["Correo"] || "",
        }));

        setTotalRows(formattedData.length);
        setProgress(0);
        setOpenProgress(true);
        procesarImportacion(formattedData);

        console.log("Datos leídos:", formattedData);
      } catch (error) {
        console.error("Error al leer Excel:", error);
        toast.error("Hubo un error al procesar el archivo Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * Lee un archivo CSV y lo transforma en JSON
   * usando los encabezados de la primera fila.
   */
  const readCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const resultData = result.data as Record<string, string>[];

        try {
          const formattedData: StudentExcel[] = resultData.map((row) => ({
            card: row["Carnet"] || "",
            lastName: row["Apellidos"] || "",
            name: row["Nombres"] || "",
            career: row["Carrera"]
              ? normalizarCarrera(row["Carrera"].toString())
              : "",
            hoursType: row["Tipo Horas"]
              ? row["Tipo Horas"]
                  .toString()
                  .replace(/^\w/, (c) => c.toUpperCase())
              : "",
            socialHours: row["Horas sociales"] || "",
            email: row["Correo"] || "",
          }));

          setTotalRows(formattedData.length);
          setProgress(0);
          setOpenProgress(true);
          procesarImportacion(formattedData);
          console.log("Datos leídos:", formattedData);
        } catch (error) {
          console.error("Error al leer CSV:", error);
          toast.error("Hubo un error al procesar el archivo CSV.");
        }
      },
      error: (err) => {
        console.error("Error con PapaParse:", err);
        toast.error("No se pudo leer el archivo CSV.");
      },
    });
  };

  /**
   * Manejador principal del input de archivo.
   * Decide si llamar a readExcel o readCSV.
   */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (fileExt === "csv") {
      readCSV(file);
    } else if (fileExt === "xls" || fileExt === "xlsx") {
      readExcel(file);
    } else {
      toast.error("Formato no soportado. Sube un .csv, .xls o .xlsx");
    }

    e.target.value = "";
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
        {/* Header intacto */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administración de estudiantes, coordinadores y datos del sistema
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              className="rounded-xl px-6 py-2 shadow"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={handleClick}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Excel
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFile}
              />
              <Button variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
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
                career_year: 1,
                student_id_card: "",
                gender: "",
                active: false,
                district_id: 0,
                address: "",
                internal_hours: 0,
                external_hours: 0,
                career: {
                  career_id: 1,
                  career_name: "",
                },
              });
            }
          }}
        >
          <DialogContent className="max-w-3xl rounded-3xl p-0">
            <Card className="rounded-3xl p-6">
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-bold text-primary">
                  {activeEdit ? "Editar Usuario" : "Registrar Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>
                  {activeEdit
                    ? "Modifica los datos del usuario."
                    : "Completa los campos para registrar un nuevo usuario."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(insertStudent)}
                  className="space-y-6"
                >
                  {/* Contenedor con scroll */}
                  <div className="max-h-96 overflow-y-auto px-1">
                    {/* Sección de Datos Personales (intacta) */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Datos Personales
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormTextField
                          formField={form}
                          nameField="name"
                          label="Nombre"
                          placeholder="Nombre"
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="lastname"
                          label="Apellido"
                          placeholder="Apellido"
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="student_id_card"
                          label="Carnet de Estudiante"
                          placeholder="Carnet de Estudiante"
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="email"
                          label="Correo Electrónico"
                          placeholder="Correo Electrónico"
                          type="email"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Sección de Información Académica (intacta) */}
                    <div className="mt-5">
                      <h3 className="text-lg font-semibold mb-2">
                        Información Académica
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <FormSelectField
                          formField={form}
                          nameField="career.career_id"
                          label="Carrera"
                          placeholder="Carrera"
                          valueType="number"
                          listRender={carreras.map((carrera) => ({
                            key: carrera.id.toString(),
                            textRender: carrera.name,
                          }))}
                          className="rounded-xl"
                        />
                        <FormSelectField
                          formField={form}
                          nameField="career_year"
                          label="Año Académico"
                          placeholder="Año académico"
                          valueType="number"
                          listRender={[1, 2, 3, 4, 5].map((year) => ({
                            key: year.toString(),
                            textRender: `${year}° Año`,
                          }))}
                          className="rounded-xl"
                        />
                        <FormSelectField
                          formField={form}
                          nameField="gender"
                          label="Género"
                          placeholder="Género"
                          valueType="string"
                          listRender={[
                            { key: "M", textRender: "Masculino" },
                            { key: "F", textRender: "Femenino" },
                            { key: "O", textRender: "Otro" },
                          ]}
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Sección de Información Adicional (intacta con departamentos/distritos) */}
                    <div className="mt-5">
                      <h3 className="text-lg font-semibold mb-4">
                        Información Adicional
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelectField
                          formField={form}
                          nameField="departmet_id"
                          label="Departamento"
                          placeholder="Seleccione departamento"
                          valueType="number"
                          listRender={departaments.map((d) => ({
                            key: d.id.toString(),
                            textRender: d.name,
                          }))}
                          className="rounded-xl"
                        />
                        <FormSelectField
                          formField={form}
                          nameField="district_id"
                          label="Distrito"
                          placeholder="Seleccione distrito"
                          valueType="number"
                          disabled={idDepartament === 0}
                          listRender={departamentsDistrict.map((d) => ({
                            key: d.id.toString(),
                            textRender: d.name,
                          }))}
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="internal_hours"
                          label="Horas Internas"
                          placeholder="Horas Internas"
                          type="number"
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="external_hours"
                          label="Horas Externas"
                          placeholder="Horas Externas"
                          type="number"
                          className="rounded-xl"
                        />
                        <FormSelectField
                          formField={form}
                          nameField="active"
                          label="Estado"
                          placeholder="Estado"
                          valueType="boolean"
                          listRender={[
                            { key: "true", textRender: "Activo" },
                            { key: "false", textRender: "Inactivo" },
                          ]}
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="address"
                          label="Dirección"
                          placeholder="Dirección"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-xl"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-xl shadow-md">
                      {activeEdit ? "Actualizar Usuario" : "Registrar Usuario"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </DialogContent>
        </Dialog>

        {/* Tabla con columnas simplificadas */}
        <TableStructure
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columns={columns}
          table={table}
        />
      </div>
      <GeneralAlert
        title="¿Estás seguro que deseas eliminar este estudiante?"
        description="Esta acción no se puede deshacer."
        openAlert={openAlertDelete}
        setOpenAlert={setOpenAlertDelete}
        confirmText="Confirmar"
        onConfirm={() => confirmDelete()}
        onCancel={() => cancelDelete()}
      />
      <Toaster position="top-right" />

      <AlertDialog open={openProgress}>
        <AlertDialogContent className="max-w-sm p-6 rounded-xl z-[9999]">
          <AlertDialogHeader>
            <AlertDialogTitle>Importando Estudiantes...</AlertDialogTitle>
            <AlertDialogDescription>
              Procesando {progress}% — {(progress / 100) * totalRows}/
              {totalRows} registros
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <Progress value={progress} className="h-3" />
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            No cierres esta ventana mientras se completa la importación.
          </p>

          {/* Oculta el contenedor de botones del AlertDialog */}
          <div className="hidden">
            <AlertDialogFooter>
              <AlertDialogCancel />
              <AlertDialogAction />
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
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
import {
  Upload,
  Download,
  Plus,
  Trash2,
  FilePenLine,
  FileText,
} from "lucide-react";
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

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const BUCKET_NAME = "plantillas";
const PUBLIC_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}`;

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
    getAllStudents,
  } = useEstudiantes();

  const { carreras } = useCarrera();
  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [idDelete, setIdDelete] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openProgress, setOpenProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);

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
      active: true,
      internal_hours: 0,
      external_hours: 0,
      career: {
        career_id: 1,
        career_name: "",
      },
    },
  });

  const openDialogDelete = useCallback((id: number) => {
    setOpenAlertDelete(true);
    setIdDelete(id);
  }, []);

  // Función editEstudiante intacta
  const editEstudiante = useCallback(
    (
      id: number,
      name: string,
      lastname: string,
      email: string,
      career_year: number,
      student_id_card: string,
      gender: string,
      active: boolean,
      internal_hours: number,
      external_hours: number,
      career: { id: number; name: string } | null
    ) => {
      setOpen(true);
      setActiveEdit(true);

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
        career: career
          ? { career_id: career.id, career_name: career.name }
          : { career_id: 1, career_name: "" },
      });
    },
    [form, setOpen, setActiveEdit]
  );

  // Columnas de la tabla MODIFICADAS (Con barra de porcentaje real)
  const columns: ColumnDef<StudentType>[] = useMemo(
    () => [
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
          const { horasCompletadas, horasRequeridas } = calcularHoras(
            row.original
          );

          // Cálculo porcentaje real (>100% permitido)
          const realPercentage =
            horasRequeridas > 0
              ? Math.round((horasCompletadas / horasRequeridas) * 100)
              : 0;

          const isOverAchieved = realPercentage > 100;

          return (
            <div className="space-y-1 min-w-[140px]">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">
                  {horasCompletadas} / {horasRequeridas} hrs
                </span>
                <span
                  className={
                    isOverAchieved
                      ? "text-green-600 font-bold"
                      : "text-foreground"
                  }
                >
                  {realPercentage}%
                </span>
              </div>
              <Progress
                value={realPercentage}
                className={`h-2 ${
                  isOverAchieved ? "[&>div]:bg-green-500" : ""
                }`}
              />
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                editEstudiante(
                  row.original.id,
                  row.original.name,
                  row.original.lastname,
                  row.original.email ?? "",
                  row.original.career_year,
                  row.original.student_id_card,
                  row.original.gender,
                  row.original.active,
                  row.original.internal_hours ?? 0,
                  row.original.external_hours ?? 0,
                  row.original.career
                    ? {
                        id: row.original.career.id,
                        name: row.original.career.name,
                      }
                    : null
                )
              }
            >
              <FilePenLine className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 cursor-pointer hover:bg-red-50"
              onClick={() => openDialogDelete(row.original.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [calcularHoras, editEstudiante, openDialogDelete]
  );

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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // ... (funciones de importación Excel/CSV intactas) ...
  const procesarImportacion = async (rows: StudentExcel[]) => {
    try {
      setProgress(0);
      setOpenProgress(true);
      const response = await insertStudentsFromExcel(rows);
      const {
        created = 0,
        updated = 0,
        rejected = 0,
        errors = [],
      } = response ?? {};
      toast.success(
        `📥 Importación completada: ✔ ${created} creados, 🔄 ${updated} actualizados, ❌ ${rejected} rechazados`
      );
      if (errors.length > 0) console.warn("Errores:", errors);
      await getAllStudents();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error durante la importación");
    } finally {
      setProgress(100);
      setTimeout(() => setOpenProgress(false), 800);
    }
  };

  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result) return;
      try {
        const workbook = XLSX.read(result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
          defval: "",
        });
        const formattedData: StudentExcel[] = jsonData.map((row) => ({
          id: row["ID"] ? Number(row["ID"]) : null,
          card: row["Carnet"]?.toString().trim() ?? "",
          lastName: row["Apellidos"]?.toString().trim() ?? "",
          name: row["Nombres"]?.toString().trim() ?? "",
          career: row["Carrera"]
            ? normalizarCarrera(row["Carrera"].toString())
            : "",
          email: row["Correo"]?.toString().trim() ?? "",
          internal_hours: Number(row["Horas internas"] ?? 0),
          external_hours: Number(row["Horas externas"] ?? 0),
        }));
        const validRows = formattedData.filter(
          (s) => s.card && s.name && s.lastName
        );
        if (validRows.length > 0) {
          setTotalRows(validRows.length);
          setProgress(0);
          setOpenProgress(true);
          procesarImportacion(validRows);
        }
      } catch (error) {
        toast.error("Hubo un error al procesar el archivo Excel:" + error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const readCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedData: StudentExcel[] = (
          result.data as Record<string, any>[]
        ).map((row) => ({
          id: row["ID"] ? Number(row["ID"]) : null,
          card: row["Carnet"]?.toString().trim() ?? "",
          lastName: row["Apellidos"]?.toString().trim() ?? "",
          name: row["Nombres"]?.toString().trim() ?? "",
          career: row["Carrera"]
            ? normalizarCarrera(row["Carrera"].toString())
            : "",
          email: row["Correo"]?.toString().trim() ?? "",
          internal_hours: Number(row["Horas internas"] ?? 0),
          external_hours: Number(row["Horas externas"] ?? 0),
        }));
        const validRows = formattedData.filter(
          (s) => s.card && s.name && s.lastName
        );
        if (validRows.length > 0) {
          setTotalRows(validRows.length);
          setProgress(0);
          setOpenProgress(true);
          procesarImportacion(validRows);
        }
      },
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "csv") readCSV(file);
      else if (ext === "xls" || ext === "xlsx") readExcel(file);
      else toast.error("Formato no soportado.");
    }
    e.target.value = "";
  };

  // --- LOGICA DE ACTUALIZACIÓN AUTOMÁTICA (EMAIL Y AÑO) ---
  const studentCard = form.watch("student_id_card");
  const emailValue = form.watch("email");
  const EMAIL_DOMAIN = "@uca.edu.sv";

  useEffect(() => {
    if (!studentCard) {
      // Limpiar si no hay carnet
      form.setValue("email", "", { shouldDirty: true });
      return;
    }

    // 1. Generar Email
    const cleanCard = studentCard.replace(/\D/g, "");
    if (!emailValue || emailValue.endsWith(EMAIL_DOMAIN)) {
      form.setValue("email", `${cleanCard}${EMAIL_DOMAIN}`, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // 2. Calcular Año Académico (Lógica Nueva)
    // Nos aseguramos que al menos tenga 2 dígitos para evitar errores
    if (cleanCard.length >= 2) {
      // Tomamos los últimos 2 dígitos del carnet (Ej: "00053520" -> "20")
      const yearDigits = cleanCard.slice(-2);
      const entryYearShort = parseInt(yearDigits, 10);

      if (!isNaN(entryYearShort)) {
        const currentYear = new Date().getFullYear();
        // Asumimos año 2000+. Si el carnet es 99, será 2099 (futuro),
        // pero la lógica capará el año académico a 1 de todos modos.
        const entryYearFull = 2000 + entryYearShort;

        // Diferencia: 2025 - 2025 = 0
        const diff = currentYear - entryYearFull;

        // Regla: Diff 0 -> 1er año, Diff 1 -> 2do año...
        let academicYear = diff + 1;

        // Restricciones: Mínimo 1, Máximo 5
        if (academicYear < 1) academicYear = 1;
        if (academicYear > 5) academicYear = 5;

        // Actualizamos el campo en el formulario
        form.setValue("career_year", academicYear, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [studentCard, form, emailValue]);
  // --------------------------------------------------------

  const exportToExcel = async () => {
    if (!estudiantes || estudiantes.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    try {
      setExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const dataToExport = estudiantes.map((e) => {
        const internas = e.internal_hours ?? 0;
        const externas = e.external_hours ?? 0;

        return {
          ID: e.id,
          Carnet: e.student_id_card,
          Apellidos: e.lastname,
          Nombres: e.name,
          Carrera: e.career?.name ?? "",          
          "Año carrera": e.career_year ?? 1, 
          Correo: e.email ?? "",
          "Horas internas": internas,
          "Horas externas": externas,
          "Total Horas": internas + externas,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
      XLSX.writeFile(
        workbook,
        `estudiantes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      toast.error("Error al exportar: " + error);
    } finally {
      setExporting(false);
    }
  };

  const downloadTemplate = (fileName: string) => {
    const fullUrl = `${PUBLIC_STORAGE_URL}/${fileName}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", fileName);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="p-6 space-y-6">
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
              onClick={() => {
                setOpen(true);
                form.reset({
                  name: "",
                  lastname: "",
                  email: "",
                  career_year: 1,
                  student_id_card: "",
                  gender: "",
                  active: true,
                  internal_hours: 0,
                  external_hours: 0,
                  career: {
                    career_id: 1,
                    career_name: "",
                  },
                });
              }}
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
                <Download className="w-4 h-4 mr-2" />
                Importar Excel
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFile}
              />
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={exportToExcel}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Spinner /> Exportando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Exportar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl bg-transparent"
                onClick={() => setOpenTemplates(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Plantillas
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
                active: true,
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
                  <div className="max-h-96 overflow-y-auto px-1">
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
                          type="text"
                          placeholder="Carnet de Estudiante"
                          className="rounded-xl"
                        />
                        <FormTextField
                          formField={form}
                          nameField="email"
                          label="Correo Electrónico (Opcional)"
                          placeholder="Correo Electrónico"
                          type="email"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

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

                    <div className="mt-5">
                      <h3 className="text-lg font-semibold mb-4">
                        Información Adicional
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Alertas y Modales de progreso/plantillas (código original) */}
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
          <div className="hidden">
            <AlertDialogFooter>
              <AlertDialogCancel />
              <AlertDialogAction />
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openTemplates} onOpenChange={setOpenTemplates}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Descargar Plantillas</DialogTitle>
            <DialogDescription>
              Selecciona la plantilla que necesitas para crear o editar
              estudiantes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => downloadTemplate("01_crear_estudiantes.xlsx")}
              className="w-full rounded-xl cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" />
              Plantilla - Crear Estudiantes
            </Button>
            <Button
              onClick={() => downloadTemplate("02_actualizar_estudiantes.xlsx")}
              className="w-full rounded-xl cursor-pointer"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Plantilla - Editar Estudiantes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

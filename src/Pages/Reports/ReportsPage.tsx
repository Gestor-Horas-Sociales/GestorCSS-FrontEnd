"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Users,
  BarChart3,
  MapPin,
  Award,
  Loader2,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Hooks
import { useCarrera } from "@/hooks/use-carrera";
import { useDepartament } from "@/hooks/use-departament";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useHoursRecord } from "@/hooks/use-hours";
import { useProjects } from "@/hooks/use-projects";

// API
import {
  downloadAnnualReport,
  downloadProjectReport,
  downloadStudentReport,
  downloadCareerReport,
} from "@/api/reports";

// Componente corregido
import { Combobox } from "@/components/ui/combobox";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");

  // Estados Combobox
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("");

  const [loadingType, setLoadingType] = useState<string | null>(null);

  // Hooks y Datos
  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();
  const { hours } = useHoursRecord();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();

  // Opciones para Combobox
  const studentOptions = useMemo(() => {
    return (
      estudiantes?.map((est) => ({
        value: String(est.id),
        label: `${est.student_id_card} - ${est.name} ${est.lastname}`,
      })) || []
    );
  }, [estudiantes]);

  const projectOptions = useMemo(() => {
    return (
      projects?.map((proj) => ({
        value: String(proj.id),
        label: proj.name,
      })) || []
    );
  }, [projects]);

  const careerOptions = useMemo(() => {
    return (
      carreras?.map((car) => ({
        value: String(car.id),
        label: car.name,
      })) || []
    );
  }, [carreras]);

  // Manejadores
  const handleDownloadAnnual = async () => {
    setLoadingType("annual");
    await downloadAnnualReport(Number(selectedPeriod));
    setLoadingType(null);
  };

  const handleDownloadStudent = async () => {
    if (!selectedStudentId) return;
    setLoadingType("student");
    await downloadStudentReport(Number(selectedStudentId));
    setLoadingType(null);
  };

  const handleDownloadProject = async () => {
    if (!selectedProjectId) return;
    setLoadingType("project");
    await downloadProjectReport(Number(selectedProjectId));
    setLoadingType(null);
  };

  const handleDownloadCareer = async () => {
    if (!selectedCareerId) return;
    setLoadingType("career");
    await downloadCareerReport(Number(selectedCareerId));
    setLoadingType(null);
  };

  // Cálculos Dashboard
  const totalBeneficiarios =
    projects?.reduce(
      (acc, p) => acc + (Number(p.number_beneficiaries) || 0),
      0
    ) || 0;
  const totalHorasCompletadas =
    hours?.reduce((acc, h) => acc + (Number(h.hours) || 0), 0) || 0;

  const dataPorAno = [1, 2, 3, 4, 5].map((year) => ({
    año: `${year}° Año`,
    total: estudiantes?.filter((e) => e.career_year === year).length || 0,
    completados:
      estudiantes?.filter(
        (e) =>
          e.career_year === year &&
          (Number(e.external_hours) || 0) + (Number(e.internal_hours) || 0) >=
            600
      ).length || 0,
  }));

  const dataPorDepto =
    departaments
      ?.map((depto, index) => {
        const count =
          projects?.filter((p) => p.district_id === depto.id)
            .length || 0;
        return {
          name: depto.name,
          value: count > 0 ? count : 1,
          color: COLORS[index % COLORS.length],
        };
      })
      .filter((d) => d.value > 0) || [];

  const dataPorCarrera =
    carreras?.map((carrera) => {
      const studentsInCareer =
        estudiantes?.filter((e) => e.career?.id === carrera.id) || [];
      const totalHoursInCareer = studentsInCareer.reduce(
        (acc, s) =>
          acc +
          ((Number(s.external_hours) || 0) + (Number(s.internal_hours) || 0)),
        0
      );
      const completedInCareer = studentsInCareer.filter(
        (s) =>
          (Number(s.external_hours) || 0) + (Number(s.internal_hours) || 0) >=
          600
      ).length;
      return {
        carrera: carrera.name,
        estudiantes: studentsInCareer.length,
        horas: totalHoursInCareer,
        completados: completedInCareer,
        porcentaje:
          studentsInCareer.length > 0
            ? Math.round((completedInCareer / studentsInCareer.length) * 100)
            : 0,
      };
    }) || [];

  const reportData = {
    resumen_general: {
      total_estudiantes: estudiantes?.length || 0,
      estudiantes_activos:
        estudiantes?.filter((s) => s.active === true).length || 0,
      horas_completadas: totalHorasCompletadas,
      proyectos_activos: projects?.filter((p) => p.active === true).length || 0,
      beneficiarios_impactados: totalBeneficiarios,
    },
    por_año: dataPorAno,
    impacto_social: dataPorDepto,
    por_carrera: dataPorCarrera,
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen transition-colors">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Reportes y Análisis
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generación de reportes detallados y métricas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[120px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleDownloadAnnual}
            disabled={loadingType === "annual"}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loadingType === "annual" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Memoria Anual
          </Button>
        </div>
      </div>
      {/* GENERADOR DE REPORTES (RESPONSIVE GRID & OVERFLOW FIX) */}
      <Card>
        <CardHeader>
          <CardTitle>Generador de Reportes PDF</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Grid responsive: 1 col (móvil), 2 cols (tablet), 4 cols (PC) */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {/* 1. Reporte Individual */}
            <div className="p-4 sm:p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full min-w-0">
              <div className="w-full min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      Individual
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Historial por alumno
                    </p>
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <Combobox
                    options={studentOptions}
                    value={selectedStudentId}
                    onChange={setSelectedStudentId}
                    placeholder="Buscar estudiante..."
                    searchPlaceholder="Nombre/Carnet..."
                    emptyText="Sin resultados."
                  />
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 mt-auto"
                onClick={handleDownloadStudent}
                disabled={loadingType === "student" || !selectedStudentId}
              >
                {loadingType === "student" ? "Generando..." : "Descargar PDF"}
              </Button>
            </div>

            {/* 2. Reporte por Proyecto */}
            <div className="p-4 sm:p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full min-w-0">
              <div className="w-full min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      Por Proyecto
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Impacto y métricas
                    </p>
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <Combobox
                    options={projectOptions}
                    value={selectedProjectId}
                    onChange={setSelectedProjectId}
                    placeholder="Buscar proyecto..."
                    searchPlaceholder="Nombre proyecto..."
                    emptyText="Sin resultados."
                  />
                </div>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 mt-auto"
                onClick={handleDownloadProject}
                disabled={loadingType === "project" || !selectedProjectId}
              >
                {loadingType === "project" ? "Generando..." : "Descargar PDF"}
              </Button>
            </div>

            {/* 3. Reporte por Carrera */}
            <div className="p-4 sm:p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full min-w-0">
              <div className="w-full min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg shrink-0">
                    <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      Por Carrera
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Progreso general
                    </p>
                  </div>
                </div>

                <div className="mb-4 w-full">
                  <Combobox
                    options={careerOptions}
                    value={selectedCareerId}
                    onChange={setSelectedCareerId}
                    placeholder="Buscar carrera..."
                    searchPlaceholder="Nombre carrera..."
                    emptyText="Sin resultados."
                  />
                </div>
              </div>
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-700 dark:hover:bg-orange-600 mt-auto"
                onClick={handleDownloadCareer}
                disabled={loadingType === "career" || !selectedCareerId}
              >
                {loadingType === "career" ? "Generando..." : "Descargar PDF"}
              </Button>
            </div>

            {/* 4. Memoria Anual */}
            <div className="p-4 sm:p-5 border rounded-xl bg-card shadow-sm flex flex-col justify-between h-full min-w-0">
              <div className="w-full min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      Memoria Anual
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Global {selectedPeriod}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  Resumen completo institucional del año seleccionado (
                  {selectedPeriod}).
                </p>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600 mt-auto"
                onClick={handleDownloadAnnual}
                disabled={loadingType === "annual"}
              >
                {loadingType === "annual" ? "Generando..." : "Generar Memoria"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* RESUMEN EJECUTIVO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-muted-foreground" /> Resumen
            Ejecutivo - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <div className="text-center p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {reportData.resumen_general.total_estudiantes.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Estudiantes
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {reportData.resumen_general.estudiantes_activos.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                Activos
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {reportData.resumen_general.horas_completadas.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                Horas Reg.
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {reportData.resumen_general.proyectos_activos}
              </div>
              <div className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">
                Proy. Activos
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg col-span-2 md:col-span-1">
              <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                {reportData.resumen_general.beneficiarios_impactados.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
                Beneficiarios
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GRÁFICOS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reportData.por_año}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#888888"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="año"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#888888" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#888888" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#94a3b8"
                  name="Inscritos"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completados"
                  fill="#10b981"
                  name="Completados"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Región</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={reportData.impacto_social}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                >
                  {reportData.impacto_social.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* LISTA DETALLADA */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {reportData.por_carrera.map((carrera, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card gap-2"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {carrera.carrera}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {carrera.estudiantes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {carrera.completados}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-sm text-muted-foreground sm:hidden">
                    Progreso:
                  </div>
                  <div className="text-right min-w-[60px]">
                    <div className="text-lg font-bold text-foreground">
                      {carrera.porcentaje}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

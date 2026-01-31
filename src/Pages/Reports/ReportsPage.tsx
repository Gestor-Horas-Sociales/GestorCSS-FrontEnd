"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MapPin,
  Award,
  BookOpen,
  Activity,
  Download,
  Building2,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Cell,
} from "recharts";

// Hooks
import { useCarrera } from "@/hooks/use-carrera";
import { useDepartament } from "@/hooks/use-departament";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useProjects } from "@/hooks/use-projects";
import { useInstitutions } from "@/hooks/use-institutions";

// API
import {
  downloadAnnualReport,
  downloadProjectReport,
  downloadStudentReport,
  downloadCareerReport,
} from "@/api/reports";

// Componentes UI
import { Combobox } from "@/components/ui/combobox";
import Spinner from "@/components/Spinner";

// Paleta de colores
const COLORS = [
  "#3b82f6", // Azul
  "#10b981", // Esmeralda
  "#f59e0b", // Ámbar
  "#8b5cf6", // Violeta
  "#ef4444", // Rojo
  "#06b6d4", // Cyan
  "#ec4899", // Rosa
];

// --- COMPONENTE TOOLTIP ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltipBar = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-950 border rounded-lg p-3 shadow-lg text-sm z-50">
        <p className="font-bold mb-1">{label}</p>
        <p className="font-semibold" style={{ color: data.fill }}>
          🏗️ {data.proyectos} Proyectos
        </p>
        <p className="text-gray-500 text-xs">
          👥 {data.estudiantes || 0} Estudiantes asignados
        </p>
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  // 1. AÑO ACTUAL POR DEFECTO
  const currentYear = new Date().getFullYear();
  const [selectedPeriod, setSelectedPeriod] = useState(currentYear.toString());

  // Estados
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("");
  const [loadingType, setLoadingType] = useState<string | null>(null);

  // Hooks de datos
  const { estudiantes, loading } = useEstudiantes();
  const { projects } = useProjects();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();
  const { institutions } = useInstitutions();

  // --- GENERAR LISTA DE AÑOS ---
  const availableYears = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, [currentYear]);

  // --- MÉTRICAS GENERALES ---
  const totalProyectos = projects?.length || 0;
  const totalInstituciones = institutions?.length || 0;

  // --- LÓGICA DE DATOS PARA GRÁFICOS ---

  // 1. Aplanar asignaciones (Necesario para tu código)
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const allAssignments = useMemo(() => {
    if (!projects) return [];
    const listaPlana: any[] = [];
    projects.forEach((proyecto) => {
      if (proyecto.assignments && Array.isArray(proyecto.assignments)) {
        proyecto.assignments.forEach((assign: any) => {
          listaPlana.push({
            student_id: assign.student_id ?? assign.studentId,
            project_id: proyecto.id,
            ...assign,
          });
        });
      }
    });
    return listaPlana;
  }, [projects]);

  // 2. Proyectos por Departamento (TU CÓDIGO REPLICADO EXACTAMENTE)
  const dataPorDepto = useMemo(() => {
    return (
      departaments?.map((depto) => {
        const proyectosEnDepto =
          projects?.filter((p: any) => {
            if (p.district?.departament_id)
              return String(p.district.departament_id) === String(depto.id);
            return false;
          }) || [];

        const idsProyectosDepto = new Set(proyectosEnDepto.map((p) => p.id));
        const estudiantesAtendidos = allAssignments.filter((a) =>
          idsProyectosDepto.has(a.project_id)
        ).length;

        return {
          departamento: depto.name,
          proyectos: proyectosEnDepto.length,
          estudiantes: estudiantesAtendidos,
        };
      }) || []
    )
      // Agrego estos filtros para que el gráfico no muestre espacios vacíos
      .filter((d) => d.proyectos > 0)
      .sort((a, b) => b.proyectos - a.proyectos);
  }, [departaments, projects, allAssignments]);

  // 3. Estudiantes por Año Académico
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

  // 4. Progreso por Carrera
  const dataPorCarrera =
    carreras?.map((carrera) => {
      const studentsInCareer =
        estudiantes?.filter((e) => e.career?.id === carrera.id) || [];
      const completedInCareer = studentsInCareer.filter(
        (s) =>
          (Number(s.external_hours) || 0) + (Number(s.internal_hours) || 0) >=
          600
      ).length;

      const rawPercentage =
        studentsInCareer.length > 0
          ? (completedInCareer / studentsInCareer.length) * 100
          : 0;

      return {
        carrera: carrera.name,
        estudiantes: studentsInCareer.length,
        completados: completedInCareer,
        porcentaje: rawPercentage.toFixed(1),
      };
    }) || [];

  // Opciones Combobox
  const studentOptions = useMemo(
    () =>
      estudiantes?.map((est) => ({
        value: String(est.id),
        label: `${est.student_id_card} - ${est.name} ${est.lastname}`,
      })) || [],
    [estudiantes]
  );

  const projectOptions = useMemo(
    () =>
      projects?.map((proj) => ({
        value: String(proj.id),
        label: proj.name,
      })) || [],
    [projects]
  );

  const careerOptions = useMemo(
    () =>
      carreras?.map((car) => ({
        value: String(car.id),
        label: car.name,
      })) || [],
    [carreras]
  );

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

  return (
    <>
      {loading && <Spinner />}
      <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-background min-h-screen transition-colors">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Reportes y Análisis
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualización y descarga de datos del período{" "}
              <span className="font-semibold text-primary">
                {selectedPeriod}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden sm:block">
              Año Fiscal:
            </span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px] bg-background shadow-sm h-10">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Año" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 1. SECCIÓN DE REPORTERÍA */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {/* Memoria Anual */}
          <ReportGeneratorCard
            title="Reporte Anual"
            desc={`Reporte Global ${selectedPeriod}`}
            icon={Award}
            color="purple"
            loading={loadingType === "annual"}
            onClick={handleDownloadAnnual}
          >
            <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
              Generando datos del año:{" "}
              <span className="font-bold text-purple-600">
                {selectedPeriod}
              </span>
            </div>
          </ReportGeneratorCard>

          {/* Individual */}
          <ReportGeneratorCard
            title="Individual"
            desc="Por estudiante"
            icon={Users}
            color="blue"
            loading={loadingType === "student"}
            onClick={handleDownloadStudent}
            disabled={!selectedStudentId}
          >
            <Combobox
              options={studentOptions}
              value={selectedStudentId}
              onChange={setSelectedStudentId}
              placeholder="Buscar estudiante..."
              searchPlaceholder="Nombre..."
              emptyText="Sin resultados."
            />
          </ReportGeneratorCard>

          {/* Por Proyecto */}
          <ReportGeneratorCard
            title="Por Proyecto"
            desc="Detalle específico"
            icon={MapPin}
            color="green"
            loading={loadingType === "project"}
            onClick={handleDownloadProject}
            disabled={!selectedProjectId}
          >
            <Combobox
              options={projectOptions}
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              placeholder="Buscar proyecto..."
              searchPlaceholder="Nombre..."
              emptyText="Sin resultados."
            />
          </ReportGeneratorCard>

          {/* Por Carrera */}
          <ReportGeneratorCard
            title="Por Carrera"
            desc="Estadísticas de área"
            icon={BookOpen}
            color="orange"
            loading={loadingType === "career"}
            onClick={handleDownloadCareer}
            disabled={!selectedCareerId}
          >
            <Combobox
              options={careerOptions}
              value={selectedCareerId}
              onChange={setSelectedCareerId}
              placeholder="Buscar carrera..."
              searchPlaceholder="Nombre..."
              emptyText="Sin resultados."
            />
          </ReportGeneratorCard>
        </div>

        {/* 2. KPIs (RESUMEN EJECUTIVO) */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          <KpiCard
            title="Total Estudiantes"
            value={estudiantes?.length || 0}
            icon={Users}
            color="text-blue-600"
            bg="bg-blue-100 dark:bg-blue-900/20"
          />
          <KpiCard
            title="Total Proyectos"
            value={totalProyectos}
            icon={Activity}
            color="text-green-600"
            bg="bg-green-100 dark:bg-green-900/20"
          />
          <KpiCard
            title="Total Instituciones"
            value={totalInstituciones}
            icon={Building2}
            color="text-orange-600"
            bg="bg-orange-100 dark:bg-orange-900/20"
          />
        </div>

        {/* 3. GRÁFICOS */}
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Gráfico Principal: Rendimiento por Carrera */}
          <Card className="lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Rendimiento por Carrera</CardTitle>
              <CardDescription>
                Estudiantes totales vs. Horas completadas (600h)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                  layout="vertical"
                  data={dataPorCarrera}
                  margin={{ top: 0, right: 20, bottom: 0, left: 40 }}
                >
                  <CartesianGrid stroke="#f5f5f5" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="carrera"
                    type="category"
                    scale="band"
                    width={100}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="estudiantes"
                    name="Inscritos"
                    barSize={20}
                    fill="#e2e8f0"
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="completados"
                    name="Completados"
                    barSize={20}
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      fill: "#3b82f6",
                      fontSize: 12,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico Secundario: Distribución Académica */}
          <Card className="lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Distribución Académica</CardTitle>
              <CardDescription>Avance por año de estudio</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dataPorAno}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="año"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar
                    dataKey="total"
                    name="Total"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    label={{ position: "top" }}
                  />
                  <Bar
                    dataKey="completados"
                    name="Completados"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    label={{ position: "top" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 4. GRÁFICO DE DEPARTAMENTOS (REPLICADO) */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="flex flex-col min-w-0">
            <CardHeader>
              <CardTitle>Proyectos por Departamento</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="h-[300px] w-full">
                {dataPorDepto.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataPorDepto}
                      margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="departamento"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        content={<CustomTooltipBar />}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar
                        dataKey="proyectos"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      >
                        {dataPorDepto.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No hay datos geográficos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5. LISTA DETALLADA (Footer) */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle Numérico por Carrera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {dataPorCarrera.map((carrera, index) => (
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
                          <Users className="w-3 h-3" /> {carrera.estudiantes}{" "}
                          Total
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" /> {carrera.completados}{" "}
                          Completados
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-right min-w-[60px]">
                        <div className="text-lg font-bold text-foreground">
                          {carrera.porcentaje}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avance
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// --- COMPONENTES AUXILIARES ---

function KpiCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReportGeneratorCard({
  title,
  desc,
  icon: Icon,
  color,
  children,
  onClick,
  loading,
  disabled,
}: any) {
  const colorClasses: any = {
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
    green: "bg-green-100 text-green-600 dark:bg-green-900/20",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
  };

  const btnClasses: any = {
    purple: "bg-purple-600 hover:bg-purple-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    orange: "bg-orange-600 hover:bg-orange-700",
  };

  return (
    <Card className="flex flex-col justify-between shadow-sm border h-full">
      <CardContent className="p-5 flex flex-col h-full gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>

        <div className="flex-1 w-full">{children}</div>

        <Button
          className={`w-full text-white ${btnClasses[color]} shadow-sm`}
          onClick={onClick}
          disabled={disabled || loading}
        >
          {loading ? (
            <>Generando...</>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" /> Descargar PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
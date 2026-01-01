import { useMemo } from "react"; // <--- Importamos useMemo
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock, Calendar, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useProjects } from "@/hooks/use-projects";
import { useHoursRecord } from "@/hooks/use-hours";
import { useCarrera } from "@/hooks/use-carrera";
import { useDepartament } from "@/hooks/use-departament";

export default function DashboardPage() {
  // --- 1. HOOKS Y DATOS ---
  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();
  const { hours } = useHoursRecord();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();

  // --- 2. CÁLCULOS MEMORIZADOS (Optimizacion) ---

  const activeStudents = useMemo(
    () => estudiantes?.filter((s) => s.active === true) || [],
    [estudiantes]
  );

  const activeProyects = useMemo(
    () => projects?.filter((p) => p.active === true) || [],
    [projects]
  );

  // Total Beneficiarios
  const totalBeneficiarios = useMemo(
    () =>
      projects?.reduce((acc, project) => {
        return acc + (Number(project.number_beneficiaries) || 0);
      }, 0) || 0,
    [projects]
  );

  // Horas Totales
  const totalHorasCompletadas = useMemo(
    () =>
      hours?.reduce((acc, record) => {
        return acc + (Number(record.hours) || 0);
      }, 0) || 0,
    [hours]
  );

  // Horas Internas (Tipo 1)
  const totalHorasInternas = useMemo(
    () =>
      hours
        ?.filter((record) => record.type_hours_id === 1)
        .reduce((acc, record) => acc + (Number(record.hours) || 0), 0) || 0,
    [hours]
  );

  // Horas Externas (Tipo 2)
  const totalHorasExternas = useMemo(
    () =>
      hours
        ?.filter((record) => record.type_hours_id === 2)
        .reduce((acc, record) => acc + (Number(record.hours) || 0), 0) || 0,
    [hours]
  );

  // --- 3. CÁLCULOS COMPLEJOS (Cruces de datos) ---

  // A. Proyectos por Carrera (LÓGICA CORREGIDA PARA TU JSON ACTUAL)
  const dataProyectosPorCarrera = useMemo(() => {
    return carreras?.map((carrera) => {
      const proyectosDeCarrera =
        projects?.filter((p) => {
          // Normalizamos los IDs a String para comparar sin miedo ("13" vs 13)
          const idCarreraContext = String(carrera.id);
          const idRequeridoProyecto = p.req_career ? String(p.req_career) : null;

          // 1. Verificamos la relación antigua (Legacy)
          const esLegacy = idRequeridoProyecto === idCarreraContext;

          // 2. Verificamos si el proyecto es "Universal" (req_career es "0")
          // Esto hará que el proyecto cuente para TODAS las carreras
          const esUniversal = idRequeridoProyecto === "0";

          // 3. Verificamos la nueva relación (Muchos a Muchos)
          // Usamos "?.some" protegiendo por si careers es undefined
          // Nota: any se usa temporalmente porque tu backend no manda la estructura tipada aún
          const tieneLaCarrera = p.careers?.some(
            (c: any) => String(c.id) === idCarreraContext
          );

          // Si CUALQUIERA de las 3 condiciones se cumple, lo contamos
          return esLegacy || esUniversal || tieneLaCarrera;
        }) || [];

      return {
        departamento: carrera.name,
        proyectos: proyectosDeCarrera.length,
        estudiantes:
          estudiantes?.filter((e) => e.career?.id === carrera.id).length || 0,
      };
    }) || [];
  }, [carreras, projects, estudiantes]);

  // B. Proyectos por Departamento Geográfico (MEMORIZADO)
  const dataProyectosPorDepto = useMemo(() => {
    return (
      departaments?.map((depto) => {
        const proyectosEnDepto =
          projects?.filter((p) => p.district_id === depto.id) || [];

        const estudiantesEnDepto = proyectosEnDepto.reduce(
          (acc, p) => acc + (Number(p.maximum_students) || 0),
          0
        );

        return {
          departamento: depto.name,
          proyectos: proyectosEnDepto.length,
          estudiantes: estudiantesEnDepto,
        };
      }) || []
    );
  }, [departaments, projects]);

  // --- 4. ARMADO DEL DASHBOARD DATA ---
  // También memorizamos el objeto final para evitar re-renders innecesarios en los hijos
  const dashboardData = useMemo(
    () => ({
      metrics: {
        total_estudiantes: estudiantes?.length || 0,
        estudiantes_activos: activeStudents.length,
        proyectos_activos: activeProyects.length,
        horas_completadas_total: totalHorasCompletadas,
        total_beneficiarios: totalBeneficiarios,
        promedio_avance: 68,
      },

      estudiantes_por_año: [1, 2, 3, 4, 5].map((year) => ({
        año: `${year}°`,
        cantidad:
          estudiantes?.filter((e) => e.career_year === year).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === year &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      })),

      horas_por_tipo: [
        { name: "Horas Internas", value: totalHorasInternas, color: "#3b82f6" },
        { name: "Horas Externas", value: totalHorasExternas, color: "#10b981" },
      ],

      proyectos_por_carrera: dataProyectosPorCarrera,
      proyectos_por_departamento: dataProyectosPorDepto,
    }),
    [
      estudiantes,
      activeStudents,
      activeProyects,
      totalHorasCompletadas,
      totalBeneficiarios,
      totalHorasInternas,
      totalHorasExternas,
      dataProyectosPorCarrera,
      dataProyectosPorDepto,
    ]
  );

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Horas Sociales</h1>
          <p className="text-muted-foreground">
            Monitoreo de proyectos de horas sociales - Facultad de Ingeniería y
            Arquitectura
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Año Académico {currentYear}
          </Badge>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.total_estudiantes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> vs año anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estudiantes Activos
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.estudiantes_activos.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (dashboardData.metrics.estudiantes_activos /
                  (dashboardData.metrics.total_estudiantes || 1)) *
                  100
              )}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proyectos Activos
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.proyectos_activos}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">8 nuevos</span> este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Completadas
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.horas_completadas_total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio: {dashboardData.metrics.promedio_avance}% completado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Estudiantes por año */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Año Académico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.estudiantes_por_año}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="año" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="cantidad"
                  fill="#3b82f6"
                  name="Total Estudiantes"
                />
                <Bar
                  dataKey="completado"
                  fill="#10b981"
                  name="Horas Completadas"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución de horas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Horas por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.horas_por_tipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.horas_por_tipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Proyectos por carrera y por departamento */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Carrera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {dashboardData.proyectos_por_carrera.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{dept.departamento}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.estudiantes} estudiantes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={dept.proyectos > 0 ? "secondary" : "outline"}
                    >
                      {dept.proyectos} proyectos
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {dashboardData.proyectos_por_departamento.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{dept.departamento}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.estudiantes} estudiantes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {dept.proyectos} proyectos
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

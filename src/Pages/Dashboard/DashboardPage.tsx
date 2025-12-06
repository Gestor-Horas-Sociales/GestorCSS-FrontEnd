import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock, Award, Calendar, Target } from "lucide-react";
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
  LineChart,
  Line,
} from "recharts";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useProjects } from "@/hooks/use-projects";
import { useHoursRecord } from "@/hooks/use-hours";

export default function DashboardPage() {
  // 1. Extraes los datos del hook una sola vez
  const { estudiantes } = useEstudiantes();
  const activeStudents = estudiantes.filter(
    (student) => student.active === true
  );

  const { projects } = useProjects();
  const activeProyects = projects.filter((project) => project.active === true);

  const { hours } = useHoursRecord();
  const totalHorasCompletadas =
    hours?.reduce((acc, record) => {
      return acc + (Number(record.hours) || 0);
    }, 0) || 0;

  // 1. Calcular Total Horas Internas
  const totalHorasInternas =
    hours
      ?.filter((record) => record.type_hours_id === 1) // Filtramos solo las de tipo 1
      .reduce((acc, record) => acc + (Number(record.hours) || 0), 0) || 0;

  // 2. Calcular Total Horas Externas
  const totalHorasExternas =
    hours
      ?.filter((record) => record.type_hours_id === 2) // Filtramos solo las de tipo 2
      .reduce((acc, record) => acc + (Number(record.hours) || 0), 0) || 0;

  // Datos de ejemplo - mezclando datos reales con mocks
  const dashboardData = {
    metrics: {
      total_estudiantes: estudiantes?.length || 0,
      estudiantes_activos: activeStudents.length,
      proyectos_activos: activeProyects.length,
      horas_completadas_total: totalHorasCompletadas,
      promedio_avance: 68,
    },
    estudiantes_por_año: [
      {
        año: "1°",
        cantidad: estudiantes?.filter((e) => e.career_year === 1).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === 1 &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      },
      {
        año: "2°",
        cantidad: estudiantes?.filter((e) => e.career_year === 2).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === 2 &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      },
      {
        año: "3°",
        cantidad: estudiantes?.filter((e) => e.career_year === 3).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === 3 &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      },
      {
        año: "4°",
        cantidad: estudiantes?.filter((e) => e.career_year === 4).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === 4 &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      },
      {
        año: "5°",
        cantidad: estudiantes?.filter((e) => e.career_year === 5).length || 0,
        completado:
          estudiantes?.filter(
            (e) =>
              e.career_year === 5 &&
              (Number(e.external_hours) || 0) +
                (Number(e.internal_hours) || 0) >=
                600
          ).length || 0,
      },
    ],
    horas_por_tipo: [
      { name: "Horas Internas", value: totalHorasInternas, color: "#3b82f6" },
      { name: "Horas Externas", value: totalHorasExternas, color: "#10b981" },
    ],
    proyectos_por_carrera: [
      { departamento: "Arquitectura", proyectos: 15, estudiantes: 180 },
      { departamento: "Ing. Civil", proyectos: 12, estudiantes: 160 },
      { departamento: "Ing. Industrial", proyectos: 22, estudiantes: 290 },
      { departamento: "Ing. Informática", proyectos: 25, estudiantes: 310 },
      { departamento: "Ing. Eléctrica", proyectos: 8, estudiantes: 85 },
      { departamento: "Ing. Mecánica", proyectos: 10, estudiantes: 115 },
      { departamento: "Ing. Química", proyectos: 7, estudiantes: 90 },
      { departamento: "Ing. de Alimentos", proyectos: 5, estudiantes: 55 },
      { departamento: "Ing. Energética", proyectos: 4, estudiantes: 40 },
    ],
    proyectos_por_departamento: [
      { departamento: "Ahuachapán", proyectos: 5, estudiantes: 45 },
      { departamento: "Santa Ana", proyectos: 18, estudiantes: 150 },
      { departamento: "Sonsonate", proyectos: 12, estudiantes: 90 },
      { departamento: "Chalatenango", proyectos: 8, estudiantes: 60 },
      { departamento: "La Libertad", proyectos: 25, estudiantes: 210 },
      { departamento: "San Salvador", proyectos: 40, estudiantes: 350 },
      { departamento: "Cuscatlán", proyectos: 6, estudiantes: 40 },
      { departamento: "La Paz", proyectos: 9, estudiantes: 75 },
      { departamento: "Cabañas", proyectos: 4, estudiantes: 30 },
      { departamento: "San Vicente", proyectos: 7, estudiantes: 55 },
      { departamento: "Usulután", proyectos: 10, estudiantes: 85 },
      { departamento: "San Miguel", proyectos: 20, estudiantes: 180 },
      { departamento: "Morazán", proyectos: 5, estudiantes: 35 },
      { departamento: "La Unión", proyectos: 8, estudiantes: 65 },
    ],
    impacto_reciente: [
      { mes: "Ene", beneficiarios: 1200 },
      { mes: "Feb", beneficiarios: 1450 },
      { mes: "Mar", beneficiarios: 1680 },
      { mes: "Abr", beneficiarios: 1920 },
      { mes: "May", beneficiarios: 2100 },
      { mes: "Jun", beneficiarios: 2350 },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Horas Sociales</h1>
          <p className="text-muted-foreground">
            Monitoreo integral del programa de horas sociales - Facultad de
            Ingeniería y Arquitectura
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Período 2024
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
                  dashboardData.metrics.total_estudiantes) *
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

      {/* Proyectos por departamento e impacto social */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Carrera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.proyectos_por_carrera.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
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


        <Card>
          <CardHeader>
            <CardTitle>Proyectos por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.proyectos_por_departamento.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
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

        <Card>
          <CardHeader>
            <CardTitle>Impacto Social - Beneficiarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dashboardData.impacto_reciente}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="beneficiarios"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total beneficiarios este año:
              </span>
              <span className="font-bold text-green-600">12,700 personas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y notificaciones importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Logros y Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-800">Meta Alcanzada</p>
                <p className="text-sm text-green-600">
                  90% estudiantes 4° año completaron horas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-800">Nuevos Proyectos</p>
                <p className="text-sm text-blue-600">
                  5 proyectos externos aprobados
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium text-orange-800">
                  Atención Requerida
                </p>
                <p className="text-sm text-orange-600">
                  120 registros pendientes de validación
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

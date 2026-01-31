/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Target, Layers } from "lucide-react";
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
  Legend,
} from "recharts";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useProjects } from "@/hooks/use-projects";
import { useHoursRecord } from "@/hooks/use-hours";
import { useCarrera } from "@/hooks/use-carrera";
import { useDepartament } from "@/hooks/use-departament";
import { useInstitutions } from "@/hooks/use-institutions";

// Colores vibrantes (Tonos 500 de Tailwind) - Se ven bien en Light y Dark mode
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

export default function DashboardPage() {
  // --- 1. HOOKS Y DATOS ---
  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();
  const { institutions } = useInstitutions();
  const { hours } = useHoursRecord();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();

  // --- 2. EXTRACCIÓN DE DATOS  ---
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
  

  // --- 3. CÁLCULOS MEMORIZADOS ---
  const totalProjects = useMemo(() => projects?.length || 0, [projects]);
  const totalInstitutions = useMemo(
    () => institutions?.length || 0,
    [institutions]
  );

  // Proyectos creados este mes
  const proyectosNuevosMes = useMemo(() => {
    if (!projects) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return projects.filter((p) => {
      const projectDate = new Date(p.start_date);
      return (
        projectDate.getMonth() === currentMonth &&
        projectDate.getFullYear() === currentYear
      );
    }).length;
  }, [projects]);

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

  // --- 4. CÁLCULOS COMPLEJOS ---

  // A. Proyectos y Estudiantes Atendidos por Carrera
  const dataProyectosPorCarrera = useMemo(() => {
    if (!carreras || !estudiantes || !projects || !allAssignments) return [];

    const projectCareersMap = new Map<string, Set<string>>();

    allAssignments.forEach((assign) => {
      const studentId = assign.student_id ?? assign.studentId;
      const projectId = String(assign.project_id ?? assign.projectId);
      const student = estudiantes.find(
        (e) => String(e.id) === String(studentId)
      );

      if (student) {
        const careerId =
          student.career?.id ?? student.career?.id ?? student.career?.id;

        if (careerId) {
          const careerIdStr = String(careerId);
          if (!projectCareersMap.has(projectId)) {
            projectCareersMap.set(projectId, new Set());
          }
          projectCareersMap.get(projectId)?.add(careerIdStr);
        }
      }
    });

    return carreras.map((carrera) => {
      const carreraIdStr = String(carrera.id);
      const idsEstudiantesDeCarrera = new Set();
      estudiantes.forEach((e) => {
        const idCarreraEstudiante =
          e.career?.id ?? e.career?.id ?? e.career?.id;
        if (String(idCarreraEstudiante) === carreraIdStr) {
          idsEstudiantesDeCarrera.add(String(e.id));
        }
      });

      let totalParticipaciones = 0;
      allAssignments.forEach((a) => {
        const idEstudianteAsignado = a.student_id ?? a.studentId;
        if (
          idEstudianteAsignado &&
          idsEstudiantesDeCarrera.has(String(idEstudianteAsignado))
        ) {
          totalParticipaciones++;
        }
      });

      const proyectosCount = projects.filter((p) => {
        const pId = String(p.id);
        const careersInProject = projectCareersMap.get(pId);
        if (careersInProject) {
          return careersInProject.has(carreraIdStr);
        }
        return false;
      }).length;

      return {
        departamento: carrera.name,
        estudiantes: totalParticipaciones,
        proyectos: proyectosCount,
      };
    });
  }, [carreras, projects, estudiantes, allAssignments]);

  // B. Proyectos por Departamento Geográfico
  const dataProyectosPorDepto = useMemo(() => {
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
    );
  }, [departaments, projects, allAssignments]);

  // --- 5. ARMADO DEL DASHBOARD DATA ---
  const dashboardData = useMemo(
    () => ({
      metrics: {
        total_atendidos: allAssignments.length,
        total_estudiantes_unicos: estudiantes?.length || 0,
        instuticiones: totalInstitutions,
        proyectos_totales: totalProjects,
        proyectos_nuevos_mes: proyectosNuevosMes,
        horas_completadas_total: totalHorasCompletadas,
        total_beneficiarios: totalBeneficiarios,
        promedio_avance: 68,
      },

      // LÓGICA DE PROGRESO POR AÑO (CORREGIDA PARA SUMA TOTAL >= 600)
      estudiantes_por_año: [1, 2, 3, 4, 5].map((year) => {
        // 1. Obtener estudiantes de ese año
        const studs = estudiantes?.filter((e) => e.career_year === year) || [];

        // 2. Filtrar completados sumando ambas horas
        const completados = studs.filter((s) => {
          const internas = Number(s.internal_hours) || 0;
          const externas = Number(s.external_hours) || 0;
          return internas + externas >= 600;
        }).length;

        return {
          año: `${year}°`,
          cantidad: studs.length,
          completado: completados,
        };
      }),

      horas_por_tipo: [
        { name: "Horas Internas", value: totalHorasInternas, color: "#3b82f6" },
        { name: "Horas Externas", value: totalHorasExternas, color: "#10b981" },
      ],

      proyectos_por_carrera: dataProyectosPorCarrera,

      // Filtramos departamentos con 0 proyectos
      proyectos_por_departamento: dataProyectosPorDepto
        .filter((d) => d.proyectos > 0)
        .sort((a, b) => b.proyectos - a.proyectos),
    }),
    [
      estudiantes,
      allAssignments,
      totalProjects,
      proyectosNuevosMes,
      totalHorasCompletadas,
      totalInstitutions,
      totalBeneficiarios,
      totalHorasInternas,
      totalHorasExternas,
      dataProyectosPorCarrera,
      dataProyectosPorDepto,
    ]
  );

  const currentYear = new Date().getFullYear();

  // Tooltip para PieChart (Carreras)
  const CustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-950 border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-bold mb-1">{data.departamento}</p>
          <p className="text-blue-500">🔹 {data.proyectos} Proyectos</p>
          <p className="text-gray-500">👥 {data.estudiantes} Estudiantes</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip para BarChart (Departamentos)
  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-950 border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-bold mb-1">{label}</p>
          <p className="font-semibold" style={{ color: data.fill }}>
            🏗️ {data.proyectos} Proyectos
          </p>
          <p className="text-gray-500 text-xs">
            👥 {data.estudiantes} Estudiantes asignados
          </p>
        </div>
      );
    }
    return null;
  };

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* CARD: ESTUDIANTES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.metrics.total_estudiantes_unicos.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de asignaciones a proyectos
            </p>
          </CardContent>
        </Card>

        {/* CARD: PROYECTOS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.proyectos_totales}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600 font-semibold">
                +{dashboardData.metrics.proyectos_nuevos_mes} nuevos
              </span>{" "}
              este mes
            </p>
          </CardContent>
        </Card>

        {/* CARD: INSTITUCIONES */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de instituciones
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.metrics.instuticiones.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* GRÁFICO BARRAS: PROGRESO POR AÑO */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Año Académico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.estudiantes_por_año}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="año" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                  }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Total Estudiantes"
                  label={{ position: "top" }}
                />
                {/* <Bar
                  dataKey="completado"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Horas Completadas"
                /> */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRÁFICO PASTEL: HORAS POR TIPO */}
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

      {/* ZONA DE DETALLES (CARRERAS Y DEPARTAMENTOS) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* GRÁFICO 1: DONA (CARRERAS) */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Proyectos por Carrera</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="h-[300px] w-full">
              {dashboardData.proyectos_por_carrera.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.proyectos_por_carrera}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="proyectos"
                      nameKey="departamento"
                    >
                      {dashboardData.proyectos_por_carrera.map(
                        (_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            strokeWidth={0}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No hay datos para mostrar
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* GRÁFICO 2: BARRAS VERTICALES (DEPARTAMENTOS) */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Proyectos por Departamento</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="h-[300px] w-full">
              {dashboardData.proyectos_por_departamento.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.proyectos_por_departamento}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="departamento"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      content={<CustomTooltipBar />}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar dataKey="proyectos" radius={[4, 4, 0, 0]} barSize={40}>
                      {dashboardData.proyectos_por_departamento.map(
                        (_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
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
      </div>
    </div>
  );
}

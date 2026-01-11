/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Calendar, Target, Layers } from "lucide-react";
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

// NOTA: Ya no usamos useAssignment aquí porque no carga datos globales.
// Usaremos los datos extraídos de 'projects'.

export default function DashboardPage() {
  // --- 1. HOOKS Y DATOS ---
  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();
  const { hours } = useHoursRecord();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();

  // --- 2. EXTRACCIÓN DE DATOS (PLAN B: SACAR ASIGNACIONES DE PROYECTOS) ---

  // Esta lógica extrae todas las asignaciones que vienen anidadas dentro de los proyectos
  // para poder contarlas globalmente.
  const allAssignments = useMemo(() => {
    if (!projects) return [];

    const listaPlana: any[] = [];
    projects.forEach((proyecto) => {
      // Verificamos si el proyecto tiene la lista de asignaciones (Prisma include)
      if (proyecto.assignments && Array.isArray(proyecto.assignments)) {
        proyecto.assignments.forEach((assign: any) => {
          listaPlana.push({
            // Normalizamos IDs: intentamos leer student_id O studentId
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

  const activeStudents = useMemo(
    () => estudiantes?.filter((s) => s.active === true) || [],
    [estudiantes]
  );

  const activeProyects = useMemo(
    () => projects?.filter((p) => p.active === true) || [],
    [projects]
  );

  // Proyectos creados este mes
  const proyectosNuevosMes = useMemo(() => {
    if (!projects) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return projects.filter((p) => {
      // Usamos start_date o createdAt
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

  // --- 4. CÁLCULOS COMPLEJOS (Cruces de datos) ---

 // A. Proyectos y Estudiantes Atendidos por Carrera (CORREGIDO)
 const dataProyectosPorCarrera = useMemo(() => {
  // Verificamos que existan las listas necesarias, incluyendo allAssignments
  if (!carreras || !estudiantes || !projects || !allAssignments) return [];

  // --- PRE-CÁLCULO: Mapa de Carreras por Proyecto ---
  // Creamos un diccionario donde la clave es el ID del proyecto y el valor es un Set con los IDs de las carreras involucradas.
  const projectCareersMap = new Map<string, Set<string>>();

  allAssignments.forEach((assign) => {
    // Normalizamos IDs
    const studentId = assign.student_id ?? assign.studentId;
    const projectId = String(assign.project_id ?? assign.projectId);

    // Buscamos al estudiante dueño de esta asignación para saber su carrera
    const student = estudiantes.find((e) => String(e.id) === String(studentId));

    if (student) {
      // Obtenemos el ID de la carrera (manejando las variantes de tu tipo anterior)
      // Prioridad: objeto nested (career.id) -> propiedad plana (career_id) -> propiedad camelCase (careerId)
      const careerId = student.career?.id ?? student.career?.id ?? student.career?.id;

      if (careerId) {
        const careerIdStr = String(careerId);
        
        // Si el proyecto no está en el mapa, lo inicializamos
        if (!projectCareersMap.has(projectId)) {
          projectCareersMap.set(projectId, new Set());
        }
        
        // Agregamos la carrera al Set (el Set evita duplicados automáticamente)
        projectCareersMap.get(projectId)?.add(careerIdStr);
      }
    }
  });

  // --- ITERACIÓN POR CARRERA ---
  return carreras.map((carrera) => {
    const carreraIdStr = String(carrera.id);

    // --- PASO 1 y 2: Identificar estudiantes y asignaciones (Tu lógica original mantenida) ---
    const idsEstudiantesDeCarrera = new Set();
    estudiantes.forEach((e) => {
      const idCarreraEstudiante = e.career?.id ?? e.career?.id ?? e.career?.id;
      if (String(idCarreraEstudiante) === carreraIdStr) {
        idsEstudiantesDeCarrera.add(String(e.id));
      }
    });

    let totalParticipaciones = 0;
    allAssignments.forEach((a) => {
      const idEstudianteAsignado = a.student_id ?? a.studentId;
      if (idEstudianteAsignado && idsEstudiantesDeCarrera.has(String(idEstudianteAsignado))) {
        totalParticipaciones++;
      }
    });

    // --- PASO 3 (NUEVO): Contar proyectos usando el Mapa Pre-calculado ---
    const proyectosCount = projects.filter((p) => {
      const pId = String(p.id);
      
      // Obtenemos las carreras que participan en este proyecto específico
      const careersInProject = projectCareersMap.get(pId);

      // Si este proyecto tiene carreras registradas, verificamos si ESTA carrera es una de ellas
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
        // 1. Filtramos proyectos de este departamento
        const proyectosEnDepto =
          projects?.filter((p: any) => {
            // Soportamos district_id directo o district objeto anidado
            if (p.district?.departament_id)
              return String(p.district.departament_id) === String(depto.id);
            return false; // Si no hay relación district cargada, no podemos saberlo
          }) || [];

        // 2. Contamos asignaciones en esos proyectos
        const idsProyectosDepto = new Set(proyectosEnDepto.map((p) => p.id));

        const estudiantesAtendidos = allAssignments.filter((a) =>
          idsProyectosDepto.has(a.project_id)
        ).length;

        return {
          departamento: depto.name,
          proyectos: proyectosEnDepto.length,
          estudiantes: estudiantesAtendidos, // Usamos asignaciones reales
        };
      }) || []
    );
  }, [departaments, projects, allAssignments]);

  // --- 5. ARMADO DEL DASHBOARD DATA ---
  const dashboardData = useMemo(
    () => ({
      metrics: {
        total_atendidos: allAssignments.length, // Usamos la longitud de la lista extraída
        total_estudiantes_unicos: estudiantes?.length || 0,
        estudiantes_activos: activeStudents.length,
        proyectos_activos: activeProyects.length,
        proyectos_nuevos_mes: proyectosNuevosMes,
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
      allAssignments, // Importante: dependencia actualizada
      activeStudents,
      activeProyects,
      proyectosNuevosMes,
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
        {/* CARD: ESTUDIANTES ATENDIDOS (Asignaciones) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estudiantes Atendidos
            </CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.metrics.total_atendidos.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de asignaciones a proyectos
            </p>
          </CardContent>
        </Card>

        {/* CARD: PROYECTOS ACTIVOS */}
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
              <span className="text-blue-600 font-semibold">
                +{dashboardData.metrics.proyectos_nuevos_mes} nuevos
              </span>{" "}
              este mes
            </p>
          </CardContent>
        </Card>

        {/* CARD: ESTUDIANTES ACTIVOS (Universo) */}
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
                  (dashboardData.metrics.total_estudiantes_unicos || 1)) *
                  100
              )}
              % del universo total
            </p>
          </CardContent>
        </Card>

        {/* CARD: HORAS COMPLETADAS */}
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
                      {dept.estudiantes} atendidos
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
                      {dept.estudiantes} atendidos
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

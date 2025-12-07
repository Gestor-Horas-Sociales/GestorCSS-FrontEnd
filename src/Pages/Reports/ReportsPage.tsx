"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Users, BarChart3, MapPin, Award } from "lucide-react";
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
import { useCarrera } from "@/hooks/use-carrera";
import { useDepartament } from "@/hooks/use-departament";
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useHoursRecord } from "@/hooks/use-hours";
import { useProjects } from "@/hooks/use-projects";

// Paleta de colores para las gráficas
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#ec4899", // Pink
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");

  // --- 1. HOOKS Y DATOS ---
  const { estudiantes } = useEstudiantes();
  const { projects } = useProjects();
  const { hours } = useHoursRecord();
  const { carreras } = useCarrera();
  const { departaments } = useDepartament();

  // --- 2. CÁLCULOS DINÁMICOS ---

  // A. Métricas Generales
  const totalBeneficiarios =
    projects?.reduce(
      (acc, p) => acc + (Number(p.number_beneficiaries) || 0),
      0
    ) || 0;

  const totalHorasCompletadas =
    hours?.reduce((acc, h) => acc + (Number(h.hours) || 0), 0) || 0;

  // B. Datos para Gráfico de Barras (Progreso por Año)
  const dataPorAno = [1, 2, 3, 4, 5].map((year) => ({
    año: `${year}° Año`, // Etiqueta XAxis
    total: estudiantes?.filter((e) => e.career_year === year).length || 0, // Barra Gris
    completados:
      estudiantes?.filter(
        (e) =>
          e.career_year === year &&
          (Number(e.external_hours) || 0) + (Number(e.internal_hours) || 0) >=
            600
      ).length || 0, // Barra Verde
  }));

  // C. Datos para Gráfico de Pastel (Proyectos por Departamento Geográfico)
  const dataPorDepto =
    departaments
      ?.map((depto, index) => {
        const count =
          projects?.filter((p) => p.id === depto.id).length || 0;
        return {
          name: depto.name, // Etiqueta
          value: count, // Valor para el slice
          color: COLORS[index % COLORS.length], // Color cíclico
        };
      })
      .filter((d) => d.value > 0) || []; // Filtramos los que tienen 0 para que no se vea feo el pie

  // D. Datos para la Lista Detallada (Por Carrera)
  const dataPorCarrera =
    carreras?.map((carrera) => {
      // Filtrar estudiantes de esta carrera
      const studentsInCareer =
        estudiantes?.filter((e) => e.id === carrera.id) || [];

      // Calcular horas totales sumadas de esos estudiantes (aproximado)
      // Nota: Esto es costoso computacionalmente, si es lento, simplifícalo.
      const totalHoursInCareer = studentsInCareer.reduce(
        (acc, s) =>
          acc +
          ((Number(s.external_hours) || 0) + (Number(s.internal_hours) || 0)),
        0
      );

      // Calcular completados (>600h)
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

  // --- 3. OBJETO UNIFICADO PARA RENDER ---
  const reportData = {
    resumen_general: {
      total_estudiantes: estudiantes?.length || 0,
      estudiantes_activos:
        estudiantes?.filter((s) => s.active === true).length || 0,
      horas_completadas: totalHorasCompletadas,
      proyectos_activos: projects?.filter((p) => p.active === true).length || 0,
      beneficiarios_impactados: totalBeneficiarios,
    },
    // Asignamos las variables calculadas arriba
    por_año: dataPorAno,
    impacto_social: dataPorDepto, // Usamos deptos geográficos para el Pie Chart
    por_carrera: dataPorCarrera,
  };

  const generateReport = (type: string) => {
    console.log(`Generando reporte: ${type}`);
    // Aquí iría la lógica para generar el PDF/Excel
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Generación de reportes detallados y análisis en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => generateReport("general")}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Resumen Ejecutivo - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {reportData.resumen_general.total_estudiantes.toLocaleString()}
              </div>
              <div className="text-sm text-blue-800">Total Estudiantes</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reportData.resumen_general.estudiantes_activos.toLocaleString()}
              </div>
              <div className="text-sm text-green-800">Estudiantes Activos</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {reportData.resumen_general.horas_completadas.toLocaleString()}
              </div>
              <div className="text-sm text-purple-800">Horas Registradas</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {reportData.resumen_general.proyectos_activos}
              </div>
              <div className="text-sm text-orange-800">Proyectos Activos</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {reportData.resumen_general.beneficiarios_impactados.toLocaleString()}
              </div>
              <div className="text-sm text-red-800">Beneficiarios</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de Análisis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Progreso por Año (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes vs Completados por Año</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.por_año}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="año"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="total"
                  fill="#e2e8f0"
                  name="Total Inscritos"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completados"
                  fill="#10b981"
                  name="Horas Completas (>600h)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución Geográfica (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Proyectos por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={reportData.impacto_social}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Hace que sea una "Donut chart" (más moderno)
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {reportData.impacto_social.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reportes por Carrera */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose Detallado por Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reportData.por_carrera.map((carrera, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{carrera.carrera}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {carrera.estudiantes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" /> {carrera.completados}{" "}
                      completados
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right min-w-[80px]">
                    <div className="text-lg font-bold text-slate-700">
                      {carrera.porcentaje}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Progreso Total
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="w-4 h-4 text-slate-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Generador de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Individual</h3>
                  <p className="text-xs text-muted-foreground">
                    Historial por alumno
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar alumno..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Llenamos el select con datos reales (limitado a 5 para no saturar) */}
                    {estudiantes?.slice(0, 5).map((est) => (
                      <SelectItem key={est.id} value={String(est.id)}>
                        {est.name} {est.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full h-9"
                  variant="outline"
                  onClick={() => generateReport("individual")}
                >
                  Descargar PDF
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Por Proyecto</h3>
                  <p className="text-xs text-muted-foreground">
                    Impacto y métricas
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Seleccionar proyecto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.slice(0, 5).map((proj) => (
                      <SelectItem key={proj.id} value={String(proj.id)}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full h-9"
                  variant="outline"
                  onClick={() => generateReport("proyecto")}
                >
                  Descargar PDF
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Memoria Anual</h3>
                  <p className="text-xs text-muted-foreground">
                    Reporte institucional
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground flex items-center h-9">
                  Incluye todas las carreras y deptos.
                </div>
                <Button
                  className="w-full h-9 bg-purple-600 hover:bg-purple-700"
                  onClick={() => generateReport("anual")}
                >
                  Generar Memoria
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

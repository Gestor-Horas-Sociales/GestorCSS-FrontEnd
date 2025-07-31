"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Users, BarChart3, MapPin, Award } from "lucide-react"
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
} from "recharts"

// Datos para reportes
const reportData = {
  resumen_general: {
    total_estudiantes: 1250,
    estudiantes_activos: 980,
    horas_completadas: 125000,
    proyectos_activos: 45,
    beneficiarios_impactados: 12500,
  },
  por_carrera: [
    { carrera: "Ing. Sistemas", estudiantes: 320, horas: 38400, completados: 245 },
    { carrera: "Ing. Civil", estudiantes: 280, horas: 33600, completados: 210 },
    { carrera: "Ing. Industrial", estudiantes: 250, horas: 30000, completados: 180 },
    { carrera: "Arquitectura", estudiantes: 400, horas: 48000, completados: 295 },
  ],
  por_año: [
    { año: "1°", total: 280, completados: 45, porcentaje: 16 },
    { año: "2°", total: 260, completados: 120, porcentaje: 46 },
    { año: "3°", total: 240, completados: 180, porcentaje: 75 },
    { año: "4°", total: 220, completados: 200, porcentaje: 91 },
    { año: "5°", total: 250, completados: 235, porcentaje: 94 },
  ],
  impacto_social: [
    { tipo: "Educación", proyectos: 18, beneficiarios: 4500, color: "#3b82f6" },
    { tipo: "Salud", proyectos: 12, beneficiarios: 3200, color: "#10b981" },
    { tipo: "Infraestructura", proyectos: 8, beneficiarios: 2800, color: "#f59e0b" },
    { tipo: "Medio Ambiente", proyectos: 7, beneficiarios: 2000, color: "#8b5cf6" },
  ],
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")

  const generateReport = (type: string) => {
    console.log(`Generando reporte: ${type}`)
    // Aquí iría la lógica para generar el reporte
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Generación de reportes detallados y análisis de impacto social</p>
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
              <div className="text-sm text-purple-800">Horas Completadas</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{reportData.resumen_general.proyectos_activos}</div>
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
        {/* Progreso por Año */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Año Académico</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.por_año}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="año" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#e5e7eb" name="Total Estudiantes" />
                <Bar dataKey="completados" fill="#10b981" name="Completados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impacto Social */}
        <Card>
          <CardHeader>
            <CardTitle>Impacto Social por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={reportData.impacto_social}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, beneficiarios }) => `${tipo}: ${beneficiarios}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="beneficiarios"
                >
                  {reportData.impacto_social.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reportes por Carrera */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis por Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.por_carrera.map((carrera, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{carrera.carrera}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{carrera.estudiantes} estudiantes</span>
                    <span>{carrera.horas.toLocaleString()} horas</span>
                    <span>{carrera.completados} completados</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {Math.round((carrera.completados / carrera.estudiantes) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completado</div>
                </div>
                <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                  <Download className="w-4 h-4 mr-1" />
                  Reporte
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Reporte Individual</h3>
                  <p className="text-sm text-muted-foreground">Por estudiante</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">María González</SelectItem>
                    <SelectItem value="2">Carlos Martínez</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" onClick={() => generateReport("individual")}>
                  Generar Reporte
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Reporte por Proyecto</h3>
                  <p className="text-sm text-muted-foreground">Impacto y participación</p>
                </div>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Apoyo Educativo El Manguito</SelectItem>
                    <SelectItem value="2">Construcción Comunitaria</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" onClick={() => generateReport("proyecto")}>
                  Generar Reporte
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Memoria Anual</h3>
                  <p className="text-sm text-muted-foreground">Reporte completo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Incluye todos los datos del año académico</div>
                <Button className="w-full" onClick={() => generateReport("anual")}>
                  Generar Memoria
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

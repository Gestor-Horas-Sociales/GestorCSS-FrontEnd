"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, MapPin, Users, Target, Building, ExternalLink, Edit, Eye } from "lucide-react"

// Datos de ejemplo
const proyectos = [
  {
    id: "1",
    nombre: "Apoyo Educativo Comunidad El Manguito",
    descripcion: "Programa de refuerzo académico para niños de primaria en comunidad rural",
    impacto_social: "Beneficia a 150 niños de 6-12 años mejorando su rendimiento académico",
    tipo: "externo",
    departamento: "Ingeniería en Sistemas",
    ubicacion: {
      departamento: "La Libertad",
      municipio: "Santa Tecla",
      direccion: "Comunidad El Manguito, Km 15",
    },
    coordinador: "Dr. María Rodríguez",
    estado: "activo",
    tipo_horas: "sociales",
    cupos_disponibles: 15,
    cupos_ocupados: 8,
    fecha_inicio: "2024-02-01",
    fecha_fin: "2024-11-30",
    beneficiarios_estimados: 150,
    estudiantes_asignados: [
      { nombre: "Ana García", carrera: "Ing. Sistemas", año: 3 },
      { nombre: "Carlos López", carrera: "Ing. Sistemas", año: 4 },
    ],
  },
  {
    id: "2",
    nombre: "Desarrollo de Sistema Web para ONG",
    descripcion: "Creación de plataforma web para gestión de donaciones y voluntarios",
    impacto_social: "Optimiza procesos de 5 ONGs locales, mejorando eficiencia en 40%",
    tipo: "interno",
    departamento: "Ingeniería en Sistemas",
    ubicacion: {
      departamento: "San Salvador",
      municipio: "San Salvador",
      direccion: "Campus UCA",
    },
    coordinador: "Ing. Roberto Martínez",
    estado: "activo",
    tipo_horas: "profesionales",
    cupos_disponibles: 10,
    cupos_ocupados: 10,
    fecha_inicio: "2024-01-15",
    fecha_fin: "2024-12-15",
    beneficiarios_estimados: 500,
    estudiantes_asignados: [],
  },
]

export default function ProjectsPage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filterTipo, setFilterTipo] = useState("all")
  const [filterEstado, setFilterEstado] = useState("all")

  const filteredProyectos = proyectos.filter((proyecto) => {
    const matchesTipo = filterTipo === "all" || proyecto.tipo === filterTipo
    const matchesEstado = filterEstado === "all" || proyecto.estado === filterEstado
    return matchesTipo && matchesEstado
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administración de proyectos de horas sociales y profesionales</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Nombre del Proyecto</label>
                      <Input placeholder="Nombre descriptivo del proyecto" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Descripción</label>
                      <Textarea placeholder="Descripción detallada del trabajo a realizar" rows={3} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Impacto Social</label>
                      <Textarea
                        placeholder="Describe el impacto social cuantificado (beneficiarios, área geográfica, etc.)"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Clasificación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Clasificación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tipo de Proyecto</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interno">Interno</SelectItem>
                          <SelectItem value="externo">Externo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tipo de Horas</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sociales">Sociales</SelectItem>
                          <SelectItem value="profesionales">Profesionales</SelectItem>
                          <SelectItem value="ambas">Ambas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Departamento</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sistemas">Ing. Sistemas</SelectItem>
                          <SelectItem value="civil">Ing. Civil</SelectItem>
                          <SelectItem value="industrial">Ing. Industrial</SelectItem>
                          <SelectItem value="arquitectura">Arquitectura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Ubicación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Departamento</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="san-salvador">San Salvador</SelectItem>
                          <SelectItem value="la-libertad">La Libertad</SelectItem>
                          <SelectItem value="santa-ana">Santa Ana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Municipio</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="san-salvador">San Salvador</SelectItem>
                          <SelectItem value="santa-tecla">Santa Tecla</SelectItem>
                          <SelectItem value="antiguo-cuscatlan">Antiguo Cuscatlán</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Dirección</label>
                      <Input placeholder="Dirección específica" />
                    </div>
                  </div>
                </div>

                {/* Configuración */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configuración</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium">Cupos Disponibles</label>
                      <Input type="number" placeholder="20" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Beneficiarios Estimados</label>
                      <Input type="number" placeholder="100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fecha Inicio</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fecha Fin</label>
                      <Input type="date" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>Crear Proyecto</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Ver Mapa
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+3 este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">71% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Asignados</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">Promedio 9 por proyecto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiarios</CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500</div>
            <p className="text-xs text-muted-foreground">Impacto acumulado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="interno">Interno</SelectItem>
                <SelectItem value="externo">Externo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de proyectos */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProyectos.map((proyecto) => (
              <Card key={proyecto.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{proyecto.nombre}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={proyecto.tipo === "externo" ? "default" : "secondary"}>{proyecto.tipo}</Badge>
                        <Badge variant="outline">{proyecto.tipo_horas}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{proyecto.descripcion}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {proyecto.ubicacion.municipio}, {proyecto.ubicacion.departamento}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {proyecto.cupos_ocupados}/{proyecto.cupos_disponibles} cupos ocupados
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span>{proyecto.beneficiarios_estimados} beneficiarios estimados</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Coordinador:</span>
                      <span className="font-medium">{proyecto.coordinador}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={proyecto.estado === "activo" ? "default" : "secondary"}>{proyecto.estado}</Badge>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

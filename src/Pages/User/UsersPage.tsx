"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus, Upload, Search, Download, Eye, Edit, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Datos de ejemplo
const estudiantes = [
  {
    id: "1",
    carnet: "00123456",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@uca.edu.sv",
    carrera: "Ingeniería en Sistemas",
    año: 3,
    genero: "femenino",
    departamento: "La Libertad",
    horas_completadas: 85,
    horas_requeridas: 120,
    estado: "activo",
    tipo_horas: "ambas",
  },
  {
    id: "2",
    carnet: "00123457",
    nombre: "Carlos",
    apellido: "Martínez",
    email: "carlos.martinez@uca.edu.sv",
    carrera: "Ingeniería Civil",
    año: 4,
    genero: "masculino",
    departamento: "San Salvador",
    horas_completadas: 120,
    horas_requeridas: 120,
    estado: "activo",
    tipo_horas: "externas",
  },
  // Más estudiantes...
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("all")
  const [filterAño, setFilterAño] = useState("all")
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false)

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const matchesSearch =
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.carnet.includes(searchTerm)

    const matchesCarrera = filterCarrera === "all" || estudiante.carrera === filterCarrera
    const matchesAño = filterAño === "all" || estudiante.año.toString() === filterAño

    return matchesSearch && matchesCarrera && matchesAño
  })

  const getProgressColor = (completadas: number, requeridas: number) => {
    const percentage = (completadas / requeridas) * 100
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 75) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administración de estudiantes, coordinadores y datos del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isNewUserModalOpen} onOpenChange={setIsNewUserModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
              </DialogHeader>
              {/* Formulario de nuevo usuario aquí */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input placeholder="Nombre del estudiante" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Apellido</label>
                    <Input placeholder="Apellido del estudiante" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Carnet</label>
                    <Input placeholder="00123456" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="estudiante@uca.edu.sv" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Carrera</label>
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
                  <div>
                    <label className="text-sm font-medium">Año</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1° Año</SelectItem>
                        <SelectItem value="2">2° Año</SelectItem>
                        <SelectItem value="3">3° Año</SelectItem>
                        <SelectItem value="4">4° Año</SelectItem>
                        <SelectItem value="5">5° Año</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Género</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsNewUserModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>Registrar Usuario</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar Excel
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">980</div>
            <p className="text-xs text-muted-foreground">78% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Completadas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">745</div>
            <p className="text-xs text-muted-foreground">60% han completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">235</div>
            <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o carnet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterCarrera} onValueChange={setFilterCarrera}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas las carreras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las carreras</SelectItem>
                  <SelectItem value="Ingeniería en Sistemas">Ing. Sistemas</SelectItem>
                  <SelectItem value="Ingeniería Civil">Ing. Civil</SelectItem>
                  <SelectItem value="Ingeniería Industrial">Ing. Industrial</SelectItem>
                  <SelectItem value="Arquitectura">Arquitectura</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterAño} onValueChange={setFilterAño}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Todos los años" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">1° Año</SelectItem>
                  <SelectItem value="2">2° Año</SelectItem>
                  <SelectItem value="3">3° Año</SelectItem>
                  <SelectItem value="4">4° Año</SelectItem>
                  <SelectItem value="5">5° Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de estudiantes */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tipo Horas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstudiantes.map((estudiante) => (
                  <TableRow key={estudiante.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {estudiante.nombre} {estudiante.apellido}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {estudiante.carnet} • {estudiante.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{estudiante.carrera}</TableCell>
                    <TableCell>{estudiante.año}°</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>
                            {estudiante.horas_completadas}/{estudiante.horas_requeridas} hrs
                          </span>
                          <span>{Math.round((estudiante.horas_completadas / estudiante.horas_requeridas) * 100)}%</span>
                        </div>
                        <Progress
                          value={(estudiante.horas_completadas / estudiante.horas_requeridas) * 100}
                          className="h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={estudiante.estado === "activo" ? "default" : "secondary"}>
                        {estudiante.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{estudiante.tipo_horas}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Building, GraduationCap, MapPin, Edit, Trash2, Users } from "lucide-react"

// Datos de ejemplo
const departamentos = [
  { id: "1", nombre: "Ingeniería en Sistemas", codigo: "SIS", coordinador: "Dr. María Rodríguez", estudiantes: 320 },
  { id: "2", nombre: "Ingeniería Civil", codigo: "CIV", coordinador: "Ing. Roberto Silva", estudiantes: 280 },
  { id: "3", nombre: "Ingeniería Industrial", codigo: "IND", coordinador: "Dra. Ana Martínez", estudiantes: 250 },
  { id: "4", nombre: "Arquitectura", codigo: "ARQ", coordinador: "Arq. Carlos López", estudiantes: 400 },
]

const carreras = [
  {
    id: "1",
    nombre: "Ingeniería en Sistemas Informáticos",
    codigo: "ISI",
    departamento: "Ingeniería en Sistemas",
    años: 5,
  },
  {
    id: "2",
    nombre: "Ingeniería en Ciencias de la Computación",
    codigo: "ICC",
    departamento: "Ingeniería en Sistemas",
    años: 5,
  },
  { id: "3", nombre: "Ingeniería Civil", codigo: "IC", departamento: "Ingeniería Civil", años: 5 },
  { id: "4", nombre: "Ingeniería Industrial", codigo: "II", departamento: "Ingeniería Industrial", años: 5 },
  { id: "5", nombre: "Arquitectura", codigo: "ARQ", departamento: "Arquitectura", años: 5 },
]

const instituciones = [
  {
    id: "1",
    nombre: "Fundación Salvadoreña para la Educación",
    tipo: "fundacion",
    ubicacion: { departamento: "San Salvador", municipio: "San Salvador" },
    contacto: { nombre: "María González", telefono: "2234-5678", email: "contacto@fse.org.sv" },
    estado: "activa",
  },
  {
    id: "2",
    nombre: "Hospital Nacional Rosales",
    tipo: "publica",
    ubicacion: { departamento: "San Salvador", municipio: "San Salvador" },
    contacto: { nombre: "Dr. Carlos Martínez", telefono: "2245-6789", email: "voluntarios@hnr.gob.sv" },
    estado: "activa",
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("departamentos")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tabs = [
    { id: "departamentos", label: "Departamentos", icon: Building },
    { id: "carreras", label: "Carreras", icon: GraduationCap },
    { id: "instituciones", label: "Instituciones", icon: MapPin },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Gestión de departamentos, carreras e instituciones colaboradoras</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Departamentos */}
      {activeTab === "departamentos" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Departamentos Académicos</CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Departamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Departamento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="text-sm font-medium">Nombre del Departamento</label>
                    <Input placeholder="Ej: Ingeniería en Sistemas" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Código</label>
                    <Input placeholder="Ej: SIS" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Coordinador</label>
                    <Input placeholder="Nombre del coordinador" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button>Crear Departamento</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Coordinador</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departamentos.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dept.codigo}</Badge>
                    </TableCell>
                    <TableCell>{dept.coordinador}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {dept.estudiantes}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
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
          </CardContent>
        </Card>
      )}

      {/* Carreras */}
      {activeTab === "carreras" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Carreras Universitarias</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Carrera
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carreras.map((carrera) => (
                  <TableRow key={carrera.id}>
                    <TableCell className="font-medium">{carrera.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{carrera.codigo}</Badge>
                    </TableCell>
                    <TableCell>{carrera.departamento}</TableCell>
                    <TableCell>{carrera.años} años</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
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
          </CardContent>
        </Card>
      )}

      {/* Instituciones */}
      {activeTab === "instituciones" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Instituciones Colaboradoras</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Institución
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instituciones.map((institucion) => (
                <div key={institucion.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{institucion.nombre}</h3>
                        <Badge variant={institucion.tipo === "publica" ? "default" : "secondary"}>
                          {institucion.tipo}
                        </Badge>
                        <Badge variant={institucion.estado === "activa" ? "default" : "secondary"}>
                          {institucion.estado}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {institucion.ubicacion.municipio}, {institucion.ubicacion.departamento}
                        </div>
                      </div>

                      <div className="text-sm">
                        <strong>Contacto:</strong> {institucion.contacto.nombre} •{institucion.contacto.telefono} •{" "}
                        {institucion.contacto.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

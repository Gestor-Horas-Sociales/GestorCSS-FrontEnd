"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Upload,
  Download,
  Search,
  Eye,
  Edit,
} from "lucide-react";
import { useEstudiantes } from "@/hooks/use-estudiantes";

// Datos de ejemplo
const registrosHoras = [
  {
    id: "1",
    estudiante: {
      nombre: "María González",
      carnet: "00123456",
      carrera: "Ing. Sistemas",
    },
    proyecto: {
      nombre: "Apoyo Educativo El Manguito",
      tipo: "externo",
    },
    horas: 8,
    fecha: "2024-01-15",
    descripcion_actividad: "Clases de matemáticas para niños de 3er grado",
    tipo_horas: "sociales",
    estado: "pendiente",
    evidencias: ["foto1.jpg", "reporte.pdf"],
    coordinador: "Dr. María Rodríguez",
  },
  {
    id: "2",
    estudiante: {
      nombre: "Carlos Martínez",
      carnet: "00123457",
      carrera: "Ing. Civil",
    },
    proyecto: {
      nombre: "Construcción Comunitaria",
      tipo: "externo",
    },
    horas: 6,
    fecha: "2024-01-14",
    descripcion_actividad: "Supervisión de construcción de aulas",
    tipo_horas: "profesionales",
    estado: "aprobado",
    evidencias: ["mediciones.pdf"],
    coordinador: "Ing. Roberto Silva",
    fecha_aprobacion: "2024-01-16",
  },
];

export default function HoursPage() {
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [filterEstado, setFilterEstado] = useState("");
  const [filterTipoHoras, setFilterTipoHoras] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { estudiantes, fetchEstudianteById } = useEstudiantes();

  useEffect(() => {
    const cargarDatos = async () => {
      const estudiante = await fetchEstudianteById(5);
      console.log("Estudiante 5:", estudiante);
    };
    cargarDatos();
  }, []);

  const filteredRegistros = registrosHoras.filter((registro) => {
    const matchesSearch =
      registro.estudiante.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      registro.estudiante.carnet.includes(searchTerm) ||
      registro.proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = !filterEstado || registro.estado === filterEstado;
    const matchesTipo =
      !filterTipoHoras || registro.tipo_horas === filterTipoHoras;

    return matchesSearch && matchesEstado && matchesTipo;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return <Badge className="bg-green-100 text-green-800">Aprobado</Badge>;
      case "rechazado":
        return <Badge className="bg-red-100 text-red-800">Rechazado</Badge>;
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seguimiento de Horas</h1>
          <p className="text-muted-foreground">
            Registro, validación y seguimiento de horas sociales y profesionales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={isNewRecordModalOpen}
            onOpenChange={setIsNewRecordModalOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Horas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevas Horas</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estudiante</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          María González - 00123456
                        </SelectItem>
                        <SelectItem value="2">
                          Carlos Martínez - 00123457
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Proyecto</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          Apoyo Educativo El Manguito
                        </SelectItem>
                        <SelectItem value="2">
                          Construcción Comunitaria
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Horas</label>
                    <Input type="number" placeholder="8" min="1" max="12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipo de Horas</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sociales">Sociales</SelectItem>
                        <SelectItem value="profesionales">
                          Profesionales
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Descripción de Actividades
                  </label>
                  <Textarea
                    placeholder="Describe las actividades realizadas durante estas horas..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Evidencias</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Arrastra archivos aquí o{" "}
                      <span className="text-blue-600 cursor-pointer">
                        selecciona archivos
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: PDF, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewRecordModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button>Registrar Horas</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registros
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+156 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes Validación
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,580</div>
            <p className="text-xs text-muted-foreground">90.6% del total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,450</div>
            <p className="text-xs text-muted-foreground">Horas validadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Horas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por estudiante o proyecto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterTipoHoras}
                onValueChange={setFilterTipoHoras}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo Horas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="sociales">Sociales</SelectItem>
                  <SelectItem value="profesionales">Profesionales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Evidencias</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {registro.estudiante.nombre}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {registro.estudiante.carnet} •{" "}
                          {registro.estudiante.carrera}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {registro.proyecto.nombre}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {registro.proyecto.tipo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {registro.horas}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          horas
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(registro.fecha).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registro.tipo_horas === "sociales"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {registro.tipo_horas}
                      </Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(registro.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {registro.evidencias.length}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {registro.estado === "pendiente" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
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
  );
}

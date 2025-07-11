"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Users,
  UserPlus,
  Upload,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getEstudiantes } from "@/api/estudiantes";
import type { StudentType } from "@/Types/Student";

export default function UsersPage() {
  const [estudiantes, setEstudiantes] = useState<StudentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCarrera, setFilterCarrera] = useState("all");
  const [filterAño, setFilterAño] = useState("all");
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  //Obtener estudiantes
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const data = await getEstudiantes();
        setEstudiantes(data);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      }
    };
    fetchEstudiantes();
  }, []);
  // Función para calcular horas y porcentaje de progreso
  const calcularHoras = (estudiante: StudentType) => {
    const horasInternas = estudiante.internal_hours || 0;
    const horasExternas = estudiante.external_hours || 0;
    const horasCompletadas = horasInternas + horasExternas;
    const horasRequeridas = 600;
    const porcentaje = Math.min(
      100,
      Math.round((horasCompletadas / horasRequeridas) * 100)
    );
    return { horasCompletadas, horasRequeridas, porcentaje };
  };

  // Filtrado
  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const nombreCompleto = estudiante.name.toLowerCase(); // Si tienes apellido, concatena aquí
    const busca = searchTerm.toLowerCase();

    const matchesSearch =
      nombreCompleto.includes(busca) || estudiante.carnet.includes(busca);

    const matchesCarrera =
      filterCarrera === "all" || estudiante.career?.name === filterCarrera;
    const matchesAño =
      filterAño === "all" || estudiante.start_year.toString() === filterAño;

    return matchesSearch && matchesCarrera && matchesAño;

    //Crear estudiantes
    
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header y botones */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administración de estudiantes, coordinadores y datos del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={isNewUserModalOpen}
            onOpenChange={setIsNewUserModalOpen}
          >
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
              <form className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      name="name"
                      placeholder="Nombre del estudiante"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Apellido</label>
                    <Input
                      name="last_name"
                      placeholder="Apellido del estudiante"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Carnet</label>
                    <Input name="carnet" placeholder="00123456" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="estudiante@uca.edu.sv"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Carrera</label>
                    <Select name="career_id">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ing. Sistemas</SelectItem>
                        <SelectItem value="2">Ing. Civil</SelectItem>
                        <SelectItem value="3">Ing. Industrial</SelectItem>
                        <SelectItem value="4">Arquitectura</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Año de Inicio</label>
                    <Select name="start_year">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 51 }, (_, i) => {
                            const year = new Date().getFullYear() - 25 + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Género</label>
                    <Select name="gender">
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsNewUserModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Usuario</Button>
                </div>
              </form>
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

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o carnet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterCarrera} onValueChange={setFilterCarrera}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas las carreras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las carreras</SelectItem>
                  <SelectItem value="Arquitectura">Arquitectura</SelectItem>
                  <SelectItem value="Ingeniería en Sistemas">
                    Ing. Sistemas
                  </SelectItem>
                  <SelectItem value="Ingeniería Civil">Ing. Civil</SelectItem>
                  <SelectItem value="Ingeniería Industrial">
                    Ing. Industrial
                  </SelectItem>
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

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstudiantes.map((estudiante) => {
                  const { horasCompletadas, horasRequeridas, porcentaje } =
                    calcularHoras(estudiante);
                  return (
                    <TableRow key={estudiante.id}>
                      <TableCell>
                        <div className="font-medium">{estudiante.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {estudiante.carnet} • {estudiante.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {estudiante.career?.name || "Campo vacío"}
                      </TableCell>
                      <TableCell>{estudiante.start_year}°</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>
                              {horasCompletadas} / {horasRequeridas} hrs
                            </span>
                            <span>{porcentaje}%</span>
                          </div>
                          <Progress value={porcentaje} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  UserPlus,
  Upload,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { getEstudiantes, createEstudiante } from "@/api/estudiantes";
import type { StudentType } from "@/Types/Student";

export default function UsersPage() {
  const [estudiantes, setEstudiantes] = useState<StudentType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCarrera, setFilterCarrera] = useState("all");
  const [filterAño, setFilterAño] = useState("all");
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [formData, setFormData] = useState<
    Omit<StudentType, "id" | "career" | "location">
  >({
    name: "",
    last_name: "",
    email: "",
    career_id: 1,
    location_id: 1,
    start_year: new Date().getFullYear(),
    gender: "",
    status: "",
    hours_type: "Select",
    internal_hours: 0,
    external_hours: 0,
    student_id_card: 0, // Asegúrate de incluir este campo si es necesario
  });
  const [error, setError] = useState("");

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]:
        name === "career_id" || name === "location_id" || name === "start_year"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const newStudent = await createEstudiante(formData);
      setEstudiantes([...estudiantes, newStudent.data]);
      setIsNewUserModalOpen(false);

      // Reset form data
      setFormData({
        name: "",
        last_name: "",
        email: "",
        career_id: 1,
        location_id: 1,
        start_year: new Date().getFullYear(),
        gender: "masculino",
        status: "active",
        hours_type: "Internas",
        internal_hours: 0,
        external_hours: 0,
        student_id_card: 0, // Asegúrate de incluir este campo si es necesario
        // Reset this field as well
      });
    } catch (err) {
      console.error("Fallo en el registro:", err);
      if (err instanceof Error && (err as any).response?.data?.message) {
        setError((err as any).response.data.message);
      } else {
        setError("Ocurrió un error al registrar el estudiante");
      }
    }
  };

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

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const nombreCompleto =
      `${estudiante.name} ${estudiante.last_name}`.toLowerCase();
    const busca = searchTerm.toLowerCase();
    const matchesSearch =
      nombreCompleto.includes(busca) ||
      estudiante.student_id_card.toString().includes(busca);
    const matchesCarrera =
      filterCarrera === "all" || estudiante.career?.name === filterCarrera;
    const matchesAño =
      filterAño === "all" || estudiante.start_year.toString() === filterAño;
    return matchesSearch && matchesCarrera && matchesAño;
  });

  return (
    <div className="p-6 space-y-6">
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
              <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="last_name"
                    placeholder="Apellido"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="student_id_card"
                    placeholder="Student ID Card"
                    value={formData.student_id_card}
                    onChange={handleInputChange}
                    required
                  />{" "}
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    value={formData.career_id.toString()}
                    onValueChange={(val) =>
                      handleSelectChange("career_id", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ing. Sistemas</SelectItem>
                      <SelectItem value="2">Ing. Civil</SelectItem>
                      <SelectItem value="3">Ing. Industrial</SelectItem>
                      <SelectItem value="4">Arquitectura</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.start_year.toString()}
                    onValueChange={(val) =>
                      handleSelectChange("start_year", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Año de Inicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.gender}
                    onValueChange={(val) => handleSelectChange("gender", val)}
                  >
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
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleSelectChange("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.hours_type}
                    onValueChange={(val) =>
                      handleSelectChange("hours_type", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Horas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internas">Internas</SelectItem>
                      <SelectItem value="Externas">Externas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.location_id.toString()}
                    onValueChange={(val) =>
                      handleSelectChange("location_id", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sede Central</SelectItem>
                      <SelectItem value="2">Campus Norte</SelectItem>
                      <SelectItem value="3">Campus Sur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="internal_hours"
                    placeholder="Horas Internas"
                    value={formData.internal_hours}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="number"
                    name="external_hours"
                    placeholder="Horas Externas"
                    value={formData.external_hours}
                    onChange={handleInputChange}
                  />
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
                  {[1, 2, 3, 4, 5].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}° Año
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
                        <div className="font-medium">
                          {estudiante.name} {estudiante.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {estudiante.student_id_card} • {estudiante.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {estudiante.career?.name || "Sin carrera"}
                      </TableCell>
                      <TableCell>{estudiante.start_year}</TableCell>
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

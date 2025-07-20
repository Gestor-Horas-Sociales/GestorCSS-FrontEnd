"use client";

import { useState } from "react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { useEstudiantes } from "@/hooks/use-estudiantes";
import { useCarrera } from "@/hooks/use-carrera";

export default function UsersPage() {
  // Cargar los estudiantes y sus funciones desde el hook useEstudiantes
  const {
    estudiantes,
    searchTerm,
    setSearchTerm,
    filterCarrera,
    setFilterCarrera,
    filterAño,
    setFilterAño,
    isNewUserModalOpen,
    setIsNewUserModalOpen,
    formData,
    error,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleDelete,
    startEdit,
    calcularHoras,
    resetForm,
  } = useEstudiantes();

  // Cargar las carreras desde el hook
  const { carreras } = useCarrera();

  const filteredEstudiantes = estudiantes.filter((estudiante) => {
    const nombreCompleto =
      `${estudiante.name} ${estudiante.lastname}`.toLowerCase();
    const busca = searchTerm.toLowerCase();
    const matchesSearch =
      nombreCompleto.includes(busca) ||
      estudiante.student_id_card.includes(busca);
    const matchesCarrera =
      filterCarrera === "all" ||
      carreras.find((carrera) => carrera.id === estudiante.career?.id)?.id ===
        Number(filterCarrera) ||
      // Asegurarse de que el estudiante tenga una carrera definida
      (estudiante.career && estudiante.career.id) === Number(filterCarrera) ||
      // Si no hay carrera definida, verificar si el filtro es "all"
      (estudiante.career === null && filterCarrera === "all");
    const matchesAño =
      filterAño === "all" || estudiante.career_year.toString() === filterAño;
    return matchesSearch && matchesCarrera && matchesAño;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);
  const paginatedEstudiantes = filteredEstudiantes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administración de estudiantes, coordinadores y datos del sistema
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Dialog
            open={isNewUserModalOpen}
            onOpenChange={(isOpen) => {
              setIsNewUserModalOpen(isOpen);
              if (!isOpen) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="rounded-xl px-6 py-2 shadow">
                <UserPlus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl rounded-3xl p-0">
              <Card className="rounded-3xl p-6">
                <CardHeader className="text-center mb-4">
                  <CardTitle className="text-2xl font-bold text-primary">
                    Registrar Nuevo Usuario
                  </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  {/* Sección: Datos Personales */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Datos Personales
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                      <Input
                        name="lastname"
                        placeholder="Apellido"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                      />
                      <Input
                        name="student_id_card"
                        placeholder="Carnet de Estudiante"
                        value={formData.student_id_card}
                        onChange={handleInputChange}
                        type="number"
                        required
                        className="rounded-xl"
                      />
                      <Input
                        name="email"
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Sección: Información Académica */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Información Académica
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <Select
                        value={formData.career_id.toString()}
                        onValueChange={(val) =>
                          handleSelectChange("career_id", val)
                        }
                      >
                        <SelectTrigger className="rounded-xl w-full truncate">
                          <SelectValue placeholder="Carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          {carreras.map((carrera) => (
                            <SelectItem
                              key={carrera.id}
                              value={String(carrera.id)}
                            >
                              {carrera.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div>
                        <h3>Año Académico</h3>
                        <Select
                          value={formData.career_year.toString()}
                          onValueChange={(val) =>
                            handleSelectChange("career_year", val)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Año académico" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}° Año
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Select
                        value={formData.gender}
                        onValueChange={(val) =>
                          handleSelectChange("gender", val)
                        }
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sección: Información Adicional */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Información Adicional
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Horas Internas */}
                      <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold">
                          Horas Internas
                        </label>
                        <Input
                          type="number"
                          name="internal_hours"
                          placeholder="Horas Internas"
                          value={formData.internal_hours}
                          onChange={handleInputChange}
                          className="rounded-xl w-full"
                        />
                      </div>
                      {/* Estado (Select) */}
                      <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold">
                          Estado
                        </label>
                        <Select
                          value={formData.active.toString()}
                          onValueChange={(val) =>
                            handleSelectChange("active", val)
                          }
                        >
                          <SelectTrigger className="rounded-xl w-full">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Activo</SelectItem>
                            <SelectItem value="false">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Horas Externas */}
                      <div className="flex flex-col gap-2">
                        <label className="text-base font-semibold">
                          Horas Externas
                        </label>
                        <Input
                          type="number"
                          name="external_hours"
                          placeholder="Horas Externas"
                          value={formData.external_hours}
                          onChange={handleInputChange}
                          className="rounded-xl w-full"
                        />
                      </div>

                      {/* Dirección */}
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-base font-semibold">
                          Dirección
                        </label>
                        <Input
                          name="address"
                          placeholder="Dirección"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="rounded-xl w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsNewUserModalOpen(false)}
                      className="rounded-xl"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-xl shadow-md">
                      Registrar Usuario
                    </Button>
                  </div>
                </form>
              </Card>
            </DialogContent>
          </Dialog>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">
              <Upload className="w-4 h-4 mr-2" />
              Importar Excel
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
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
                  <SelectItem value="all">Todos</SelectItem>
                  {carreras.map((carrera) => (
                    <SelectItem key={carrera.id} value={String(carrera.id)}>
                      {carrera.name}
                    </SelectItem>
                  ))}
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
                {paginatedEstudiantes.map((estudiante) => {
                  const { horasCompletadas, horasRequeridas, porcentaje } =
                    calcularHoras(estudiante);
                  return (
                    <TableRow key={estudiante.id}>
                      <TableCell>
                        <div className="font-medium">
                          {estudiante.name} {estudiante.lastname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {estudiante.student_id_card} • {estudiante.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {estudiante.career?.name || "Sin carrera"}
                      </TableCell>
                      <TableCell>{estudiante.career_year}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(estudiante)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDelete(estudiante.id)}
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
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Anterior
          </Button>

          <span className="px-2 py-1 text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Siguiente
          </Button>
        </div>
      </Card>
    </div>
  );
}

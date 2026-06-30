import { useCallback, useEffect, useMemo, useState } from "react";
import Map from "@/components/Map";
import MapInfoCard from "@/components/MapInfoCard";
import MapLegend, { type DepartmentCount } from "@/components/MapLegend";
import { getProjectsMap, getProjectMapDetails } from "@/api/projects";
import type { MapProject, ProjectMapDetails } from "@/Types/MapType";

export default function MapPage() {
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [details, setDetails] = useState<ProjectMapDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  // Filtros
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedTypeHours, setSelectedTypeHours] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProjectsMap()
      .then(setProjects)
      .catch((error) => console.error("Error fetching map projects:", error));
  }, []);

  // Conteo de proyectos por departamento (sobre el total, sin filtrar)
  const departmentCounts = useMemo<DepartmentCount[]>(() => {
    const counts = new globalThis.Map<string, number>();
    projects.forEach((p) => {
      const dept = p.departament ?? "Sin departamento";
      counts.set(dept, (counts.get(dept) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [projects]);

  const typeHoursOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.type_hours) set.add(p.type_hours);
    });
    return [...set].sort();
  }, [projects]);

  // Proyectos visibles según filtros
  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (
        selectedDepartment &&
        (p.departament ?? "Sin departamento") !== selectedDepartment
      )
        return false;
      if (selectedTypeHours && p.type_hours !== selectedTypeHours)
        return false;
      if (
        term &&
        !p.name.toLowerCase().includes(term) &&
        !(p.institution ?? "").toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [projects, selectedDepartment, selectedTypeHours, search]);

  const totalStudents = useMemo(
    () => filteredProjects.reduce((sum, p) => sum + p.students_count, 0),
    [filteredProjects]
  );

  const hasActiveFilters =
    selectedDepartment !== null || selectedTypeHours !== null || search !== "";

  const handleClearFilters = useCallback(() => {
    setSelectedDepartment(null);
    setSelectedTypeHours(null);
    setSearch("");
  }, []);

  const handleProjectClick = useCallback(async (project: MapProject) => {
    setCardOpen(true);
    setLoadingDetails(true);
    setDetails(null);
    try {
      const data = await getProjectMapDetails(project.id);
      setDetails(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    setCardOpen(false);
    setDetails(null);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <h1 className="text-2xl font-bold mb-4">Mapa de Proyectos</h1>
      <div className="relative flex-1 min-h-[500px] rounded-lg overflow-hidden">
        <Map
          projects={filteredProjects}
          onProjectClick={handleProjectClick}
          fitToProjects={hasActiveFilters}
        />

        {/* Leyenda y filtros */}
        <div className="absolute top-4 left-4 z-[1000]">
          <MapLegend
            departments={departmentCounts}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            typeHoursOptions={typeHoursOptions}
            selectedTypeHours={selectedTypeHours}
            onSelectTypeHours={setSelectedTypeHours}
            search={search}
            onSearchChange={setSearch}
            totalShown={filteredProjects.length}
            totalAll={projects.length}
            totalStudents={totalStudents}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Detalle del proyecto seleccionado */}
        {cardOpen && (
          <div className="absolute top-4 right-4 z-[1000] w-80 max-w-[calc(100%-2rem)]">
            <MapInfoCard
              details={details}
              loading={loadingDetails}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

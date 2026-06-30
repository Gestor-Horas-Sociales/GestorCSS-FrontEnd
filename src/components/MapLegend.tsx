import { useState } from "react";

export interface DepartmentCount {
  name: string;
  count: number;
}

interface MapLegendProps {
  departments: DepartmentCount[];
  selectedDepartment: string | null;
  onSelectDepartment: (name: string | null) => void;
  typeHoursOptions: string[];
  selectedTypeHours: string | null;
  onSelectTypeHours: (value: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  totalShown: number;
  totalAll: number;
  totalStudents: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function MapLegend({
  departments,
  selectedDepartment,
  onSelectDepartment,
  typeHoursOptions,
  selectedTypeHours,
  onSelectTypeHours,
  search,
  onSearchChange,
  totalShown,
  totalAll,
  totalStudents,
  hasActiveFilters,
  onClearFilters,
}: MapLegendProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg shadow-md w-72 max-w-[calc(100vw-2rem)] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="font-semibold text-foreground">Proyectos en el mapa</p>
          <p className="text-xs text-muted-foreground">
            {totalShown} de {totalAll} proyecto{totalAll !== 1 ? "s" : ""} ·{" "}
            {totalStudents} estudiante{totalStudents !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          className={`text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Búsqueda */}
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar proyecto o institución…"
            className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {/* Filtro por tipo de horas */}
          {typeHoursOptions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                Tipo de horas
              </p>
              <select
                value={selectedTypeHours ?? ""}
                onChange={(e) =>
                  onSelectTypeHours(e.target.value === "" ? null : e.target.value)
                }
                className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Todos</option>
                {typeHoursOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Leyenda: proyectos por departamento */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Proyectos por departamento
            </p>
            {departments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin proyectos ubicados
              </p>
            ) : (
              <ul className="space-y-1">
                {departments.map((dept) => {
                  const isSelected = selectedDepartment === dept.name;
                  return (
                    <li key={dept.name}>
                      <button
                        type="button"
                        onClick={() =>
                          onSelectDepartment(isSelected ? null : dept.name)
                        }
                        className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                            : "hover:bg-muted text-foreground"
                        }`}
                        title={
                          isSelected
                            ? "Quitar filtro"
                            : `Filtrar por ${dept.name}`
                        }
                      >
                        <span className="flex-1 text-left truncate">
                          {dept.name}
                        </span>
                        <span
                          className={`text-xs font-semibold w-6 text-right shrink-0 ${
                            isSelected
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-muted-foreground"
                          }`}
                        >
                          {dept.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-1"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

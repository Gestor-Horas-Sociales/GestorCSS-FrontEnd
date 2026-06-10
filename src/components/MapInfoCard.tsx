import type { ProjectMapDetails } from "@/Types/MapType";

interface MapInfoCardProps {
  details: ProjectMapDetails | null;
  loading?: boolean;
  onClose?: () => void;
}

const formatDate = (date: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  // Protege contra fechas inválidas o epoch (31/12/1969)
  if (isNaN(d.getTime()) || d.getFullYear() < 1971) return "—";
  return d.toLocaleDateString("es-SV");
};

export default function MapInfoCard({
  details,
  loading = false,
  onClose,
}: MapInfoCardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg shadow-md p-4 w-full max-w-sm max-h-[70vh] overflow-y-auto">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-xl font-semibold text-foreground">
          {loading ? "Cargando..." : details?.name ?? "Información del Proyecto"}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Obteniendo métricas del proyecto…
        </p>
      )}

      {!loading && details && (
        <div className="space-y-3 text-sm">
          {details.description && (
            <p className="text-muted-foreground">{details.description}</p>
          )}

          <div>
            <p className="font-medium text-foreground">Ubicación</p>
            <p className="text-muted-foreground">
              {[details.canton, details.district, details.departament]
                .filter(Boolean)
                .join(", ") || "Sin ubicación"}
            </p>
          </div>

          {details.institution && (
            <div>
              <p className="font-medium text-foreground">Institución</p>
              <p className="text-muted-foreground">{details.institution}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/40 rounded-md p-2 text-center">
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {details.students_count}
                {details.maximum_students != null && (
                  <span className="text-sm font-normal text-blue-500 dark:text-blue-400">
                    {" "}/ {details.maximum_students}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">Estudiantes</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/40 rounded-md p-2 text-center">
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                {details.number_beneficiaries ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">Beneficiarios</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-foreground mb-1">
              Estudiantes por carrera
            </p>
            {details.careers.length === 0 ? (
              <p className="text-muted-foreground">Sin estudiantes asignados</p>
            ) : (
              <ul className="space-y-1">
                {details.careers.map((career) => (
                  <li
                    key={career.name}
                    className="flex justify-between gap-2 text-muted-foreground"
                  >
                    <span className="truncate">{career.name}</span>
                    <span className="font-medium text-foreground">
                      {career.count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {details.genders.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Por género</p>
              <ul className="space-y-1">
                {details.genders.map((gender) => (
                  <li
                    key={gender.name}
                    className="flex justify-between gap-2 text-muted-foreground"
                  >
                    <span>{gender.name}</span>
                    <span className="font-medium text-foreground">
                      {gender.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-border">
            <span>Inicio: {formatDate(details.start_date)}</span>
            <span>Fin: {formatDate(details.end_date)}</span>
          </div>

          {details.type_hours && (
            <p className="text-xs text-muted-foreground">
              Tipo de horas: {details.type_hours}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

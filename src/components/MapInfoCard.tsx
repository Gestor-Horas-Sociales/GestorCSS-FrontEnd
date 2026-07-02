import { useState } from "react";
import type { ProjectMapDetails } from "@/Types/MapType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  return (
    <>
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-md p-4 w-full max-w-sm max-h-[70vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">
            {loading
              ? "Cargando..."
              : details?.institution ?? "Institución no especificada"}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground text-lg leading-none shrink-0"
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
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Proyecto
              </p>
              <p className="text-base font-semibold text-foreground">
                {details.name}
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">Ubicación</p>
              <p className="text-muted-foreground">
                {[details.canton, details.district, details.departament]
                  .filter(Boolean)
                  .join(", ") || "Sin ubicación"}
              </p>
            </div>

            {details.description && (
              <p className="text-muted-foreground text-xs bg-muted/30 p-2 rounded border border-border/50">
                {details.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setShowStudentsModal(true)}
                className="bg-blue-50 dark:bg-blue-950/40 rounded-md p-2 text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all border border-blue-200 dark:border-blue-800/60 shadow-sm"
                title="Ver lista de estudiantes asignados"
              >
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {details.students_count}
                  {details.maximum_students != null && (
                    <span className="text-sm font-normal text-blue-500 dark:text-blue-400">
                      {" "}/ {details.maximum_students}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 mt-0.5">
                  <span>Estud. Atendidos</span>
                  <span className="text-[10px] bg-blue-200/80 dark:bg-blue-800 px-1 rounded text-blue-800 dark:text-blue-200 font-semibold">
                    👁 Ver
                  </span>
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/40 rounded-md p-2 text-center border border-green-200/60 dark:border-green-800/40">
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

      {/* Modal de Lista de Estudiantes Asignados */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col z-[10000]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <span>Estudiantes Asignados</span>
              {details?.students && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-normal">
                  {details.students.length}
                </span>
              )}
            </DialogTitle>
            <p className="text-xs text-muted-foreground text-left">
              Proyecto:{" "}
              <span className="font-semibold text-foreground">
                {details?.name}
              </span>
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-1 mt-2 space-y-2">
            {!details?.students || details.students.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay estudiantes asignados a este proyecto.
              </p>
            ) : (
              <div className="divide-y divide-border border border-border rounded-md overflow-hidden">
                {details.students.map((st, i) => (
                  <div
                    key={st.id ?? i}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors bg-card"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {st.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {st.career}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

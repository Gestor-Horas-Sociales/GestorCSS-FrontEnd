import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type Proyecto = {
  id: string;
  name: string;
  description: string;
  social_impact: string;
  type: string;
  id_location: string;
  id_institution: string;
  req_gender: string;
  req_year: string;
  req_career: string;
  status: string;
  tipo_horas: string;
  createdAt: Date;
};

interface NewProyectoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NuevoProyectoModal({
  open,
  onOpenChange,
}: NewProyectoModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      social_impact: "",
      type: "",
      id_location: "",
      id_institution: "",
      req_gender: "",
      req_year: "",
      req_career: "",
      status: "",
      tipo_horas: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Formulario enviado:", data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <DialogDescription>
            Registro de proyectos con datos completos para evaluación.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del proyecto
            </label>
            <Input id="name" {...register("name", { required: true })} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="social_impact"
              className="block text-sm font-medium"
            >
              Impacto social
            </label>
            <Textarea
              id="social_impact"
              {...register("social_impact", { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tipo de proyecto
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccionar tipo</option>
              <option value="interno">Interno</option>
              <option value="externo">Externo</option>
            </select>
          </div>

          <div>
            <label htmlFor="id_location" className="block text-sm font-medium">
              Ubicación (Departamento)
            </label>
            <Input
              id="id_location"
              {...register("id_location", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="id_institution"
              className="block text-sm font-medium"
            >
              ID de Institución
            </label>
            <Input
              id="id_institution"
              {...register("id_institution", { required: true })}
            />
          </div>

          <div>
            <label htmlFor="req_gender" className="block text-sm font-medium">
              Género requerido
            </label>
            <select
              {...register("req_gender")}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Sin requisito</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="req_year" className="block text-sm font-medium">
              Año requerido
            </label>
            <Input
              id="req_year"
              {...register("req_year")}
              type="number"
              min={1}
            />
          </div>
          {/* Aquí debe de guardarse en un array por si es necesario más de una carrera */}
          <div>
            <label htmlFor="req_career" className="block text-sm font-medium">
              Carrera requerida
            </label>
            <Input id="req_career" {...register("req_career")} />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Estado
            </label>
            <select
              {...register("status")}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccionar estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div>
            <label htmlFor="tipo_horas" className="block text-sm font-medium">
              Tipo de horas
            </label>
            <select
              {...register("tipo_horas")}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Seleccionar</option>
              <option value="sociales">Sociales</option>
              <option value="profesionales">Profesionales</option>
              <option value="ambas">Ambas</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Crear proyecto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

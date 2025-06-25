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

export type Proyecto = {
  id: string;
  name: string;
  description: string;
  departmet_location: string;
  province_location: string;
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
    },
  });

  const onSubmit = (data: { name: string; description: string }) => {
    console.log("Formulario enviado:", data);
    reset(); // Reinicia el formulario después de enviarlo
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nombre del proyecto
            </label>
            <Input
              id="name"
              {...register("name", { required: true })}
              type="text"
              placeholder="Nombre del proyecto"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder="Descripción del proyecto"
            />
          </div>
          <Button type="submit" className="w-full">
            Crear proyecto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
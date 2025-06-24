// NuevoProyectoModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/assets/components/ui/dialog";

export type Proyecto = {
  id: string;
  name: string;
  description: string;
  departmet_location: string;
  province_location: string;

  createdAt: Date;
};

// const formSchema = z.object({
//   username: z.string().min(1, "El nombre de usuario es obligatorio"),
// });

// const form = useForm<z.infer<typeof formSchema>>({
//   resolver: zodResolver(formSchema),
//   defaultValues: {
//     username: "",
//   },
// });

interface NewProyectoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NuevoProyectoModal({
  open,
  onOpenChange,
}: NewProyectoModalProps) {
  // const onSubmit = (data: z.infer<typeof formSchema>) => {
  //   console.log(data);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <DialogDescription>
            {/* <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-4 sm:p-6 rounded-lg"
              >
                
              </form>
            </Form> */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

// function getModalData() {
//   // Aquí puedes implementar la lógica para obtener los datos del modal
//   // Por ejemplo, podrías usar un formulario para capturar el nombre del proyecto, descripción, etc.
//   return {
//     name: "",
//     description: "",
//   };
// }

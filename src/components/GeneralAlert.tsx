import type { SetStateBoolean } from "@/Types/ReactFunctionTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Props {
  openAlert: boolean;
  setOpenAlert: SetStateBoolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function GeneralAlert({
  openAlert,
  setOpenAlert,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer"
            onClick={onCancel ? () => onCancel() : undefined}
          >
            {cancelText}
          </AlertDialogCancel>
          {onConfirm && (
            <AlertDialogAction
              className="text-secondary dark:text-secondary bg-primary dark:bg-primary hover:bg-primary/80 hover:dark:bg-primary-light/40 active:bg-primary-dark active:dark:bg-primary-dark cursor-pointer"
              onClick={onConfirm}
            >
              {confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

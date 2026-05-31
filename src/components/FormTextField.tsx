import type { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea"; // Importamos el Textarea
import { cn } from "@/lib/utils";
import type { TextFieldType } from "@/Types/TextFieldTypes";

// Extendemos el tipo para incluir la prop isTextArea
interface ExtendedTextFieldType<T extends FieldValues> extends TextFieldType<T> {
  isTextArea?: boolean;
  rows?: number;
}

export default function FormTextField<T extends FieldValues>({
  formField,
  nameField,
  label,
  placeholder,
  icon,
  disabled,
  defaultValue,
  rules,
  shouldUnregister,
  className,
  type,
  isTextArea = false, // Nueva prop por defecto false
  rows = 3, // Nueva prop para textareas
  ...rest
}: ExtendedTextFieldType<T>) {
  return (
    <FormField
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      control={formField.control}
      name={nameField}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={`input-${nameField}`}
            className={cn(
              formField.formState.errors[nameField] ? "text-red-600" : ""
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {icon && !isTextArea && ( // Solo mostramos icono para inputs
                <span className="absolute left-3 top-1/2 h-5 w-4 -translate-y-1/2 text-muted-foreground inline-flex items-center justify-center">
                  {icon}
                </span>
              )}
              
              {isTextArea ? (
                <Textarea
                  id={`textarea-${nameField}`}
                  placeholder={placeholder}
                  className={cn(
                    "min-h-[80px] focus-visible:ring-primary dark:border-primary-dark",
                    className
                  )}
                  rows={rows}
                  disabled={disabled}
                  {...field}
                />
              ) : (
                <Input
                  id={`input-${nameField}`}
                  placeholder={placeholder}
                  className={cn(
                    "focus-visible:ring-primary dark:border-primary-dark",
                    icon ? "pl-10" : "pl-3",
                    className
                  )}
                  type={type}
                  autoComplete="off"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(type === "number" ? Number(value) : value);
                  }}
                  {...rest}
                />
              )}
            </div>
          </FormControl>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
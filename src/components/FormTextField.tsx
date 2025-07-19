import type { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import type { TextFieldType } from "@/Types/TextFieldTypes";

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
  ...rest
}: TextFieldType<T>) {
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
              formField.formState.errors[nameField]
                ? "text-red-600"
                : "",
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {icon && (
                <span className="absolute left-3 top-1/2 h-5 w-4 -translate-y-1/2 text-muted-foreground inline-flex items-center justify-center">
                  {icon}
                </span>
              )}
              <Input
                id={`input-${nameField}`}
                placeholder={placeholder}
                className={cn(
                  "focus-visible:ring-primary dark:border-primary-dark",
                  icon ? "pl-10" : "pl-3", // Ajustamos el padding según si hay icono o no
                  className,
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
            </div>
          </FormControl>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}

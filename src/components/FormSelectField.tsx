import type { TextFieldType } from "@/Types/TextFieldTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";

export interface ListRender {
  key: string;
  textRender: string;
}

interface Props<T extends FieldValues> extends Omit<TextFieldType<T>, 'type'> {
  listRender: ListRender[];
  valueType?: "number" | "string" | "boolean" ;
  className?: string;
  defaultValue?: any;
  rules?: any;
  shouldUnregister?: boolean;
}

export default function FormSelectField<T extends FieldValues>({
  formField,
  nameField,
  label,
  placeholder,
  disabled = false,
  className,
  listRender,
  valueType = "number", // Mantenemos number como default por compatibilidad
  defaultValue,
  rules,
  shouldUnregister,
}: Props<T>) {
  const parseValue = (value: string) => {
    if (value === "") return null;
    
    switch (valueType) {
      case "number":
        return Number(value);
      case "boolean":
        return value === "true";
      default:
        return value;
    }
  };

  const formatValue = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  return (
    <FormField
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      control={formField.control}
      name={nameField as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={`select-${String(nameField)}`}
            className={cn(
              formField.formState.errors[nameField] && "text-red-600"
            )}
          >
            {label}
          </FormLabel>
          <Select
            onValueChange={(value) => field.onChange(parseValue(value))}
            value={formatValue(field.value)}
            defaultValue={formatValue(field.value)}
            disabled={disabled}
          >
            <FormControl
              className={`focus:ring-primary dark:border-primary-dark ${className}`}
            >
              <SelectTrigger id={`select-${String(nameField)}`} className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-full">
              {listRender.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.textRender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}
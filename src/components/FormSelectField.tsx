import type { TextFieldType } from "@/Types/TextFieldTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { FieldValues } from "react-hook-form";
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

interface Props<T extends FieldValues> extends TextFieldType<T> {
  listRender: ListRender[];
}

export default function FormSelectField<T extends FieldValues>({
  formField,
  nameField,
  label,
  placeholder,
  disabled,
  defaultValue,
  rules,
  shouldUnregister,
  className,
  listRender,
  ...rest
}: Props<T>) {
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
            htmlFor={`select-${nameField}`}
            className={cn(
              formField.formState.errors[nameField] ? "text-red-600" : ""
            )}
          >
            {label}
          </FormLabel>
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value?.toString()} // convierte a string para el Select
            defaultValue={field.value?.toString()}
            disabled={disabled}
          >
            <FormControl
              className={`focus:ring-primary dark:border-primary-dark ${className}`}
              {...rest}
            >
              <SelectTrigger id={`select-${nameField}`} className="w-full">
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

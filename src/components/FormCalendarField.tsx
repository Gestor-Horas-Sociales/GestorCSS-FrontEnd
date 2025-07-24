import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type{ CalendarField } from "@/Types/TextFieldTypes";
import type { FieldValues } from "react-hook-form";
import { useState } from "react";

export default function FormCalendarField<T extends FieldValues>({
  formField,
  nameField,
  label,
  disabled,
  defaultValue,
  rules,
  shouldUnregister,
  ...rest
}: CalendarField<T>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={formField.control}
      name={nameField}
      defaultValue={defaultValue}
      disabled={disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(
              formField.formState.errors.getDate
                ? "text-red-600"
                : "dark:text-secondary",
            )}
          >
            {label}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal focus-visible:ring-primary dark:border-primary-dark",
                    !field.value && "text-muted-foreground",
                  )}
                  {...rest}
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: es })
                  ) : (
                    <span>Seleccione una fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}

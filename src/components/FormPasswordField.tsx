import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

export default function FormPasswordField<T extends FieldValues>({
  formField,
  nameField,
  label,
  placeholder,
  disabled,
  defaultValue,
  rules,
  shouldUnregister,
  className,
}: TextFieldType<T>) {
  const [showPassword, setShowPassword] = useState(false);

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
            htmlFor={`password-${nameField}`}
            className={cn(
              formField.formState.errors[nameField] ? "text-red-600" : ""
            )}
          >
            {label}
          </FormLabel>

          <FormControl>
            <div className="relative">
              <Input
                id={`password-${nameField}`}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={cn(
                  "focus-visible:ring-primary dark:border-primary-dark pr-10",
                  className
                )}
                autoComplete="new-password"
                {...field}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </FormControl>

          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
}

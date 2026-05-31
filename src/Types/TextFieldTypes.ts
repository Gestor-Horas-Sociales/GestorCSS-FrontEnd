import type {
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormReturn,
} from "react-hook-form";
import type {
  AreaProperties,
  ButtonProperties,
  InputProperties,
} from "./HTMLPropertiesTypes";

export interface TextFieldType<T extends FieldValues> extends InputProperties {
  formField: UseFormReturn<T>;
  nameField: Path<T>;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  shouldUnregister?: boolean;
}

export interface CalendarField<T extends FieldValues> extends ButtonProperties {
  formField: UseFormReturn<T>;
  nameField: Path<T>;
  label: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  shouldUnregister?: boolean;
}

export interface AreaField<T extends FieldValues> extends AreaProperties {
  formField: UseFormReturn<T>;
  nameField: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  shouldUnregister?: boolean;
}

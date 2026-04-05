import { View, TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className={className}>
      {label && (
        <Text variant="label" className="mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          "h-10 border border-input rounded-md px-3 text-foreground bg-background text-sm",
          error && "border-destructive"
        )}
        placeholderTextColor="#94A3B8"
        {...props}
      />
      {error && (
        <Text variant="error" className="mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}

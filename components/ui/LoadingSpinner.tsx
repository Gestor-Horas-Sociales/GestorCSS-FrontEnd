import { ActivityIndicator, View } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "./Text";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#2563EB",
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    <View className={cn("flex-1 items-center justify-center", className)}>
      <ActivityIndicator size={size} color={color} />
      {label && (
        <Text variant="muted" className="mt-2">
          {label}
        </Text>
      )}
    </View>
  );
}

import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface CardProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

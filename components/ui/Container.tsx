import { SafeAreaView, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface ContainerProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <SafeAreaView
      className={cn("flex-1 bg-background", className)}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}

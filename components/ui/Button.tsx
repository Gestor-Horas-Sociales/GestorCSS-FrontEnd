import { ActivityIndicator, TouchableOpacity } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Text } from "./Text";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-md px-4 py-2 gap-2",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border border-border bg-transparent",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-medium text-sm", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "text-foreground",
      secondary: "text-white",
      ghost: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  disabled,
  loading,
  variant,
  size,
  className,
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size }), className, {
        "opacity-50": disabled || loading,
      })}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : typeof children === "string" ? (
        <Text className={buttonTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

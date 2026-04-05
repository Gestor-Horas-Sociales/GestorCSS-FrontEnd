import { Text as RNText, type TextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "text-base",
      heading: "text-2xl font-bold",
      subheading: "text-lg font-semibold",
      label: "text-sm font-medium",
      muted: "text-sm text-muted-foreground",
      error: "text-sm text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextComponentProps
  extends TextProps,
    VariantProps<typeof textVariants> {
  className?: string;
}

export function Text({ variant, className, ...props }: TextComponentProps) {
  return (
    <RNText
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

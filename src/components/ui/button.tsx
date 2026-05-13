import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.22em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-100",
  {
    variants: {
      variant: {
        primary:
          "border border-white/10 bg-[linear-gradient(90deg,rgba(61,103,255,0.95),rgba(119,85,255,0.4))] text-white shadow-glow hover:scale-[1.02]",
        secondary:
          "border border-white/15 bg-white/[0.03] text-white/88 hover:border-white/30 hover:bg-white/[0.06]",
        ghost: "text-white/70 hover:text-white"
      },
      size: {
        default: "h-14 px-8",
        sm: "h-10 px-4 text-xs",
        lg: "h-16 px-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

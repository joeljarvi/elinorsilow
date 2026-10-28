import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none gap-1 whitespace-nowrap   cursor-pointer  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none pointer-events-auto disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 hover:bg-neutral-300 rounded-full",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 justify-center",
        outline:
          "border-[0.5px] border-border bg-background hover:bg-accent hover:text-accent-foreground justify-center",
        secondary:
          "bg-secondary text-primary shadow-none transition-all hover:bg-neutral-100 rounded-2xl border-secondary",
        ghost:
          "bg-transparent text-foreground dark:text-neutral-400 hover:bg-foreground/10 hover:text-muted-foreground justify-center",
        link: "text-primary  font-medium justify-start  tracking-wide  hover:text-foreground/80  [transition:color_0.2s_ease] uppercase ",
        nav: "text-primary transition-all w-full justify-between hover:text-primary/80",
      },
      size: {
        default: "h-12 px-4 text-lg font-normal ",
        sm: "h-6 px-2   text-sm tracking-wide font-normal  font-gtAlpina ",
        lg: "px-4 py-2",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

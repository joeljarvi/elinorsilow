import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none  gap-1 whitespace-nowrap font-normal h3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none pointer-events-auto disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-3xl   transition-all   hover:text-primary/80 ",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 justify-center",
        outline:
          "border border-foreground bg-background  hover:bg-accent hover:text-accent-foreground justify-center",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 justify-center",
        ghost: "hover:bg-accent hover:text-accent-foreground justify-center",
        link: "text-primary   transition-all   hover:text-primary/80 ",
        nav: "text-primary       transition-all w-full  justify-between hover:text-primary/80 ",
      },
      size: {
        default: "h-9 px-4 py-2 h3",
        sm: "h-6 px-4 py-1 h3",
        lg: "h-16 px-4 py-2 text-lg",
        linkSize: "h-6  px-0 py-0 text-sm",
        linkSizeMd: "h-9    pt-0.5 text-lg",
        listSize: "h-auto px-0 py-0",
        linkIcon: "h-6 w-6 px-0 py-0",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

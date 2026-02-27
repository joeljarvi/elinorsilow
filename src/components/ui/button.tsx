import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none  gap-1 whitespace-nowrap font-normal h3 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none pointer-events-auto  disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground  shadow-none transition-all   hover:text-primary/80 ",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 justify-center",
        outline:
          "border-[0.5px] border-foreground bg-background  hover:bg-accent hover:text-accent-foreground justify-center",
        secondary:
          "bg-background text-background-foreground  hover:bg-secondary/80 justify-center",
        ghost: "  bg-background hover:bg-foreground/20 justify-center",
        link: "text-primary   transition-all   hover:underline active:underline underline-offset-8 decoration-[1px]   ",
        nav: "text-primary       transition-all w-full  justify-between hover:text-primary/80 ",
      },
      size: {
        default: "h-9 px-4 py-2 h3",
        sm: "h-6 px-4 py-1 h3",
        lg: " px-4 py-2  text-xl lg:text-base font-directorLight h-16 lg:h-12 ",
        linkSize: "h-6  px-0 py-0 text-sm",
        linkSizeLg: "text-3xl lg:text-3xl leading-tight ",
        listSize: "h-auto px-0 py-0",
        linkIcon: "h-6 w-6 px-0 py-0",
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

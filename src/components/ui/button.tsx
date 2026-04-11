import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-none gap-1 whitespace-nowrap font-universNextPro font-medium  cursor-pointer  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none pointer-events-auto disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-none transition-all hover:bg-neutral-100 rounded-2xl border-primary",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 justify-center",
        outline:
          "border-[0.5px] border-border bg-background hover:bg-accent hover:text-accent-foreground justify-center",
        secondary:
          "bg-secondary text-primary shadow-none transition-all hover:bg-neutral-100 rounded-2xl border-secondary",
        ghost:
          "bg-background text-neutral-600 dark:text-neutral-400 hover:bg-foreground/10 hover:text-foreground justify-center",
        link: "text-primary hover:text-foreground/80 font-extrabold font-universNextProExt [transition:color_0.2s_ease]",
        filter:
          "text-primary hover:text-foreground/80 font-medium font-universNextProExt [transition:color_0.2s_ease]",
        stretch:
          "text-primary hover:text-foreground/80 font-extrabold font-universNextProExt hover:[transform:scaleX(1.5)] origin-center   duration-1200 ease-in-out ",
        stroke:
          "text-foreground font-extrabold font-universNextProExt [paint-order:stroke_fill] [-webkit-text-stroke-width:0px] [-webkit-text-stroke-color:theme(colors.neutral.300)] ![transition:color_0.15s_ease,-webkit-text-stroke-width_6s_ease] hover:[-webkit-text-stroke-width:20px]",
        nav: "text-primary transition-all w-full justify-between hover:text-primary/80",
      },
      size: {
        default: "h-[34px] px-[18px] text-[15px]",
        sm: "h-6 px-4 py-1",
        lg: "px-4 py-2",
        linkSize: "h-6 px-0 py-0 text-sm",
        linkSizeLg: "text-lg leading-tight",
        listSize: "h-auto px-0 py-0",
        linkIcon: "h-6 w-6 px-0 py-0",
        controls:
          "h-[34px] tracking-wide px-[18px] py-[4px] [&_svg]:size-3  text-[15px] ",
        controlsIcon:
          "h-[34px] tracking-wide px-0 aspect-square py-[5px] [&_svg]:size-3 rounded-full",
        icon: "h-9 w-9",
        filterControls:
          "h-[34px] tracking-wide px-[18px] py-[5px] [&_svg]:size-3 text-[21px]  ",
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

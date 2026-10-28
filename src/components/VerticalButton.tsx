"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A Button whose label reads top-to-bottom with the glyphs left upright —
 * `text-orientation: upright` is what keeps them from rotating 90°.
 *
 * In vertical writing mode the inline axis runs top-to-bottom, so the gap
 * between the stacked glyphs is `letter-spacing`, not `line-height` — tighten
 * the label with `tracking-*` (line-height only sets the column's width, and
 * CSS rejects negative values for it).
 */
const VerticalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "[writing-mode:vertical-rl] -leading-[0.5] [text-orientation:upright]",
        "h-12 w-auto px-0 py-1 text-xs font-normal uppercase tracking-[-0.35em]",
        "bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  ),
);
VerticalButton.displayName = "VerticalButton";

export default VerticalButton;

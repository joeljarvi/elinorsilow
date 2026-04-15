"use client";

import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface RevealImageProps extends ImageProps {
  revealIndex?: number;
  noScaleY?: boolean;
  blurUntilCentered?: boolean;
}

export function RevealImage({
  revealIndex: _revealIndex = 0,
  noScaleY: _noScaleY = false,
  blurUntilCentered: _blurUntilCentered = false,
  className,
  ...props
}: RevealImageProps) {
  // fill mode needs absolute-positioned wrappers; non-fill renders inline
  if (props.fill) {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image {...props} className={className} />
        </div>
      </div>
    );
  }

  return <Image {...props} className={className} />;
}

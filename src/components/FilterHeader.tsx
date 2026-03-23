"use client";

import React, { useState, isValidElement, cloneElement } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface FilterHeaderProps {
  select: ReactNode;
  mobileLabel?: string;
  onClose: () => void;
  onToggleList: () => void;
  asList: boolean;
  hidden?: boolean;
  showMobile?: boolean;
  className?: string;
}

export default function FilterHeader({
  select,
  mobileLabel = "Filter",
  onClose,
  onToggleList,
  asList,
  hidden = false,
  showMobile = true,
  className = "",
}: FilterHeaderProps) {
  const [mobileSelectRevealed, setMobileSelectRevealed] = useState(false);

  return (
    <>
      {/* Desktop: inline inside subnav */}
      <div
        className={`hidden lg:flex items-center w-full gap-x-2 ${className}`}
      >
        <div className="flex-1 min-w-0 [&>*]:w-full">{select}</div>
        <span className="flex items-center gap-x-2">
          <Button variant="secondary" size="controls" onClick={onToggleList}>
            {asList ? "Thumbnails" : "List"}
          </Button>
          <Button
            variant="secondary"
            size="controlsIcon"
            className="aspect-square"
            onClick={onClose}
          >
            <Cross1Icon />
          </Button>
        </span>
      </div>

      {/* Mobile: fixed top-right, above nav */}
      <div
        className={`lg:hidden fixed bottom-4 right-4 flex items-center gap-x-2 z-[61] ${hidden || !showMobile ? "hidden" : ""}`}
      >
        <span className="flex flex-row items-center">
          <Button
            variant="link"
            size="controls"
            className="px-0"
            onClick={() => setMobileSelectRevealed(!mobileSelectRevealed)}
          >
            {mobileLabel}
          </Button>
          {mobileSelectRevealed && (
            <Button
              variant="link"
              size="controlsIcon"
              className="px-0"
              onClick={() => setMobileSelectRevealed(false)}
            >
              <Cross1Icon />
            </Button>
          )}
        </span>

        <Button
          variant="link"
          size="controls"
          className="px-0"
          onClick={onToggleList}
        >
          {asList ? "Thumbnails" : "List"}
        </Button>
      </div>

      {/* Mobile: select revealed at bottom-left */}
      {mobileSelectRevealed && showMobile && !hidden && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[59]"
            onClick={() => setMobileSelectRevealed(false)}
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] p-4 [&>*]:w-full">
            {isValidElement(select)
              ? cloneElement(
                  select as React.ReactElement<{
                    onValueChange?: (v: string) => void;
                  }>,
                  {
                    onValueChange: (v: string) => {
                      (
                        select.props as { onValueChange?: (v: string) => void }
                      ).onValueChange?.(v);
                      setMobileSelectRevealed(false);
                    },
                  },
                )
              : select}
          </div>
        </>
      )}
    </>
  );
}

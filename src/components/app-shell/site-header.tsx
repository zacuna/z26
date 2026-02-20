"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  onMenuToggle: () => void;
  className?: string;
}

export function SiteHeader({ onMenuToggle, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-header flex h-header w-full items-center justify-between border-b border-border bg-background px-4",
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={undefined}
          className="shrink-0"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
        <span className="text-lg font-semibold text-foreground">Z26</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

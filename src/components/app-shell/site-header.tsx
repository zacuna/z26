"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-[var(--z-header)] flex h-14 w-full items-center justify-between border-b border-border bg-background px-4",
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger
          aria-label="Toggle navigation menu"
          className="shrink-0"
        />
        <span className="text-lg font-semibold text-foreground">Z26</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

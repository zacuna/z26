"use client";

import * as React from "react";
import { ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TAILWIND_COLOR_PALETTE,
  COLOR_FAMILY_ORDER,
  RADIUS_OPTIONS,
  SPACING_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  SHADOW_OPTIONS,
  TAILWIND_COLOR_OPTIONS,
} from "./primitives";

// ─── Color token field: dropdown with palette by family, swatches, search ───

export interface ColorTokenFieldProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Find display label for an HSL value from our palette, or return custom text */
function getColorLabel(value: string): string {
  const opt = TAILWIND_COLOR_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : value ? `Custom (${value})` : "—";
}

export function ColorTokenField({
  label,
  cssVar,
  value,
  onChange,
  className,
}: ColorTokenFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const filteredFamilies = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return COLOR_FAMILY_ORDER;
    return COLOR_FAMILY_ORDER.filter((f) => f.includes(q));
  }, [search]);

  const swatchStyle = (hsl: string) =>
    ({ backgroundColor: `hsl(${hsl})` } as React.CSSProperties);

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm shadow-sm",
            "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring"
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span
            className="h-4 w-4 shrink-0 rounded border border-border"
            style={swatchStyle(value)}
            aria-hidden
          />
          <span className="min-w-0 truncate">
            {value ? getColorLabel(value) : "—"}
          </span>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </button>
        {open && (
          <div
            className="absolute top-full left-0 z-50 mt-1 w-64 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg"
            role="listbox"
          >
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search colors…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredFamilies.map((family) => {
                const stops = TAILWIND_COLOR_PALETTE[family];
                if (!stops) return null;
                const entries = Object.entries(stops).sort(
                  (a, b) => Number(a[0]) - Number(b[0])
                );
                return (
                  <div key={family} className="mb-3 last:mb-0">
                    <div className="mb-1.5 px-1 text-xs font-semibold capitalize text-foreground">
                      {family}
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                      {entries.map(([stop, hsl]) => {
                        const isSelected = value === hsl;
                        return (
                          <button
                            key={stop}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            title={`${family}-${stop}`}
                            className={cn(
                              "flex h-7 w-full items-center justify-center rounded border transition-colors",
                              isSelected
                                ? "border-ring ring-1 ring-ring"
                                : "border-transparent hover:border-border"
                            )}
                            style={swatchStyle(hsl)}
                            onClick={() => {
                              onChange(hsl);
                              setOpen(false);
                            }}
                          >
                            {isSelected ? (
                              <span className="text-background drop-shadow-md">
                                ✓
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Radius token field: segmented control ──────────────────────────────────

export interface RadiusTokenFieldProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Normalize radius value to option value (e.g. 0.5rem → 8px for md) */
function normalizeRadiusValue(val: string): string {
  const rem = parseFloat(val);
  if (!Number.isNaN(rem)) {
    const px = Math.round(rem * 16);
    const match = RADIUS_OPTIONS.find((o) => o.value === `${px}px`);
    if (match) return match.value;
  }
  const match = RADIUS_OPTIONS.find((o) => o.value === val);
  return match ? match.value : RADIUS_OPTIONS[1].value;
}

export function RadiusTokenField({
  label,
  value,
  onChange,
  className,
}: RadiusTokenFieldProps) {
  const current = normalizeRadiusValue(value);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div
        className="flex flex-wrap gap-0.5 rounded-md border border-input bg-muted/30 p-0.5"
        role="group"
        aria-label={label}
      >
        {RADIUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "rounded px-2.5 py-1.5 text-xs font-medium transition-colors",
              opt.value === current
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Spacing token field: segmented or compact dropdown ───────────────────────

export interface SpacingTokenFieldProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SpacingTokenField({
  label,
  value,
  onChange,
  className,
}: SpacingTokenFieldProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const currentLabel =
    SPACING_OPTIONS.find((o) => o.value === value)?.label ?? value ?? "—";

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={ref}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring"
          )}
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-popover py-1 shadow-lg">
            {SPACING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  value === opt.value && "bg-accent"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                <span className="text-muted-foreground">{opt.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typography: font size and font weight dropdowns ─────────────────────────

export interface TypographyTokenFieldProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export function TypographyTokenField({
  label,
  value,
  onChange,
  options,
  className,
}: TypographyTokenFieldProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const currentLabel =
    options.find((o) => o.value === value)?.label ?? value ?? "—";

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={ref}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring"
          )}
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  value === opt.value && "bg-accent"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shadow token field: dropdown sm / md / lg ───────────────────────────────

export interface ShadowTokenFieldProps {
  label: string;
  cssVar: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ShadowTokenField({
  label,
  value,
  onChange,
  className,
}: ShadowTokenFieldProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const currentLabel =
    SHADOW_OPTIONS.find((o) => o.value === value)?.label ?? "—";

  return (
    <div className={cn("flex flex-col gap-1.5", className)} ref={ref}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring"
          )}
        >
          <span>{currentLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover py-1 shadow-lg">
            {SHADOW_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={cn(
                  "flex w-full px-3 py-2 text-left text-sm",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  value === opt.value && "bg-accent"
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { FONT_SIZE_OPTIONS, FONT_WEIGHT_OPTIONS } from "./primitives";

"use client";

import * as React from "react";
import { ChevronDown, Copy, RotateCcw } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ColorTokenField,
  RadiusTokenField,
  ShadowTokenField,
} from "./TokenField";
import { exportAsCss, exportAsJson, copyToClipboard } from "./export-utils";

/** Semantic CSS variables we expose in the Theme Editor (must match globals.css) */
const SEMANTIC_VAR_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "radius",
  "shadow",
] as const;

type SemanticVarKey = (typeof SEMANTIC_VAR_KEYS)[number];

function readCssVars(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const style = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (const key of SEMANTIC_VAR_KEYS) {
    const value = style.getPropertyValue(`--${key}`).trim();
    out[key] = value;
  }
  return out;
}

function applyCssVar(key: string, value: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(`--${key}`, value);
}

const COLOR_GROUPS: { title: string; vars: SemanticVarKey[] }[] = [
  { title: "Primary Colors", vars: ["primary", "primary-foreground"] },
  { title: "Secondary Colors", vars: ["secondary", "secondary-foreground"] },
  { title: "Accent Colors", vars: ["accent", "accent-foreground"] },
  { title: "Muted Colors", vars: ["muted", "muted-foreground"] },
  { title: "Destructive Colors", vars: ["destructive", "destructive-foreground"] },
  { title: "Base Colors", vars: ["background", "foreground"] },
  { title: "Card Colors", vars: ["card", "card-foreground"] },
  { title: "Popover Colors", vars: ["popover", "popover-foreground"] },
  { title: "Border & Input Colors", vars: ["border", "input", "ring"] },
];

export interface ThemeEditorProps {
  className?: string;
}

export function ThemeEditor({ className }: ThemeEditorProps) {
  const [vars, setVars] = React.useState<Record<string, string>>({});
  const [initialVars, setInitialVars] = React.useState<Record<string, string>>({});
  const [exportCopied, setExportCopied] = React.useState<string | null>(null);

  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const read = readCssVars();
    setVars(read);
    setInitialVars(read);
  }, []);

  const updateVar = React.useCallback((key: string, value: string) => {
    setVars((prev) => ({ ...prev, [key]: value }));
    applyCssVar(key, value);
  }, []);

  const handleReset = React.useCallback(() => {
    setVars(initialVars);
    for (const [key, value] of Object.entries(initialVars)) {
      applyCssVar(key, value);
    }
  }, [initialVars]);

  const handleExport = React.useCallback(async (format: "json" | "css") => {
    const prefixed: Record<string, string> = {};
    for (const [k, v] of Object.entries(vars)) {
      prefixed[`--${k}`] = v;
    }
    const text = format === "json" ? exportAsJson(prefixed) : exportAsCss(prefixed);
    await copyToClipboard(text);
    setExportCopied(format);
    setTimeout(() => setExportCopied(null), 2000);
  }, [vars]);

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-l border-border bg-card text-card-foreground",
        className
      )}
      aria-label="Theme Editor"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Theme Editor</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Copy className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("json")}>
                  Copy as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("css")}>
                  Copy as CSS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {exportCopied && (
              <span className="absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {exportCopied === "json" ? "JSON copied" : "CSS copied"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Colors — only section open by default */}
        <Collapsible defaultOpen className="group border-b border-border">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 focus:outline-none focus:ring-0">
            <span className="text-sm font-medium text-foreground">Colors</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-6 px-4 pb-4 pt-1">
              {COLOR_GROUPS.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.vars.map((varKey) => (
                      <ColorTokenField
                        key={varKey}
                        label={varKey.replace(/-/g, " ")}
                        cssVar={`--${varKey}`}
                        value={vars[varKey] ?? ""}
                        onChange={(v) => updateVar(varKey, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Radius — collapsed by default */}
        <Collapsible defaultOpen={false} className="group border-b border-border last:border-b-0">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 focus:outline-none focus:ring-0">
            <span className="text-sm font-medium text-foreground">Radius</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <RadiusTokenField
                label="Border radius"
                cssVar="--radius"
                value={vars.radius ?? ""}
                onChange={(v) => updateVar("radius", v)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Shadows — collapsed by default */}
        <Collapsible defaultOpen={false} className="group border-b border-border last:border-b-0">
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 focus:outline-none focus:ring-0">
            <span className="text-sm font-medium text-foreground">Shadows</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <ShadowTokenField
                label="Shadow"
                cssVar="--shadow"
                value={vars.shadow ?? ""}
                onChange={(v) => updateVar("shadow", v)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}

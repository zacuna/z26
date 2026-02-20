import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TypeScalePage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <Link
          href="/play"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Play
        </Link>
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Type Scale Calculator
        </h1>
        <p className="text-base text-muted-foreground">
          Generate harmonious type scales. Placeholder — tool to be built.
        </p>
      </header>
      <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-muted-foreground">
        <p>This tool will let you set a base size and ratio to generate a
          type scale for headings and body text.</p>
      </div>
    </div>
  );
}

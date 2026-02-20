import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TOOLS = [
  {
    href: "/play/design-system",
    title: "Design System",
    description: "Browse components, tokens, and theme editor",
  },
  {
    href: "/play/color-contrast",
    title: "Color Contrast Checker",
    description: "Test color combinations for WCAG compliance",
  },
  {
    href: "/play/type-scale",
    title: "Type Scale Calculator",
    description: "Generate harmonious type scales",
  },
];

export default function Play() {
  return (
    <div className="flex flex-col gap-12 p-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Play
        </h1>
        <p className="text-lg text-muted-foreground">
          Tools and experiments
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SPACING_SCALE = [
  { name: "1", size: "var(--spacing-1)" },
  { name: "2", size: "var(--spacing-2)" },
  { name: "3", size: "var(--spacing-3)" },
  { name: "4", size: "var(--spacing-4)" },
  { name: "5", size: "var(--spacing-5)" },
  { name: "6", size: "var(--spacing-6)" },
  { name: "8", size: "var(--spacing-8)" },
  { name: "10", size: "var(--spacing-10)" },
  { name: "12", size: "var(--spacing-12)" },
];

const COLOR_SWATCHES = [
  { name: "Background", token: "bg-background" },
  { name: "Foreground", token: "bg-foreground" },
  { name: "Primary", token: "bg-primary" },
  { name: "Secondary", token: "bg-secondary" },
  { name: "Muted", token: "bg-muted" },
  { name: "Accent", token: "bg-accent" },
  { name: "Destructive", token: "bg-destructive" },
  { name: "Border", token: "bg-border" },
];

const TABLE_ROWS = [
  { col1: "Row 1 A", col2: "Row 1 B", col3: "Row 1 C", col4: "Row 1 D" },
  { col1: "Row 2 A", col2: "Row 2 B", col3: "Row 2 C", col4: "Row 2 D" },
  { col1: "Row 3 A", col2: "Row 3 B", col3: "Row 3 C", col4: "Row 3 D" },
  { col1: "Row 4 A", col2: "Row 4 B", col3: "Row 4 C", col4: "Row 4 D" },
  { col1: "Row 5 A", col2: "Row 5 B", col3: "Row 5 C", col4: "Row 5 D" },
];

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-16 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Design System
        </h1>
        <p className="text-lg text-muted-foreground">
          A living documentation of our UI components and design tokens.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Table
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column A</TableHead>
              <TableHead>Column B</TableHead>
              <TableHead>Column C</TableHead>
              <TableHead>Column D</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TABLE_ROWS.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.col1}</TableCell>
                <TableCell>{row.col2}</TableCell>
                <TableCell>{row.col3}</TableCell>
                <TableCell>{row.col4}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Cards
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card with title</CardTitle>
              <CardDescription>Supporting description text for this card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Placeholder content. Cards can hold any composition.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Footer optional</p>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Second card</CardTitle>
              <CardDescription>Another example with different copy.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                More placeholder content to show consistency.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Third card</CardTitle>
              <CardDescription>Minimal footer or none.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Simple body text only.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Typography
        </h2>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            Heading 1
          </h1>
          <h2 className="text-2xl font-semibold leading-tight text-foreground">
            Heading 2
          </h2>
          <h3 className="text-xl font-semibold leading-tight text-foreground">
            Heading 3
          </h3>
          <h4 className="text-lg font-semibold leading-tight text-foreground">
            Heading 4
          </h4>
          <p className="text-base leading-normal text-foreground">
            Body base. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm leading-normal text-muted-foreground">
            Body small. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-xs leading-normal text-muted-foreground">
            Body xs. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Colors
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {COLOR_SWATCHES.map((swatch) => (
            <div
              key={swatch.name}
              className={`flex flex-col overflow-hidden rounded-lg border border-border ${swatch.token === "bg-foreground" || swatch.token === "bg-primary" ? "text-primary-foreground" : "text-foreground"}`}
            >
              <div className={`h-16 w-full ${swatch.token}`} aria-hidden />
              <div className="bg-card px-3 py-2">
                <p className="text-xs font-medium text-foreground">{swatch.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Spacing
        </h2>
        <p className="text-sm text-muted-foreground">
          Spacing scale (primitive tokens). Labeled by scale step.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          {SPACING_SCALE.map((step) => (
            <div
              key={step.name}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="rounded bg-muted border border-border"
                style={{ width: step.size, height: step.size }}
                aria-hidden
              />
              <span className="text-xs text-muted-foreground">{step.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

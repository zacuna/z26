import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 p-6">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Zach Acuna
        </h1>
        <p className="text-xl font-medium text-muted-foreground">
          Product Designer
        </p>
        <p className="max-w-prose text-base leading-normal text-foreground">
          Placeholder bio. This section will be filled with a short introduction
          about design practice, approach, and what you’re looking for.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold leading-tight text-foreground">
          Featured Work
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: "Project One", description: "Short placeholder description for the first featured project." },
            { title: "Project Two", description: "Short placeholder description for the second featured project." },
            { title: "Project Three", description: "Short placeholder description for the third featured project." },
          ].map((item) => (
            <Link key={item.title} href="/work/sample-project">
              <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                <div className="aspect-video w-full bg-muted" aria-hidden />
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold leading-tight text-foreground">
          Play
        </h2>
        <p className="text-base text-muted-foreground">
          Tools and experiments.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/play/design-system">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Design System</CardTitle>
                <CardDescription>Components and tokens</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/play/color-contrast">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Color Contrast</CardTitle>
                <CardDescription>WCAG compliance checker</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/play/type-scale">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Type Scale</CardTitle>
                <CardDescription>Harmonious type scales</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

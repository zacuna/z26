import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SAMPLE_SLUG = "sample-project";

const PLACEHOLDER_SECTIONS = [
  { heading: "Overview", text: "Placeholder overview text. This case study will describe the context, goals, and scope of the project. Content to be added later." },
  { heading: "Problem", text: "Placeholder problem statement. What challenges did the team face? What user or business needs drove this work? Content to be added later." },
  { heading: "Process", text: "Placeholder process description. Research, ideation, iteration, and collaboration. Content to be added later." },
  { heading: "Solution", text: "Placeholder solution summary. The key design decisions and deliverables. Content to be added later." },
  { heading: "Results", text: "Placeholder results and impact. Metrics, feedback, and outcomes. Content to be added later." },
];

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  if (slug !== SAMPLE_SLUG) {
    notFound();
  }

  return (
    <article className="flex flex-col">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <Link
          href="/work"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Work
        </Link>
      </div>

      <div className="aspect-video w-full bg-muted" aria-hidden />

      <div className="mx-auto w-full max-w-prose px-6 py-10">
        <header className="flex flex-col gap-4 pb-10">
          <h1 className="text-3xl font-bold leading-tight text-foreground">
            Sample Project
          </h1>
          <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <dt className="font-medium text-foreground">Company</dt>
              <dd>Acme Co</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Role</dt>
              <dd>Lead Product Designer</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Timeline</dt>
              <dd>2024 – 2025</dd>
            </div>
          </dl>
        </header>

        <div className="flex flex-col gap-12">
          {PLACEHOLDER_SECTIONS.map((section, i) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold leading-tight text-foreground">
                {section.heading}
              </h2>
              <p className="text-base leading-normal text-foreground">
                {section.text}
              </p>
              {i < PLACEHOLDER_SECTIONS.length - 1 && (
                <div
                  className="aspect-video w-full bg-muted rounded-lg"
                  aria-hidden
                />
              )}
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <Button variant="outline" asChild>
            <Link href="/work">Back to Work</Link>
          </Button>
        </footer>
      </div>
    </article>
  );
}

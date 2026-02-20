import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PROJECTS = [
  {
    slug: "sample-project",
    title: "Sample Project",
    company: "Acme Co",
    description: "Placeholder one-line description of the project and outcome.",
    year: "2025",
  },
  {
    slug: "project-b",
    title: "Project B",
    company: "Beta Inc",
    description: "Placeholder one-line description of the project and outcome.",
    year: "2024",
  },
  {
    slug: "project-c",
    title: "Project C",
    company: "Gamma LLC",
    description: "Placeholder one-line description of the project and outcome.",
    year: "2024",
  },
  {
    slug: "project-d",
    title: "Project D",
    company: "Delta Corp",
    description: "Placeholder one-line description of the project and outcome.",
    year: "2023",
  },
];

const OLDER_PROJECTS = [
  { title: "Older Project A", year: "2022" },
  { title: "Older Project B", year: "2022" },
  { title: "Older Project C", year: "2021" },
  { title: "Older Project D", year: "2021" },
];

export default function Work() {
  return (
    <div className="flex flex-col gap-16 p-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Work
        </h1>
        <p className="text-base text-muted-foreground">
          Case studies and selected projects.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <Link key={project.slug} href={`/work/${project.slug}`}>
            <Card className="overflow-hidden transition-colors hover:bg-muted/50">
              <div className="aspect-video w-full bg-muted" aria-hidden />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">
                  {project.company}
                </p>
                <CardDescription>{project.description}</CardDescription>
                <p className="text-xs text-muted-foreground">{project.year}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Older Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {OLDER_PROJECTS.map((item) => (
            <Card
              key={item.title}
              className="transition-colors hover:bg-muted/50"
            >
              <CardContent className="flex flex-col gap-1 p-4">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.year}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

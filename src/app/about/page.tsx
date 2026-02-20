const SKILLS = [
  "Figma",
  "React",
  "TypeScript",
  "Design Systems",
  "Prototyping",
  "User Research",
  "Accessibility",
  "Component Libraries",
];

export default function About() {
  return (
    <div className="flex flex-col gap-16 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          About
        </h1>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_2fr]">
        <div
          className="aspect-square w-full max-w-sm rounded-lg bg-muted"
          aria-hidden
        />
        <div className="flex flex-col gap-6">
          <p className="text-base leading-normal text-foreground">
            Placeholder bio paragraph one. This will describe background,
            approach to design, and what drives your work.
          </p>
          <p className="text-base leading-normal text-foreground">
            Placeholder bio paragraph two. Experience, collaboration style, and
            interests. Content to be filled in later.
          </p>
          <p className="text-base leading-normal text-foreground">
            Placeholder bio paragraph three. What you’re looking for next, or
            how to work with you. Content to be filled in later.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Skills & Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Currently
        </h2>
        <p className="text-base text-muted-foreground">
          Placeholder line about current role and focus. To be updated.
        </p>
      </section>
    </div>
  );
}

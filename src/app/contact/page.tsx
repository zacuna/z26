import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="flex flex-col gap-10 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Contact
        </h1>
      </header>

      <section className="flex flex-col gap-6">
        <p className="text-lg text-foreground">
          Let&apos;s connect
        </p>
        <div className="flex flex-col gap-4">
          <Button asChild size="lg">
            <a
              href="https://www.linkedin.com/in/zachacuna"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </Button>
          <a
            href="mailto:hello@example.com"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            hello@example.com
          </a>
        </div>
      </section>
    </div>
  );
}

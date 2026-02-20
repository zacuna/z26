import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold leading-tight text-foreground">
        Z26
      </h1>
      <p className="text-base leading-normal text-foreground">
        Foundation in progress
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  );
}

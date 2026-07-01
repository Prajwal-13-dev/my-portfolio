import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About — Engineering Atlas",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <Badge variant="outline" className="w-fit text-[10px]">
        placeholder — real bio coming soon
      </Badge>
      <h1 className="text-3xl font-semibold tracking-tight">
        Hi, I&apos;m Prajwal.
      </h1>
      <p className="text-muted-foreground">
        This page is a placeholder narrative section. The canvas you just came
        from is the real proof of work &mdash; it pulls live from my GitHub
        repositories, so every project card reflects what I&apos;m actually
        building right now. This bio, resume-style background, and a proper
        recruiter-facing AI assistant are next up.
      </p>
      <p className="text-muted-foreground">
        Two nodes on the canvas are marked &ldquo;coming soon&rdquo;: a
        RAG-powered chat assistant trained on my experience, and a link to a
        personal AI assistant project I&apos;m building next.
      </p>
      <Link href="/" className="text-sm font-medium text-primary underline">
        &larr; Back to the canvas
      </Link>
    </main>
  );
}

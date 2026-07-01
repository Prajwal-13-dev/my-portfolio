import { getProjects } from "@/lib/github/getProjects";
import { Scene } from "@/components/canvas/Scene";
import { ControlPanel } from "@/components/canvas/ControlPanel";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      <ControlPanel />
      <Scene projects={projects} />
    </main>
  );
}

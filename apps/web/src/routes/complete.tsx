import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/complete")({
  validateSearch: (s: Record<string, unknown>) => ({
    game: typeof s.game === "string" ? s.game : "neon-racer",
  }),
  head: () => ({ meta: [{ title: "Game Complete — THE ARCADE" }] }),
  component: GameComplete,
});

function GameComplete() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <PageHeader title="Game Complete" back="/" />
      <Screen className="pt-2 flex flex-col h-[calc(100vh-140px)]">
        
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
          <p className="text-[17px] font-medium text-muted-foreground mb-4">Your Score -</p>
          <p className="font-display text-[80px] font-bold text-white tracking-tight leading-none mb-8">
            2,090
          </p>
          
          <div className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 shadow-glow mb-12">
            <span className="font-sans text-[15px] font-bold text-white">
              Rank : #10
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6 pb-2 flex flex-col gap-4">
          <Button onClick={() => navigate({ to: "/" })}>Play again</Button>
          <div className="flex gap-4">
            <Link to="/compare" className="flex-1">
              <Button variant="secondary" className="w-full">Compare</Button>
            </Link>
            <Link to="/share" className="flex-1">
              <Button variant="secondary" className="w-full">Share</Button>
            </Link>
          </div>
        </div>
      </Screen>
    </AppShell>
  );
}

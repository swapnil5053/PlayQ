import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";
import { useGame, useGames } from "@/hooks/useGames";
import { useLeaderboard } from "@/hooks/useScores";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/leaderboard")({
  validateSearch: (s: Record<string, unknown>) => ({
    game: typeof s.game === "string" ? s.game : "neon-racer",
  }),
  head: () => ({ meta: [{ title: "Leaderboard — THE ARCADE" }] }),
  component: Leaderboard,
});

function Leaderboard() {
  const { game } = useSearch({ from: "/leaderboard" });
  const { data: games = [] } = useGames();
  const g = games.find((x) => x.id === game || x.slug === game);
  const { data: leaderboard = [], isLoading: isBoardLoading } = useLeaderboard(game);
  const user = useAuthStore(state => state.user);
  const [open, setOpen] = useState(false);

  const max = leaderboard.length > 0 ? Math.max(...leaderboard.map((e) => e.score)) : 1000;
  const isGameLoading = games.length === 0;

  if (isGameLoading) {
    return (
      <AppShell>
        <PageHeader title="Leaderboard" back="/account" />
        <Screen className="pt-2">
          <div className="animate-pulse h-10 w-full bg-muted rounded-full mb-4"></div>
          <div className="animate-pulse space-y-3">
            <div className="h-16 w-full bg-muted rounded-2xl"></div>
            <div className="h-16 w-full bg-muted rounded-2xl"></div>
          </div>
        </Screen>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Leaderboard" back="/" />
      <Screen className="pt-2">
        <div className="relative mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-full bg-foreground px-5 py-3.5 text-sm font-semibold text-background outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{g?.title || "Select Game"}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {open && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-lg animate-in slide-in-from-top-2">
              {games.map((gm) => (
                <Link
                  key={gm.id}
                  to="/leaderboard"
                  search={{ game: gm.id }}
                  onClick={() => setOpen(false)}
                  className={`block w-full px-5 py-3 text-left text-sm transition-colors hover:bg-secondary ${
                    gm.id === g?.id ? "bg-primary text-primary-foreground font-bold" : ""
                  }`}
                >
                  {gm.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {isBoardLoading ? (
             <div className="animate-pulse space-y-3">
                <div className="h-16 w-full bg-muted rounded-2xl"></div>
                <div className="h-16 w-full bg-muted rounded-2xl"></div>
             </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No scores yet. Be the first to play!
            </div>
          ) : (
            leaderboard.map((e) => {
              const isUser = user?.id === e.userId;
              return (
                <div
                  key={e.rank}
                  className={`relative flex items-center justify-between rounded-full px-6 py-4 shadow-glow transition-all ${
                    isUser ? "bg-primary border-2 border-white" : "bg-primary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-[16px] font-bold text-white/70">
                      {e.rank}
                    </span>
                    <span className="font-semibold text-[16px] text-white">
                      {e.name}
                      {isUser && (
                        <span className="ml-2 text-xs font-normal text-white/70">(you)</span>
                      )}
                    </span>
                  </div>
                  <span className="font-display text-[16px] font-bold text-white">
                    {e.score.toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <Link to="/game/$gameId" params={{ gameId: game }}>
            <Button variant="secondary">Back to Game</Button>
          </Link>
        </div>
      </Screen>
    </AppShell>
  );
}

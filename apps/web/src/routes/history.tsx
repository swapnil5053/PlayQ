import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  LineChart as RLineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { useGames } from "@/hooks/useGames";
import { useScores } from "@/hooks/useScores";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Score History — THE ARCADE" }] }),
  component: ScoreHistory,
});

function ScoreHistory() {
  const { data: games = [] } = useGames();
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Default to first game when loaded
  if (games.length > 0 && !selectedGameId) {
    setSelectedGameId(games[0].id);
  }

  const { data: scores = [], isLoading } = useScores(selectedGameId);

  const formattedScores = useMemo(() => {
    return scores.map(s => ({
      date: new Date(s.playedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: s.value,
      isPb: s.isPersonalBest
    }));
  }, [scores]);

  const data = [...formattedScores].reverse();
  const best = formattedScores.length > 0 ? Math.max(...formattedScores.map((s) => s.score)) : 0;

  return (
    <AppShell>
      <PageHeader title="Score History" back="/account" />
      <Screen className="pt-2">
        <div className="relative mb-4">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-full bg-foreground px-5 py-3.5 text-sm font-semibold text-background outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{games.find((g) => g.id === selectedGameId)?.title || "Select Game"}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {open && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-lg animate-in slide-in-from-top-2">
              {games.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setSelectedGameId(g.id);
                    setOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left text-sm transition-colors hover:bg-secondary ${
                    g.id === selectedGameId ? "bg-primary text-primary-foreground font-bold" : ""
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
           <div className="animate-pulse h-64 bg-muted rounded-3xl w-full"></div>
        ) : formattedScores.length === 0 ? (
           <p className="mt-20 text-center text-sm text-muted-foreground">
              You haven't played this game yet.
           </p>
        ) : (
          <>
            <div className="rounded-3xl bg-card p-4 shadow-card animate-in slide-in-from-bottom-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Score trend</p>
                <p className="text-xs font-semibold text-success">
                  Best {best.toLocaleString()}
                </p>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart data={data}>
                    <XAxis
                      dataKey="date"
                      stroke="oklch(0.72 0.02 285)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.18 0.02 285)",
                        border: "none",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="oklch(0.62 0.22 290)"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "oklch(0.72 0.18 300)" }}
                    />
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h3 className="mb-3 mt-6 font-sans text-base font-bold">Past attempts</h3>
            <div className="flex flex-col gap-2">
              {formattedScores.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-full bg-primary px-6 py-3.5 animate-in fade-in shadow-glow"
                >
                  <span className="text-[15px] font-medium text-primary-foreground/80">{s.date}</span>
                  <span className="font-display text-[15px] font-bold text-white">
                    {s.score.toLocaleString()}
                    {s.isPb && (
                      <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[10px] text-primary">
                        PB
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Screen>
    </AppShell>
  );
}

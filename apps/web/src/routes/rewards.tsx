import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Zap, Moon, Target, Timer, Crown, Lock } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { rewards } from "@/lib/arcade-data";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards — THE ARCADE" }] }),
  component: Rewards,
});

const icons = { trophy: Trophy, zap: Zap, moon: Moon, target: Target, timer: Timer, crown: Crown };

function Rewards() {
  const user = useAuthStore(state => state.user);
  const earned = rewards.filter((r) => r.earned).length;
  
  return (
    <AppShell>
      <PageHeader title="Rewards" />
      <Screen className="pt-2">
        <div className="rounded-3xl bg-gradient-card p-5 text-center shadow-card">
          <p className="font-display text-4xl">0</p>
          <p className="text-sm text-muted-foreground">Total points</p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <span>
              <b className="text-primary-glow">{earned}</b>/{rewards.length} badges
            </span>
            <span>
              <b className="text-success">5</b> day streak
            </span>
          </div>
        </div>

        <h3 className="mb-3 mt-6 font-sans text-base font-bold">Badges</h3>
        <div className="grid grid-cols-3 gap-3">
          {rewards.map((r) => {
            const Icon = icons[r.icon as keyof typeof icons];
            return (
              <div
                key={r.id}
                className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center shadow-card ${
                  r.earned ? "bg-card" : "bg-card/40"
                }`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    r.earned ? "bg-gradient-primary" : "bg-secondary"
                  }`}
                >
                  {r.earned ? (
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <span className="text-xs font-medium">{r.name}</span>
              </div>
            );
          })}
        </div>
      </Screen>
    </AppShell>
  );
}

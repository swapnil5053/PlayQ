import { createFileRoute, Link } from "@tanstack/react-router";
import { LineChart, Trophy, CalendarCheck, Flame, ChevronRight } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { user } from "@/lib/arcade-data";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — THE ARCADE" }] }),
  component: Account,
});

import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "@tanstack/react-router";

const menu = [
  { to: "/history", label: "Score History" },
  { to: "/leaderboard", label: "Leader Board" },
  { to: "/summary", label: "Today's Summary" },
  { to: "/high-score", label: "Today's High Score" },
] as const;

function Account() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <AppShell>
      <PageHeader title="Account" />
      <Screen className="pt-2">
        <div className="flex items-center gap-4 rounded-3xl bg-gradient-card p-5 shadow-card">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary font-display text-2xl text-primary-foreground">
            {user?.displayName?.[0] || 'U'}
          </span>
          <div>
            <h1 className="font-sans text-xl font-bold">{user?.displayName || 'Unknown User'}</h1>
            <p className="text-sm text-muted-foreground">
              Level 1 · 0 pts
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {menu.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center justify-between rounded-full bg-foreground px-6 py-4 text-background active:scale-[0.98] transition-all"
            >
              <span className="font-semibold text-[15px]">
                {label}
              </span>
              <ChevronRight className="h-5 w-5 opacity-50" />
            </Link>
          ))}
          
          <button
              onClick={handleLogout}
              className="mt-4 flex items-center justify-center rounded-full bg-destructive/10 text-destructive px-5 py-4 font-semibold hover:bg-destructive/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </Screen>
    </AppShell>
  );
}

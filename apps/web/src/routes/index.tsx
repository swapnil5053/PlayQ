import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, MapPin, Heart, Gift, Users, Trophy } from "lucide-react";
import { AppShell, Screen } from "@/components/arcade/shell";
import { GameCardList } from "@/components/arcade/ui";
import { useGames } from "@/hooks/useGames";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THE ARCADE — Smart Arcade & Game Discovery" },
      {
        name: "description",
        content:
          "Discover games, skip the line with virtual queues, track scores, and climb the leaderboard at THE ARCADE.",
      },
      { property: "og:title", content: "THE ARCADE" },
      {
        property: "og:description",
        content: "Smart arcade management and gamification app.",
      },
    ],
  }),
  component: Home,
});

const quickActions = [
  { to: "/map", label: "Map View", icon: MapPin },
  { to: "/favourites", label: "Favourites", icon: Heart },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/family", label: "Family Mode", icon: Users },
] as const;

function Home() {
  const { data: games = [], isLoading } = useGames();
  const user = useAuthStore(state => state.user) || { displayName: 'Guest', level: 1 };
  
  const { data: dailyBest } = useQuery({
    queryKey: ['daily-best'],
    queryFn: async () => {
      // api interceptor returns response.data, so result = { success, data: {...} }
      const result = await api.get<{ data: { value: number; playerName: string; gameTitle: string } | null }>('/scores/daily-best');
      return (result as any).data as { value: number; playerName: string; gameTitle: string } | null;
    },
    refetchInterval: 30000,
  });

  // Just show first 3 games as popular for now
  const popular = games.slice(0, 3);
  
  return (
    <AppShell>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-nebula" />
        <Screen className="relative pt-8">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="font-display text-3xl tracking-tight">THE ARCADE</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hi {user.displayName} · Level {user.level}
          </p>

          <Link
            to="/discover"
            className="mt-5 flex items-center gap-3 rounded-full bg-foreground px-5 py-3.5 text-background"
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium text-background/60">
              Search for games...
            </span>
          </Link>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-start gap-3 rounded-2xl bg-card p-4 shadow-card hover:bg-accent/50 transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            ))}
          </div>



          <div className="mb-3 mt-2 flex items-center justify-between">
            <h2 className="font-sans text-lg font-bold">Popular Games</h2>
            <Link to="/discover" className="text-sm font-medium text-primary">
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-24 bg-muted rounded-xl w-full"></div>
                <div className="h-24 bg-muted rounded-xl w-full"></div>
              </div>
            ) : (
              popular.map((g) => (
                <GameCardList key={g.id} game={g as any} />
              ))
            )}
          </div>
        </Screen>
      </div>
    </AppShell>
  );
}

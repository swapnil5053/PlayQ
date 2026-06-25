import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { GameCardList } from "@/components/arcade/ui";
import { games } from "@/lib/arcade-data";
import { useGames } from "@/hooks/useGames";

export const Route = createFileRoute("/favourites")({
  head: () => ({ meta: [{ title: "Favourites — THE ARCADE" }] }),
  component: Favourites,
});

function Favourites() {
  const { data: games = [], isLoading } = useGames();
  const favs = games.filter((g) => g.rating >= 4.5);
  return (
    <AppShell>
      <PageHeader title="Favourites" />
      <Screen className="pt-2">
        {isLoading ? (
          <div className="animate-pulse space-y-4 mt-4">
             <div className="h-24 bg-muted rounded-xl w-full"></div>
             <div className="h-24 bg-muted rounded-xl w-full"></div>
          </div>
        ) : favs.length === 0 ? (
          <p className="mt-20 text-center text-sm text-muted-foreground">
            No favourites yet — tap the heart on a game to save it.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {favs.map((g) => (
              <GameCardList key={g.id} game={g as any} />
            ))}
          </div>
        )}
      </Screen>
    </AppShell>
  );
}

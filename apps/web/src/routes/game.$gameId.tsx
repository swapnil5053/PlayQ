import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import {
  GameThumb,
  Rating,
  WaitBadge,
  Tag,
  LiveIndicator,
  Button,
} from "@/components/arcade/ui";
import { useGame } from "@/hooks/useGames";
import { useQueue } from "@/hooks/useQueue";

import { Heart, Bookmark } from "lucide-react";

export const Route = createFileRoute("/game/$gameId")({
  head: () => ({
    meta: [{ title: "Game Details — THE ARCADE" }],
  }),
  component: GameDetail,
  errorComponent: () => <div className="p-6 text-center">Game not found.</div>,
  notFoundComponent: () => <div className="p-6 text-center">Game not found.</div>,
});

function GameDetail() {
  const { gameId } = useParams({ from: "/game/$gameId" });
  const { data: game, isLoading } = useGame(gameId);
  const { data: queue } = useQueue(gameId); // live queue data

  if (isLoading) {
    return (
      <AppShell>
        <PageHeader title="Game Details" back="/discover" />
        <Screen>
          <div className="animate-pulse space-y-4">
            <div className="h-60 bg-muted rounded-2xl w-full"></div>
            <div className="h-40 bg-muted rounded-3xl w-full"></div>
          </div>
        </Screen>
      </AppShell>
    );
  }

  if (!game) return <div className="p-6 text-center">Game not found.</div>;

  return (
    <AppShell>
      <PageHeader title="Game Details" back="/discover" />
      <div className="relative">
        <GameThumb game={game as any} className="h-60 w-full" />
      </div>
      <Screen className="-mt-6 relative z-10">
        <div className="rounded-[24px] bg-card p-5 shadow-card pb-6">
          <div className="mb-4 flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors cursor-pointer text-foreground hover:bg-background/80">
              <Heart className="h-3.5 w-3.5" />
            </button>
            <Tag>{game.difficulty}</Tag>
            <Tag>{game.category?.name || 'Arcade'}</Tag>
            <button className="flex h-8 w-8 ml-auto items-center justify-center rounded-full bg-background transition-colors cursor-pointer text-foreground hover:bg-background/80">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mb-2 flex items-center gap-3">
            <Rating value={game.rating} />
            <WaitBadge minutes={game.estimatedWaitMin} crowd={game.crowdLevel} />
          </div>

          <h1 className="font-display text-[22px] font-bold">{game.title}</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {game.description}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link to="/queue/$gameId" params={{ gameId: game.id }}>
              <Button>Join Queue</Button>
            </Link>
            <Link to="/leaderboard" search={{ game: game.id }}>
              <Button variant="secondary">View Scores</Button>
            </Link>
          </div>
        </div>
      </Screen>
    </AppShell>
  );
}



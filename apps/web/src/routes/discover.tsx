import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal, Check, Search } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { GameCardLarge } from "@/components/arcade/ui";
import { useGames } from "@/hooks/useGames";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Games — THE ARCADE" },
      {
        name: "description",
        content: "Browse and filter arcade games by wait time, crowd level, and popularity.",
      },
    ],
  }),
  component: Discover,
});

type Filter = "all" | "low" | "popular" | "high";
const filterMeta: { id: Filter; label: string }[] = [
  { id: "all", label: "All games" },
  { id: "low", label: "Low wait time" },
  { id: "popular", label: "Popular games" },
  { id: "high", label: "High wait time" },
];

function Discover() {
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: games = [], isLoading } = useGames();

  const list = games.filter((g) => {
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === "low") return g.crowdLevel === "LOW";
    if (filter === "high") return g.crowdLevel === "HIGH";
    if (filter === "popular") return g.rating >= 4.5;
    return true;
  });

  return (
    <AppShell>
      <PageHeader title="Discover" />
      <Screen>
        <div className="relative mb-4 flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="shrink-0 rounded-full bg-primary/20 px-5 py-2.5 text-sm font-semibold text-primary">
            Filter
          </div>
          {filterMeta.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.id === "popular" ? "Pop" : f.id === "all" ? "All" : f.label}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            autoFocus
            className="w-full rounded-full bg-foreground px-5 py-3.5 pl-11 text-sm font-medium text-background outline-none placeholder:text-background/60"
            placeholder="Search for games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <p className="mb-3 text-sm text-muted-foreground">
          {list.length} game{list.length !== 1 ? "s" : ""} · {filterMeta.find((f) => f.id === filter)?.label}
        </p>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded-3xl w-full animate-pulse"></div>
              <div className="h-40 bg-muted rounded-3xl w-full animate-pulse"></div>
            </div>
          ) : (
            list.map((g) => (
              <GameCardLarge key={g.id} game={g as any} />
            ))
          )}
        </div>
      </Screen>
    </AppShell>
  );
}

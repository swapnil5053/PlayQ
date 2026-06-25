import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button, GameCardList } from "@/components/arcade/ui";
import { useGames } from "@/hooks/useGames";

export const Route = createFileRoute("/high-score")({
  head: () => ({ meta: [{ title: "Today's High Score — THE ARCADE" }] }),
  component: HighScore,
});

function HighScore() {
  const { data: games = [] } = useGames();
  const popular = games.slice(0, 3);

  return (
    <AppShell>
      <div className="sticky top-0 z-20 bg-background px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/account"
            className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-5 w-5"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h2 className="text-[17px] font-semibold">Hello, Player</h2>
            <p className="text-[12px] text-muted-foreground">Welcome back to the arcade</p>
          </div>
        </div>
      </div>
      
      <Screen className="pt-4">
        
        <h3 className="font-display text-[22px] font-bold mb-4">Today's High Score</h3>
        
        <div className="bg-primary rounded-[32px] overflow-hidden shadow-glow mb-8">
          <div className="h-40 w-full bg-black/20">
            <img 
              src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800" 
              alt="Game" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="p-6">
            <h4 className="font-display text-[22px] font-bold text-white mb-1">Dragon Strike VR</h4>
            <p className="font-display text-[48px] font-bold text-white mb-6">5,890</p>
            <Button className="bg-white !text-primary hover:bg-white/90 font-bold">Compete Now</Button>
          </div>
        </div>

        <h3 className="font-sans text-[17px] font-bold mb-4">More Games</h3>
        <div className="flex flex-col gap-3 pb-8">
          {popular.map((g) => (
            <GameCardList key={g.id} game={g as any} />
          ))}
        </div>

      </Screen>
    </AppShell>
  );
}

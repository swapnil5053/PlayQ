import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { WaitBadge } from "@/components/arcade/ui";
import { useGames } from "@/hooks/useGames";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Arcade Map — THE ARCADE" }] }),
  component: MapView,
});

const positions = [
  { top: "18%", left: "20%" },
  { top: "30%", left: "62%" },
  { top: "48%", left: "35%" },
  { top: "58%", left: "75%" },
  { top: "72%", left: "25%" },
  { top: "80%", left: "58%" },
];

// --- Bouncing Ghost Component ---
function BouncingGhost() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 40, y: 40 });
  const velRef = useRef({ vx: 0.4, vy: 0.3 });
  const ghostRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const GHOST_SIZE = 36;

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current?.parentElement;
      if (!container || !ghostRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const W = container.clientWidth - GHOST_SIZE;
      const H = container.clientHeight - GHOST_SIZE;

      let { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx = Math.abs(vx); }
      if (x >= W) { x = W; vx = -Math.abs(vx); }
      if (y <= 0) { y = 0; vy = Math.abs(vy); }
      if (y >= H) { y = H; vy = -Math.abs(vy); }

      posRef.current = { x, y };
      velRef.current = { vx, vy };

      ghostRef.current.style.transform = `translate(${x}px, ${y}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10">
      <div
        ref={ghostRef}
        style={{ position: "absolute", top: 0, left: 0, willChange: "transform" }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 0 6px #00ff88)" }}>
          <path d="M12 2C6.48 2 2 6.48 2 12v9.5c0 .41.43.68.8.5L5 20.5l2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5.2.15c.37.18.8-.09.8-.5V12c0-5.52-4.48-10-10-10z" fill="#00ff88" opacity="0.9"/>
          <path d="M12 2C6.48 2 2 6.48 2 12v9.5c0 .41.43.68.8.5L5 20.5l2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5.2.15c.37.18.8-.09.8-.5V12c0-5.52-4.48-10-10-10z" fill="none" stroke="#00ff88" strokeWidth="0.5"/>
          <circle cx="9" cy="11" r="1.5" fill="#001a0a"/>
          <circle cx="15" cy="11" r="1.5" fill="#001a0a"/>
          <circle cx="9.5" cy="10.5" r="0.6" fill="white"/>
          <circle cx="15.5" cy="10.5" r="0.6" fill="white"/>
        </svg>
      </div>
    </div>
  );
}

function MapView() {
  const { data: games = [] } = useGames();

  return (
    <AppShell>
      <PageHeader title="Arcade Map" />
      <Screen className="pt-2">
        <div
          className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border"
          style={{
            background: "oklch(0.08 0.03 285)",
            backgroundImage: `
              linear-gradient(oklch(0.28 0.08 285 / 0.6) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.28 0.08 285 / 0.6) 1px, transparent 1px),
              linear-gradient(oklch(0.2 0.05 285 / 0.25) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.2 0.05 285 / 0.25) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
          }}
        >
          {/* Radial nebula glow in center */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.35 0.25 300 / 0.2), transparent 70%)" }} />

          {/* Bouncing Ghost */}
          <BouncingGhost />

          {/* Game Map Pins */}
          {games.map((g, i) => (
            <Link
              key={g.id}
              to="/game/$gameId"
              params={{ gameId: g.id }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center animate-in fade-in zoom-in z-20"
              style={positions[i % positions.length]}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg text-white ${
                  g.crowdLevel === "LOW" || g.crowdLevel === "low"
                    ? "bg-success"
                    : g.crowdLevel === "MEDIUM" || g.crowdLevel === "medium"
                      ? "bg-warning"
                      : "bg-danger"
                }`}
                style={{ boxShadow: g.crowdLevel === "LOW" || g.crowdLevel === "low" ? "0 0 12px oklch(0.78 0.18 150 / 0.7)" : g.crowdLevel === "HIGH" || g.crowdLevel === "high" ? "0 0 12px oklch(0.65 0.24 25 / 0.7)" : "0 0 12px oklch(0.83 0.16 85 / 0.7)" }}
              >
                <MapPin className="h-5 w-5" />
              </span>
              <span className="mt-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm border border-border">
                {g.title.split(' ')[0]}
              </span>
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary-glow">
                {g.estimatedWaitMin}m
              </span>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_8px_oklch(0.62_0.19_148)]" /> Low wait
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-warning shadow-[0_0_8px_oklch(0.7_0.18_70)]" /> Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger shadow-[0_0_8px_oklch(0.6_0.2_25)]" /> Busy
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} /> Ghost
          </span>
        </div>

        <h3 className="mb-3 mt-6 font-sans text-base font-bold">All locations</h3>
        <div className="flex flex-col gap-2">
          {games.map((g) => (
            <Link
              key={g.id}
              to="/game/$gameId"
              params={{ gameId: g.id }}
              className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-card hover:bg-primary/10 hover:border-primary border border-transparent transition-all"
            >
              <span className="font-medium">{g.title}</span>
              <WaitBadge minutes={g.estimatedWaitMin} crowd={g.crowdLevel as any} />
            </Link>
          ))}
        </div>
      </Screen>
    </AppShell>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@tanstack/react-router";
import { Star, Clock, Heart, Bookmark } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Game, CrowdLevel } from "@/lib/arcade-data";

/* ---------- Button ---------- */
const buttonVariants = cva(
  "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-glow",
        secondary: "bg-foreground text-background hover:opacity-90",
        danger: "bg-danger text-danger-foreground",
        menu: "justify-start bg-foreground px-5 text-background hover:opacity-90",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

interface BtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function Button({ variant, className = "", children, ...props }: BtnProps) {
  return (
    <button className={`${buttonVariants({ variant })} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ---------- Badges ---------- */
const crowdStyles: Record<CrowdLevel, string> = {
  low: "bg-success/15 text-success",
  medium: "bg-warning/15 text-warning",
  high: "bg-danger/15 text-danger",
};

export function WaitBadge({ minutes, crowd }: { minutes: number; crowd: CrowdLevel }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${crowdStyles[crowd]}`}
    >
      <Clock className="h-3 w-3" />
      {minutes} min wait
    </span>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-1 text-xs font-semibold text-warning">
      <Star className="h-3 w-3 fill-current" />
      {value.toFixed(1)}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="inline-flex items-center rounded-full bg-success/90 px-3 py-1 text-xs font-bold text-background">
      Rank: #{rank}
    </span>
  );
}

export function LiveIndicator({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
      <span className="h-2 w-2 animate-live rounded-full bg-success" />
      {label}
    </span>
  );
}

/* ---------- Game thumbnails ---------- */
export function GameThumb({
  game,
  className = "",
}: {
  game: Game;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-muted ${className}`}
      style={!game.imageUrl ? {
        background: `linear-gradient(150deg, oklch(0.45 0.2 ${game.hue || 280}), oklch(0.18 0.08 ${game.hue || 280}))`,
      } : {}}
    >
      {game.imageUrl ? (
        <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-nebula opacity-70" />
          <span className="absolute bottom-2 left-3 font-display text-lg text-white/90 drop-shadow">
            {game.title
              ?.split(" ")
              .map((w) => w[0])
              .join("") || "G"}
          </span>
        </>
      )}
    </div>
  );
}

export function GameCardList({ game }: { game: any }) {
  return (
    <Link
      to="/game/$gameId"
      params={{ gameId: game.id }}
      className="flex items-center gap-4 rounded-[20px] bg-card p-3.5 shadow-card hover:bg-card/80 transition-colors"
    >
      <GameThumb game={game} className="h-[88px] w-[88px] shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-[17px] font-bold">{game.title}</h3>
        <div className="mt-1 flex items-center gap-3">
          <Rating value={game.rating} />
          <WaitBadge minutes={game.estimatedWaitMin || 0} crowd={(game.crowdLevel as any) || "low"} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Tag>{(game.tags?.[0] || "Hard").toUpperCase()}</Tag>
          <Tag>{(typeof game.category === "string" ? game.category : game.category?.name || "Action").toUpperCase()}</Tag>
        </div>
      </div>
    </Link>
  );
}

export function GameCardLarge({ game }: { game: any }) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-card shadow-card group pb-4">
      <GameThumb game={game} className="h-48 w-full object-cover" />
      <div className="px-4 pt-3">
        {/* Actions row below image */}
        <div className="mb-3 flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors cursor-pointer text-foreground hover:bg-background/80">
            <Heart className="h-3.5 w-3.5" />
          </button>
          
          <Tag>{(game.tags?.[0] || "Hard").toUpperCase()}</Tag>
          <Tag>{(typeof game.category === "string" ? game.category : game.category?.name || "Action").toUpperCase()}</Tag>
          
          <button className="flex h-8 w-8 ml-auto items-center justify-center rounded-full bg-background transition-colors cursor-pointer text-foreground hover:bg-background/80">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mb-2 flex items-center gap-3">
          <Rating value={game.rating} />
          <WaitBadge minutes={game.estimatedWaitMin || 0} crowd={(game.crowdLevel as any) || "low"} />
        </div>
        
        <h3 className="font-display text-xl font-bold">{game.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {game.description}
        </p>
        
        <Link
          to="/game/$gameId"
          params={{ gameId: game.id }}
          className="mt-4 flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-all active:scale-[0.98]"
        >
          View Game Details
        </Link>
      </div>
    </div>
  );
}

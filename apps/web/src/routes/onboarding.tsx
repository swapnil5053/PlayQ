import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Clock, Trophy } from "lucide-react";
import { AppShell } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — THE ARCADE" }] }),
  component: Onboarding,
});

const slides = [
  {
    icon: Compass,
    title: "Discover every game",
    text: "Browse the floor, filter by crowd and wait time, and find your next favourite.",
  },
  {
    icon: Clock,
    title: "Skip the line",
    text: "Join virtual queues and watch a live countdown until it's your turn to play.",
  },
  {
    icon: Trophy,
    title: "Compete & share",
    text: "Track your scores, climb leaderboards, and challenge friends to beat your best.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const Slide = slides[i].icon;
  const last = i === slides.length - 1;

  return (
    <AppShell withNav={false}>
      <div className="relative flex min-h-screen flex-col px-8 pb-10 pt-20">
        <div className="absolute inset-0 bg-gradient-nebula" />
        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-primary shadow-glow">
            <Slide className="h-12 w-12 text-primary-foreground" />
          </span>
          <h1 className="mt-8 font-display text-2xl">{slides[i].title}</h1>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{slides[i].text}</p>
        </div>

        <div className="relative">
          <div className="mb-6 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-6 bg-primary" : "w-2 bg-secondary"
                }`}
              />
            ))}
          </div>
          <Button
            onClick={() =>
              last ? navigate({ to: "/login" }) : setI((v) => v + 1)
            }
          >
            {last ? "Get Started" : "Next"}
          </Button>
          <Link
            to="/login"
            className="mt-4 block text-center text-sm text-muted-foreground"
          >
            Skip
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

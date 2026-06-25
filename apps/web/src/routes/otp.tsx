import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/otp")({
  head: () => ({ meta: [{ title: "Verify — THE ARCADE" }] }),
  component: Otp,
});

function Otp() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <AppShell withNav={false}>
      <div className="relative min-h-screen px-8 pt-24 text-center">
        <div className="absolute inset-0 bg-gradient-nebula" />
        <div className="relative">
          <h1 className="font-display text-3xl">Verify email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the 6-digit code we sent to your inbox.
          </p>

          <div className="mt-8 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => set(i, e.target.value)}
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 rounded-2xl bg-card text-center font-display text-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <div className="mt-8">
            <Button onClick={() => navigate({ to: "/" })}>Verify</Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn't get it? <span className="font-semibold text-primary">Resend</span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}

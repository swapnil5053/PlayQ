import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/family")({
  head: () => ({ meta: [{ title: "Family Mode — THE ARCADE" }] }),
  component: Family,
});

const members = [
  { id: "m1", name: "You", role: "Host" },
  { id: "m2", name: "Maya", role: "Member" },
  { id: "m3", name: "Leo", role: "Member" },
];

function Family() {
  const [selected, setSelected] = useState<string[]>(["m1", "m2"]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <AppShell>
      <PageHeader title="Family Mode" />
      <Screen className="pt-2">
        <p className="text-sm text-muted-foreground">
          Play together — share one queue and combine scores across your group.
        </p>

        <h3 className="mb-3 mt-5 font-sans text-base font-bold">Your group</h3>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => toggle(m.id)}
              className={`flex items-center gap-3 rounded-2xl p-3 text-left shadow-card ${
                selected.includes(m.id) ? "bg-gradient-card ring-1 ring-primary" : "bg-card"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-primary font-display text-primary-foreground">
                {m.name[0]}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  selected.includes(m.id)
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              />
            </button>
          ))}
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-secondary/40 py-3 text-sm font-medium">
          <UserPlus className="h-4 w-4" /> Invite member
        </button>

        <div className="mt-6">
          <Link to="/discover">
            <Button>Start shared session ({selected.length})</Button>
          </Link>
        </div>
      </Screen>
    </AppShell>
  );
}

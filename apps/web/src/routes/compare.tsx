import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare Scores — THE ARCADE" }] }),
  component: Compare,
});

function Compare() {
  const [open, setOpen] = useState(false);
  const [friend, setFriend] = useState("Alex Gaming");

  const friendsList = ["Alex Gaming", "Sarah Pro", "Mike123"];

  return (
    <AppShell>
      <PageHeader title="Compare Scores" back="/account" />
      <Screen className="pt-2 flex flex-col h-[calc(100vh-140px)]">
        <div className="relative mb-6">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between rounded-full bg-foreground px-5 py-3.5 text-[15px] font-semibold text-background outline-none focus:ring-2 focus:ring-primary"
          >
            <span>{friend}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          
          {open && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-[20px] border border-border bg-popover shadow-lg animate-in slide-in-from-top-2">
              {friendsList.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFriend(f);
                    setOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left text-[15px] transition-colors hover:bg-secondary ${
                    f === friend ? "bg-primary text-primary-foreground font-bold" : ""
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 bg-primary rounded-[32px] p-6 text-center shadow-glow">
              <p className="text-primary-foreground/80 font-medium text-[15px]">You</p>
              <p className="mt-2 font-display text-[32px] font-bold text-white">2,450</p>
            </div>
            <div className="flex-1 bg-primary rounded-[32px] p-6 text-center shadow-glow">
              <p className="text-primary-foreground/80 font-medium text-[15px]">{friend}</p>
              <p className="mt-2 font-display text-[32px] font-bold text-white">1,890</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-success text-success-foreground px-5 py-2.5 rounded-full font-bold text-[15px] shadow-sm">
              <ArrowUpRight className="h-5 w-5" />
              +560 Higher
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 pb-2">
          <Button>Challenge Again</Button>
        </div>
      </Screen>
    </AppShell>
  );
}

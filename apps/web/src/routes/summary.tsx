import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/summary")({
  head: () => ({ meta: [{ title: "Today's Summary — THE ARCADE" }] }),
  component: Summary,
});

function Summary() {
  return (
    <AppShell>
      <PageHeader title="Today's Summary" back="/account" />
      <Screen className="pt-4 flex flex-col h-[calc(100vh-140px)]">
        
        <div className="flex-1 flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between bg-primary rounded-full px-6 py-5 shadow-glow">
            <span className="text-[16px] font-medium text-primary-foreground/80">Total Games Played</span>
            <span className="font-display text-[22px] font-bold text-white">8</span>
          </div>

          <div className="flex items-center justify-between bg-primary rounded-full px-6 py-5 shadow-glow">
            <span className="text-[16px] font-medium text-primary-foreground/80">Best Score</span>
            <span className="font-display text-[22px] font-bold text-white">3,120</span>
          </div>

          <div className="flex items-center justify-between bg-primary rounded-full px-6 py-5 shadow-glow">
            <span className="text-[16px] font-medium text-primary-foreground/80">Total Time Spent</span>
            <span className="font-display text-[22px] font-bold text-white">2h</span>
          </div>

          <div className="mt-8 text-center px-4">
            <p className="text-[16px] leading-relaxed text-foreground">
              Great session today! You're improving steadily across action titles. Keep it up!
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6 pb-2">
          <Button>Plan Next Visit</Button>
        </div>
      </Screen>
    </AppShell>
  );
}

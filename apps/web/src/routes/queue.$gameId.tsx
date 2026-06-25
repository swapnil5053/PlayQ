import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button, LiveIndicator } from "@/components/arcade/ui";
import { useQueue, useLeaveQueue } from "@/hooks/useQueue";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/queue/$gameId")({
  head: () => ({ meta: [{ title: "Queue Status — THE ARCADE" }] }),
  component: QueueStatus,
});

function QueueStatus() {
  const { gameId } = useParams({ from: "/queue/$gameId" });
  const { data: queue, isLoading } = useQueue(gameId);
  const leaveQueue = useLeaveQueue();
  const user = useAuthStore(state => state.user);
  
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  // We simulate seconds here for the UI based on position * avgTurnMinutes, 
  // but position and queue state come from the server.
  const myPositionObj = queue?.positions.find(p => p.userId === user?.id);
  const position = myPositionObj ? myPositionObj.position : (queue?.currentLength || 0);
  const [seconds, setSeconds] = useState(0);
  const [lastPos, setLastPos] = useState(0);

  useEffect(() => {
    if (position !== lastPos && position > 0) {
      setSeconds(position * (queue?.avgTurnMinutes || 5) * 60);
      setLastPos(position);
    }
  }, [position, queue?.avgTurnMinutes, lastPos]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleLeave = async () => {
    await leaveQueue.mutateAsync(gameId);
    navigate({ to: "/" });
  };

  if (isLoading || !queue) {
    return (
      <AppShell>
        <PageHeader title="Queue Status" back="/game/$gameId" />
        <Screen className="pt-2">
           <div className="animate-pulse h-64 bg-muted rounded-3xl w-full"></div>
        </Screen>
      </AppShell>
    );
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = Math.min(100, ((queue.maxCapacity - position + 1) / queue.maxCapacity) * 100);

  return (
    <AppShell>
      <PageHeader title="Queue Status" back="/game/$gameId" />
      <Screen className="pt-2">
        <div className="rounded-3xl bg-gradient-card p-6 text-center shadow-card relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-50 pulse-bg"></div>
          <div className="relative z-10 py-4">
            <p className="font-display text-[72px] font-bold tracking-tight transition-all text-white">
              {mm}:{ss}
            </p>
            <p className="mt-2 text-[15px] text-muted-foreground">Time Remaining</p>

            <div className="mt-8 mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2">
              <span className="text-[15px] font-medium text-primary-foreground/80">Position -</span>
              <span className="font-sans text-[15px] font-bold text-white">
                {position}/{queue.maxCapacity}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-[14px] text-muted-foreground">
                Estimated wait time
              </p>
              <p className="text-[14px] text-muted-foreground mt-1">
                - {Math.ceil(seconds / 60)} minutes
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {position === 1 ? (
            <Button onClick={() => navigate({ to: "/complete", search: { game: gameId } })} className="animate-in slide-in-from-bottom-2 duration-300">
              It's your turn — Start Game
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setConfirm(true)}>
            Leave Queue
          </Button>
        </div>
      </Screen>

      {confirm && (
        <div className="absolute inset-0 z-40 flex items-end bg-background/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full rounded-t-3xl border-t border-border bg-popover p-6 animate-in slide-in-from-bottom-5 duration-300">
            <h3 className="font-sans text-lg font-bold">Leave the queue?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll lose your spot (Position {position}/{queue.maxCapacity}) and need to rejoin from the
              back of the line.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button variant="danger" onClick={handleLeave}>Yes, leave queue</Button>
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Stay in queue
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

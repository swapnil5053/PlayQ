import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/arcade/shell";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/splash")({
  head: () => ({ meta: [{ title: "THE ARCADE" }] }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate({ to: "/" });
      } else {
        navigate({ to: "/login" });
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <AppShell withNav={false}>
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="border-[3px] border-primary px-4 py-2 flex flex-col font-display text-4xl leading-none text-primary shadow-[0_0_25px_rgba(138,43,226,0.4)]">
          <span className="tracking-widest">THE:</span>
          <span className="tracking-widest">ARCADE</span>
        </div>
      </div>
    </AppShell>
  );
}

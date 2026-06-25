import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Copy, MessageCircle } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
import { Button } from "@/components/arcade/ui";

export const Route = createFileRoute("/share")({
  head: () => ({ meta: [{ title: "Share Scores — THE ARCADE" }] }),
  component: Share,
});

function Share() {
  return (
    <AppShell>
      <PageHeader title="Share Scores" back="/account" />
      <Screen className="pt-2 flex flex-col h-[calc(100vh-140px)]">
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-primary rounded-[32px] p-8 text-center shadow-glow mb-10">
            <p className="text-primary-foreground/80 font-medium text-[16px] mb-2">Neon Racer</p>
            <p className="font-display text-[48px] font-bold text-white tracking-tight">2,450</p>
          </div>

          <div className="text-center mb-6">
            <p className="font-medium text-[15px] mb-4">Share Via</p>
            <div className="flex justify-center gap-4">
              <button className="flex flex-col items-center justify-center gap-2 h-20 w-20 bg-card rounded-[20px] shadow-sm hover:bg-card/80 transition-colors">
                <MessageCircle className="h-6 w-6 text-foreground" />
                <span className="text-[11px] font-semibold">WhatsApp</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 h-20 w-20 bg-card rounded-[20px] shadow-sm hover:bg-card/80 transition-colors">
                <QrCode className="h-6 w-6 text-foreground" />
                <span className="text-[11px] font-semibold">QR Code</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 h-20 w-20 bg-card rounded-[20px] shadow-sm hover:bg-card/80 transition-colors">
                <Copy className="h-6 w-6 text-foreground" />
                <span className="text-[11px] font-semibold">Copy Link</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 pb-2">
          <Button>Share Now</Button>
        </div>
      </Screen>
    </AppShell>
  );
}

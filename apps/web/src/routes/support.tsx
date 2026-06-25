import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronDown, Mail } from "lucide-react";
import { AppShell, PageHeader, Screen } from "@/components/arcade/shell";
const faqs = [
  { q: "How does the queue system work?", a: "When you join a queue, you'll receive an estimated wait time. We'll notify you when it's your turn. You have 2 minutes to scan the machine's QR code to start playing." },
  { q: "What happens if I miss my turn?", a: "If you don't scan the QR code within 2 minutes of your turn, your spot will be given to the next person. You'll need to rejoin the queue." },
  { q: "Can I queue for multiple games?", a: "You can only be in one queue at a time to ensure fair access for all players." },
  { q: "How are scores tracked?", a: "Scores are automatically synced when you play while logged in. They contribute to your global ranking and daily leaderboards." }
];
export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — THE ARCADE" }] }),
  component: Support,
});

function Support() {
  const [open, setOpen] = useState<number | null>(0);
  const [q, setQ] = useState("");
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const list = faqs.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()));

  const handleChat = async () => {
    if (!q) return;
    const msg = q;
    setMessages(prev => [...prev, {role: 'user', text: msg}]);
    setQ("");
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:4000/api/v1/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      const json = await res.json();
      setMessages(prev => [...prev, {role: 'bot', text: json.data?.reply || "Error reaching bot."}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'bot', text: "Connection failed."}]);
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <PageHeader title="Support" />
      <Screen className="pt-2">
        <div className="flex flex-col gap-3 mb-6 max-h-[300px] overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-accent" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-300">
                Hi! I'm the Virtual Concierge. Ask me anything!
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground self-end ml-10 rounded-br-none' : 'bg-card text-card-foreground shadow-card mr-10 rounded-bl-none'}`}>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="p-3 rounded-2xl text-sm bg-card text-card-foreground shadow-card mr-10 rounded-bl-none animate-pulse">
              Typing...
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask the assistant..."
            className="w-full bg-transparent text-sm text-background placeholder:text-background/50 focus:outline-none"
          />
          <button onClick={handleChat} className="bg-primary text-primary-foreground p-2 rounded-full shadow-glow">
            <Mail className="h-4 w-4" />
          </button>
        </div>

        <h3 className="mb-3 mt-8 font-sans text-base font-bold">FAQs</h3>
        <div className="flex flex-col gap-2">
          {list.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-card shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold"
              >
                {f.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </Screen>
    </AppShell>
  );
}

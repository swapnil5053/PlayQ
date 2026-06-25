import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, Compass, MapPin, User, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({
  children,
  withNav = true,
}: {
  children: ReactNode;
  withNav?: boolean;
}) {
  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[440px] min-h-screen bg-background overflow-hidden">
        <div className={withNav ? "pb-24" : ""}>{children}</div>
        {withNav && <BottomNav />}
      </div>
    </div>
  );
}

export function Screen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-5 ${className}`}>{children}</div>;
}

export function PageHeader({
  title,
  right,
}: {
  title?: string;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-background px-5 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {title && (
          <h2 className="text-[17px] font-semibold">{title}</h2>
        )}
      </div>
      <div className="flex items-center justify-center">{right}</div>
    </div>
  );
}

import { Home } from "lucide-react"; // I need to import Home

const navItems = [
  { to: "/", label: "Home", icon: Home, match: ["/"] },
  { to: "/map", label: "Map", icon: MapPin, match: ["/map"] },
  { to: "/discover", label: "Discover", icon: Compass, match: ["/discover"] },
  { to: "/account", label: "Account", icon: User, match: ["/account"] },
  { to: "/support", label: "Support", icon: HelpCircle, match: ["/support"] },
];

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 mx-auto flex h-16 max-w-[440px] items-center justify-around border-t border-border bg-background/95 backdrop-blur-md">
      {navItems.map(({ to, label, icon: Icon, match }) => {
        const active = match.includes(pathname);
        return (
          <Link
            key={label}
            to={to}
            className={`flex flex-col items-center gap-1 text-xs ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

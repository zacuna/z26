"use client";

import { useCallback, useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
import { SideNav, type NavItem } from "./side-nav";
import { cn } from "@/lib/utils";

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "play", label: "Play", href: "/play" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const MOBILE_BREAKPOINT = 768;

export interface AppShellProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  className?: string;
}

export function AppShell({
  children,
  navItems = DEFAULT_NAV_ITEMS,
  className,
}: AppShellProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const onMenuToggle = useCallback(() => {
    if (isMobile) {
      setMobileNavOpen((prev) => !prev);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  }, [isMobile]);

  return (
    <div className={cn("min-h-full bg-background", className)}>
      <SiteHeader onMenuToggle={onMenuToggle} />
      <SideNav
        items={navItems}
        expanded={sidebarExpanded}
        mobileOpen={mobileNavOpen}
        onMobileOpenChange={setMobileNavOpen}
      />
      <main
        className={cn(
          "min-h-screen pt-header transition-[margin-left] duration-200 ease-in-out",
          "md:ml-sidebar-collapsed",
          sidebarExpanded && "md:ml-sidebar-expanded"
        )}
      >
        {children}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  Gamepad2,
  User,
  Mail,
} from "lucide-react";
import { SiteHeader } from "./site-header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "work", label: "Work", href: "/work", icon: Briefcase },
  { id: "play", label: "Play", href: "/play", icon: Gamepad2 },
  { id: "about", label: "About", href: "/about", icon: User },
  { id: "contact", label: "Contact", href: "/contact", icon: Mail },
] as const;

export interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "250px",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex min-h-svh w-full flex-col bg-background",
          className
        )}
      >
        <SiteHeader />
        <div className="flex flex-1 pt-14 min-w-0">
          <Sidebar
            collapsible="icon"
            className="!top-14 !h-[calc(100vh-3.5rem)] !border-r !border-sidebar-border"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                        >
                          <Link
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <Icon className="size-4 shrink-0" aria-hidden />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="min-w-0">
            <main className="min-h-[calc(100vh-3.5rem)] flex-1">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
}

export interface SideNavProps {
  items: NavItem[];
  expanded: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  className?: string;
}

function NavLinks({
  items,
  currentPathname,
  collapsed,
  className,
}: {
  items: NavItem[];
  currentPathname: string;
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <nav
      className={cn("flex flex-col gap-1", className)}
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const isActive =
          currentPathname === item.href ||
          (item.href !== "/" && currentPathname.startsWith(item.href));
        return (
          <Link
            key={item.id}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
            aria-label={collapsed ? item.label : undefined}
          >
            {item.icon ? (
              <span className="flex size-5 shrink-0 items-center justify-center [&>svg]:size-5" aria-hidden>
                {item.icon}
              </span>
            ) : collapsed ? (
              <span className="flex size-5 shrink-0 items-center justify-center text-xs font-semibold" aria-hidden>
                {item.label.charAt(0)}
              </span>
            ) : null}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function SideNav({
  items,
  expanded,
  mobileOpen,
  onMobileOpenChange,
  className,
}: SideNavProps) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onMobileOpenChange(false);
    }
  }, [pathname, onMobileOpenChange]);

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-[var(--layout-header-height)] z-sidebar hidden h-[calc(100vh-var(--layout-header-height))] border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out md:block",
          expanded ? "w-sidebar-expanded min-w-sidebar-expanded" : "w-sidebar-collapsed min-w-sidebar-collapsed",
          className
        )}
        aria-label="Side navigation"
      >
        <div className="flex h-full flex-col overflow-hidden p-2">
          <NavLinks
            items={items}
            currentPathname={pathname}
            collapsed={!expanded}
          />
        </div>
      </aside>

      {/* Mobile: Sheet overlay */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="w-sidebar-expanded max-w-sidebar-expanded border-sidebar-border bg-sidebar p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="border-b border-sidebar-border p-4 text-left">
            <SheetTitle className="text-sidebar-foreground">Menu</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <NavLinks items={items} currentPathname={pathname} collapsed={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

import { Link, useLocation } from "wouter";
import { LayoutDashboard, Inbox, FolderKanban, Library, Archive, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Kotak Masuk", href: "/inbox", icon: Inbox },
  { label: "Proyek", href: "/projects", icon: FolderKanban },
  { label: "Sumber Daya", href: "/resources", icon: Library },
  { label: "Arsip", href: "/archive", icon: Archive },
];

export function Sidebar() {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-semibold tracking-tight text-sidebar-foreground">
          Mind<span className="text-sidebar-primary drop-shadow-[0_0_8px_rgba(249,168,37,0.5)]">Vault</span>
        </h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                  location === item.href 
                    ? "bg-sidebar-accent text-sidebar-primary shadow-[inset_2px_0_0_0_hsl(var(--sidebar-primary))]" 
                    : "text-sidebar-foreground/70"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-sidebar-border">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </div>
    </>
  );
}

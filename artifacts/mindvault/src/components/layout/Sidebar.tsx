import { Link, useLocation } from "wouter";
import { LayoutDashboard, Inbox, FolderKanban, Library, Archive, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Kotak Masuk", href: "/inbox", icon: Inbox },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Resources", href: "/resources", icon: Library },
  { label: "Archive", href: "/archive", icon: Archive },
];

function NavContent({ collapsed = false, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const [location] = useLocation();

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className={cn(
        "flex h-16 shrink-0 items-center border-b border-sidebar-border/40",
        collapsed ? "px-4 justify-center" : "px-6"
      )}>
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.span
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold text-sidebar-primary drop-shadow-[0_0_10px_rgba(249,168,37,0.6)]"
            >
              M
            </motion.span>
          ) : (
            <motion.h1
              key="full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-xl font-semibold tracking-tight text-sidebar-foreground whitespace-nowrap"
            >
              Mind<span className="text-sidebar-primary drop-shadow-[0_0_10px_rgba(249,168,37,0.5)]">Vault</span>
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-auto py-5">
        <nav className={cn("grid gap-0.5", collapsed ? "px-2" : "px-3")}>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors relative group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active amber left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-sidebar-primary rounded-r-full shadow-[0_0_8px_rgba(249,168,37,0.8)]"
                    />
                  )}
                  <item.icon className={cn(
                    "shrink-0 transition-colors",
                    collapsed ? "h-5 w-5" : "h-4 w-4",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                  )} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-card border border-border rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer hint */}
      {!collapsed && (
        <div className="px-4 pb-5">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-primary font-medium">MindVault</span> — ruang pikir pribadimu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("mv_sidebar_collapsed") === "true"; }
    catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem("mv_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <>
      {/* Mobile hamburger */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="md:hidden fixed top-4 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground transition-colors shadow-lg"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-sidebar-border bg-sidebar">
          <NavContent onClose={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="hidden md:flex h-screen flex-col fixed inset-y-0 z-30 overflow-hidden"
      >
        <NavContent collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          data-testid="button-toggle-sidebar"
          className={cn(
            "absolute bottom-5 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all shadow-lg z-10",
            collapsed ? "right-4" : "right-4"
          )}
        >
          {collapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />
          }
        </button>
      </motion.div>

      {/* Spacer so main content shifts with sidebar */}
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="hidden md:block shrink-0 h-screen"
      />
    </>
  );
}

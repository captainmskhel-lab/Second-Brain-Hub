import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, FolderKanban, Library, Inbox, Tag, X, ArrowRight,
  Stethoscope, Brain, Zap, Pill, Target, Music, Layers
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { searchItems, SearchResult, SearchResultType } from "@/lib/searchData";

const FILTERS: Array<{ label: string; value: SearchResultType | "Semua" }> = [
  { label: "Semua", value: "Semua" },
  { label: "Knowledge", value: "Knowledge" },
  { label: "Projects", value: "Project" },
  { label: "Resources", value: "Resource" },
  { label: "Inbox", value: "Inbox" },
];

const TYPE_ICONS: Record<SearchResultType, typeof Search> = {
  Knowledge: BookOpen,
  Project: FolderKanban,
  Resource: Library,
  Inbox: Inbox,
  Topic: Tag,
};

const TYPE_COLORS: Record<SearchResultType, string> = {
  Knowledge: "text-blue-400 bg-blue-500/10",
  Project: "text-amber-400 bg-amber-500/10",
  Resource: "text-emerald-400 bg-emerald-500/10",
  Inbox: "text-purple-400 bg-purple-500/10",
  Topic: "text-muted-foreground bg-muted",
};

const TYPE_LABELS: Record<SearchResultType, string> = {
  Knowledge: "Knowledge",
  Project: "Project",
  Resource: "Resource",
  Inbox: "Inbox",
  Topic: "Topic",
};

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-primary rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface SmartSearchProps {
  className?: string;
}

export function SmartSearch({ className }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchResultType | "Semua">("Semua");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [, setLocation] = useLocation();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchItems(query, filter), [query, filter]);

  useEffect(() => {
    setActiveIdx(-1);
  }, [query, filter]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    setLocation(result.href);
  }, [setLocation]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = isOpen && query.length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Input */}
      <div
        className={cn(
          "relative flex items-center rounded-full border transition-all duration-300",
          isOpen && query
            ? "border-primary/60 shadow-[0_0_0_3px_rgba(249,168,37,0.12),0_0_24px_rgba(249,168,37,0.15)] bg-card"
            : "border-border bg-card/80 hover:border-border/80",
        )}
      >
        <Search className={cn(
          "absolute left-4 h-5 w-5 transition-colors duration-200",
          isOpen && query ? "text-primary" : "text-muted-foreground"
        )} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari pengetahuan, catatan, project, atau topik..."
          className="w-full bg-transparent pl-12 pr-10 h-12 text-base text-foreground placeholder:text-muted-foreground outline-none rounded-full"
          data-testid="input-smart-search"
          autoComplete="off"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { setQuery(""); setIsOpen(false); inputRef.current?.focus(); }}
              className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-clear-search"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
            data-testid="search-dropdown"
          >
            {/* Filter chips */}
            <div className="flex gap-2 px-4 pt-3 pb-2 border-b border-border/40 overflow-x-auto scrollbar-none">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  data-testid={`filter-search-${f.value}`}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                    filter === f.value
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(249,168,37,0.3)]"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Tidak ada hasil untuk <span className="text-foreground font-medium">"{query}"</span></p>
                <p className="text-xs text-muted-foreground/60 mt-1">Coba kata kunci yang berbeda</p>
              </div>
            ) : (
              <div className="py-2 max-h-[400px] overflow-y-auto">
                {results.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type];
                  const colorClass = TYPE_COLORS[result.type];
                  const isActive = idx === activeIdx;
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      data-testid={`search-result-${result.id}`}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left transition-all group",
                        isActive ? "bg-muted/60" : "hover:bg-muted/40"
                      )}
                    >
                      {/* Icon */}
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {highlightMatch(result.title, query)}
                          </p>
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                            colorClass
                          )}>
                            {TYPE_LABELS[result.type]}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {highlightMatch(result.subtitle, query)}
                        </p>
                        {result.snippet && (
                          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                            {result.snippet}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowRight className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-150",
                        isActive ? "text-primary translate-x-0" : "text-muted-foreground/30 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                      )} />
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="px-4 py-2 border-t border-border/40 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/50">
                  {results.length} hasil ditemukan
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40">
                  <span>↑↓ navigasi</span>
                  <span>↵ pilih</span>
                  <span>esc tutup</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

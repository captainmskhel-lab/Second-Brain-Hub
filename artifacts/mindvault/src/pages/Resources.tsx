import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Plus, FileText, X, Stethoscope, Brain, Zap, Pill, Target, Music,
  Tag, Clock, BookOpen, Link2, ChevronRight, Layers, ExternalLink,
  HardDrive, Trash2, Check, AlertCircle, Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface KnowledgeCard {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  updated: string;
  related: string[];
  highlights: string[];
  keyPoints: string[];
  linkedNotes: string[];
}

interface DriveLink {
  url: string;
  title: string;
  addedAt: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Stethoscope;
  color: string;
}

const categories: Category[] = [
  { id: "all", label: "Semua", icon: Layers, color: "text-foreground" },
  { id: "internal", label: "Internal Medicine", icon: Stethoscope, color: "text-blue-400" },
  { id: "psychiatry", label: "Psychiatry", icon: Brain, color: "text-purple-400" },
  { id: "emergency", label: "Emergency", icon: Zap, color: "text-red-400" },
  { id: "pharmacology", label: "Pharmacology", icon: Pill, color: "text-emerald-400" },
  { id: "productivity", label: "Productivity", icon: Target, color: "text-amber-400" },
  { id: "music", label: "Music & Worship", icon: Music, color: "text-pink-400" },
];

const DRIVE_LINKS_KEY = "mindvault_drive_links";

function useDriveLinks() {
  const [driveLinks, setDriveLinks] = useState<Record<string, DriveLink>>(() => {
    try {
      const stored = localStorage.getItem(DRIVE_LINKS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(DRIVE_LINKS_KEY, JSON.stringify(driveLinks));
  }, [driveLinks]);

  function saveLink(cardId: string, url: string, title: string) {
    setDriveLinks((prev) => ({
      ...prev,
      [cardId]: {
        url,
        title,
        addedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      },
    }));
  }

  function removeLink(cardId: string) {
    setDriveLinks((prev) => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
  }

  return { driveLinks, saveLink, removeLink };
}

function isValidDriveUrl(url: string): boolean {
  return url.includes("drive.google.com") || url.includes("docs.google.com");
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);
  const { driveLinks, saveLink, removeLink } = useDriveLinks();
  const [cards] = useLocalStorage<KnowledgeCard[]>("mindvault_cards", []);

  const filtered =
    activeCategory === "all" ? cards : cards.filter((c) => c.category === activeCategory);

  const activeCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-1">Perpustakaan pengetahuan pribadi</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(249,168,37,0.2)] self-start sm:self-auto"
          data-testid="button-add-resource"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Sumber
        </Button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat.id)}
              data-testid={`filter-${cat.id}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                isActive
                  ? `bg-card border-border/80 ${cat.color} shadow-[0_0_14px_rgba(0,0,0,0.3)]`
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/60"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Section heading */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <activeCat.icon className={cn("h-5 w-5", activeCat.color)} />
            <h2 className="text-lg font-medium">{activeCat.label}</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filtered.length} sumber
            </span>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 space-y-5 text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/6 border border-primary/12 flex items-center justify-center shadow-[0_0_24px_rgba(249,168,37,0.08)]">
                  <Library className="w-7 h-7 text-muted-foreground/60" />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-medium">Belum ada Knowledge Card</p>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Tambahkan pengetahuan pertamamu dan bangun perpustakaan pribadimu.
                </p>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_16px_rgba(249,168,37,0.2)]"
                data-testid="button-add-first-resource"
              >
                <Plus className="h-4 w-4" />
                Tambah Sumber Pertama
              </Button>
            </motion.div>
          )}

          {/* Cards grid */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((card, i) => (
                <KnowledgeCardItem
                  key={card.id}
                  card={card}
                  index={i}
                  categories={categories}
                  driveLink={driveLinks[card.id]}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Knowledge Detail Panel */}
      <AnimatePresence>
        {selectedCard && (
          <KnowledgeDetailView
            card={selectedCard}
            categories={categories}
            driveLink={driveLinks[selectedCard.id]}
            onSaveLink={(url, title) => saveLink(selectedCard.id, url, title)}
            onRemoveLink={() => removeLink(selectedCard.id)}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function KnowledgeCardItem({
  card,
  index,
  categories,
  driveLink,
  onClick,
}: {
  card: KnowledgeCard;
  index: number;
  categories: Category[];
  driveLink?: DriveLink;
  onClick: () => void;
}) {
  const cat = categories.find((c) => c.id === card.category);
  const Icon = cat?.icon ?? Stethoscope;

  function handlePdfClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (driveLink) window.open(driveLink.url, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      data-testid={`card-resource-${card.id}`}
      className="group cursor-pointer rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-border/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className={cn("h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current to-transparent", cat?.color)} />

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted/60", cat?.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{card.title}</h3>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-all group-hover:translate-x-0.5 shrink-0 mt-0.5" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{card.summary}</p>

        {card.highlights.length > 0 && (
          <div className="space-y-1.5">
            {card.highlights.slice(0, 2).map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                <span className="text-primary mt-0.5 shrink-0">—</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            {card.updated}
          </div>
          {driveLink ? (
            <button
              onClick={handlePdfClick}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              data-testid={`button-open-drive-${card.id}`}
            >
              <HardDrive className="h-3 w-3" />
              Buka PDF
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/40">
              <FileText className="h-3 w-3" />
              Belum ada PDF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KnowledgeDetailView({
  card,
  categories,
  driveLink,
  onSaveLink,
  onRemoveLink,
  onClose,
}: {
  card: KnowledgeCard;
  categories: Category[];
  driveLink?: DriveLink;
  onSaveLink: (url: string, title: string) => void;
  onRemoveLink: () => void;
  onClose: () => void;
}) {
  const cat = categories.find((c) => c.id === card.category);
  const Icon = cat?.icon ?? Stethoscope;

  const [linkInput, setLinkInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [urlError, setUrlError] = useState(false);

  function handleSave() {
    if (!isValidDriveUrl(linkInput)) { setUrlError(true); return; }
    onSaveLink(linkInput.trim(), titleInput.trim() || card.title + " — PDF");
    setLinkInput(""); setTitleInput(""); setShowLinkForm(false); setUrlError(false);
  }

  function handleCancel() {
    setLinkInput(""); setTitleInput(""); setShowLinkForm(false); setUrlError(false);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-background border-l border-border z-50 flex flex-col"
        data-testid="knowledge-detail-panel"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-muted", cat?.color)}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{card.title}</h2>
              <p className={cn("text-xs", cat?.color)}>{cat?.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="button-close-detail"
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted/60 text-muted-foreground font-normal gap-1">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </Badge>
            ))}
            <span className="flex items-center gap-1 text-xs text-muted-foreground/50 ml-auto">
              <Clock className="h-3 w-3" />
              {card.updated}
            </span>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">{card.summary}</p>

          {card.highlights.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">High-Yield Notes</h3>
              </div>
              <div className="space-y-2">
                {card.highlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3"
                  >
                    <span className="text-primary font-bold text-sm mt-0.5 shrink-0">•</span>
                    <p className="text-sm leading-relaxed">{h}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {card.keyPoints.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Key Points</h3>
              </div>
              <div className="space-y-2">
                {card.keyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className="text-xs text-muted-foreground/50 mt-0.5 tabular-nums shrink-0 w-4">{i + 1}.</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {card.related.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Topik Terkait</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {card.related.map((r) => (
                  <span key={r} className="px-3 py-1.5 rounded-full text-xs bg-muted/60 border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer">
                    {r}
                  </span>
                ))}
              </div>
            </section>
          )}

          {card.linkedNotes.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Catatan Terhubung</h3>
              </div>
              <div className="space-y-2">
                {card.linkedNotes.map((note) => (
                  <div key={note} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{note}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Drive PDF section */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Google Drive PDF</h3>
            </div>

            {driveLink ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-emerald-400">{driveLink.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Ditambahkan {driveLink.addedAt}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => window.open(driveLink.url, "_blank", "noopener,noreferrer")}
                      className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      data-testid="button-open-pdf-detail"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Buka
                    </button>
                    <button
                      onClick={onRemoveLink}
                      className="flex items-center gap-1.5 text-xs text-destructive/60 hover:text-destructive transition-colors"
                      data-testid="button-remove-pdf"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ) : showLinkForm ? (
              <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-3">
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={linkInput}
                  onChange={(e) => { setLinkInput(e.target.value); setUrlError(false); }}
                  className={cn(
                    "w-full bg-muted/40 border rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                    urlError ? "border-destructive focus:border-destructive" : "border-border/60 focus:border-primary"
                  )}
                  data-testid="input-drive-url"
                />
                {urlError && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    Masukkan URL Google Drive yang valid
                  </p>
                )}
                <input
                  type="text"
                  placeholder="Nama PDF (opsional)"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full bg-muted/40 border border-border/60 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  data-testid="input-drive-title"
                />
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={handleSave} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-save-pdf">
                    <Check className="h-3.5 w-3.5" />
                    Simpan Link
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} className="text-muted-foreground" data-testid="button-cancel-pdf">
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLinkForm(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 py-4 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                data-testid="button-add-pdf"
              >
                <HardDrive className="h-4 w-4" />
                Tautkan Google Drive PDF
              </button>
            )}
          </section>
        </div>
      </motion.div>
    </>
  );
}

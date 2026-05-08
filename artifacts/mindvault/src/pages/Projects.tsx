import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderKanban, FileText, ChevronRight, Minus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Project {
  id: string;
  title: string;
  notes: number;
  status: string;
  progress: number;
  description: string;
  color: string;
  bg: string;
}

const colorOptions = [
  { color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/15" },
  { color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/15" },
  { color: "text-purple-400", bg: "bg-purple-500/8 border-purple-500/15" },
  { color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/15" },
  { color: "text-pink-400", bg: "bg-pink-500/8 border-pink-500/15" },
  { color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/15" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useLocalStorage<Project[]>("mindvault_projects", []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  function updateProgress(id: string, delta: number) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, progress: Math.max(0, Math.min(100, p.progress + delta)) } : p
      )
    );
  }

  function addNote(id: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, notes: p.notes + 1 } : p))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Proyek aktif yang sedang dikerjakan</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(249,168,37,0.2)] gap-2"
          data-testid="button-new-project"
        >
          <Plus className="h-4 w-4" />
          Project Baru
        </Button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24 space-y-5 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/6 border border-primary/12 flex items-center justify-center shadow-[0_0_24px_rgba(249,168,37,0.08)]">
            <FolderOpen className="w-7 h-7 text-muted-foreground/60" />
          </div>
          <div className="space-y-1.5">
            <p className="text-base font-medium">Belum ada project aktif</p>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Buat project pertamamu dan mulai melacak progres pengetahuanmu.
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_16px_rgba(249,168,37,0.2)]"
            data-testid="button-new-project-empty"
          >
            <Plus className="h-4 w-4" />
            Buat Project Pertama
          </Button>
        </motion.div>
      )}

      {/* Summary stats — only when projects exist */}
      {projects.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Aktif", value: projects.length },
            { label: "Total Catatan", value: projects.reduce((a, p) => a + p.notes, 0) },
            {
              label: "Rata-rata Progres",
              value: Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) + "%",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 min-w-[100px] rounded-2xl border border-border/60 bg-card/60 px-4 py-3"
            >
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Project cards */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              whileHover={{ y: -3 }}
              className="group rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-border/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 overflow-hidden"
              data-testid={`card-project-${proj.id}`}
            >
              <div className={`h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current to-transparent ${proj.color}`} />

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${proj.bg} ${proj.color}`}>
                      <FolderKanban className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{proj.notes} catatan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-normal border text-xs">
                      {proj.status}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-all group-hover:translate-x-0.5" />
                  </div>
                </div>

                {proj.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{proj.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    <span>{proj.notes} catatan tersimpan</span>
                  </div>
                  <button
                    onClick={() => addNote(proj.id)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                    data-testid={`button-add-note-${proj.id}`}
                  >
                    <Plus className="h-3 w-3" />
                    tambah
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progres</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateProgress(proj.id, -5)}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                        data-testid={`button-progress-down-${proj.id}`}
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className={`font-semibold tabular-nums w-8 text-center ${proj.color}`}>
                        {proj.progress}%
                      </span>
                      <button
                        onClick={() => updateProgress(proj.id, 5)}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                        data-testid={`button-progress-up-${proj.id}`}
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${proj.color}`}
                      style={{ background: "currentColor" }}
                      initial={{ width: 0 }}
                      animate={{ width: mounted ? `${proj.progress}%` : 0 }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}

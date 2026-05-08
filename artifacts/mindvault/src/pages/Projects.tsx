import { motion } from "framer-motion";
import { Plus, FolderKanban, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const projects = [
  {
    title: "Internship Survival",
    notes: 8,
    status: "aktif",
    progress: 60,
    description: "Panduan bertahan dan berkembang selama masa internship klinis.",
    color: "text-blue-400",
    bg: "bg-blue-500/8 border-blue-500/15",
  },
  {
    title: "UKMPPD Preparation",
    notes: 23,
    status: "aktif",
    progress: 40,
    description: "Persiapan komprehensif ujian kompetensi dokter Indonesia.",
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/15",
  },
  {
    title: "Serimpi Depmus Hub",
    notes: 5,
    status: "aktif",
    progress: 30,
    description: "Pengembangan komunitas dan platform kolaborasi Serimpi.",
    color: "text-purple-400",
    bg: "bg-purple-500/8 border-purple-500/15",
  },
  {
    title: "Belajar Farmakologi",
    notes: 12,
    status: "aktif",
    progress: 45,
    description: "Rangkuman obat-obatan penting untuk koas dan UKMPPD.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/8 border-emerald-500/15",
  },
];

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

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

      {/* Summary row */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "Aktif", value: projects.length },
          { label: "Total Catatan", value: projects.reduce((a, p) => a + p.notes, 0) },
          { label: "Rata-rata Progres", value: Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) + "%" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 min-w-[100px] rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer rounded-2xl border border-border bg-card/70 backdrop-blur-sm hover:border-border/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 overflow-hidden"
            data-testid={`card-project-${i}`}
          >
            {/* Top accent */}
            <div className={`h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-current to-transparent ${proj.color}`} />

            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${proj.bg} ${proj.color}`}>
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-base transition-colors group-hover:${proj.color}`}>{proj.title}</h3>
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

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">{proj.description}</p>

              {/* Notes indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <FileText className="h-3 w-3" />
                <span>{proj.notes} catatan tersimpan</span>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progres</span>
                  <span className={`font-semibold ${proj.color}`}>{proj.progress}%</span>
                </div>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r from-current to-current ${proj.color}`}
                    style={{ boxShadow: `0 0 8px currentColor` }}
                    initial={{ width: 0 }}
                    animate={{ width: mounted ? `${proj.progress}%` : 0 }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

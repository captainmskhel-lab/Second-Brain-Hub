import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, File, FolderArchive, Library, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ArchiveItem {
  id: string;
  title: string;
  time: string;
  type: "catatan" | "proyek" | "sumber";
}

const typeConfig = {
  catatan: { icon: File, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "Catatan" },
  proyek: { icon: FolderArchive, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Project" },
  sumber: { icon: Library, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Resource" },
} as const;

const defaultItems: ArchiveItem[] = [
  { id: "a1", title: "Catatan lama 1", time: "2 bulan lalu", type: "catatan" },
  { id: "a2", title: "Ujian Blok 12", time: "1 bulan lalu", type: "proyek" },
  { id: "a3", title: "Anatomi Dasar", time: "3 minggu lalu", type: "sumber" },
];

export default function ArchivePage() {
  const [items, setItems] = useLocalStorage<ArchiveItem[]>("mindvault_archive", defaultItems);

  function restore(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Archive</h1>
          <p className="text-muted-foreground mt-1">Item yang tidak aktif</p>
        </div>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full mt-1">
            {items.length} item
          </span>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 space-y-3 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Archive className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Archive kosong</p>
          <p className="text-sm text-muted-foreground/60">Item yang diarsipkan akan muncul di sini.</p>
        </motion.div>
      )}

      {/* Items */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-4 hover:border-border hover:bg-card/80 transition-all"
                data-testid={`card-archive-${item.id}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground/80 truncate">{item.title}</h3>
                    <Badge
                      variant="outline"
                      className={`${config.bg} ${config.color} border text-xs font-normal shrink-0`}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Diarsipkan {item.time}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restore(item.id)}
                  className="shrink-0 border-border/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5 gap-2 opacity-0 group-hover:opacity-100 transition-all"
                  data-testid={`button-restore-${item.id}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Pulihkan
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Library, Archive, Mic, Lightbulb, BookOpen, StickyNote, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInbox, CaptureType } from "@/context/InboxContext";

const typeConfig: Record<CaptureType, { icon: typeof Mic; color: string; bg: string }> = {
  "Voice Capture": { icon: Mic, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  "Idea": { icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  "Reflection": { icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  "Quick Note": { icon: StickyNote, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
};

export default function InboxPage() {
  const { items, removeItem } = useInbox();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Kotak Masuk</h1>
          <p className="text-muted-foreground mt-1.5">Pikiran mentah yang belum diproses</p>
        </div>
        {items.length > 0 && (
          <span className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full mt-1">
            {items.length} item
          </span>
        )}
      </div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 space-y-3 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <StickyNote className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Kotak masuk kosong</p>
          <p className="text-sm text-muted-foreground/60">Tangkap pikiran dari Dashboard dan akan muncul di sini.</p>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Card
                  data-testid={`card-inbox-${item.id}`}
                  className="bg-card/70 backdrop-blur-sm border-border hover:border-border/80 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${config.bg} ${config.color} border font-normal gap-1.5 py-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {item.type}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                      <button
                        data-testid={`button-delete-inbox-${item.id}`}
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-base leading-relaxed">{item.text}</p>
                  </CardContent>
                  <CardFooter className="pt-3 flex flex-wrap gap-2 border-t border-border/40 bg-muted/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                      data-testid={`button-move-project-${item.id}`}
                    >
                      <FolderKanban className="mr-1.5 w-3.5 h-3.5" />
                      Pindah ke Projects
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
                      data-testid={`button-move-resources-${item.id}`}
                    >
                      <Library className="mr-1.5 w-3.5 h-3.5" />
                      Pindah ke Resources
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                      data-testid={`button-archive-${item.id}`}
                    >
                      <Archive className="mr-1.5 w-3.5 h-3.5" />
                      Arsipkan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

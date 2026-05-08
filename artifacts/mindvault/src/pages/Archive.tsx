import { motion } from "framer-motion";
import { RotateCcw, File, FolderArchive, Library } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const archivedItems = [
  { title: "Catatan lama 1", time: "diarsipkan 2 bulan lalu", type: "catatan", icon: File },
  { title: "Ujian Blok 12", time: "diarsipkan 1 bulan lalu", type: "proyek", icon: FolderArchive },
  { title: "Anatomi Dasar", time: "diarsipkan 3 minggu lalu", type: "sumber", icon: Library },
];

export default function ArchivePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Arsip</h1>
        <p className="text-muted-foreground mt-2">Item yang tidak aktif</p>
      </div>

      <div className="space-y-3">
        {archivedItems.map((item, i) => (
          <Card key={i} className="bg-card/50 border-card-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary/50 rounded-md">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground/80">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-card-border hover:bg-secondary hover:text-primary">
                <RotateCcw className="mr-2 w-3.5 h-3.5" />
                Pulihkan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

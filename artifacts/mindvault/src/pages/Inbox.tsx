import { motion } from "framer-motion";
import { FolderKanban, Library, Archive } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const inboxItems = [
  { text: "ide random untuk sidang", time: "2 jam lalu", type: "Catatan" },
  { text: "voice notes kuliah dr. Budi", time: "kemarin", type: "Rekaman Suara" },
  { text: "insight dosen tentang farmakologi", time: "2 hari lalu", type: "Wawasan" },
  { text: "refleksi minggu pertama koas", time: "3 hari lalu", type: "Refleksi" },
  { text: "link artikel: burnout prevention", time: "4 hari lalu", type: "Tautan" },
];

export default function InboxPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Kotak Masuk</h1>
        <p className="text-muted-foreground mt-2">Pikiran mentah yang belum diproses</p>
      </div>

      <div className="space-y-4">
        {inboxItems.map((item, i) => (
          <Card key={i} className="bg-card border-card-border hover:-translate-y-1 transition-transform">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal">
                {item.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{item.text}</p>
            </CardContent>
            <CardFooter className="pt-2 flex flex-wrap gap-2 border-t border-card-border/50 bg-muted/20">
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                <FolderKanban className="mr-2 w-3.5 h-3.5" />
                Pindah ke Proyek
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                <Library className="mr-2 w-3.5 h-3.5" />
                Pindah ke Sumber Daya
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-destructive">
                <Archive className="mr-2 w-3.5 h-3.5" />
                Arsipkan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

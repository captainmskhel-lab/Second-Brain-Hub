import { motion } from "framer-motion";
import { Mic, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const recentResources = [
  { title: "GERD", category: "Penyakit Dalam", updated: "2 hari lalu", desc: "Gangguan asam lambung kronis..." },
  { title: "Epilepsi", category: "Neurologi", updated: "3 hari lalu", desc: "Gangguan kejang berulang..." },
  { title: "Syok", category: "Gawat Darurat", updated: "5 hari lalu", desc: "Kondisi kritis penurunan perfusi..." },
  { title: "Pneumonia", category: "Pulmonologi", updated: "1 minggu lalu", desc: "Infeksi parenkim paru..." },
];

const activeProjects = [
  { title: "Internship Survival", notes: 8, progress: 60 },
  { title: "Serimpi Depmus Hub", notes: 5, progress: 30 },
  { title: "Belajar Farmakologi", notes: 12, progress: 45 },
];

const activities = [
  { type: "Catatan", text: "ide random untuk sidang", time: "2 jam lalu" },
  { type: "Resource ditambah", text: "Epilepsi", time: "kemarin" },
  { type: "Proyek diperbarui", text: "Internship Survival", time: "3 hari lalu" },
];

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-10"
    >
      <div className="flex flex-col items-center space-y-6 pt-10">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            className="w-full pl-12 h-12 bg-card border-card-border rounded-full text-base focus-visible:ring-primary shadow-lg"
            placeholder="Cari pengetahuan, catatan, atau proyek..." 
          />
        </div>
        
        <Button 
          size="lg" 
          className="rounded-full h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(249,168,37,0.4)] transition-all hover:shadow-[0_0_30px_rgba(249,168,37,0.6)]"
        >
          <Mic className="mr-2 h-5 w-5" />
          Tangkap Pikiran
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium tracking-tight">Sumber Daya Terbaru</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {recentResources.map((res, i) => (
            <Card key={i} className="min-w-[280px] snap-start bg-card/50 backdrop-blur-sm border-card-border hover:-translate-y-1 transition-transform cursor-pointer">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{res.title}</h3>
                  <span className="text-xs text-muted-foreground">{res.category}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{res.desc}</p>
                <p className="text-xs text-muted-foreground/60 pt-2">Terakhir diperbarui {res.updated}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-medium tracking-tight">Proyek Aktif</h2>
          <div className="space-y-3">
            {activeProjects.map((proj, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-card-border hover:bg-card transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{proj.title}</h3>
                    <p className="text-sm text-muted-foreground">{proj.notes} catatan</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-primary">{proj.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium tracking-tight">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary/60 mt-2"></div>
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground mr-2">{act.type}:</span>
                    <span className="font-medium">{act.text}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

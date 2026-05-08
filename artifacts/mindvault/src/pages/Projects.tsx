import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const projects = [
  { title: "Internship Survival", notes: 8, status: "aktif", progress: 60 },
  { title: "UKMPPD Preparation", notes: 23, status: "aktif", progress: 40 },
  { title: "Serimpi Depmus Hub", notes: 5, status: "aktif", progress: 30 },
  { title: "Belajar Farmakologi", notes: 12, status: "aktif", progress: 45 },
];

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Proyek</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Proyek Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <Card key={i} className="bg-card border-card-border hover:-translate-y-1 transition-all hover:shadow-lg cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{proj.title}</CardTitle>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-normal">
                  {proj.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{proj.notes} catatan</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progres</span>
                  <span className="font-medium">{proj.progress}%</span>
                </div>
                <Progress value={mounted ? proj.progress : 0} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

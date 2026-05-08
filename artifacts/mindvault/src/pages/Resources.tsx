import { motion } from "framer-motion";
import { Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const categories = [
  "Semua", "Penyakit Dalam", "Psikiatri", "Gawat Darurat", "Farmakologi", "Produktivitas", "Musik & Ibadah"
];

const resources = [
  { title: "GERD", category: "Penyakit Dalam", tags: ["asam lambung", "dispepsia"], desc: "Gangguan refluks gastroesofageal yang kronis menyebabkan iritasi mukosa.", related: "Ulkus Peptikum" },
  { title: "Epilepsi", category: "Neurologi", tags: ["kejang", "neurologi"], desc: "Gangguan otak yang menyebabkan kejang berulang karena aktivitas listrik abnormal." },
  { title: "Syok", category: "Gawat Darurat", tags: ["emergensi", "kritis"], desc: "Penurunan perfusi organ sistemik yang mengancam jiwa." },
  { title: "Pneumonia", category: "Pulmonologi", tags: ["paru", "infeksi"], desc: "Infeksi jaringan paru-paru yang disebabkan oleh bakteri, virus, atau jamur." },
];

export default function ResourcesPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Sumber Daya</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Sumber
        </Button>
      </div>

      <Tabs defaultValue="Semua" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-secondary/50 p-1">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="data-[state=active]:bg-card data-[state=active]:text-primary"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value="Semua" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res, i) => (
              <Card key={i} className="bg-card border-card-border hover:-translate-y-1 transition-all cursor-pointer flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{res.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {res.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/40">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{res.desc}</p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-card-border/50 bg-muted/10 flex justify-between items-center">
                  <Button variant="ghost" size="sm" className="h-8 text-xs hover:text-primary">
                    <FileText className="mr-2 w-3.5 h-3.5" />
                    Buka PDF
                  </Button>
                  {res.related && (
                    <span className="text-xs text-muted-foreground">
                      Terkait: <span className="hover:text-primary cursor-pointer transition-colors">{res.related}</span>
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        {categories.slice(1).map(cat => (
          <TabsContent key={cat} value={cat} className="mt-6">
            <div className="py-10 text-center text-muted-foreground">
              Tidak ada sumber daya di kategori ini.
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}

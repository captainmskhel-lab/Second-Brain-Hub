import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Plus, FileText, X, Stethoscope, Brain, Zap, Pill, Target, Music,
  Tag, Clock, BookOpen, Link2, ChevronRight, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface Category {
  id: string;
  label: string;
  icon: typeof Stethoscope;
  color: string;
  glow: string;
}

const categories: Category[] = [
  { id: "all", label: "Semua", icon: Layers, color: "text-foreground", glow: "rgba(255,255,255,0.1)" },
  { id: "internal", label: "Internal Medicine", icon: Stethoscope, color: "text-blue-400", glow: "rgba(96,165,250,0.15)" },
  { id: "psychiatry", label: "Psychiatry", icon: Brain, color: "text-purple-400", glow: "rgba(192,132,252,0.15)" },
  { id: "emergency", label: "Emergency", icon: Zap, color: "text-red-400", glow: "rgba(248,113,113,0.15)" },
  { id: "pharmacology", label: "Pharmacology", icon: Pill, color: "text-emerald-400", glow: "rgba(52,211,153,0.15)" },
  { id: "productivity", label: "Productivity", icon: Target, color: "text-amber-400", glow: "rgba(251,191,36,0.15)" },
  { id: "music", label: "Music & Worship", icon: Music, color: "text-pink-400", glow: "rgba(244,114,182,0.15)" },
];

const allCards: KnowledgeCard[] = [
  {
    id: "gerd",
    title: "GERD",
    category: "internal",
    tags: ["asam lambung", "dispepsia", "GI"],
    summary: "Gangguan refluks gastroesofageal kronis akibat lemahnya lower esophageal sphincter menyebabkan iritasi mukosa esofagus.",
    updated: "2 hari lalu",
    related: ["Dyspepsia", "PPI", "GI Bleeding", "Ulkus Peptikum"],
    highlights: ["Heartburn adalah gejala khas", "LES tone turun = reflux naik", "PPI adalah terapi utama"],
    keyPoints: [
      "Patofisiologi: disfungsi LES → paparan asam kronik",
      "Gejala: heartburn, regurgitasi, disfagia",
      "Komplikasi: esofagitis, Barrett's esophagus, adenokarsinoma",
      "Terapi: PPI 8 minggu, modifikasi gaya hidup",
      "Red flags: disfagia progresif, BB turun, hematemesis",
    ],
    linkedNotes: ["Dyspepsia - Workup", "PPI Farmakologi", "Barrett Esophagus"],
  },
  {
    id: "epilepsi",
    title: "Epilepsi",
    category: "internal",
    tags: ["kejang", "neurologi", "antikonvulsan"],
    summary: "Gangguan otak kronik ditandai kejang berulang akibat aktivitas listrik abnormal neuron.",
    updated: "3 hari lalu",
    related: ["Status Epileptikus", "Febrile Seizure", "EEG"],
    highlights: ["Minimal 2 kejang unprovoked", "EEG bukan satu-satunya diagnosis", "Hindari pencetus"],
    keyPoints: [
      "Definisi: ≥2 kejang unprovoked berjarak >24 jam",
      "Klasifikasi: fokal, umum, unknown onset",
      "First line: valproate (umum), karbamazepin (fokal)",
      "Status epileptikus: benzodiazepin IV segera",
      "Edukasi: jangan berenang sendirian, jaga tidur cukup",
    ],
    linkedNotes: ["Status Epileptikus", "Farmakologi Antikonvulsan"],
  },
  {
    id: "hipertensi",
    title: "Hipertensi",
    category: "internal",
    tags: ["kardiovaskular", "kronis", "lifestyle"],
    summary: "Peningkatan tekanan darah persisten ≥140/90 mmHg yang meningkatkan risiko kardiovaskular dan ginjal.",
    updated: "5 hari lalu",
    related: ["Gagal Jantung", "CKD", "Stroke", "ACE Inhibitor"],
    highlights: ["Silent killer — sering asimtomatik", "Target <130/80 pada berisiko tinggi", "Modifikasi gaya hidup adalah terapi pertama"],
    keyPoints: [
      "Diagnosis: rerata ≥2 kali pengukuran berbeda",
      "Stage 1: 130–139/80–89 mmHg, Stage 2: ≥140/90",
      "First line: ACEI/ARB, CCB, thiazide",
      "Hipertensi urgensi vs emergensi berdasarkan kerusakan organ",
      "Komplikasi: HF, stroke, retinopati, nefropati",
    ],
    linkedNotes: ["ACE Inhibitor - Farmakologi", "CKD & Hipertensi"],
  },
  {
    id: "depresi",
    title: "Depresi Mayor",
    category: "psychiatry",
    tags: ["mood", "antidepresan", "psikiatri"],
    summary: "Gangguan mood ditandai afek depresif persisten ≥2 minggu disertai anhedonia dan gejala neurovegetatif.",
    updated: "1 minggu lalu",
    related: ["Bipolar Disorder", "SSRI", "CBT", "Suicidality"],
    highlights: ["SIG E CAPS mnemonic untuk diagnosis", "SSRI adalah first line farmakologi", "CBT sama efektifnya dengan obat"],
    keyPoints: [
      "Kriteria DSM-5: ≥5 gejala selama 2 minggu (harus ada afek depresif/anhedonia)",
      "SIG E CAPS: Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidal",
      "Terapi: SSRI (fluoxetin, sertralin) + psikoterapi",
      "Onset efek antidepresan: 2–4 minggu",
      "Selalu nilai risiko bunuh diri",
    ],
    linkedNotes: ["SSRI Farmakologi", "CBT Principles", "Risk Assessment Suicidal"],
  },
  {
    id: "skizofrenia",
    title: "Skizofrenia",
    category: "psychiatry",
    tags: ["psikosis", "antipsikotik", "kronik"],
    summary: "Gangguan psikotik kronik dengan gejala positif (halusinasi, waham), negatif, dan disorganisasi berlangsung ≥6 bulan.",
    updated: "2 minggu lalu",
    related: ["Antipsikotik", "EPS", "Clozapine", "Psikosis Akut"],
    highlights: ["Gejala positif lebih responsif terhadap obat", "Antipsikotik tipikal vs atipikal", "Compliance adalah tantangan utama"],
    keyPoints: [
      "Kriteria A: ≥2 dari 5 gejala selama 1 bulan",
      "Gejala positif: halusinasi, waham, bicara kacau",
      "Gejala negatif: afek datar, alogia, avolisi",
      "First line: antipsikotik atipikal (risperidone, olanzapine)",
      "Clozapine: refrakter, pantau agranulositosis",
    ],
    linkedNotes: ["Antipsikotik Atipikal", "EPS & Tardive Dyskinesia"],
  },
  {
    id: "syok",
    title: "Syok",
    category: "emergency",
    tags: ["emergensi", "kritis", "hemodinamik"],
    summary: "Kondisi mengancam jiwa akibat ketidakseimbangan suplai dan kebutuhan oksigen jaringan yang menyebabkan disfungsi organ.",
    updated: "4 hari lalu",
    related: ["Sepsis", "Fluid Resuscitation", "Vasopressor", "ABCDE"],
    highlights: ["4 tipe: distributif, hipovolemik, kardiogenik, obstruktif", "Distributif paling sering (sepsis)", "Mean arterial pressure target ≥65"],
    keyPoints: [
      "Distributif: sepsis, anafilaksis — vasodilatasi masif",
      "Hipovolemik: perdarahan, dehidrasi — volume rendah",
      "Kardiogenik: pump failure — dobutamin",
      "Obstruktif: tamponade, tension pneumotoraks",
      "Prinsip: ABCDE, 2 IV large bore, fluid challenge 500 mL kristaloid",
    ],
    linkedNotes: ["Sepsis - Management", "Vasopressor Guide", "ABCDE Assessment"],
  },
  {
    id: "pneumonia",
    title: "Pneumonia",
    category: "emergency",
    tags: ["paru", "infeksi", "antibiotik"],
    summary: "Infeksi parenkim paru yang menyebabkan konsolidasi dan gangguan pertukaran gas, dapat mengancam jiwa bila berat.",
    updated: "6 hari lalu",
    related: ["CAP vs HAP", "PSI Score", "CURB-65", "Antibiotik"],
    highlights: ["CURB-65 untuk stratifikasi risiko", "CAP: amoksisilin + makrolid", "Kultur dahak sebelum antibiotik"],
    keyPoints: [
      "CAP vs HAP: <48 jam vs ≥48 jam rawat inap",
      "CURB-65: Confusion, Urea, RR, BP, Age ≥65",
      "Skor 0–1: rawat jalan, 2: rawat inap, ≥3: ICU",
      "CAP ringan: amoksisilin. Berat: beta-laktam + makrolid/FQ",
      "Komplikasi: empyema, abses paru, ARDS",
    ],
    linkedNotes: ["CURB-65 Calculator", "CAP Antibiotik Guide"],
  },
  {
    id: "ppi",
    title: "Proton Pump Inhibitor",
    category: "pharmacology",
    tags: ["PPI", "GI", "antasid"],
    summary: "Penghambat pompa proton yang menekan sekresi asam lambung secara ireversibel, digunakan pada GERD, ulkus, dan H. pylori.",
    updated: "1 minggu lalu",
    related: ["GERD", "H. pylori", "NSAIDs", "Omeprazole"],
    highlights: ["Dosis sebelum makan untuk efek optimal", "Taper sebelum stop jangka panjang", "Risiko: hipomagnesemia, infeksi C. diff"],
    keyPoints: [
      "Mekanisme: inhibisi H+/K+ ATPase ireversibel",
      "Contoh: omeprazole, pantoprazole, lansoprazole",
      "Onset: 1–4 hari, efek penuh 4 hari",
      "Indikasi: GERD, ulkus peptikum, H. pylori eradikasi",
      "ES jangka panjang: fraktur tulang, defisiensi B12, Mg",
    ],
    linkedNotes: ["GERD Management", "H. pylori Triple Therapy"],
  },
  {
    id: "gtd",
    title: "Metode GTD",
    category: "productivity",
    tags: ["sistem", "produktivitas", "workflow"],
    summary: "Getting Things Done — sistem produktivitas David Allen untuk mengelola komitmen, tugas, dan proyek dengan pikiran yang jernih.",
    updated: "3 minggu lalu",
    related: ["PARA Method", "Inbox Zero", "Weekly Review"],
    highlights: ["Capture everything out of your head", "Weekly review adalah kunci sistem", "2-minute rule: langsung kerjakan jika <2 menit"],
    keyPoints: [
      "5 langkah: Capture, Clarify, Organize, Reflect, Engage",
      "Inbox = semua input masuk, harus diproses rutin",
      "Next actions harus spesifik dan actionable",
      "Weekly Review: bersihkan inbox, perbarui daftar proyek",
      "Konteks-based lists: @phone, @komputer, @kampus",
    ],
    linkedNotes: ["PARA Method", "Weekly Review Template"],
  },
  {
    id: "kidung",
    title: "Penyembahan — Worship Leading",
    category: "music",
    tags: ["worship", "pemimpin pujian", "rohani"],
    summary: "Prinsip dan praktik memimpin jemaat dalam penyembahan yang tulus, berfokus pada kehadiran Tuhan bukan penampilan.",
    updated: "1 bulan lalu",
    related: ["Teologi Penyembahan", "Vokal", "Flow Lagu"],
    highlights: ["Pemimpin penyembahan adalah fasilitator, bukan bintang", "Flow lagu: dari gembira → intim", "Doa sebelum memimpin adalah fondasi"],
    keyPoints: [
      "Tujuan: membawa jemaat masuk hadirat Tuhan",
      "Pilih lagu dengan alur dinamika dan teologi yang kuat",
      "Komunikasi dengan tim musik: transisi, signal, tempo",
      "Jangan takut keheningan — beri ruang Roh Kudus bergerak",
      "Evaluasi pasca ibadah: apa yang berhasil, apa yang bisa diperbaiki",
    ],
    linkedNotes: ["Flow Penyembahan", "Daftar Lagu Favorit"],
  },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);

  const filtered = activeCategory === "all"
    ? allCards
    : allCards.filter((c) => c.category === activeCategory);

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

          {/* Knowledge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((card, i) => (
              <KnowledgeCardItem
                key={card.id}
                card={card}
                index={i}
                categories={categories}
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Knowledge Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <KnowledgeDetailView
            card={selectedCard}
            categories={categories}
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
  onClick,
}: {
  card: KnowledgeCard;
  index: number;
  categories: Category[];
  onClick: () => void;
}) {
  const cat = categories.find((c) => c.id === card.category);
  const Icon = cat?.icon ?? Stethoscope;

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
      {/* Card top accent bar */}
      <div className={cn("h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity", `bg-gradient-to-r from-transparent via-current to-transparent`, cat?.color)} />

      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted/60", cat?.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{card.title}</h3>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-all group-hover:translate-x-0.5 shrink-0 mt-0.5" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{card.summary}</p>

        {/* Highlights */}
        <div className="space-y-1.5">
          {card.highlights.slice(0, 2).map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
              <span className="text-primary mt-0.5 shrink-0">—</span>
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            {card.updated}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            data-testid={`button-pdf-${card.id}`}
          >
            <FileText className="h-3 w-3" />
            Buka PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function KnowledgeDetailView({
  card,
  categories,
  onClose,
}: {
  card: KnowledgeCard;
  categories: Category[];
  onClose: () => void;
}) {
  const cat = categories.find((c) => c.id === card.category);
  const Icon = cat?.icon ?? Stethoscope;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      {/* Slide-in panel */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-background border-l border-border z-50 flex flex-col shadow-[−24px_0_60px_rgba(0,0,0,0.5)]"
        data-testid="knowledge-detail-panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60 bg-card/50">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-muted", cat?.color)}>
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
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

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Tags */}
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

          {/* Summary */}
          <div>
            <p className="text-base text-muted-foreground leading-relaxed">{card.summary}</p>
          </div>

          {/* High-yield notes */}
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

          {/* Key learning points */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Poin Kunci</h3>
            </div>
            <div className="space-y-2.5">
              {card.keyPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-muted-foreground/50 text-xs font-mono mt-1 shrink-0 w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Related topics */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Related Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {card.related.map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="text-sm px-3 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </section>

          {/* Linked notes */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Catatan Terhubung</h3>
            </div>
            <div className="space-y-2">
              {card.linkedNotes.map((note) => (
                <div key={note} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/40 hover:border-border/70 cursor-pointer transition-all group">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{note}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 ml-auto group-hover:text-muted-foreground transition-all group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </section>

          {/* PDF preview placeholder */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Dokumen PDF</h3>
            </div>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-8 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">Belum ada PDF yang diunggah</p>
              <Button variant="outline" size="sm" className="border-border hover:border-primary hover:text-primary">
                Unggah PDF
              </Button>
            </div>
          </section>
        </div>

        {/* Panel footer */}
        <div className="px-6 py-4 border-t border-border/60 bg-card/30 flex gap-3">
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_12px_rgba(249,168,37,0.2)]"
            data-testid="button-open-pdf-detail"
          >
            <FileText className="mr-2 h-4 w-4" />
            Buka PDF
          </Button>
          <Button variant="outline" onClick={onClose} className="border-border hover:border-border/80">
            Tutup
          </Button>
        </div>
      </motion.div>
    </>
  );
}

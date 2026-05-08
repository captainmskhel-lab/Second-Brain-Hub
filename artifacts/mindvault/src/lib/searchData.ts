export type SearchResultType = "Knowledge" | "Project" | "Resource" | "Inbox" | "Topic";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  snippet?: string;
  tags?: string[];
  href: string;
  cardId?: string;
}

const knowledgeResults: SearchResult[] = [
  {
    id: "k-gerd", type: "Knowledge", title: "GERD", subtitle: "Internal Medicine",
    snippet: "Gangguan refluks gastroesofageal kronis akibat disfungsi LES.",
    tags: ["asam lambung", "dispepsia", "GI", "PPI", "Dyspepsia", "GI Bleeding"],
    href: "/resources", cardId: "gerd",
  },
  {
    id: "k-epilepsi", type: "Knowledge", title: "Epilepsi", subtitle: "Internal Medicine",
    snippet: "Gangguan otak kronik ditandai kejang berulang akibat aktivitas listrik abnormal.",
    tags: ["kejang", "neurologi", "antikonvulsan", "EEG", "Status Epileptikus"],
    href: "/resources", cardId: "epilepsi",
  },
  {
    id: "k-hipertensi", type: "Knowledge", title: "Hipertensi", subtitle: "Internal Medicine",
    snippet: "Peningkatan tekanan darah persisten ≥140/90 mmHg.",
    tags: ["kardiovaskular", "kronis", "lifestyle", "ACE Inhibitor", "Stroke"],
    href: "/resources", cardId: "hipertensi",
  },
  {
    id: "k-depresi", type: "Knowledge", title: "Depresi Mayor", subtitle: "Psychiatry",
    snippet: "Gangguan mood ditandai afek depresif persisten ≥2 minggu disertai anhedonia.",
    tags: ["mood", "antidepresan", "SSRI", "CBT", "Bipolar"],
    href: "/resources", cardId: "depresi",
  },
  {
    id: "k-skizofrenia", type: "Knowledge", title: "Skizofrenia", subtitle: "Psychiatry",
    snippet: "Gangguan psikotik kronik dengan gejala positif dan negatif berlangsung ≥6 bulan.",
    tags: ["psikosis", "antipsikotik", "kronik", "Clozapine", "EPS"],
    href: "/resources", cardId: "skizofrenia",
  },
  {
    id: "k-syok", type: "Knowledge", title: "Syok", subtitle: "Emergency",
    snippet: "Kondisi mengancam jiwa akibat ketidakseimbangan suplai dan kebutuhan oksigen jaringan.",
    tags: ["emergensi", "kritis", "hemodinamik", "Sepsis", "Vasopressor"],
    href: "/resources", cardId: "syok",
  },
  {
    id: "k-pneumonia", type: "Knowledge", title: "Pneumonia", subtitle: "Emergency",
    snippet: "Infeksi parenkim paru menyebabkan konsolidasi dan gangguan pertukaran gas.",
    tags: ["paru", "infeksi", "antibiotik", "CAP", "CURB-65"],
    href: "/resources", cardId: "pneumonia",
  },
  {
    id: "k-ppi", type: "Knowledge", title: "Proton Pump Inhibitor", subtitle: "Pharmacology",
    snippet: "Penghambat pompa proton yang menekan sekresi asam lambung secara ireversibel.",
    tags: ["PPI", "GI", "antasid", "omeprazole", "H. pylori"],
    href: "/resources", cardId: "ppi",
  },
  {
    id: "k-gtd", type: "Knowledge", title: "Metode GTD", subtitle: "Productivity",
    snippet: "Getting Things Done — sistem produktivitas untuk mengelola komitmen dan tugas.",
    tags: ["sistem", "produktivitas", "workflow", "PARA", "Inbox Zero"],
    href: "/resources", cardId: "gtd",
  },
  {
    id: "k-kidung", type: "Knowledge", title: "Worship Leading", subtitle: "Music & Worship",
    snippet: "Prinsip memimpin jemaat dalam penyembahan yang tulus.",
    tags: ["worship", "pemimpin pujian", "rohani", "Flow Lagu"],
    href: "/resources", cardId: "kidung",
  },
];

const projectResults: SearchResult[] = [
  {
    id: "p-internship", type: "Project", title: "Internship Survival", subtitle: "8 catatan · 60% selesai",
    snippet: "Panduan bertahan dan berkembang selama masa internship klinis.",
    href: "/projects",
  },
  {
    id: "p-ukmppd", type: "Project", title: "UKMPPD Preparation", subtitle: "23 catatan · 40% selesai",
    snippet: "Persiapan komprehensif ujian kompetensi dokter Indonesia.",
    href: "/projects",
  },
  {
    id: "p-serimpi", type: "Project", title: "Serimpi Depmus Hub", subtitle: "5 catatan · 30% selesai",
    snippet: "Proyek komunitas dan pengembangan Serimpi.",
    href: "/projects",
  },
  {
    id: "p-farmako", type: "Project", title: "Belajar Farmakologi", subtitle: "12 catatan · 45% selesai",
    snippet: "Rangkuman obat-obatan penting untuk koas dan UKMPPD.",
    href: "/projects",
  },
];

const inboxResults: SearchResult[] = [
  {
    id: "i-1", type: "Inbox", title: "ide random untuk sidang", subtitle: "Idea · 2 jam lalu",
    href: "/inbox",
  },
  {
    id: "i-2", type: "Inbox", title: "voice notes kuliah dr. Budi", subtitle: "Voice Capture · kemarin",
    href: "/inbox",
  },
  {
    id: "i-3", type: "Inbox", title: "insight dosen tentang farmakologi", subtitle: "Quick Note · 2 hari lalu",
    href: "/inbox",
  },
  {
    id: "i-4", type: "Inbox", title: "refleksi minggu pertama koas", subtitle: "Reflection · 3 hari lalu",
    href: "/inbox",
  },
];

const topicResults: SearchResult[] = [
  { id: "t-dyspepsia", type: "Topic", title: "Dyspepsia", subtitle: "Terkait GERD", href: "/resources", cardId: "gerd" },
  { id: "t-ppi", type: "Topic", title: "PPI", subtitle: "Terkait GERD", href: "/resources", cardId: "ppi" },
  { id: "t-sepsis", type: "Topic", title: "Sepsis", subtitle: "Terkait Syok", href: "/resources", cardId: "syok" },
  { id: "t-ssri", type: "Topic", title: "SSRI", subtitle: "Terkait Depresi Mayor", href: "/resources", cardId: "depresi" },
  { id: "t-cbt", type: "Topic", title: "CBT", subtitle: "Terkait Depresi Mayor", href: "/resources", cardId: "depresi" },
  { id: "t-curb65", type: "Topic", title: "CURB-65", subtitle: "Terkait Pneumonia", href: "/resources", cardId: "pneumonia" },
  { id: "t-status", type: "Topic", title: "Status Epileptikus", subtitle: "Terkait Epilepsi", href: "/resources", cardId: "epilepsi" },
  { id: "t-para", type: "Topic", title: "PARA Method", subtitle: "Terkait GTD", href: "/resources", cardId: "gtd" },
  { id: "t-barrett", type: "Topic", title: "Barrett Esophagus", subtitle: "Terkait GERD", href: "/resources", cardId: "gerd" },
  { id: "t-clozapine", type: "Topic", title: "Clozapine", subtitle: "Terkait Skizofrenia", href: "/resources", cardId: "skizofrenia" },
];

export const allSearchData: SearchResult[] = [
  ...knowledgeResults,
  ...projectResults,
  ...inboxResults,
  ...topicResults,
];

export function searchItems(query: string, filter: SearchResultType | "Semua"): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return allSearchData.filter((item) => {
    if (filter !== "Semua" && item.type !== filter) return false;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.snippet ?? "").toLowerCase().includes(q) ||
      (item.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 8);
}

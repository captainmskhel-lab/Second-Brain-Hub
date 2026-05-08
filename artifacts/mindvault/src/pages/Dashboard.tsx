import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Send, X, Lightbulb, BookOpen, Headphones, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useInbox, CaptureType } from "@/context/InboxContext";
import { useToast } from "@/hooks/use-toast";
import { SmartSearch } from "@/components/SmartSearch";

const recentResources = [
  { title: "GERD", category: "Penyakit Dalam", updated: "2 hari lalu", desc: "Gangguan asam lambung kronis yang mempengaruhi kualitas hidup." },
  { title: "Epilepsi", category: "Neurologi", updated: "3 hari lalu", desc: "Gangguan otak yang menyebabkan kejang berulang." },
  { title: "Syok", category: "Gawat Darurat", updated: "5 hari lalu", desc: "Kondisi kritis penurunan perfusi organ sistemik." },
  { title: "Pneumonia", category: "Pulmonologi", updated: "1 minggu lalu", desc: "Infeksi parenkim paru yang memerlukan penanganan segera." },
];

const activeProjects = [
  { title: "Internship Survival", notes: 8, progress: 60 },
  { title: "Serimpi Depmus Hub", notes: 5, progress: 30 },
  { title: "Belajar Farmakologi", notes: 12, progress: 45 },
];

const activities = [
  { type: "Catatan", text: "ide random untuk sidang", time: "2 jam lalu" },
  { type: "Resource ditambah", text: "Epilepsi", time: "kemarin" },
  { type: "Project diperbarui", text: "Internship Survival", time: "3 hari lalu" },
];

const captureTypes: { label: string; value: CaptureType; icon: typeof Lightbulb }[] = [
  { label: "Ide", value: "Idea", icon: Lightbulb },
  { label: "Refleksi", value: "Reflection", icon: BookOpen },
  { label: "Voice", value: "Voice Capture", icon: Headphones },
  { label: "Catatan", value: "Quick Note", icon: StickyNote },
];

export default function Dashboard() {
  const [captureText, setCaptureText] = useState("");
  const [captureType, setCaptureType] = useState<CaptureType>("Quick Note");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [captureOpen, setCaptureOpen] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addItem } = useInbox();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  function openCapture() {
    setCaptureOpen(true);
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  }

  function startVoiceCapture() {
    const SpeechRecognition = window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Browser tidak mendukung voice capture", variant: "destructive" });
      return;
    }

    setCaptureType("Voice Capture");
    setCaptureOpen(true);

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCaptureText(transcript);
    };

    recognition.onerror = () => stopRecording();
    recognition.onend = () => stopRecording();

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }

  function handleStopRecording() {
    stopRecording();
  }

  function handleSave() {
    const trimmed = captureText.trim();
    if (!trimmed) return;
    addItem(trimmed, captureType);
    setCaptureText("");
    setCaptureOpen(false);
    toast({
      title: "Tersimpan ke Kotak Masuk",
      description: `"${trimmed.slice(0, 50)}${trimmed.length > 50 ? "..." : ""}" berhasil ditambahkan.`,
    });
    setLocation("/inbox");
  }

  function handleClear() {
    setCaptureText("");
    stopRecording();
    setCaptureOpen(false);
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-10"
    >
      {/* Search + Capture */}
      <div className="flex flex-col items-center space-y-6 pt-10">
        <SmartSearch />

        {/* Quick Capture Panel */}
        <div className="w-full max-w-2xl space-y-3">
          <AnimatePresence>
            {captureOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-5 space-y-4 shadow-[0_0_30px_rgba(249,168,37,0.08)]"
              >
                {/* Capture type selector */}
                <div className="flex gap-2 flex-wrap">
                  {captureTypes.map((ct) => (
                    <button
                      key={ct.value}
                      data-testid={`button-capture-type-${ct.value}`}
                      onClick={() => setCaptureType(ct.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        captureType === ct.value
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(249,168,37,0.3)]"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <ct.icon className="h-3 w-3" />
                      {ct.label}
                    </button>
                  ))}
                </div>

                {/* Text area */}
                <Textarea
                  value={captureText}
                  onChange={(e) => setCaptureText(e.target.value)}
                  placeholder={
                    isRecording ? "Mendengarkan..." : "Tulis pikiran kamu di sini..."
                  }
                  className="min-h-[100px] resize-none bg-muted/30 border-border/50 focus-visible:ring-primary text-base rounded-xl"
                  data-testid="textarea-capture"
                />

                {/* Recording indicator */}
                <AnimatePresence>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                      />
                      <span className="text-sm text-muted-foreground font-mono">
                        {formatTime(recordingSeconds)}
                      </span>
                      <span className="text-xs text-muted-foreground">Sedang merekam...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action row */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startVoiceCapture}
                        className="border-border hover:border-primary hover:text-primary gap-2"
                        data-testid="button-start-recording"
                      >
                        <Mic className="h-4 w-4" />
                        Rekam
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStopRecording}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2"
                        data-testid="button-stop-recording"
                      >
                        <Square className="h-4 w-4" />
                        Berhenti
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-muted-foreground hover:text-foreground"
                      data-testid="button-clear-capture"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Batal
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!captureText.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_12px_rgba(249,168,37,0.25)] disabled:opacity-30"
                    data-testid="button-save-capture"
                  >
                    <Send className="h-4 w-4" />
                    Simpan ke Inbox
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main capture button */}
          {!captureOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-center"
            >
              <Button
                size="lg"
                onClick={openCapture}
                className="rounded-full h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(249,168,37,0.35)] transition-all hover:shadow-[0_0_36px_rgba(249,168,37,0.55)]"
                data-testid="button-open-capture"
              >
                <StickyNote className="mr-2 h-5 w-5" />
                Tangkap Pikiran
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={startVoiceCapture}
                className="rounded-full h-14 w-14 border-border hover:border-primary hover:text-primary hover:shadow-[0_0_20px_rgba(249,168,37,0.2)] transition-all"
                data-testid="button-open-voice"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent Resources */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium tracking-tight">Sumber Daya Terbaru</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-none">
          {recentResources.map((res, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card
                data-testid={`card-resource-${i}`}
                className="min-w-[280px] snap-start bg-card/60 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-[0_0_20px_rgba(249,168,37,0.08)] transition-all cursor-pointer"
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{res.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{res.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{res.desc}</p>
                  <p className="text-xs text-muted-foreground/50 pt-1">Diperbarui {res.updated}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-medium tracking-tight">Projects Aktif</h2>
          <div className="space-y-3">
            {activeProjects.map((proj, i) => (
              <motion.div key={i} whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card
                  data-testid={`card-project-${i}`}
                  className="bg-card/60 backdrop-blur-sm border-border hover:border-primary/30 transition-all cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm">{proj.title}</h3>
                        <p className="text-xs text-muted-foreground">{proj.notes} catatan</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full shadow-[0_0_6px_rgba(249,168,37,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${proj.progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium tracking-tight">Aktivitas Terbaru</h2>
          <div className="space-y-5">
            {activities.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-primary/70 ring-2 ring-primary/20 shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground mr-1.5">{act.type}:</span>
                    <span className="font-medium">{act.text}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{act.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

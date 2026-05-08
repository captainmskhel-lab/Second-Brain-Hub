import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Send, X, Lightbulb, BookOpen, Headphones, StickyNote, FolderKanban, Inbox, Library, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useInbox, CaptureType } from "@/context/InboxContext";
import { useToast } from "@/hooks/use-toast";
import { SmartSearch } from "@/components/SmartSearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Project {
  id: string;
  title: string;
  notes: number;
  progress: number;
  color: string;
}

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
  const { addItem, items: inboxItems } = useInbox();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [projects] = useLocalStorage<Project[]>("mindvault_projects", []);

  const totalItems = inboxItems.length + projects.length;
  const isEmpty = totalItems === 0;

  useEffect(() => {
    return () => stopRecording();
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
    const SpeechRecognition =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
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
      className="p-6 md:p-10 max-w-5xl mx-auto space-y-12"
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

                <Textarea
                  value={captureText}
                  onChange={(e) => setCaptureText(e.target.value)}
                  placeholder={isRecording ? "Mendengarkan..." : "Tulis pikiran kamu di sini..."}
                  className="min-h-[100px] resize-none bg-muted/30 border-border/50 focus-visible:ring-primary text-base rounded-xl"
                  data-testid="textarea-capture"
                />

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
                      <span className="text-sm text-muted-foreground font-mono">{formatTime(recordingSeconds)}</span>
                      <span className="text-xs text-muted-foreground">Sedang merekam...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                        onClick={stopRecording}
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

      {/* Empty — first time welcome */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-5 py-10"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center shadow-[0_0_30px_rgba(249,168,37,0.12)]">
              <Sparkles className="w-9 h-9 text-primary/60" />
            </div>
            <div className="absolute -inset-3 rounded-full border border-primary/5 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Selamat datang di MindVault</h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Ruang pikir pribadimu dimulai dari sini. Tangkap ide pertamamu, atau buat project dan resource untuk mulai membangun second brain-mu.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={openCapture}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all"
              data-testid="button-welcome-capture"
            >
              <Inbox className="h-4 w-4 text-purple-400" />
              Tangkap ide pertama
            </button>
            <button
              onClick={() => setLocation("/projects")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all"
              data-testid="button-welcome-projects"
            >
              <FolderKanban className="h-4 w-4 text-blue-400" />
              Buat project pertama
            </button>
            <button
              onClick={() => setLocation("/resources")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/60 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-all"
              data-testid="button-welcome-resources"
            >
              <Library className="h-4 w-4 text-emerald-400" />
              Tambah knowledge card
            </button>
          </div>
        </motion.div>
      )}

      {/* Active projects — only when data exists */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight">Projects Aktif</h2>
            <button
              onClick={() => setLocation("/projects")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Lihat semua
            </button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((proj, i) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                onClick={() => setLocation("/projects")}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 px-5 py-4 hover:border-border hover:bg-card/80 transition-all cursor-pointer group"
                data-testid={`dashboard-project-${proj.id}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm truncate">{proj.title}</h3>
                    <span className="text-sm font-semibold text-primary shrink-0 ml-3">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full shadow-[0_0_6px_rgba(249,168,37,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent inbox — only when data exists */}
      {inboxItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight">Capture Terbaru</h2>
            <button
              onClick={() => setLocation("/inbox")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Lihat semua
            </button>
          </div>
          <div className="space-y-2">
            {inboxItems.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setLocation("/inbox")}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/40 px-4 py-3 hover:bg-card/60 hover:border-border/60 transition-all cursor-pointer"
                data-testid={`dashboard-inbox-${item.id}`}
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{item.time} · {item.type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

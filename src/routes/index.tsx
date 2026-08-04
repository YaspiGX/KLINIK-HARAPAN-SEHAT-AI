import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Send, Stethoscope, User2, Loader2, Instagram, Facebook,
  Phone, MapPin, Mail, Heart, Activity, Sparkles, PlusCircle, Download,
  Wand2, Edit, ThumbsUp, ThumbsDown, AlertCircle, 
  Lock, KeyRound, ChevronRight, Menu, MessageSquare, Search, Home,
  Server, Users, Database, Settings, ArrowLeft
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Klinik Harapan Sehat — Rekam Medis AI" }] }),
  component: Index,
});

type ChatMessage = { id: string; role: "user" | "doctor"; content: string; };

function makeId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

const QUICK_PROMPTS = [
  "Saya demam dan pusing sejak kemarin",
  "Bagaimana pola makan sehat?",
  "Anak saya batuk pilek, apa yang harus dilakukan?",
];

function Avatar({ role }: { role: "user" | "doctor" }) {
  const isDoctor = role === "doctor";
  return (
    <div className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white " + (isDoctor ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700")}>
      {isDoctor ? <Stethoscope className="h-4 w-4" /> : <User2 className="h-4 w-4" />}
    </div>
  );
}

function MessageBubble({ message, onSend }: { message: ChatMessage, onSend: (text: string) => void }) {
  const isUser = message.role === "user";
  let mainText = message.content;
  let questions: string[] = [];
  let recommendationText = "";

  if (!isUser && message.content.includes("PERTANYAAN LANJUTAN UNTUK MEMASTIKAN:")) {
    const parts = message.content.split("PERTANYAAN LANJUTAN UNTUK MEMASTIKAN:");
    mainText = parts[0].trim();
    const subParts = parts[1].split("⚠️ **REKOMENDASI MEDIS:**");
    questions = subParts[0].split('\n').filter(q => q.trim().length > 3);
    if (subParts.length > 1) recommendationText = subParts[1].trim();
  } else if (!isUser && message.content.includes("⚠️ **REKOMENDASI MEDIS:**")) {
    const parts = message.content.split("⚠️ **REKOMENDASI MEDIS:**");
    mainText = parts[0].trim();
    recommendationText = parts[1].trim();
  }

  return (
    <div className={`flex items-end gap-2 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar role="doctor" />}
      <div className={"relative w-full max-w-[90%] rounded-2xl px-6 py-5 text-sm shadow-sm leading-relaxed transition-all " + (isUser ? "rounded-br-sm bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-medium" : "rounded-bl-sm bg-white text-slate-800 border border-slate-200")}>
        {!isUser && (
          <div className="absolute right-4 top-4 flex gap-1.5 z-10">
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600 transition hover:bg-teal-500 hover:text-white" title="Hasil akurat"><ThumbsUp className="h-3.5 w-3.5" /></button>
            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition hover:bg-rose-500 hover:text-white" title="Hasil kurang tepat"><ThumbsDown className="h-3.5 w-3.5" /></button>
          </div>
        )}
        <div className={!isUser ? "pr-16" : ""}>
          
          <ReactMarkdown components={{
              p: ({ node, ...props }) => <p className={`mb-3 last:mb-0 ${isUser ? "text-white" : "text-slate-800"}`} {...props} />,
              h3: ({ node, ...props }) => (
                <div className="mt-5 mb-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-400">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1.5" {...props} />
                </div>
              ),
              ul: ({ node, ...props }) => <ul className="mt-3 space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3" {...props} />,
              li: ({ node, ...props }) => <li className="flex items-start gap-1.5 list-none" {...props} />,
              strong: ({ node, ...props }) => <strong className={`font-semibold ${isUser ? "text-white" : "text-slate-900"}`} {...props} />,
            }}>{mainText}</ReactMarkdown>

          {questions.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="text-xs font-bold text-teal-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="h-4 w-4" /> Answer guided questions:
              </p>
              <div className="flex flex-col gap-2.5">
                {questions.map((q, i) => {
                  const cleanQ = q.replace(/^[\d\.\-\*]\s*/, '').replace(/\*\*/g, '').trim();
                  if (!cleanQ) return null;
                  return (
                    <button 
                      key={i} 
                      onClick={() => onSend(cleanQ)} 
                      className="text-left w-full rounded-xl border border-teal-200 bg-teal-50/40 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-teal-100 hover:border-teal-400 hover:shadow-sm flex items-center justify-between group"
                    >
                      <span className="pr-4 leading-relaxed">{cleanQ}</span>
                      <div className="h-7 w-7 shrink-0 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Send className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {recommendationText && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5"><AlertCircle className="h-4 w-4" /> REKOMENDASI MEDIS</p>
              <p className="text-sm text-amber-900 leading-relaxed">{recommendationText}</p>
            </div>
          )}
        </div>
      </div>
      {isUser && <Avatar role="user" />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <Avatar role="doctor" />
      <div className="rounded-2xl rounded-bl-sm bg-white border border-slate-100 px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [userRole, setUserRole] = useState<"admin" | "doctor" | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "archive">("dashboard");

  const [history, setHistory] = useState<{ id: number; title: string; date: string; }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const pesanAwal = { id: makeId(), role: "doctor" as const, content: "Selamat datang di **Klinik Harapan Sehat** 👋\n\nIbu/Bapak Dokter, silakan masukkan keluhan atau gejala pasien untuk memulai analisis rekam medis." };
  const [messages, setMessages] = useState<ChatMessage[]>([pesanAwal]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ========================================================
  // ✨ PERBAIKAN: FETCH OTOMATIS MENGIKUTI ALAMAT BROWSER
  // ========================================================
  const fetchRiwayat = async () => {
    try {
      const res = await fetch('https://klinik-harapan-sehat-ai-production-3384.up.railway.app/riwayat');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      console.log("Gagal memuat riwayat database.");
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchRiwayat();
      if (currentView === "chat") {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages, loading, userRole, currentView]);

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (pinInput === "Pastimudah") {
      setUserRole("doctor");
      setCurrentView("dashboard");
      setPinError(false);
      setPinInput("");
    } else if (pinInput === "qsefthuko;13579") { // PIN Admin Sesuai Permintaanmu Sebelumnya
      setUserRole("admin");
      setPinError(false);
      setPinInput("");
    } else {
      setPinError(true);
      setPinInput("");
    }
  }

  function handleLogout() {
    setUserRole(null);
    setCurrentView("dashboard");
  }

  function handleNewPatient() {
    if (window.confirm("Mulai sesi untuk pasien baru? Sesi sebelumnya telah tersimpan di database.")) {
      setMessages([pesanAwal]);
      setError(null);
      setInput("");
      setSearchQuery("");
      fetchRiwayat();
    }
  }

  function handleEditDescription() {
    const keluhanTerakhir = [...messages].reverse().find(m => m.role === "user");
    if (keluhanTerakhir) {
      setInput(keluhanTerakhir.content);
      inputRef.current?.focus();
    } else {
      alert("Belum ada keluhan yang bisa diedit.");
    }
  }

  function handleExport() {
    const textToCopy = messages.map(m => `${m.role === 'doctor' ? '🏥 AI Klinik' : '👤 Pasien'}:\n${m.content}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(textToCopy);
    alert("✅ Riwayat konsultasi berhasil disalin!");
  }

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Gagal membuka jendela cetak. Izinkan pop-up pada browser Anda.");
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lembar Rekam Medis - Klinik Harapan Sehat</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 800px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 25px; }
            .header h1 { color: #0d9488; margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0; color: #666; font-size: 14px; }
            .section { margin-bottom: 20px; }
            .section h3 { font-size: 16px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
            .chat-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 10px; line-height: 1.5; white-space: pre-wrap; }
            .footer { margin-top: 40px; text-align: right; font-size: 14px; }
            .footer .signature { margin-top: 60px; font-weight: bold; text-decoration: underline; }
            @media print { body { padding: 10px; } button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KLINIK HARAPAN SEHAT</h1>
            <p>Jl. Kesehatan No. 128, Telepon: (021) 555-8998</p>
            <p><strong>LEMBAR RESMI REKAM MEDIS & DIAGNOSIS AI</strong></p>
          </div>
          <div class="section">
            <h3>Waktu Pemeriksaan:</h3>
            <p>${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
          <div class="section">
            <h3>Riwayat Konsultasi & Hasil Analisis:</h3>
            ${messages.map(m => `
              <div class="chat-box">
                <strong>${m.role === 'doctor' ? '🏥 Dr. Anda (AI Klinik)' : '👤 Pasien'}:</strong><br/>
                ${m.content}
              </div>
            `).join('')}
          </div>
          <div class="footer"><p>Dokter Jaga Pemeriksa,</p><div class="signature">( Dr. Jaga Klinik )</div></div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  // ========================================================
  // ✨ PERBAIKAN: FETCH OTOMATIS MENGIKUTI ALAMAT BROWSER
  // ========================================================
  async function sendMessage(text: string) {
    if (!text || loading) return;
    const userMsg: ChatMessage = { id: makeId(), role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError(null);

 try {
      const res = await fetch('https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      
      if (!res.ok) throw new Error("Server sedang sibuk");
      const data = await res.json();
      setMessages([...updated, { id: makeId(), role: "doctor", content: data.pesan }]);
      fetchRiwayat();
  }

  function handleSubmit(e?: FormEvent) { e?.preventDefault(); sendMessage(input.trim()); }

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-fade-in text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-600"></div>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-inner">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Login Sistem Klinik</h1>
          <p className="mt-2 text-sm text-slate-500 mb-8">Masukkan PIN Keamanan Anda.<br/>(Gunakan PIN Dokter atau PIN Admin Server)</p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="password" 
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN"
                className={`w-full rounded-xl border-2 py-4 pl-12 pr-4 text-center text-xl tracking-[0.3em] font-bold text-slate-800 focus:outline-none transition-all ${pinError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:border-teal-500'}`}
                autoFocus
              />
            </div>
            {pinError && <p className="text-xs text-red-500 font-medium animate-pulse">PIN yang Anda masukkan salah. Coba lagi.</p>}
            <button type="submit" className="w-full rounded-xl bg-slate-800 py-4 font-bold text-white shadow-lg transition hover:bg-slate-900 flex items-center justify-center gap-2">
              Masuk / Buka Kunci <ChevronRight className="h-5 w-5" />
            </button>
          </form>
          <div className="mt-8 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
            <span>© {new Date().getFullYear()} Harapan Sehat</span>
            <span className="flex items-center gap-1"><Server className="w-3 h-3"/> Server: Online</span>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="flex min-h-screen bg-slate-900 text-slate-200 p-6">
        <div className="max-w-5xl w-full mx-auto">
          <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                <Server className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Server Control</h1>
                <p className="text-slate-400 text-sm">Dashboard Pengelolaan Database Klinik Harapan Sehat</p>
              </div>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium text-sm flex items-center gap-2 transition-all border border-red-500/20">
              <Lock className="w-4 h-4" /> Keluar (Log Out)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Database className="w-24 h-24" /></div>
              <h3 className="text-slate-400 font-medium text-sm mb-1">Total Pasien Terdaftar</h3>
              <p className="text-4xl font-bold text-white">{history.length}</p>
              <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><Activity className="w-3 h-3"/> Terhubung dengan SQLite</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Server className="w-24 h-24" /></div>
              <h3 className="text-slate-400 font-medium text-sm mb-1">Status Server API</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-2">ONLINE</p>
              <p className="text-slate-500 text-xs mt-2">Port: 8000 | Network: Local</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-24 h-24" /></div>
              <h3 className="text-slate-400 font-medium text-sm mb-1">Pengguna Sistem</h3>
              <p className="text-lg font-bold text-white mt-1">2 Role Aktif</p>
              <p className="text-slate-400 text-xs mt-1">• Admin Server</p>
              <p className="text-slate-400 text-xs">• Dokter Pemeriksa</p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-white font-bold pb-4 border-b border-slate-700">
              <Settings className="w-5 h-5 text-indigo-400" /> Log Riwayat Database
            </div>
            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm italic">Belum ada data terekam di database.</p>
              ) : (
                history.map((item, idx) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <div className="truncate pr-4 text-sm font-medium text-slate-300">
                      {idx + 1}. {item.title}
                    </div>
                    <div className="text-xs text-slate-500 shrink-0 bg-slate-800 px-2 py-1 rounded">
                      {item.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === "doctor" && currentView === "dashboard") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl animate-fade-in relative z-10">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md text-2xl font-bold">🏥</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Klinik Harapan Sehat</h1>
              <p className="text-sm text-slate-500">Dashboard Utama Ruang Dokter</p>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">PILIH MENU OPERASIONAL</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => {
                setMessages([pesanAwal]);
                setError(null);
                setInput("");
                setCurrentView("chat");
              }} 
              className="text-left p-6 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all flex items-center gap-4 group shadow-sm"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">🩺</div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Konsultasi Pasien Baru</h2>
                <p className="text-xs text-slate-500 mt-0.5">Buka ruang rekam medis AI & analisis gejala.</p>
              </div>
            </button>

            <button 
              onClick={() => setCurrentView("archive")}
              className="text-left p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center gap-4 shadow-sm group cursor-pointer"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-700 text-white flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform">📁</div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">Database Arsip Pasien</h2>
                <p className="text-xs text-slate-500 mt-0.5">Lihat daftar riwayat konsultasi pasien lama.</p>
              </div>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Login sebagai: <strong>Dokter Pemeriksa</strong></span>
            <button onClick={handleLogout} className="text-red-500 hover:underline font-medium flex items-center gap-1">
               Kunci Layar <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === "doctor" && currentView === "archive") {
    return (
      <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden animate-fade-in">
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView("dashboard")} className="p-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition text-slate-600 flex items-center gap-2 px-4 text-sm font-semibold">
              <ArrowLeft className="h-4 w-4" /> Kembali ke Menu
            </button>
            <div className="hidden sm:block border-l border-slate-300 pl-4">
              <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-500" /> Arsip Rekam Medis
              </h1>
            </div>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari keluhan atau tanggal pasien..."
              className="w-full rounded-full bg-white border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-32">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-slate-400 mb-4 shadow-inner">
                  <Database className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-700">Tidak ada arsip ditemukan</h2>
                <p className="text-sm text-slate-500 mt-2">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-default flex flex-col justify-between min-h-[160px]">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-3 mb-2 leading-relaxed">{item.title}</h3>
                    </div>
                    <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 w-full justify-between">
                      Lihat Rekam Medis <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50">
        
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex w-full items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView("dashboard")} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm" title="Kembali ke Dashboard">
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md">
                  <Heart className="h-5 w-5" fill="currentColor" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 leading-tight">Konsultasi AI (Pasien Baru)</h1>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Klinik Harapan Sehat
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={handleEditDescription} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 shadow-sm">
                <Edit className="h-3.5 w-3.5" /> Edit deskripsi
              </button>
            </div>
          </div>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-5">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} onSend={sendMessage} />
            ))}
            {loading && <TypingIndicator />}
            {error && <div className="mx-auto rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}
            
            {messages.length <= 1 && !loading && (
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)} className="rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-medium text-teal-700 shadow-sm transition-all hover:bg-teal-50 hover:scale-105">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {messages.length > 2 && !loading && (
              <div className="mt-4 flex flex-col items-center justify-center gap-3 border-t border-slate-200/60 pt-6 pb-2">
                <p className="text-xs text-slate-500">Hasil diagnosis sudah lengkap?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 shadow-md">
                    <Download className="h-3.5 w-3.5" /> Cetak Rekam Medis
                  </button>
                  <button onClick={handleExport} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm">
                    <Download className="h-3.5 w-3.5" /> Salin Laporan
                  </button>
                  <button onClick={() => sendMessage("Tolong berikan analisis lanjutan yang lebih mendalam.")} className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-100 shadow-sm">
                    <Wand2 className="h-3.5 w-3.5" /> Analisis Lanjutan
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <form onSubmit={handleSubmit} className="border-t border-slate-200/60 bg-white/90 backdrop-blur-md px-4 py-4 shrink-0">
          <div className="mx-auto flex max-w-4xl items-end gap-2">
            <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                rows={1}
                className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-32"
                placeholder="Tulis keluhan pasien di sini..."
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading || !input.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
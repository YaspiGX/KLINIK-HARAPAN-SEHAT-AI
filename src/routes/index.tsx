import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Send, Stethoscope, User2, Loader2, Heart, Sparkles, 
  MessageSquare, X, ChevronRight, AlertCircle, LayoutDashboard,
  FolderKanban, ClipboardList, Users, UserPlus, Building2, 
  BedDouble, Pill, LogOut, Menu, ShieldAlert
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Klinik & Apotek Harapan Sehat — SIMRS" }] }),
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
    <div className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-md ring-2 ring-white " + (isDoctor ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-700")}>
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
    <div className={`flex items-end gap-2 my-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar role="doctor" />}
      <div className={"relative max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed " + (isUser ? "rounded-br-sm bg-teal-600 text-white font-medium" : "rounded-bl-sm bg-white text-slate-800 border border-slate-200")}>
        <div className={!isUser ? "pr-6" : ""}>
          <ReactMarkdown components={{
              p: ({ node, ...props }) => <p className={`mb-2 last:mb-0 ${isUser ? "text-white" : "text-slate-800"}`} {...props} />,
              strong: ({ node, ...props }) => <strong className={`font-semibold ${isUser ? "text-white" : "text-slate-900"}`} {...props} />,
            }}>{mainText}</ReactMarkdown>

          {questions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex flex-col gap-1.5">
                {questions.map((q, i) => {
                  const cleanQ = q.replace(/^[\d\.\-\*]\s*/, '').replace(/\*\*/g, '').trim();
                  if (!cleanQ) return null;
                  return (
                    <button key={i} onClick={() => onSend(cleanQ)} className="text-left w-full rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-xs font-medium text-teal-800 transition hover:bg-teal-100">
                      {cleanQ}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {recommendationText && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5">
              <p className="text-[10px] font-bold text-amber-700 mb-0.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> REKOMENDASI MEDIS</p>
              <p className="text-xs text-amber-900 leading-relaxed">{recommendationText}</p>
            </div>
          )}
        </div>
      </div>
      {isUser && <Avatar role="user" />}
    </div>
  );
}

function Index() {
  // --- STATE LOGIN & SISTEM ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("administrator");
  const [password, setPassword] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("Poli Umum");
  const [showPassword, setShowPassword] = useState(false);
  
  // --- STATE DASHBOARD ---
  const [activeMenu, setActiveMenu] = useState("DASHBOARD");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // --- STATE AI CHAT ---
  const [isOpen, setIsOpen] = useState(false);
  const pesanAwal = { id: makeId(), role: "doctor" as const, content: "Halo! Ada yang bisa saya bantu terkait keluhan kesehatan Anda hari ini? 👋" };
  const [messages, setMessages] = useState<ChatMessage[]>([pesanAwal]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  async function sendMessage(text: string) {
    if (!text || loading) return;
    const userMsg: ChatMessage = { id: makeId(), role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const endpoint = selectedRoom === "Poli Gigi" 
        ? "https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi/gigi"
        : "https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi/umum";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      
      if (!res.ok) throw new Error("Server sibuk");
      const data = await res.json();
      setMessages([...updated, { id: makeId(), role: "doctor", content: data.pesan }]);
    } catch {
      setMessages([...updated, { id: makeId(), role: "doctor", content: "Maaf, gagal terhubung ke server AI Railway." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e?: FormEvent) { 
    e?.preventDefault(); 
    sendMessage(input.trim()); 
  }

  // ==========================================
  // 1. TAMPILAN HALAMAN LOGIN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-30 filter blur-sm"></div>
        
        <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 mx-4">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-sm shadow">S</span>
              <span className="bg-teal-700 text-white font-bold px-2.5 py-1 rounded text-sm shadow">H</span>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Harapan Sehat</h1>
            </div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">pasti mudah 🩺</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Poli Umum">Poli Umum / Admisi</option>
                <option value="Poli Gigi">Poli Gigi & Mulut</option>
                <option value="UGD">UGD (Gawat Darurat)</option>
                <option value="Apotek">Apotek & Farmasi</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                id="showPass"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="showPass" className="cursor-pointer">Lihat Password</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-200 text-sm"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => alert("Silakan hubungi Administrator IT Klinik untuk pendaftaran akun baru.")}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-md transition duration-200 text-sm"
            >
              Daftar
            </button>
            <div className="text-center mt-3">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Instruksi pemulihan dikirim ke admin."); }} className="text-xs text-slate-500 hover:underline">
                Lupa Password
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. TAMPILAN DASHBOARD SIMRS UTAMA
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* SIDEBAR MENU */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30 shrink-0 shadow-sm`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded text-xs">SH</span>
              <span className="font-extrabold text-sm text-slate-800">Harapan Sehat</span>
            </div>
          ) : (
            <span className="font-bold text-emerald-600 mx-auto">SH</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {[
            { name: "DASHBOARD", icon: LayoutDashboard },
            { name: "PROGRAM KERJA 2026", icon: FolderKanban },
            { name: "PROGRAM KERJA 2025", icon: FolderKanban },
            { name: "SURVEY", icon: ClipboardList },
            { name: "ADMISI & OPERASIONAL", icon: Building2 },
            { name: "PENDAFTARAN", icon: UserPlus },
            { name: "PERAWAT POLI", icon: Users },
            { name: "POLI RAWAT JALAN", icon: Stethoscope },
            { name: "UGD", icon: ShieldAlert },
            { name: "OBSERVASI", icon: ClipboardList },
            { name: "RAWAT INAP", icon: BedDouble },
            { name: "APOTEK", icon: Pill },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive ? "bg-teal-700 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </div>
                {sidebarOpen && <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? "rotate-90" : ""}`} />}
              </button>
            );
          })}
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-800 rounded-full border border-teal-200">
              Ruangan: {selectedRoom}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-base font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-inner">
              {currentTime}
            </div>

            <div className="flex items-center gap-2 border-l pl-6 border-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shadow-inner">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{username} ({selectedRoom})</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Online</p>
              </div>
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </header>

        {/* BODY DASHBOARD */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-teal-600" /> Dashboard Utama — {activeMenu}
              </h2>
              <p className="text-xs text-slate-500">Statistik real-time operasional Klinik & Apotek Harapan Sehat.</p>
            </div>
            <div className="text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
              📅 Periode: 2026-08-03 s/d 2026-08-10
            </div>
          </div>

          {/* KARTU STATISTIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Kunjungan Pasien", val: "1.697", color: "border-l-4 border-l-sky-500 text-sky-600" },
              { title: "Total Pasien Lama", val: "1.390", color: "border-l-4 border-l-emerald-500 text-emerald-600" },
              { title: "Pasien Baru", val: "307", color: "border-l-4 border-l-amber-500 text-amber-600" },
              { title: "Total Terlayani", val: "1.426", color: "border-l-4 border-l-indigo-500 text-indigo-600" },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 ${stat.color} flex flex-col justify-between`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-3">{stat.val}</h3>
              </div>
            ))}
          </div>

          {/* AREA GRAFIK ANALITIK SIMULASI */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Grafik Tren Kunjungan Harian Pasien</h3>
              <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-2 py-1 rounded">Live Data</span>
            </div>
            <div className="h-64 w-full bg-gradient-to-t from-sky-100/60 to-white rounded-xl border border-sky-100 flex items-end justify-between p-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none">
                <div className="w-full border-b border-dashed border-slate-400"></div>
              </div>
              {[240, 260, 220, 270, 210, 230, 160, 195, 250, 280].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10">
                  <div style={{ height: `${h * 0.7}px` }} className="w-8 bg-sky-500/80 hover:bg-sky-600 rounded-t-md transition-all shadow"></div>
                  <span className="text-[10px] text-slate-500 font-mono">H-{10-i}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* FLOATING AI DIAGNOSTIC CHAT ASSISTANT */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-[360px] md:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center border border-teal-500">
                  <Heart className="h-4 w-4 text-white" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Asisten AI ({selectedRoom})</h3>
                  <p className="text-[10px] text-teal-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Terhubung ke Railway API
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-teal-200 hover:text-white p-1 rounded-lg transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onSend={sendMessage} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 my-2">
                  <Avatar role="doctor" />
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
                {QUICK_PROMPTS.map((p) => (
                  <button key={p} onClick={() => sendMessage(p)} className="shrink-0 rounded-full border border-teal-200 bg-teal-50/50 px-3 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-100">
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                rows={1}
                placeholder={`Tanya AI seputar ${selectedRoom}...`}
                className="flex-1 resize-none bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 max-h-20"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shadow-sm">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tombol Mengambang AI */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-teal-600 text-white shadow-xl flex items-center justify-center hover:bg-teal-700 transition-all hover:scale-105 relative group"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></span>
        </button>
      </div>

    </div>
  );
}
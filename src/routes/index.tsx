import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Send, Stethoscope, User2, Loader2, Heart, Sparkles, 
  MessageSquare, X, ChevronRight, AlertCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Klinik Harapan Sehat — AI Assistant" }] }),
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
  const [isOpen, setIsOpen] = useState(false);
  const pesanAwal = { id: makeId(), role: "doctor" as const, content: "Halo! Ada yang bisa saya bantu terkait keluhan kesehatan Anda hari ini? 👋" };
  const [messages, setMessages] = useState<ChatMessage[]>([pesanAwal]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
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
      const res = await fetch("https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      
      if (!res.ok) throw new Error("Server sibuk");
      const data = await res.json();
      setMessages([...updated, { id: makeId(), role: "doctor", content: data.pesan }]);
    } catch {
      setMessages([...updated, { id: makeId(), role: "doctor", content: "Maaf, gagal terhubung ke server AI." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e?: FormEvent) { 
    e?.preventDefault(); 
    sendMessage(input.trim()); 
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
      <nav className="bg-white sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-xl text-white shadow-md">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-teal-800 leading-tight">Klinik Harapan Sehat</h1>
              <p className="text-[10px] font-semibold text-teal-600 tracking-wider uppercase">Melayani dengan Hati</p>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-teal-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="py-1 px-3 rounded-full bg-teal-800 text-teal-200 text-xs font-bold tracking-wider mb-4 inline-block">
            LAYANAN KESEHATAN TERPADU
          </span>
          <h2 className="text-4xl font-extrabold mb-4">Kesehatan Keluarga Anda Prioritas Kami</h2>
          <p className="text-teal-100 text-sm leading-relaxed">
            Silakan gunakan widget konsultasi AI di pojok kanan bawah untuk bertanya seputar keluhan medis atau konsultasi cepat secara instan.
          </p>
        </div>
      </header>

      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-[360px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center border border-teal-500">
                  <Heart className="h-4 w-4 text-white" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Asisten Klinik AI</h3>
                  <p className="text-[10px] text-teal-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online siap membantu
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
                placeholder="Tulis keluhan pasien..."
                className="flex-1 resize-none bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 max-h-20"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50 shadow-sm">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

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
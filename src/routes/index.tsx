import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Stethoscope, Loader2, Sparkles, X, LayoutDashboard,
  LogOut, Menu
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// ==========================================
// INISIALISASI ROUTER (VITE / TANSTACK)
// ==========================================
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Klinik & Apotek Harapan Sehat — SIMRS" }] }),
  component: Index,
});

function Index() {
  // --- STATE LOGIN & SISTEM ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("dr_arka");
  const [password, setPassword] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("Poli Umum");
  const [showPassword, setShowPassword] = useState(false);
  
  // --- STATE DASHBOARD ---
  const [activeMenu, setActiveMenu] = useState("POLI RAWAT JALAN");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // ==========================================
  // STATE BARU UNTUK FORM REKAM MEDIS & AI MODAL
  // ==========================================
  const [formData, setFormData] = useState({
    nama: "Rayi Amada Surya Ridwan",
    umur: "18",
    jenis_kelamin: "Laki-laki",
    tensi: "120/80",
    keluhan: "",
    riwayat: "Tidak ada alergi obat."
  });

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // FUNGSI INTI: TRIGGER BANTUAN HsDX
  // ==========================================
  const handleBantuanAI = async () => {
    if (!formData.keluhan.trim()) {
      alert("Keluhan pasien tidak boleh kosong sebelum menjalankan analisis.");
      return;
    }

    setShowAiModal(true);
    setAiLoading(true);
    setAiResult("");

    // 1. Injeksi Konteks: Menggabungkan data form menjadi 1 prompt utuh
    const autoPrompt = `Lakukan skrining medis. \nUsia: ${formData.umur} tahun \nGender: ${formData.jenis_kelamin} \nTensi: ${formData.tensi} \nKeluhan Utama: ${formData.keluhan} \nRiwayat: ${formData.riwayat}`;

    try {
      // 2. Tembak ke API Groq Railway
      const endpoint = selectedRoom === "Poli Gigi" 
        ? "https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi/gigi"
        : "https://klinik-harapan-sehat-ai-production-3384.up.railway.app/konsultasi/umum";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: autoPrompt }] 
        }),
      });

      if (!response.ok) throw new Error("Server sibuk");
      
      const data = await response.json();
      setAiResult(data.pesan);
    } catch (error) {
      setAiResult("⚠️ Gagal memuat analisis HsDX dari server. Pastikan API Railway online.");
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // 1. TAMPILAN HALAMAN LOGIN
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center opacity-30 filter blur-sm"></div>
        <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 mx-4">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Harapan Sehat (Testing Mode)</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-200 text-sm">Masuk Sistem Uji</button>
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
          <span className="font-extrabold text-sm text-slate-800">{sidebarOpen ? "Harapan Sehat" : "SH"}</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"><Menu className="w-5 h-5" /></button>
        </div>
        
<div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {[
            { name: "POLI RAWAT JALAN", icon: Stethoscope },
            { name: "DASHBOARD", icon: LayoutDashboard },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button key={item.name} onClick={() => setActiveMenu(item.name)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${isActive ? "bg-teal-700 text-white shadow-md" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                <div className="flex items-center gap-3"><Icon className="w-4 h-4 shrink-0" />{sidebarOpen && <span className="truncate">{item.name}</span>}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm">
          <div className="flex items-center gap-4"><span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-800 rounded-full border border-teal-200">Ruangan: {selectedRoom}</span></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition border border-red-200"><LogOut className="w-3.5 h-3.5" /> Keluar</button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* AREA PENGUJIAN: FORM REKAM MEDIS & TOMBOL HsDX */}
        {/* ============================================================== */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-4">
              <Stethoscope className="w-5 h-5 text-teal-600" /> Form Pemeriksaan Medis (Mode Pengujian)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolom Kiri: Identitas Pasien */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nama Pasien</label>
                  <input type="text" value={formData.nama} disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Usia</label>
                    <input type="text" value={formData.umur} onChange={(e) => setFormData({...formData, umur: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                    <select value={formData.jenis_kelamin} onChange={(e) => setFormData({...formData, jenis_kelamin: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500">
                      <option>Laki-laki</option>
                      <option>Perempuan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tanda Vital (Tensi)</label>
                  <input type="text" value={formData.tensi} onChange={(e) => setFormData({...formData, tensi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500" />
                </div>
              </div>

              {/* Kolom Kanan: Klinis & Tombol HsDX */}
              <div className="space-y-4 flex flex-col">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Keluhan Utama (Anamnesis)</label>
                  <textarea 
                    value={formData.keluhan} 
                    onChange={(e) => setFormData({...formData, keluhan: e.target.value})} 
                    placeholder="Contoh: Pasien mengeluh pusing berputar, mual, dan pandangan gelap saat berdiri..."
                    className="w-full h-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 resize-none"
                  />
                </div>
                
                {/* 🎯 INI ADALAH TOMBOL HsDX */}
                <button 
                  onClick={handleBantuanAI}
                  disabled={aiLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  {aiLoading ? "Memproses HsDX..." : "Jalankan HsDX"}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* ============================================================== */}
        {/* MODAL / POPUP HASIL HsDX */}
        {/* ============================================================== */}
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-[90%] md:w-[700px] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all">
              
              <div className="bg-indigo-700 p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-200" /> Hasil Analisis HsDX
                </h3>
                <button onClick={() => setShowAiModal(false)} className="hover:bg-indigo-600 p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 opacity-80">
                    <div className="relative mb-6">
                      <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-ping absolute"></div>
                      <Loader2 className="w-12 h-12 animate-spin text-indigo-600 relative z-10" />
                    </div>
                    <p className="font-mono text-sm text-indigo-900 font-semibold text-center">
                      Mengekstraksi parameter klinis pasien...<br/>
                      <span className="text-xs font-normal text-slate-500">Menganalisis matriks diagnostik...</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm text-sm text-slate-800 leading-relaxed">
                    <ReactMarkdown components={{
                      h3: ({node, ...props}) => <h3 className="text-indigo-800 font-black text-base mt-4 mb-2 border-b border-indigo-50 pb-1" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-slate-700" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-extrabold text-slate-900" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />
                    }}>
                      {aiResult}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              
              <div className="bg-white border-t border-slate-200 p-4 shrink-0 bg-slate-100/50">
                <p className="text-[10px] text-slate-500 text-center font-medium">
                  ⚠️ HsDX hanya sebagai asisten sekunder. Keputusan klinis mutlak berada di tangan Dokter Penanggung Jawab.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
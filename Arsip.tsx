import React, { useState, useEffect } from 'react';

export default function ArsipRekamMedis({ onBack }: { onBack: () => void }) {
  const [arsip, setArsip] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Pop-up Detail & Edit
  const [selectedData, setSelectedData] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editKeluhan, setEditKeluhan] = useState('');
  const [editJawaban, setEditJawaban] = useState('');

  // 1. FUNGSI MENARIK DATA DARI PYTHON
  const fetchArsip = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/riwayat');
      const data = await response.json();
      setArsip(data);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArsip();
  }, []);

  // Filter pencarian
  const filteredArsip = arsip.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.includes(searchQuery)
  );

  // 2. FUNGSI MEMBUKA DETAIL (DEKRIPSI FULL)
  const openDetail = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/riwayat/${id}`);
      const data = await response.json();
      setSelectedData(data);
      setEditKeluhan(data.keluhan_pasien);
      setEditJawaban(data.jawaban_ai);
      setIsEditing(false);
    } catch (error) {
      alert("Gagal membuka detail data.");
    }
  };

  // 3. FUNGSI MENYIMPAN HASIL EDIT (ENKRIPSI ULANG)
  const handleSaveEdit = async () => {
    if (!selectedData) return;
    try {
      const response = await fetch(`http://localhost:8000/riwayat/${selectedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keluhan_pasien: editKeluhan,
          jawaban_ai: editJawaban
        })
      });
      if (response.ok) {
        alert("Data berhasil diubah dan dikunci ulang! 🔒");
        setSelectedData(null);
        fetchArsip(); // Refresh tabel
      }
    } catch (error) {
      alert("Gagal menyimpan data.");
    }
  };

  // 4. FUNGSI MENGHAPUS DATA
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus rekam medis ini selamanya?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/riwayat/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert("Data berhasil dihapus! 🗑️");
        setSelectedData(null);
        fetchArsip(); // Refresh tabel
      }
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span>←</span> Kembali ke Menu
          </button>
          <div className="w-px h-6 bg-slate-300 mx-2"></div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            🗄️ Arsip Rekam Medis
          </h1>
        </div>
        
        {/* KOLOM SEARCH */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Cari keluhan atau tanggal pasien..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-4 top-2.5 text-slate-400">🔍</span>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-slate-500">Memuat data aman... 🔒</div>
        ) : filteredArsip.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-5xl">🗃️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tidak ada arsip ditemukan</h2>
            <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain atau data memang kosong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArsip.map((item) => (
              <div 
                key={item.id} 
                onClick={() => openDetail(item.id)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                    ID: {item.id}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                </div>
                <h3 className="text-slate-800 font-medium leading-relaxed">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* POP-UP DETAIL & EDIT */}
      {selectedData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Pop-up Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? '✏️ Edit Rekam Medis' : '📄 Detail Rekam Medis'}
              </h2>
              <button onClick={() => setSelectedData(null)} className="text-slate-400 hover:text-red-500 text-2xl font-bold">×</button>
            </div>

            {/* Pop-up Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Keluhan Pasien (Dekripsi):</label>
                {isEditing ? (
                  <textarea 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    value={editKeluhan}
                    onChange={(e) => setEditKeluhan(e.target.value)}
                  />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-slate-800 border">{selectedData.keluhan_pasien}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jawaban / Diagnosis AI (Dekripsi):</label>
                {isEditing ? (
                  <textarea 
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[250px]"
                    value={editJawaban}
                    onChange={(e) => setEditJawaban(e.target.value)}
                  />
                ) : (
                  <div className="p-4 bg-blue-50/50 rounded-xl text-slate-800 border whitespace-pre-wrap">
                    {selectedData.jawaban_ai}
                  </div>
                )}
              </div>
            </div>

            {/* Pop-up Footer (Tombol Aksi) */}
            <div className="px-6 py-4 border-t bg-slate-50 flex justify-between items-center">
              <button 
                onClick={() => handleDelete(selectedData.id)}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 font-semibold rounded-lg transition-colors"
              >
                Hapus Data
              </button>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 bg-white border hover:bg-slate-50 font-semibold rounded-lg transition-colors">Batal</button>
                    <button onClick={handleSaveEdit} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors">Simpan & Enkripsi</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-white bg-slate-800 hover:bg-slate-900 font-semibold rounded-lg transition-colors">
                    Edit Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
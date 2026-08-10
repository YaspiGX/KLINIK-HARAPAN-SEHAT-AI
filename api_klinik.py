from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from cryptography.fernet import Fernet
from pydantic import BaseModel
from google import genai
from google.genai import types
import sqlite3
import os

# ==========================================
# 🛡️ KUNCI RAHASIA ENKRIPSI DATABASE
# ==========================================
SECRET_ENCRYPTION_KEY = b'vS-hEbxZ97z9O-_fGWeYvYkM2_P8_kS3R5U5y3V7wQA='
cipher_suite = Fernet(SECRET_ENCRYPTION_KEY)

def encrypt_data(text: str) -> str:
    if not text: return ""
    return cipher_suite.encrypt(text.encode('utf-8')).decode('utf-8')

def decrypt_data(text: str) -> str:
    if not text: return ""
    try:
        return cipher_suite.decrypt(text.encode('utf-8')).decode('utf-8')
    except Exception:
        return text 

# ==========================================
# 🔑 INISIALISASI CLIENT GEMINI TERBARU
# ==========================================
api_key = "AQ.Ab8RN6Kgmbt5iVvfw-nsr0FGuvXhxHEgl7vvnerjV88YN_HiEQ"
client = genai.Client(api_key=api_key)

app = FastAPI()

# ==========================================
# 🌐 BUKA GERBANG CORS
# ==========================================
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

# ==========================================
# 🗄️ INISIALISASI DATABASE
# ==========================================
DB_UMUM = 'klinik_umum.db'
DB_GIGI = 'klinik_gigi.db'

def init_db(db_name):
    try:
        conn = sqlite3.connect(db_name, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS riwayat_chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                keluhan_pasien TEXT,
                jawaban_ai TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        try:
            cursor.execute('ALTER TABLE riwayat_chat ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
        except sqlite3.OperationalError:
            pass 
        conn.commit()
        conn.close()
        print(f"Database {db_name} siap & aman! 🔒✅")
    except Exception as e:
        print(f"Gagal inisialisasi {db_name}: {e} ❌")

init_db(DB_UMUM)
init_db(DB_GIGI)

def baca_buku_medis(filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as file:
            return file.read()
    elif os.path.exists("Buku_medis.txt"):
        with open("Buku_medis.txt", "r", encoding="utf-8") as file:
            return file.read()
    return "Gunakan pengetahuan medismu sendiri karena referensi tidak ditemukan."

class EditData(BaseModel):
    keluhan_pasien: str
    jawaban_ai: str

# ==========================================
# 🧠 LOGIK AI GEMINI (SDK GOOGLE-GENAI TERBARU)
# ==========================================
async def handle_konsultasi_logic(request: Request, db_file: str, buku_file: str, role_title: str):
    try:
        data = await request.json()
        raw_messages = data.get("messages", []) 
        
        gemini_messages = []
        for msg in raw_messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append({"role": role, "parts": [{"text": msg["content"]}]})
            
        referensi_klinik = baca_buku_medis(buku_file)

        # --- 1. Tahap Berpikir (Thought Process) ---
        thought_instruction = f"""Kamu adalah asisten medis spesialis {role_title} di Klinik Harapan Sehat.
        PEDOMAN: {referensi_klinik}
        TUGASMU: Analisis gejala pasien HANYA berdasarkan Buku Pedoman di atas. Jangan jawab pasien sekarang, tuliskan analisis internalmu."""
        
        thought_response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=gemini_messages,
            config=types.GenerateContentConfig(
                system_instruction=thought_instruction
            )
        )
        thought = thought_response.text

        # --- 2. Tahap Pembuatan Jawaban Final ---
        final_instruction = f"""Kamu adalah mesin diagnosis {role_title} cerdas ala DxGPT.
        Ini adalah hasil analisis internalmu: {thought}.
        
        INSTRUKSI FORMATTING (WAJIB DIIKUTI SUPAYA TAMPILANNYA SAMA PERSIS DXGPT):
        Berikan 3 kemungkinan diagnosis teratas dengan format persis seperti ini untuk setiap nomor:

        ### 1. [Nama Penyakit Utama]
        [Deskripsi singkat mengenai penyakit tersebut]
        - **Matching symptoms:** [Sebutkan gejala pasien yang cocok dengan penyakit ini]
        - **Non-matching symptoms:** [Sebutkan gejala atau kondisi pasien yang tidak ada/tidak cocok, atau tulis 'None']

        ### 2. [Nama Penyakit Banding Pertama]
        [Deskripsi singkat]
        - **Matching symptoms:** [...]
        - **Non-matching symptoms:** [...]

        ### 3. [Nama Penyakit Banding Kedua]
        [Deskripsi singkat]
        - **Matching symptoms:** [...]
        - **Non-matching symptoms:** [...]

        Di bagian paling bawah, berikan tombol pertanyaan lanjutan dengan format persis ini:
        PERTANYAAN LANJUTAN UNTUK MEMASTIKAN:
        a. [Pertanyaan pertama]
        b. [Pertanyaan kedua]
        c. [Pertanyaan ketiga]

        Di bagian akhir, gunakan format kotak peringatan:
        ⚠️ **REKOMENDASI MEDIS:** [Saran tindakan medis darurat atau rujukan spesialis. AMBIL DARI BUKU PEDOMAN JIKA ADA]."""
        
        final_response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=gemini_messages,
            config=types.GenerateContentConfig(
                system_instruction=final_instruction
            )
        )
        pesan_ai = final_response.text
        
        pesan_pasien = raw_messages[-1]["content"] if raw_messages else "Pesan kosong"
        
        encrypted_pasien = encrypt_data(pesan_pasien)
        encrypted_ai = encrypt_data(pesan_ai)
        
        conn = sqlite3.connect(db_file, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO riwayat_chat (keluhan_pasien, jawaban_ai) VALUES (?, ?)', (encrypted_pasien, encrypted_ai))
        conn.commit()
        conn.close()
        print(f"Berhasil menyimpan riwayat {role_title} TERENKRIPSI! 🔒✅")

        return {"pesan": pesan_ai}
    except Exception as e:
        error_msg = str(e)
        print(f"Error AI Detail: {error_msg}")
        return {"pesan": f"⚠️ DEBUG ERROR AI: {error_msg}"}

# ==========================================
# 🩺 ENDPOINT RUTING UTAMA
# ==========================================
@app.get("/")
async def root():
    return {"status": "Server Klinik Harapan Sehat API Online! 🚀"}

@app.post("/konsultasi/umum")
async def konsultasi_umum(request: Request):
    return await handle_konsultasi_logic(request, DB_UMUM, "buku_umum.txt", "Dokter Umum")

@app.get("/riwayat/umum")
async def get_riwayat_umum():
    return ambil_riwayat(DB_UMUM)

@app.get("/riwayat/umum/{item_id}")
async def get_detail_umum(item_id: int):
    return ambil_detail(DB_UMUM, item_id)

@app.put("/riwayat/umum/{item_id}")
async def edit_umum(item_id: int, data: EditData):
    return edit_data_logic(DB_UMUM, item_id, data)

@app.delete("/riwayat/umum/{item_id}")
async def hapus_umum(item_id: int):
    return hapus_data_logic(DB_UMUM, item_id)

@app.get("/riwayat")
async def get_riwayat_alias():
    return ambil_riwayat(DB_UMUM)

@app.post("/konsultasi")
async def konsultasi_alias(request: Request):
    return await handle_konsultasi_logic(request, DB_UMUM, "buku_umum.txt", "Dokter Umum")

@app.post("/konsultasi/gigi")
async def konsultasi_gigi(request: Request):
    return await handle_konsultasi_logic(request, DB_GIGI, "buku_gigi.txt", "Dokter Gigi")

@app.get("/riwayat/gigi")
async def get_riwayat_gigi():
    return ambil_riwayat(DB_GIGI)

@app.get("/riwayat/gigi/{item_id}")
async def get_detail_gigi(item_id: int):
    return ambil_detail(DB_GIGI, item_id)

@app.put("/riwayat/gigi/{item_id}")
async def edit_gigi(item_id: int, data: EditData):
    return edit_data_logic(DB_GIGI, item_id, data)

@app.delete("/riwayat/gigi/{item_id}")
async def hapus_gigi(item_id: int):
    return hapus_data_logic(DB_GIGI, item_id)

def ambil_riwayat(db_file):
    try:
        conn = sqlite3.connect(db_file, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT id, keluhan_pasien, created_at FROM riwayat_chat ORDER BY id DESC LIMIT 20")
        rows = cursor.fetchall()
        conn.close()
        result = []
        for r in rows:
            decrypted_keluhan = decrypt_data(str(r[1]) if r[1] else "Pasien Baru")
            judul = f"Pasien: {decrypted_keluhan[:28]}..." if len(decrypted_keluhan) > 28 else f"Pasien: {decrypted_keluhan}"
            result.append({"id": r[0], "title": judul, "date": str(r[2])[:16] if r[2] else ""})
        return result
    except:
        return []

def ambil_detail(db_file, item_id):
    try:
        conn = sqlite3.connect(db_file, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT keluhan_pasien, jawaban_ai, created_at FROM riwayat_chat WHERE id = ?", (item_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {
                "id": item_id,
                "keluhan_pasien": decrypt_data(str(row[0]) if row[0] else ""),
                "jawaban_ai": decrypt_data(str(row[1]) if row[1] else ""),
                "date": str(row[2]) if row[2] else ""
            }
        return {"error": "Data tidak ditemukan"}
    except Exception as e:
        return {"error": str(e)}

def edit_data_logic(db_file, item_id, data):
    try:
        enc_keluhan = encrypt_data(data.keluhan_pasien)
        enc_jawaban = encrypt_data(data.jawaban_ai)
        conn = sqlite3.connect(db_file, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE riwayat_chat 
            SET keluhan_pasien = ?, jawaban_ai = ?
            WHERE id = ?
        ''', (enc_keluhan, enc_jawaban, item_id))
        conn.commit()
        conn.close()
        return {"pesan": "Data berhasil diubah dan dikunci ulang! 🔒"}
    except Exception as e:
        return {"error": str(e)}

def hapus_data_logic(db_file, item_id):
    try:
        conn = sqlite3.connect(db_file, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM riwayat_chat WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()
        return {"pesan": "Data berhasil dihapus selamanya! 🗑️"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/riwayat/admin/semua")
async def get_semua_riwayat_admin():
    semua_data = []
    try:
        conn = sqlite3.connect(DB_UMUM, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT id, keluhan_pasien, created_at FROM riwayat_chat ORDER BY id DESC")
        for r in cursor.fetchall():
            decrypted_keluhan = decrypt_data(str(r[1]) if r[1] else "Pasien Baru")
            judul = f"Pasien: {decrypted_keluhan[:28]}..." if len(decrypted_keluhan) > 28 else f"Pasien: {decrypted_keluhan}"
            semua_data.append({"id": r[0], "db_target": "umum", "ruangan": "Dokter Umum", "badge": "🩺", "title": judul, "date": str(r[2])[:16] if r[2] else ""})
        conn.close()
    except Exception as e:
        pass
    try:
        conn = sqlite3.connect(DB_GIGI, check_same_thread=False)
        cursor = conn.cursor()
        cursor.execute("SELECT id, keluhan_pasien, created_at FROM riwayat_chat ORDER BY id DESC")
        for r in cursor.fetchall():
            decrypted_keluhan = decrypt_data(str(r[1]) if r[1] else "Pasien Baru")
            judul = f"Pasien: {decrypted_keluhan[:28]}..." if len(decrypted_keluhan) > 28 else f"Pasien: {decrypted_keluhan}"
            semua_data.append({"id": r[0], "db_target": "gigi", "ruangan": "Dokter Gigi", "badge": "🦷", "title": judul, "date": str(r[2])[:16] if r[2] else ""})
        conn.close()
    except Exception as e:
        pass
    semua_data.sort(key=lambda x: x["date"], reverse=True)
    return semua_data

@app.delete("/riwayat/admin/{db_target}/{item_id}")
async def admin_hapus_data(db_target: str, item_id: int):
    target_db = DB_UMUM if db_target == "umum" else DB_GIGI
    return hapus_data_logic(target_db, item_id)

@app.put("/riwayat/admin/{db_target}/{item_id}")
async def admin_edit_data(db_target: str, item_id: int, data: EditData):
    target_db = DB_UMUM if db_target == "umum" else DB_GIGI
    return edit_data_logic(target_db, item_id, data)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("api_klinik:app", host="0.0.0.0", port=port)

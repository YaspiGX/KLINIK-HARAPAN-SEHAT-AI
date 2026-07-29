import sqlite3

# 1. Membuat file database (otomatis terbuat kalau belum ada)
conn = sqlite3.connect('klinik_harapan_sehat.db')
cursor = conn.cursor()

# 2. Membuat Tabel untuk menyimpan riwayat chat pasien
cursor.execute('''
    CREATE TABLE IF NOT EXISTS riwayat_chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keluhan_pasien TEXT,
        jawaban_ai TEXT,
        waktu DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# 3. Menyimpan perubahan dan menutup koneksi
conn.commit()
conn.close()

print("Beres Bos! Database 'klinik_harapan_sehat.db' berhasil dibuat! 🎉")
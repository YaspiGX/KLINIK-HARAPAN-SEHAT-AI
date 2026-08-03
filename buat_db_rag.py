from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

print("1. Membaca buku teks (buku_medis.txt)...")
# Tambahkan encoding="utf-8" agar aman dari error baca simbol aneh
loader_txt = TextLoader("buku_medis.txt", encoding="utf-8")
dokumen_txt = loader_txt.load()

print("2. Membaca tabel Kaggle (dataset_gejala.csv)...")
loader_csv = CSVLoader(file_path="dataset_gejala.csv", encoding="utf-8")
dokumen_csv = loader_csv.load()

# 🪄 MANTRA GABUNGAN: Jadikan satu semua ilmunya!
semua_dokumen = dokumen_txt + dokumen_csv

print("3. Memotong semua data menjadi bagian-bagian kecil...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=30)
potongan_teks = text_splitter.split_documents(semua_dokumen)

print("4. Membangun Database Vector (ChromaDB) Gabungan... (Tunggu sebentar)")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2") 
   
vectorstore = Chroma.from_documents(
    documents=potongan_teks, 
    embedding=embeddings, 
    persist_directory="./chroma_db"
)

print("✅ SUKSES! Database RAG Gabungan (TXT + CSV) berhasil diperbarui di folder 'chroma_db'.")
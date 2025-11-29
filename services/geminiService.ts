
import { GoogleGenAI, Type } from "@google/genai";
import { DraftData, GeneratedContent, Reference, Faculty, WritingStyle, ResearchType, CitationFormat } from '../types';
import { SEMINAL_WORKS_DB, GENERIC_REFS } from '../constants';

// Helper to get seed references (mandatory base)
const getSeedReferences = (faculty: Faculty): Reference[] => {
  return SEMINAL_WORKS_DB[faculty] || GENERIC_REFS;
};

// Helper to generate instructions based on Writing Style
const getStyleInstruction = (style: WritingStyle): string => {
  switch (style) {
    case WritingStyle.PROFESOR:
      return "Gunakan gaya bahasa PROFESOR BESAR: Sangat otoritatif, kritis, menggunakan terminologi tingkat tinggi, filosofis, dan kalimat yang kompleks namun presisi.";
    case WritingStyle.DOSEN:
      return "Gunakan gaya bahasa DOSEN SENIOR: Edukatif, sistematis, jelas, namun tetap formal akademik. Penjelasan harus runut seperti sedang mengajar.";
    case WritingStyle.PROFESIONAL:
      return "Gunakan gaya bahasa PROFESIONAL / KONSULTAN: Lugas (to the point), berorientasi pada data dan solusi, efisien, dan objektif.";
    case WritingStyle.GURU:
      return "Gunakan gaya bahasa GURU: Instruktif, sangat jelas, menggunakan analogi yang mudah dimengerti.";
    case WritingStyle.UMUM:
      return "Gunakan gaya bahasa UMUM / POPULER: Mengalir (flowing), hindari jargon yang terlalu teknis, komunikatif.";
    case WritingStyle.AKADEMISI:
    default:
      return "Gunakan gaya bahasa AKADEMISI STANDAR: Pasif formal, objektif, berbasis referensi, baku, dan sesuai kaidah PUEBI.";
  }
};

// --- NEW FUNCTION: AI AUTO-SUGGESTION FOR METHODOLOGY ---
export const suggestMethodology = async (title: string, faculty: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Sebagai Ahli Metodologi Penelitian Akademik, analisis judul skripsi berikut:
    JUDUL: "${title}"
    FAKULTAS: "${faculty}"

    Tentukan:
    1. Jenis Penelitian yang paling cocok (Kuantitatif/Kualitatif/Campuran). Jika judul mengandung "Pengaruh", "Hubungan", "Dampak" biasanya Kuantitatif.
    2. Rumus Statistik/Analisis yang TEPAT. (Contoh: "Regresi Linear Berganda", "Korelasi Product Moment", "Uji T-Test", "Analisis Jalur/Path Analysis", atau "Reduksi Data Miles & Huberman" untuk kualitatif).
    3. Rekomendasi Populasi dan Teknik Sampling yang logis (Contoh: "Karyawan PT X, Rumus Slovin error 5%").

    Output JSON saja.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            researchType: { type: Type.STRING, enum: Object.values(ResearchType) },
            statisticalFormula: { type: Type.STRING, description: "Nama rumus dan formula matematikanya jika ada" },
            populationSuggestion: { type: Type.STRING },
            sampleSuggestion: { type: Type.STRING },
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Suggestion Error", e);
    return null;
  }
};

export const generateResearchDraft = async (data: DraftData): Promise<GeneratedContent> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const seedRefs = getSeedReferences(data.faculty);
  const seedRefString = seedRefs.map(r => `- ${r.author} (${r.year}). ${r.title}. ${r.publisher}.`).join('\n');
  const styleInstruction = getStyleInstruction(data.writingStyle);

  // Citation Format Logic
  const citationInstruction = data.citationFormat === CitationFormat.FOOT_NOTE
    ? "GUNAKAN FORMAT FOOTNOTE (CATATAN KAKI). Tulis detail citasi (Nama, Judul, Hal, dsb) di dalam kurung siku ganda `[[...]]` tepat setelah kalimat yang dikutip. Contoh: `Teori ini valid.[[Santoso, A. *Teori Ekonomi*. Jakarta: Gramedia, 2020, hlm. 5.]]`. JANGAN buat daftar footnote manual, sistem akan memformatnya otomatis."
    : "GUNAKAN FORMAT IN-NOTE/BODY NOTE. Di dalam teks, tulis (Author, Tahun).";

  const systemInstruction = `
    Anda adalah Peneliti Senior Akademik (Post-Doctoral Level) yang sedang menulis Naskah Penelitian Final yang SANGAT DETAIL dan PANJANG.
    
    TUGAS UTAMA: Menyusun konten penelitian yang KREDIBEL, UNIK, dan MENDALAM (Minimal setara ${data.chapterPages.c2} halaman teori).
    
    INSTRUKSI FORMATTING (SANGAT PENTING):
    1. **HTML TAGS**: Gunakan <b>, <i>, <br>, <blockquote>, dan <table border="1">.
    2. **JANGAN GUNAKAN MARKDOWN**: Dilarang menggunakan #, ##, **, __.
    3. **ITALIC**: Kata asing (Inggris/Arab/Latin) wajib italic.
    
    INSTRUKSI KONTEN SPESIFIK:
    1. **BAB 4 (HASIL & PEMBAHASAN)**: 
       - WAJIB MENYAJIKAN TABEL HASIL PENELITIAN (HTML Table).
       - Untuk Kuantitatif: Sajikan Tabel Deskriptif, Uji Validitas, Uji Reliabilitas, Uji Normalitas, dan Hasil Uji Hipotesis (Simulasi data yang logis).
       - Pembahasan harus sangat mendalam, mengaitkan hasil angka dengan teori di Bab 2.
    
    2. **LAMPIRAN (WAJIB LENGKAP)**:
       - **Kuesioner/Angket**: Buat daftar pertanyaan.
       - **Instrumen Tes**: Buat kisi-kisi, soal pre-test dan post-test yang relevan dengan variabel penelitian.
       - **Calculations**: Lampiran Output Statistik Lengkap (SPSS, R-Square, Anova, dll).

    INSTRUKSI PANJANG KONTEN:
    - Kembangkan setiap poin pembahasan menjadi paragraf yang panjang dan deskriptif.
    - Hindari bullet point pendek, ubah menjadi narasi paragraf yang mengalir (flow).
    - Tambahkan "Filler Akademik" yang berbobot: definisi menurut berbagai ahli, perbandingan teori, dan argumentasi logis untuk memperpanjang halaman.

    ${citationInstruction}
    Gaya Bahasa: ${styleInstruction}

    KONTEKS METODOLOGI:
    - Jenis: ${data.researchType}
    - Rumus: ${data.statisticalFormula}
    - Lokasi: ${data.location}
    - Sampel: ${data.sample}
  `;

  const prompt = `
    JUDUL: "${data.title}"
    FAKULTAS: ${data.faculty}
    NAMA: ${data.studentName}
    
    BUAT DRAFT LENGKAP DALAM FORMAT JSON:
    
    1. **cover**: Teks Cover.
    2. **abstract**: 300-500 kata, Bhs Indonesia & Inggris.
    3. **chapter1**: (Target ${data.chapterPages.c1} hal). Latar Belakang (minimal 5 paragraf panjang), Rumusan, Tujuan, Manfaat.
    4. **chapter2**: (Target ${data.chapterPages.c2} hal). Tinjauan Pustaka. Minimal 5 Sub-bab Teori. Setiap teori bahas mendalam dengan banyak citasi.
    5. **chapter3**: (Target ${data.chapterPages.c3} hal). Metodologi rinci. Definisi Operasional Variabel (buat Tabel). Langkah Penelitian.
    6. **chapter4**: (Target ${data.chapterPages.c4} hal). HASIL & PEMBAHASAN. Sertakan TABEL-TABEL HTML hasil perhitungan data (Simulasi ${data.statisticalFormula}). Interpretasi setiap tabel minimal 2 paragraf.
    7. **chapter5**: (Target ${data.chapterPages.c5} hal). Kesimpulan & Saran.
    8. **references**: ${data.refCount} referensi (Wajib sertakan: ${seedRefString}).
    9. **questionnaire**: Instrumen Angket (Tabel HTML dengan skala likert/pilihan ganda).
    10. **instrumentGrid**: KISI-KISI INSTRUMEN (HTML Table: Kolom Variabel, Indikator, No Item).
    11. **preTest**: Soal Pre-Test (Minimal 10 soal essay/pilihan ganda yang mengukur kemampuan awal).
    12. **postTest**: Soal Post-Test (Minimal 10 soal yang setara dengan pre-test untuk mengukur hasil akhir).
    13. **calculations**: LAMPIRAN DATA & PERHITUNGAN. (Wajib Tabel HTML: Tabulasi Data Dummy, Output Uji Validitas, Reliabilitas, Uji Hipotesis sesuai rumus ${data.statisticalFormula}).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                cover: { type: Type.STRING },
                abstract: { type: Type.STRING },
                chapter1: { type: Type.STRING },
                chapter2: { type: Type.STRING },
                chapter3: { type: Type.STRING },
                chapter4: { type: Type.STRING },
                chapter5: { type: Type.STRING },
                references: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ["BOOK", "JOURNAL"] },
                      author: { type: Type.STRING },
                      year: { type: Type.STRING },
                      title: { type: Type.STRING },
                      city: { type: Type.STRING },
                      publisher: { type: Type.STRING }
                    },
                    required: ["type", "author", "year", "title", "city", "publisher"]
                  }
                },
                questionnaire: { type: Type.STRING, description: "Tabel Angket Penelitian" },
                instrumentGrid: { type: Type.STRING, description: "Tabel Kisi-kisi Instrumen (Variabel, Indikator, No Item)" },
                preTest: { type: Type.STRING, description: "Daftar Soal Pre-test" },
                postTest: { type: Type.STRING, description: "Daftar Soal Post-test" },
                calculations: { type: Type.STRING, description: "HTML Table berisi simulasi output statistik (SPSS) dan tabulasi data" },
            },
            required: ["cover", "abstract", "chapter1", "chapter2", "chapter3", "chapter4", "chapter5", "references", "questionnaire", "instrumentGrid", "preTest", "postTest", "calculations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsedJson = JSON.parse(resultText);
    return parsedJson as GeneratedContent;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

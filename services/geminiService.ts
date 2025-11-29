
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
    ? "GUNAKAN FORMAT FOOTNOTE/CATATAN KAKI. Di dalam teks, gunakan tanda [1], [2], dst. Jangan tulis (Author, Tahun) di teks."
    : "GUNAKAN FORMAT IN-NOTE/BODY NOTE. Di dalam teks, tulis (Author, Tahun).";

  const systemInstruction = `
    Anda adalah Peneliti Senior Akademik (Post-Doctoral Level) yang sedang menulis Naskah Penelitian Final.
    
    TUGAS UTAMA: Menyusun konten penelitian yang KREDIBEL, UNIK, dan HUMANIS (Tidak terdeteksi AI).
    
    INSTRUKSI TEKNIS KHUSUS (SANGAT PENTING):
    1. **TABEL REAL**: Jika Anda menyajikan data (misal di Bab 4 atau Lampiran), JANGAN gunakan format Markdown ASCII. Gunakan tag HTML MURNI: <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">, <tr>, <th>, dan <td>.
    2. **ANGKET OTOMATIS**: Pada lampiran, buat tabel kuesioner rapi (HTML Table).
    3. **ANALISIS MENDALAM**: Pada Bab 4, wajib menyertakan Tabel Analisis (statistik/tematik) sebelum pembahasan.
    4. **SITASI**: ${citationInstruction}

    INSTRUKSI GAYA BAHASA (${data.writingStyle}):
    - ${styleInstruction}
    - Variasikan panjang kalimat untuk burstiness (ritme alami manusia).

    KONTEKS METODOLOGI (WAJIB DIPAKAI):
    - Jenis Penelitian: ${data.researchType}
    - Lokasi: ${data.location}
    - Populasi: ${data.population}
    - Sampel: ${data.sample}
    - **RUMUS / TEKNIK ANALISIS**: Gunakan "${data.statisticalFormula}" dalam pembahasan Bab 3 dan Bab 4. Tuliskan rumus matematikanya secara eksplisit jika Kuantitatif.
    
    Struktur Bab:
    - **Abstrak**: Lengkap (Latar Belakang, Tujuan, Metode, Hasil, Kesimpulan).
    - **Bab 1**: Gap analysis jelas, rumusan masalah tajam.
    - **Bab 2**: Elaborasi teori.
    - **Bab 3**: Metodologi detail. Jelaskan mengapa menggunakan rumus "${data.statisticalFormula}". Sertakan definisi operasional (Tabel HTML).
    - **Bab 4**: Hasil & Pembahasan. SAJIKAN PERHITUNGAN MENGGUNAKAN RUMUS "${data.statisticalFormula}" (jika kuantitatif). Gunakan Tabel HTML.
    - **Bab 5**: Kesimpulan saran.
    - **Lampiran**: Instrumen penelitian (Tabel HTML).
    
    Output JSON valid.
  `;

  const prompt = `
    JUDUL PENELITIAN: "${data.title}"
    FAKULTAS: ${data.faculty}
    NAMA: ${data.studentName}
    UNIVERSITAS: ${data.university}
    
    METODOLOGI:
    - Jenis: ${data.researchType}
    - Teknik Analisis/Rumus: ${data.statisticalFormula}
    - Tempat: ${data.location}
    - Populasi: ${data.population}
    - Sampel: ${data.sample}

    TARGET KEDALAMAN (Halaman per Bab):
    - Bab 1: Target ${data.chapterPages.c1} hal
    - Bab 2: Target ${data.chapterPages.c2} hal
    - Bab 3: Target ${data.chapterPages.c3} hal (Jelaskan Rumus ${data.statisticalFormula})
    - Bab 4: Target ${data.chapterPages.c4} hal (Hitungan Detail & Tabel HTML)
    - Bab 5: Target ${data.chapterPages.c5} hal

    REFERENSI (${data.refCount} buah):
    - Wajib menyertakan Seminal Works:
    ${seedRefString}
    - Sisanya generate buku/jurnal NYATA relevan.

    Pastikan output adalah JSON.
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
                questionnaire: { type: Type.STRING },
            },
            required: ["cover", "abstract", "chapter1", "chapter2", "chapter3", "chapter4", "chapter5", "references", "questionnaire"]
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

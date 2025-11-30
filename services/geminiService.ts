
import { GoogleGenAI, Type } from "@google/genai";
import { DraftData, GeneratedContent, Reference, Faculty, WritingStyle, ResearchType, CitationFormat, ResearchLevel, Language } from '../types';
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

// Helper: Convert File to Base64 Part for Gemini
const fileToPart = async (file: File) => {
  return new Promise<any>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      
      // For images and PDFs, use inlineData
      // For text-based files that Gemini might not sniff automatically or if we want to be safe,
      // we can try sending them. 
      // Note: Gemini API 1.5/2.0 supports PDF, Images, Audio, Video natively.
      // Text files should ideally be read as text, but for this implementation we try standard inlineData.
      
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/octet-stream' 
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
    
  // Language Instruction
  const langInstruction = data.language === Language.ARAB
    ? "OUTPUT WAJIB DALAM BAHASA ARAB (FUSHA/MODERN STANDARD ARABIC). Gunakan istilah akademik Arab yang tepat. Pastikan alur teks logis untuk Right-to-Left (RTL)."
    : data.language === Language.INGGRIS
      ? "OUTPUT MUST BE IN ENGLISH (Academic English)."
      : "OUTPUT WAJIB DALAM BAHASA INDONESIA YANG BAIK DAN BENAR (Ejaan Baku).";

  // Level Instruction
  let levelInstruction = "";
  if (data.researchLevel === ResearchLevel.DISERTASI) {
      levelInstruction = "INI ADALAH DISERTASI (S3). Kualitas harus SANGAT TINGGI, ANALISIS MENDALAM, mengandung NOVELTY (Kebaruan) yang eksplisit, dan Kritikal terhadap teori yang ada.";
  } else if (data.researchLevel === ResearchLevel.TESIS) {
      levelInstruction = "INI ADALAH TESIS (S2). Analisis harus lebih dalam dari Skripsi, sintesa teori harus kuat.";
  } else {
      levelInstruction = "INI ADALAH SKRIPSI (S1). Standar akademik sarjana.";
  }

  // Check which chapters to generate
  const { chaptersToGenerate, refConfig } = data;
  
  const chapterPromptParts = [];
  if (chaptersToGenerate.coverAbstract) chapterPromptParts.push("1. **cover**: Teks Cover.\n2. **abstract**: 300-500 kata.");
  if (chaptersToGenerate.chapter1) chapterPromptParts.push(`3. **chapter1**: (Target ${data.chapterPages.c1} hal). Latar Belakang (minimal 5 paragraf panjang), Rumusan, Tujuan, Manfaat.`);
  if (chaptersToGenerate.chapter2) chapterPromptParts.push(`4. **chapter2**: (Target ${data.chapterPages.c2} hal). Tinjauan Pustaka. Minimal 5 Sub-bab Teori. Setiap teori bahas mendalam dengan banyak citasi.`);
  if (chaptersToGenerate.chapter3) chapterPromptParts.push(`5. **chapter3**: (Target ${data.chapterPages.c3} hal). Metodologi rinci. Definisi Operasional Variabel (buat Tabel). Langkah Penelitian.`);
  if (chaptersToGenerate.chapter4) chapterPromptParts.push(`6. **chapter4**: (Target ${data.chapterPages.c4} hal). HASIL & PEMBAHASAN. Sertakan TABEL-TABEL HTML hasil perhitungan data (Simulasi ${data.statisticalFormula}). Interpretasi setiap tabel minimal 2 paragraf.`);
  if (chaptersToGenerate.chapter5) chapterPromptParts.push(`7. **chapter5**: (Target ${data.chapterPages.c5} hal). Kesimpulan & Saran.`);
  
  const refParts = [];
  if (chaptersToGenerate.referencesAppendices) {
    refParts.push(`8. **references**: Buat Daftar Pustaka sesuai kategori berikut:
       - Jurnal Ilmiah Open Access: ${refConfig.journals} buah
       - Buku (Cetak/E-Book): ${refConfig.books} buah
       - Skripsi/Tesis Repository Universitas: ${refConfig.repository} buah
       - Karya Ilmiah Digital: ${refConfig.digitalWorks} buah
       - Artikel Penelitian/Prosiding Konferensi: ${refConfig.proceedings} buah
       - Laporan Penelitian Pemerintah/Lembaga: ${refConfig.reports} buah
       - Website Resmi: ${refConfig.websites} buah
       * FILTER TAHUN: Referensi harus terbit antara TAHUN ${data.refYearStart} sampai ${data.refYearEnd}.
       * Tambahkan seminal works berikut: ${seedRefString}
    `);
    refParts.push(`9. **questionnaire**: Instrumen Angket (Tabel HTML).`);
    refParts.push(`10. **instrumentGrid**: KISI-KISI INSTRUMEN (HTML Table).`);
    refParts.push(`11. **preTest**: Soal Pre-Test.`);
    refParts.push(`12. **postTest**: Soal Post-Test.`);
    refParts.push(`13. **calculations**: LAMPIRAN DATA & PERHITUNGAN (Tabel HTML).`);
  }

  const systemInstruction = `
    Anda adalah Peneliti Senior Akademik (Post-Doctoral Level).
    
    ${langInstruction}
    ${levelInstruction}
    
    TUGAS UTAMA: Menyusun konten penelitian berdasarkan 'Checklist' yang diminta user.
    BAGIAN YANG TIDAK DIMINTA: Kembalikan string kosong ("").
    
    INSTRUKSI FORMATTING:
    1. **HTML TAGS**: Gunakan <b>, <i>, <br>, <blockquote>, dan <table border="1">.
    2. **JANGAN GUNAKAN MARKDOWN**: Dilarang menggunakan #, ##, **, __.
    3. **ITALIC**: Kata asing (non-bahasa utama) wajib italic.
    
    INSTRUKSI KREDIBILITAS:
    - Kembangkan paragraf yang panjang dan deskriptif untuk memenuhi target halaman.
    - Sertakan filler akademik yang berbobot.
    - JIKA ADA FILE YANG DIUPLOAD USER: Gunakan konten di dalam file tersebut sebagai referensi utama atau konteks tambahan yang spesifik untuk bab Tinjauan Pustaka atau Hasil.

    ${citationInstruction}
    Gaya Bahasa: ${styleInstruction}

    KONTEKS:
    - Judul: ${data.title}
    - Jenis: ${data.researchType}
    - Rumus: ${data.statisticalFormula}
  `;

  const promptText = `
    BUAT DRAFT FORMAT JSON.
    HANYA ISI FIELD YANG DIMINTA BERIKUT INI (Sisanya string kosong):
    
    ${chapterPromptParts.join('\n')}
    ${refParts.join('\n')}
  `;

  try {
    // Process Uploaded Files into Parts
    const fileParts = await Promise.all(data.uploadedFiles.map(fileToPart));
    
    // Construct content parts: [Prompt, ...Files]
    const contentParts = [
        { text: promptText },
        ...fileParts
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Supports multimodal (PDF, Images)
      contents: { parts: contentParts },
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
                      type: { type: Type.STRING, enum: ["BOOK", "JOURNAL", "THESIS", "PROCEEDING", "REPORT", "WEBSITE"] },
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
                instrumentGrid: { type: Type.STRING, description: "Tabel Kisi-kisi Instrumen" },
                preTest: { type: Type.STRING, description: "Daftar Soal Pre-test" },
                postTest: { type: Type.STRING, description: "Daftar Soal Post-test" },
                calculations: { type: Type.STRING, description: "HTML Table simulasi statistik" },
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


export enum Faculty {
  EKONOMI = 'Ekonomi & Bisnis',
  IT = 'Teknologi Informasi & Komputer',
  PSIKOLOGI = 'Psikologi',
  HUKUM = 'Hukum',
  KEDOKTERAN = 'Kedokteran',
  TEKNIK = 'Teknik',
  PENDIDIKAN = 'Pendidikan',
  SASTRA = 'Sastra & Budaya'
}

export enum CitationStyle {
  APA = 'APA (7th Edition)',
  MLA = 'MLA (9th Edition)',
  CHICAGO = 'Chicago',
  HARVARD = 'Harvard'
}

export enum CitationFormat {
  IN_NOTE = 'In-Note / Body Note (Nama, Tahun)',
  FOOT_NOTE = 'Footnote / Catatan Kaki'
}

export enum WritingStyle {
  PROFESIONAL = 'Profesional (Bisnis & Lugas)',
  AKADEMISI = 'Akademisi (Formal Standar)',
  PROFESOR = 'Profesor (Kritis, Filosofis & Otoritatif)',
  DOSEN = 'Dosen (Sistematis & Edukatif)',
  GURU = 'Guru (Instruktif & Mudah Dipahami)',
  UMUM = 'Umum (Populer & Mengalir)'
}

export enum ResearchType {
  KUANTITATIF = 'Kuantitatif (Statistik & Angka)',
  KUALITATIF = 'Kualitatif (Deskriptif & Analisis Mendalam)',
  CAMPURAN = 'Campuran (Mix Method)'
}

export enum ResearchLevel {
  SKRIPSI = 'Skripsi (S1 - Undergraduate)',
  TESIS = 'Tesis (S2 - Masters)',
  DISERTASI = 'Disertasi (S3 - PhD)'
}

export enum Language {
  INDONESIA = 'Bahasa Indonesia',
  INGGRIS = 'English',
  ARAB = 'Bahasa Arab (Arabic)'
}

export interface Reference {
  type: string;
  author: string;
  year: string;
  title: string;
  city: string;
  publisher: string;
}

export interface ChapterPages {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
}

export interface ReferenceCounts {
  journals: number;
  repository: number; // Skripsi/Tesis
  digitalWorks: number;
  proceedings: number;
  reports: number; // Gov/Institusi
  websites: number;
  books: number; // New field
}

export interface ChapterSelection {
  coverAbstract: boolean;
  chapter1: boolean;
  chapter2: boolean;
  chapter3: boolean;
  chapter4: boolean;
  chapter5: boolean;
  referencesAppendices: boolean;
}

export interface DraftData {
  title: string;
  faculty: Faculty;
  studentName: string;
  university: string;
  
  // New Fields
  researchLevel: ResearchLevel;
  language: Language;

  chapterPages: ChapterPages;
  // Replaced simple refCount with detailed config
  refConfig: ReferenceCounts;
  refYearStart: number;
  refYearEnd: number;
  // New: Chapter Selection for partial generation
  chaptersToGenerate: ChapterSelection;
  
  // New: Uploaded Files for Context
  uploadedFiles: File[];

  citationStyle: CitationStyle;
  citationFormat: CitationFormat;
  writingStyle: WritingStyle;
  // Methodology Fields
  researchType: ResearchType;
  statisticalFormula: string;
  location: string;
  population: string;
  sample: string;
}

export interface GeneratedContent {
  cover: string;
  abstract: string;
  chapter1: string;
  chapter2: string;
  chapter3: string;
  chapter4: string;
  chapter5: string;
  references: Reference[];
  questionnaire: string;
  // New Fields for Instruments
  instrumentGrid: string; // Kisi-kisi
  preTest: string;        // Soal Pre-test
  postTest: string;       // Soal Post-test
  calculations: string;   // Output Statistik
}

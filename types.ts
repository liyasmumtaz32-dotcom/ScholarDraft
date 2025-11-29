
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

export interface DraftData {
  title: string;
  faculty: Faculty;
  studentName: string;
  university: string;
  chapterPages: ChapterPages;
  refCount: number;
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
  calculations: string; // New Field for Statistical Appendices
}

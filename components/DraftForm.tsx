
import React, { useState, useRef } from 'react';
import { Faculty, DraftData, CitationStyle, WritingStyle, ResearchType, CitationFormat, ResearchLevel, Language, RESEARCH_STANDARDS } from '../types';
import { BookOpen, User, GraduationCap, FileText, Calendar, Layers, PenTool, FlaskConical, MapPin, Users, Sparkles, Calculator, Quote, CheckSquare, Library, Globe, UploadCloud, X, File as FileIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { suggestMethodology } from '../services/geminiService';

interface Props {
  data: DraftData;
  onChange: (field: keyof DraftData, value: any) => void;
  onChapterPageChange: (key: string, value: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DraftForm: React.FC<Props> = ({ data, onChange, onChapterPageChange, onSubmit, isLoading }) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoSuggest = async () => {
    if (!data.title) {
        alert("Mohon isi Judul Penelitian terlebih dahulu.");
        return;
    }
    setIsSuggesting(true);
    try {
        const suggestion = await suggestMethodology(data.title, data.faculty);
        if (suggestion) {
            if (suggestion.researchType) onChange('researchType', suggestion.researchType);
            if (suggestion.statisticalFormula) onChange('statisticalFormula', suggestion.statisticalFormula);
            if (suggestion.populationSuggestion) onChange('population', suggestion.populationSuggestion);
            if (suggestion.sampleSuggestion) onChange('sample', suggestion.sampleSuggestion);
        }
    } catch (error) {
        console.error("Suggestion failed", error);
    } finally {
        setIsSuggesting(false);
    }
  };

  const updateRefConfig = (key: string, val: number) => {
    onChange('refConfig', { ...data.refConfig, [key]: val });
  };

  const updateChapterSelection = (key: string, val: boolean) => {
    onChange('chaptersToGenerate', { ...data.chaptersToGenerate, [key]: val });
  };

  const selectAllChapters = () => {
    const allSelected = {
      coverAbstract: true,
      chapter1: true,
      chapter2: true,
      chapter3: true,
      chapter4: true,
      chapter5: true,
      referencesAppendices: true
    };
    onChange('chaptersToGenerate', allSelected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = data.uploadedFiles.length + newFiles.length;
      
      if (totalFiles > 20) {
        alert("Maksimal upload 20 file.");
        return;
      }
      
      onChange('uploadedFiles', [...data.uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = data.uploadedFiles.filter((_, i) => i !== index);
    onChange('uploadedFiles', updatedFiles);
  };

  // CALCULATE TOTALS
  const totalPages = data.chapterPages.c1 + data.chapterPages.c2 + data.chapterPages.c3 + data.chapterPages.c4 + data.chapterPages.c5;
  const totalRefs = Object.values(data.refConfig).reduce((a, b) => a + b, 0);
  
  const minPages = RESEARCH_STANDARDS[data.researchLevel].minPages;
  const minRefs = RESEARCH_STANDARDS[data.researchLevel].minRefs;

  const isPagesValid = totalPages >= minPages;
  const isRefsValid = totalRefs >= minRefs;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-600" />
        Parameter Penelitian
      </h2>
      
      <div className="space-y-6">
        {/* SECTION 1: IDENTITAS */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Identitas Riset</h3>
            
            {/* New: Level & Language */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang/Level</label>
                   <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                        value={data.researchLevel}
                        onChange={(e) => onChange('researchLevel', e.target.value as ResearchLevel)}
                   >
                        {Object.values(ResearchLevel).map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Bahasa</label>
                   <div className="relative">
                        <select
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                            value={data.language}
                            onChange={(e) => onChange('language', e.target.value as Language)}
                        >
                            {Object.values(Language).map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                   </div>
                </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Penelitian</label>
            <div className="relative">
                <input
                type="text"
                dir={data.language === Language.ARAB ? "rtl" : "ltr"}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Judul Lengkap..."
                value={data.title}
                onChange={(e) => onChange('title', e.target.value)}
                />
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fakultas</label>
                <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                value={data.faculty}
                onChange={(e) => onChange('faculty', e.target.value as Faculty)}
                >
                {Object.values(Faculty).map((f) => (
                    <option key={f} value={f}>{f}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Universitas</label>
                <div className="relative">
                <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Nama Univ"
                    value={data.university}
                    onChange={(e) => onChange('university', e.target.value)}
                />
                <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Mahasiswa</label>
            <div className="relative">
                <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Nama Lengkap"
                value={data.studentName}
                onChange={(e) => onChange('studentName', e.target.value)}
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            </div>
        </div>

        {/* SECTION 2: METODOLOGI */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-blue-700 uppercase flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Metodologi & Data
                </h3>
                <button 
                    onClick={handleAutoSuggest}
                    disabled={isSuggesting}
                    className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition"
                >
                    {isSuggesting ? <span className="animate-spin">⌛</span> : <Sparkles className="w-3 h-3" />}
                    Auto-Lengkapi
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Jenis Penelitian</label>
                        <select
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-xs"
                            value={data.researchType}
                            onChange={(e) => onChange('researchType', e.target.value as ResearchType)}
                        >
                            {Object.values(ResearchType).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-slate-700 mb-1">Tempat Penelitian</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-7 pr-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                                placeholder="Lokasi..."
                                value={data.location}
                                onChange={(e) => onChange('location', e.target.value)}
                            />
                            <MapPin className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Calculator className="w-3 h-3" />
                        Rumus Statistik / Teknik Analisis
                    </label>
                    <textarea
                        rows={2}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                        placeholder="Contoh: Regresi Linear Berganda..."
                        value={data.statisticalFormula}
                        onChange={(e) => onChange('statisticalFormula', e.target.value)}
                    />
                </div>
               
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Populasi</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                            placeholder="Jml Populasi"
                            value={data.population}
                            onChange={(e) => onChange('population', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Sampel</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                            placeholder="Jml Sampel"
                            value={data.sample}
                            onChange={(e) => onChange('sample', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* SECTION 3: REFERENSI DETAIL */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                    <Library className="w-4 h-4" />
                    Konfigurasi Referensi
                </h3>
                 {/* CREDIBILITY BADGE REF */}
                 <div className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${isRefsValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isRefsValid ? <CheckCircle2 className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                    Target: {totalRefs}/{minRefs} Refs
                </div>

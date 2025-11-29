
import React, { useState } from 'react';
import { Faculty, DraftData, CitationStyle, WritingStyle, ResearchType, CitationFormat } from '../types';
import { BookOpen, User, GraduationCap, FileText, Hash, Layers, PenTool, FlaskConical, MapPin, Users, Sparkles, Calculator, Quote } from 'lucide-react';
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-600" />
        Parameter Penelitian
      </h2>
      
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase">Informasi Dasar</h3>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul Penelitian</label>
            <div className="relative">
                <input
                type="text"
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

        {/* Methodology Section */}
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Penelitian</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                            value={data.researchType}
                            onChange={(e) => onChange('researchType', e.target.value as ResearchType)}
                        >
                            {Object.values(ResearchType).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Penelitian</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Lokasi..."
                                value={data.location}
                                onChange={(e) => onChange('location', e.target.value)}
                            />
                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                        <Calculator className="w-3 h-3" />
                        Rumus Statistik / Teknik Analisis
                    </label>
                    <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="Contoh: Regresi Linear Berganda, Uji T, Path Analysis..."
                        value={data.statisticalFormula}
                        onChange={(e) => onChange('statisticalFormula', e.target.value)}
                    />
                </div>
               
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Populasi</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Jml Populasi"
                                value={data.population}
                                onChange={(e) => onChange('population', e.target.value)}
                            />
                            <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sampel</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Jml Sampel"
                                value={data.sample}
                                onChange={(e) => onChange('sample', e.target.value)}
                            />
                            <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gaya Bahasa</label>
                    <div className="relative">
                        <select
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm appearance-none"
                        value={data.writingStyle}
                        onChange={(e) => onChange('writingStyle', e.target.value as WritingStyle)}
                        >
                        {Object.values(WritingStyle).map((style) => (
                            <option key={style} value={style}>{style}</option>
                        ))}
                        </select>
                        <PenTool className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bentuk Citasi</label>
                    <div className="relative">
                        <select
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm appearance-none"
                        value={data.citationFormat}
                        onChange={(e) => onChange('citationFormat', e.target.value as CitationFormat)}
                        >
                        {Object.values(CitationFormat).map((fmt) => (
                            <option key={fmt} value={fmt}>{fmt.split(' (')[0]}</option>
                        ))}
                        </select>
                        <Quote className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Chapter Pages Configuration */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Target Halaman per Bab
            </label>
            <div className="grid grid-cols-5 gap-2 text-xs">
                {Object.entries(data.chapterPages).map(([key, val], idx) => (
                     <div key={key}>
                     <label className="block text-slate-500 mb-1 text-center">Bab {idx + 1}</label>
                     <input
                         type="number" min={1}
                         className="w-full px-1 py-1 border border-slate-300 rounded outline-none focus:border-blue-500 text-center"
                         value={val}
                         onChange={(e) => onChapterPageChange(key, parseInt(e.target.value) || 0)}
                     />
                     </div>
                ))}
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Style Referensi</label>
                <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                value={data.citationStyle}
                onChange={(e) => onChange('citationStyle', e.target.value as CitationStyle)}
                >
                {Object.values(CitationStyle).map((style) => (
                    <option key={style} value={style}>{style}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jml. Referensi</label>
                <div className="relative">
                <input
                    type="number"
                    min={3}
                    max={50}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={data.refCount}
                    onChange={(e) => onChange('refCount', parseInt(e.target.value))}
                />
                <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
            </div>
            </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all mt-4
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sedang Menyusun Riset...
            </span>
          ) : (
            "Buat Draft Penelitian"
          )}
        </button>
      </div>
    </div>
  );
};

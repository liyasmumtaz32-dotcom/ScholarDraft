
import React, { useState, useRef } from 'react';
import { Faculty, DraftData, CitationStyle, WritingStyle, ResearchType, CitationFormat, ResearchLevel, Language } from '../types';
import { BookOpen, User, GraduationCap, FileText, Calendar, Layers, PenTool, FlaskConical, MapPin, Users, Sparkles, Calculator, Quote, CheckSquare, Library, Globe, UploadCloud, X, File as FileIcon } from 'lucide-react';
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
            <h3 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                <Library className="w-4 h-4" />
                Konfigurasi Referensi
            </h3>
            
            {/* Year Filter */}
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-200">
                <div>
                   <label className="block text-xs font-medium text-slate-600 mb-1">Dari Tahun</label>
                   <input type="number" className="w-full p-1.5 border rounded text-sm" value={data.refYearStart} onChange={e => onChange('refYearStart', parseInt(e.target.value))} />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-600 mb-1">Sampai Tahun</label>
                   <input type="number" className="w-full p-1.5 border rounded text-sm" value={data.refYearEnd} onChange={e => onChange('refYearEnd', parseInt(e.target.value))} />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                    <label className="block text-xs text-slate-500">Jurnal Ilmiah Open Access</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.journals} onChange={e => updateRefConfig('journals', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Buku Referensi (Cetak/E-Book)</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.books} onChange={e => updateRefConfig('books', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Skripsi/Tesis Repo Univ</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.repository} onChange={e => updateRefConfig('repository', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Karya Ilmiah Digital</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.digitalWorks} onChange={e => updateRefConfig('digitalWorks', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Artikel/Prosiding Konferensi</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.proceedings} onChange={e => updateRefConfig('proceedings', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Laporan Penelitian Gov</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.reports} onChange={e => updateRefConfig('reports', parseInt(e.target.value)||0)} />
                </div>
                <div>
                    <label className="block text-xs text-slate-500">Website</label>
                    <input type="number" min="0" className="w-full p-1 border rounded text-sm" value={data.refConfig.websites} onChange={e => updateRefConfig('websites', parseInt(e.target.value)||0)} />
                </div>
            </div>

             {/* FILE UPLOAD SECTION */}
            <div className="pt-2 border-t border-slate-200 mt-2">
                <label className="block text-xs font-medium text-slate-700 mb-2 flex justify-between">
                    <span>Upload File Referensi (Optional)</span>
                    <span className="text-slate-400 font-normal">{data.uploadedFiles.length}/20 File</span>
                </label>
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition"
                >
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs text-center text-slate-500">
                        Klik untuk upload PDF, Word, Gambar, TXT, MD <br/> (Max 20 file)
                    </p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        accept=".pdf,.doc,.docx,.txt,.md,image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                </div>

                {/* Uploaded File List */}
                {data.uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {data.uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-100 px-2 py-1 rounded text-xs">
                                <span className="truncate flex-1 flex items-center gap-1">
                                    <FileIcon className="w-3 h-3 text-slate-400"/> {file.name}
                                </span>
                                <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 ml-2">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Style Referensi</label>
                    <select
                    className="w-full px-2 py-1.5 border border-slate-300 rounded outline-none bg-white text-xs"
                    value={data.citationStyle}
                    onChange={(e) => onChange('citationStyle', e.target.value as CitationStyle)}
                    >
                    {Object.values(CitationStyle).map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bentuk Citasi</label>
                    <select
                    className="w-full px-2 py-1.5 border border-slate-300 rounded outline-none bg-white text-xs"
                    value={data.citationFormat}
                    onChange={(e) => onChange('citationFormat', e.target.value as CitationFormat)}
                    >
                    {Object.values(CitationFormat).map((fmt) => (
                        <option key={fmt} value={fmt}>{fmt.split(' (')[0]}</option>
                    ))}
                    </select>
                </div>
            </div>
        </div>

        {/* SECTION 4: BAB CHECKLIST */}
        <div className="space-y-4 pt-2">
            <div className="flex justify-between items-end border-b pb-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target & Filter Bab</h3>
                <button onClick={selectAllChapters} className="text-[10px] text-blue-600 hover:underline">Pilih Semua</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.coverAbstract} onChange={(e) => updateChapterSelection('coverAbstract', e.target.checked)} />
                    <span className="text-xs font-medium">Cover & Abstrak</span>
                </label>
                <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.chapter1} onChange={(e) => updateChapterSelection('chapter1', e.target.checked)} />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">Bab 1: Pendahuluan</span>
                        <input type="number" min="1" className="w-12 h-5 text-[10px] border rounded mt-1 px-1" value={data.chapterPages.c1} onChange={(e) => onChapterPageChange('c1', parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} placeholder="Hal" />
                    </div>
                </label>
                <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.chapter2} onChange={(e) => updateChapterSelection('chapter2', e.target.checked)} />
                     <div className="flex flex-col">
                        <span className="text-xs font-medium">Bab 2: Tinjauan Pustaka</span>
                         <input type="number" min="1" className="w-12 h-5 text-[10px] border rounded mt-1 px-1" value={data.chapterPages.c2} onChange={(e) => onChapterPageChange('c2', parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} placeholder="Hal" />
                    </div>
                </label>
                 <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.chapter3} onChange={(e) => updateChapterSelection('chapter3', e.target.checked)} />
                     <div className="flex flex-col">
                        <span className="text-xs font-medium">Bab 3: Metodologi</span>
                         <input type="number" min="1" className="w-12 h-5 text-[10px] border rounded mt-1 px-1" value={data.chapterPages.c3} onChange={(e) => onChapterPageChange('c3', parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} placeholder="Hal" />
                    </div>
                </label>
                 <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.chapter4} onChange={(e) => updateChapterSelection('chapter4', e.target.checked)} />
                     <div className="flex flex-col">
                        <span className="text-xs font-medium">Bab 4: Pembahasan</span>
                         <input type="number" min="1" className="w-12 h-5 text-[10px] border rounded mt-1 px-1" value={data.chapterPages.c4} onChange={(e) => onChapterPageChange('c4', parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} placeholder="Hal" />
                    </div>
                </label>
                 <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={data.chaptersToGenerate.chapter5} onChange={(e) => updateChapterSelection('chapter5', e.target.checked)} />
                     <div className="flex flex-col">
                        <span className="text-xs font-medium">Bab 5: Penutup</span>
                         <input type="number" min="1" className="w-12 h-5 text-[10px] border rounded mt-1 px-1" value={data.chapterPages.c5} onChange={(e) => onChapterPageChange('c5', parseInt(e.target.value))} onClick={(e) => e.stopPropagation()} placeholder="Hal" />
                    </div>
                </label>
                 <label className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50 cursor-pointer col-span-2">
                    <input type="checkbox" checked={data.chaptersToGenerate.referencesAppendices} onChange={(e) => updateChapterSelection('referencesAppendices', e.target.checked)} />
                    <span className="text-xs font-medium">Daftar Pustaka & Lampiran</span>
                </label>
            </div>

            <div className="pt-2">
                 <label className="block text-xs font-medium text-slate-700 mb-1">Gaya Bahasa</label>
                 <select
                    className="w-full pl-2 pr-4 py-2 border border-slate-300 rounded-lg outline-none bg-white text-sm"
                    value={data.writingStyle}
                    onChange={(e) => onChange('writingStyle', e.target.value as WritingStyle)}
                    >
                    {Object.values(WritingStyle).map((style) => (
                        <option key={style} value={style}>{style}</option>
                    ))}
                 </select>
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
            "Buat Draft (Bagian Terpilih)"
          )}
        </button>
      </div>
    </div>
  );
};

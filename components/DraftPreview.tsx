
import React from 'react';
import { GeneratedContent, DraftData } from '../types';
import { FileDown, BookMarked, AlignLeft, ScrollText, Layers, FileText } from 'lucide-react';
import { 
  downloadFullDOC, 
  downloadRIS, 
  getFormattedReference,
  downloadCover,
  downloadChapter,
  downloadReferences,
  downloadAppendices
} from '../utils/exportUtils';

interface Props {
  content: GeneratedContent | null;
  data: DraftData;
}

export const DraftPreview: React.FC<Props> = ({ content, data }) => {
  if (!content) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-xl border border-dashed border-slate-300">
        <ScrollText className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Preview Dokumen akan muncul di sini</p>
        <p className="text-sm">Silakan isi form dan klik tombol buat draft</p>
      </div>
    );
  }

  // Safe helper to render HTML content (allows tables) or fallback to text
  const renderContent = (htmlContent: string) => {
    let processed = htmlContent;
    
    // Replace [[Citation]] with <sup>(Citation...)</sup> for preview visibility
    processed = processed.replace(/\[\[(.*?)\]\]/g, '<sup class="text-blue-600 font-bold text-[10px] cursor-help" title="$1">[FN]</sup>');

    // If it looks like HTML table, render as HTML
    if (processed.includes('<table') || processed.includes('sup>')) {
      return <div className="text-sm text-slate-600 space-y-4" dangerouslySetInnerHTML={{ __html: processed }} />;
    }
    
    return <p className="text-sm text-slate-600 whitespace-pre-wrap">{htmlContent}</p>;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full max-h-screen">
      {/* Header / Actions */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-4 bg-slate-50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-blue-600" />
            Preview & Download
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => downloadFullDOC(data, content)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              <Layers className="w-4 h-4" />
              Download Semua (Full)
            </button>
            <button
              onClick={() => downloadRIS(content.references)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              <BookMarked className="w-4 h-4" />
              Download .RIS
            </button>
          </div>
        </div>
        
        {/* Separate Download Buttons */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Download Per Bagian (Terpisah):</p>
          <div className="flex flex-wrap gap-2">
             <button onClick={() => downloadCover(data, content)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Cover & Abstrak
             </button>
             <button onClick={() => downloadChapter(data, "Pendahuluan", content.chapter1, 1)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Bab 1
             </button>
             <button onClick={() => downloadChapter(data, "Tinjauan Pustaka", content.chapter2, 2)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Bab 2
             </button>
             <button onClick={() => downloadChapter(data, "Metodologi Penelitian", content.chapter3, 3)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Bab 3
             </button>
             <button onClick={() => downloadChapter(data, "Hasil & Pembahasan", content.chapter4, 4)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Bab 4
             </button>
             <button onClick={() => downloadChapter(data, "Penutup", content.chapter5, 5)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Bab 5
             </button>
             <button onClick={() => downloadReferences(data, content.references)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Daftar Pustaka
             </button>
             <button onClick={() => downloadAppendices(data, content)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-300 transition">
               <FileText className="w-3 h-3" /> Lampiran (Instrumen & Data)
             </button>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-y-auto p-8 document-font bg-slate-50">
        <div className="max-w-[21cm] mx-auto bg-white shadow-md min-h-[29.7cm] p-[2.54cm] text-justify leading-relaxed">
          
          {/* Cover Preview */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-lg uppercase mb-4">{data.title}</h1>
            <p className="mb-8">PROPOSAL PENELITIAN</p>
            <div className="my-12">
                <p className="font-bold">Oleh:</p>
                <p className="font-bold">{data.studentName}</p>
            </div>
            <div className="mt-12 uppercase font-bold">
                <p>{data.faculty}</p>
                <p>{data.university}</p>
                <p>{new Date().getFullYear()}</p>
            </div>
          </div>

          <hr className="my-8 border-t-2 border-slate-100" />
          
          {/* Content Preview Snippets */}
          <div className="space-y-8">
            <section>
                <h2 className="text-center font-bold text-md mb-4">ABSTRAK</h2>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{content.abstract}</p>
            </section>

             <section>
                <h2 className="text-center font-bold text-md mb-4">BAB I: PENDAHULUAN</h2>
                {renderContent(content.chapter1)}
            </section>
            
            <section>
                <h2 className="text-center font-bold text-md mb-4">BAB II: TINJAUAN PUSTAKA</h2>
                {renderContent(content.chapter2)}
            </section>
            
            <section>
                <h2 className="text-center font-bold text-md mb-4">BAB IV: HASIL & PEMBAHASAN</h2>
                {renderContent(content.chapter4)}
            </section>

             <section>
                <h2 className="text-center font-bold text-md mb-4">DAFTAR PUSTAKA ({data.citationStyle})</h2>
                <ul className="list-none space-y-3 text-sm">
                    {content.references.map((ref, idx) => (
                        <li key={idx} className="pl-8 -indent-8"
                          dangerouslySetInnerHTML={{ __html: getFormattedReference(ref, data.citationStyle) }}
                        />
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-center font-bold text-md mb-4">LAMPIRAN: KISI-KISI & TES</h2>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 mb-4">
                    <h4 className="font-bold mb-2">Kisi-Kisi Instrumen</h4>
                    {renderContent(content.instrumentGrid)}
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 mb-4">
                    <h4 className="font-bold mb-2">Soal Pre-Test</h4>
                    {renderContent(content.preTest)}
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 mb-4">
                    <h4 className="font-bold mb-2">Soal Post-Test</h4>
                    {renderContent(content.postTest)}
                </div>
            </section>

            <section>
                <h2 className="text-center font-bold text-md mb-4">LAMPIRAN: HITUNGAN STATISTIK</h2>
                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                    {renderContent(content.calculations)}
                </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

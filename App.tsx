
import React, { useState } from 'react';
import { DraftForm } from './components/DraftForm';
import { DraftPreview } from './components/DraftPreview';
import { DraftData, Faculty, GeneratedContent, CitationStyle, WritingStyle, ResearchType, CitationFormat, ResearchLevel, Language } from './types';
import { generateResearchDraft } from './services/geminiService';
import { GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const [formData, setFormData] = useState<DraftData>({
    title: '',
    faculty: Faculty.EKONOMI,
    studentName: '',
    university: '',
    
    // Default Values for New Fields
    researchLevel: ResearchLevel.SKRIPSI,
    language: Language.INDONESIA,

    chapterPages: {
      c1: 10,
      c2: 20,
      c3: 10,
      c4: 20,
      c5: 5
    },
    // New Reference Config Defaults
    refConfig: {
      journals: 5,
      repository: 3,
      digitalWorks: 2,
      proceedings: 2,
      reports: 1,
      websites: 2,
      books: 3
    },
    refYearStart: currentYear - 5, // Default last 5 years
    refYearEnd: currentYear,
    // New Chapter Selection Defaults (All Selected)
    chaptersToGenerate: {
      coverAbstract: true,
      chapter1: true,
      chapter2: true,
      chapter3: true,
      chapter4: true,
      chapter5: true,
      referencesAppendices: true
    },
    uploadedFiles: [], // Initialize empty array
    citationStyle: CitationStyle.APA,
    citationFormat: CitationFormat.IN_NOTE, 
    writingStyle: WritingStyle.AKADEMISI,
    researchType: ResearchType.KUANTITATIF,
    statisticalFormula: '', 
    location: '',
    population: '',
    sample: '',
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to handle nested object updates
  const handleInputChange = (field: keyof DraftData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChapterPageChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      chapterPages: {
        ...prev.chapterPages,
        [key]: value
      }
    }));
  };

  const handleGenerate = async () => {
    if (!formData.title || !formData.studentName || !formData.university || !formData.location) {
      alert("Mohon lengkapi Judul, Nama, Universitas, dan Tempat Penelitian.");
      return;
    }

    // Check if at least one chapter is selected
    const isAnyChapterSelected = Object.values(formData.chaptersToGenerate).some(val => val);
    if (!isAnyChapterSelected) {
      alert("Mohon pilih minimal satu bagian/bab untuk dibuat.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // NOTE: In a real app with partial updates, we might want to merge `content` with `generatedContent`
      // For now, we replace it to reflect exactly what the AI generated this session.
      const content = await generateResearchDraft(formData);
      setGeneratedContent(content);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat membuat draft. Pastikan API Key valid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">ScholarDraft</h1>
              <p className="text-xs text-slate-500 font-medium">Sistem Penyusun Riset Ilmiah</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-slate-500">
            Powered by Gemini AI & Internal Knowledge Base
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 font-bold">Error:</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-6">
            <DraftForm 
              data={formData} 
              onChange={handleInputChange} 
              onChapterPageChange={handleChapterPageChange}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8 h-full min-h-[600px]">
            <DraftPreview content={generatedContent} data={formData} />
          </div>
        </div>
      </main>

       <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} ScholarDraft. Research Drafting Assistant.
        </div>
      </footer>
    </div>
  );
};

export default App;

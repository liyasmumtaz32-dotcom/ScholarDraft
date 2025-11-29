
import { GeneratedContent, Reference, DraftData, CitationStyle } from '../types';

export const getFormattedReference = (ref: Reference, style: CitationStyle): string => {
  switch (style) {
    case CitationStyle.MLA:
      return `${ref.author}. <i>${ref.title}</i>. ${ref.publisher}, ${ref.year}.`;
    case CitationStyle.CHICAGO:
      return `${ref.author}. <i>${ref.title}</i>. ${ref.city}: ${ref.publisher}, ${ref.year}.`;
    case CitationStyle.HARVARD:
      return `${ref.author} (${ref.year}) <i>${ref.title}</i>. ${ref.city}: ${ref.publisher}.`;
    case CitationStyle.APA:
    default:
      return `${ref.author} (${ref.year}). <i>${ref.title}</i>. ${ref.publisher}.`;
  }
};

export const generateRIS = (references: Reference[]): string => {
  let risContent = '';
  
  references.forEach(ref => {
    risContent += `TY  - ${ref.type === 'BOOK' ? 'BOOK' : 'JOUR'}\r\n`;
    risContent += `AU  - ${ref.author}\r\n`;
    risContent += `PY  - ${ref.year}\r\n`;
    risContent += `TI  - ${ref.title}\r\n`;
    risContent += `CY  - ${ref.city}\r\n`;
    risContent += `PB  - ${ref.publisher}\r\n`;
    risContent += `ER  - \r\n\r\n`;
  });

  return risContent;
};

export const downloadRIS = (references: Reference[]) => {
  const content = generateRIS(references);
  const blob = new Blob([content], { type: 'application/x-research-info-systems' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'referensi_scholardraft.ris';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- CLEANING UTILITY ---
const cleanMarkdown = (text: string): string => {
  if (!text) return "";
  let clean = text;

  // 1. Handle Blockquotes ( > quote) -> <blockquote>
  clean = clean.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

  // 2. Convert Bold (**text**) -> <b>text</b>
  clean = clean.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // 3. Convert Italic (*text* or _text_) -> <i>text</i> (For Foreign Words)
  clean = clean.replace(/\*(.*?)\*/g, '<i>$1</i>');
  clean = clean.replace(/_(.*?)_/g, '<i>$1</i>');

  // 4. Remove Header hashes (### Title) -> Just Title
  clean = clean.replace(/^#+\s+(.*$)/gm, '$1');

  // 5. Remove any remaining isolated Markdown symbols
  clean = clean.replace(/```/g, ''); 
  
  return clean;
};

// Internal Helper for Styling
const getDocStyles = () => `
  <style>
    @page {
        size: A4;
        margin: 3cm 4cm 3cm 4cm; /* Top Right Bottom Left */
        mso-page-orientation: portrait;
        mso-header-margin: 1.27cm;
        mso-footer-margin: 1.27cm;
    }
    @page Section1 {
        mso-footer: f1;
    }
    div.Section1 { page:Section1; }
    
    body { 
        font-family: 'Times New Roman', serif; 
        font-size: 12pt; 
        line-height: 200%; /* Double Spacing (2 Spasi) */
        text-align: justify; /* Justify Alignment */
        color: #000; 
    }
    
    /* Headings */
    h1 { 
        font-size: 14pt; 
        font-weight: bold; 
        text-align: center; 
        text-transform: uppercase; 
        margin-top: 0pt; 
        margin-bottom: 24pt; 
    }
    h2, h3, h4 { 
        font-size: 12pt; 
        font-weight: bold; 
        text-align: justify; 
        margin-top: 12pt; 
        margin-bottom: 6pt; 
    }
    
    p { 
        text-align: justify; 
        margin-bottom: 12pt; 
        text-indent: 1cm; 
    }
    
    blockquote {
        margin-left: 1.5cm;
        margin-right: 1cm;
        font-size: 11pt;
        line-height: 100%; 
        text-align: justify;
    }
    
    /* TABLE STYLES */
    table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1px solid #000; line-height: 115%; }
    th { border: 1px solid #000; padding: 8px; background-color: #f2f2f2; font-weight: bold; text-align: center; }
    td { border: 1px solid #000; padding: 8px; vertical-align: top; }
    
    .page-break { page-break-before: always; }
    
    .cover { text-align: center; padding-top: 50pt; line-height: 150%; }
    .cover-title { font-size: 14pt; font-weight: bold; margin-bottom: 24pt; text-transform: uppercase; }
    .cover-name { margin-top: 48pt; font-size: 12pt; font-weight: bold; }
    .cover-inst { margin-top: 48pt; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
    
    .ref-item { 
        margin-bottom: 12pt; 
        text-indent: -1cm; 
        margin-left: 1cm; 
        line-height: 150%; 
        text-align: justify;
    }
    
    .toc-entry { display: flex; justify-content: space-between; margin-bottom: 6pt; line-height: 150%; }
    .toc-dots { flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 5pt; position: relative; top: -5px; }
    .toc-page { font-weight: bold; }

    /* Footer Style */
    p.MsoFooter, li.MsoFooter, div.MsoFooter {
        margin: 0cm;
        margin-bottom: 0.0001pt;
        mso-pagination: widow-orphan;
        font-size: 11.0pt;
        font-family: "Times New Roman", serif;
        text-align: right; 
    }
    
    /* Footnote Styles */
    p.MsoFootnoteText, li.MsoFootnoteText, div.MsoFootnoteText {
        mso-pagination: widow-orphan;
        font-size: 10.0pt;
        font-family: "Times New Roman", serif;
        margin: 0cm;
        margin-bottom: 0.0001pt;
        text-align: justify;
        line-height: 100%; 
    }
    span.MsoFootnoteReference { vertical-align: super; font-size: 8pt; }
  </style>
`;

// FOOTNOTE PROCESSOR
const processFootnotes = (html: string) => {
  let footnotesHtml = '';
  let counter = 1;
  
  const processedHtml = html.replace(/\[\[(.*?)\]\]/g, (match, content) => {
    const id = counter++;
    footnotesHtml += `
      <div style='mso-element:footnote' id=ftn${id}>
        <p class=MsoFootnoteText>
          <a style='mso-footnote-id:ftn${id}' href='#_ftnref${id}' name='_ftn${id}' title=''>
            <span class=MsoFootnoteReference><span style='mso-special-character:footnote'></span></span>
          </a>
          ${content}
        </p>
      </div>
    `;
    return `<a style='mso-footnote-id:ftn${id}' href='#_ftn${id}' name='_ftnref${id}' title=''><span class=MsoFootnoteReference><span style='mso-special-character:footnote'></span></span></a>`;
  });

  return { processedHtml, footnotesHtml };
};

const wrapHTML = (bodyContent: string, footnotesContent: string = '') => `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
        </w:WordDocument>
    </xml>
    ${getDocStyles()}
  </head>
  <body>
    <div class="Section1">
      ${bodyContent}
      <div style='mso-element:footer' id=f1>
        <p class=MsoFooter align=center style='text-align:center'>
            <span style='mso-field-code:" PAGE "'></span>
        </p>
      </div>
    </div>
    ${footnotesContent ? `<div style='mso-element:footnote-list'>${footnotesContent}</div>` : ''}
  </body>
  </html>
`;

const downloadHTMLAsDoc = (htmlContent: string, filename: string, footnotesContent: string = '') => {
  const fullHTML = wrapHTML(htmlContent, footnotesContent);
  const blob = new Blob(['\ufeff', fullHTML], {
      type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- DYNAMIC PAGE CALCULATION ---
// Estimasi: 1 Halaman A4 spasi ganda = 250 - 300 kata
const WORDS_PER_PAGE = 250;

const countPages = (html: string): number => {
    // Strip HTML tags to get raw text length
    const text = html.replace(/<[^>]*>?/gm, '');
    const wordCount = text.split(/\s+/).length;
    const pages = Math.ceil(wordCount / WORDS_PER_PAGE);
    return pages > 0 ? pages : 1; // Minimal 1 page
};

const generateTableOfContents = (content: GeneratedContent) => {
  // Hitung halaman secara dinamis berdasarkan konten nyata
  let currentPage = 1;
  // Cover & Abstrak (Asumsi 2 hal)
  currentPage += 2; 

  const p_c1 = countPages(content.chapter1);
  const p_c2 = countPages(content.chapter2);
  const p_c3 = countPages(content.chapter3);
  const p_c4 = countPages(content.chapter4);
  const p_c5 = countPages(content.chapter5);
  const p_refs = Math.ceil(content.references.length / 5); // Est 5 ref per page

  const entries = [
    { title: "BAB I PENDAHULUAN", page: currentPage },
    { title: "BAB II TINJAUAN PUSTAKA", page: (currentPage += p_c1) },
    { title: "BAB III METODOLOGI PENELITIAN", page: (currentPage += p_c2) },
    { title: "BAB IV HASIL DAN PEMBAHASAN", page: (currentPage += p_c3) },
    { title: "BAB V PENUTUP", page: (currentPage += p_c4) },
    { title: "DAFTAR PUSTAKA", page: (currentPage += p_c5) },
    { title: "LAMPIRAN", page: (currentPage += p_refs) },
  ];

  return `
    <h1>DAFTAR ISI</h1>
    <div style="margin-bottom: 24pt;">
       ${entries.map(e => `
         <div class="toc-entry">
            <span>${e.title}</span>
            <span class="toc-dots"></span>
            <span class="toc-page">${e.page}</span>
         </div>
       `).join('')}
    </div>
  `;
};

const proc = (txt: string) => {
    let cleaned = cleanMarkdown(txt);
    if (cleaned.includes('<table')) return cleaned;
    return cleaned.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('');
};

export const downloadCover = (data: DraftData, content: GeneratedContent) => {
  const { processedHtml, footnotesHtml } = processFootnotes(proc(content.abstract));
  
  const body = `
    <div class="cover">
      <div class="cover-title">${data.title}</div>
      <div style="margin-top: 24pt;">PROPOSAL PENELITIAN</div>
      <div class="cover-name">Oleh:<br/>${data.studentName}</div>
      <div class="cover-inst">${data.faculty.toUpperCase()}<br/>${data.university.toUpperCase()}<br/>${new Date().getFullYear()}</div>
    </div>
    <div class="page-break"></div>
    <h1>ABSTRAK</h1>
    ${processedHtml}
  `;
  downloadHTMLAsDoc(body, `Cover_Abstrak_${data.studentName}.doc`, footnotesHtml);
};

export const downloadChapter = (data: DraftData, chapterTitle: string, content: string, chapterNum: number) => {
  const { processedHtml, footnotesHtml } = processFootnotes(proc(content));
  const body = `
    <h1>BAB ${chapterNum}<br/>${chapterTitle.toUpperCase()}</h1>
    ${processedHtml}
  `;
  downloadHTMLAsDoc(body, `Bab_${chapterNum}_${data.studentName}.doc`, footnotesHtml);
};

export const downloadReferences = (data: DraftData, references: Reference[]) => {
  const refHTML = references.map(r => 
    `<div class="ref-item">${getFormattedReference(r, data.citationStyle)}</div>`
  ).join('');
  
  const body = `
    <h1>DAFTAR PUSTAKA</h1>
    ${refHTML}
  `;
  downloadHTMLAsDoc(body, `Daftar_Pustaka_${data.studentName}.doc`);
};

export const downloadAppendices = (data: DraftData, content: GeneratedContent) => {
  const body = `
    <h1>LAMPIRAN 1: INSTRUMEN PENELITIAN</h1>
    <h3>Kuesioner</h3>
    ${proc(content.questionnaire)}
    <div class="page-break"></div>
    <h1>LAMPIRAN 2: OUTPUT PENGOLAHAN DATA</h1>
    <h3>Hasil Analisis Statistik & Perhitungan</h3>
    ${proc(content.calculations)}
  `;
  downloadHTMLAsDoc(body, `Lampiran_${data.studentName}.doc`);
};

export const downloadFullDOC = (data: DraftData, content: GeneratedContent) => {
  const refHTML = content.references.map(r => 
    `<div class="ref-item">${getFormattedReference(r, data.citationStyle)}</div>`
  ).join('');

  const tocHTML = generateTableOfContents(content); // Use content for dynamic TOC

  const rawBody = `
    <div class="cover">
      <div class="cover-title">${data.title}</div>
      <div style="margin-top: 24pt;">PROPOSAL PENELITIAN</div>
      <div class="cover-name">Oleh:<br/>${data.studentName}</div>
      <div class="cover-inst">${data.faculty.toUpperCase()}<br/>${data.university.toUpperCase()}<br/>${new Date().getFullYear()}</div>
    </div>

    <div class="page-break"></div>
    <h1>ABSTRAK</h1>
    ${proc(content.abstract)}

    <div class="page-break"></div>
    ${tocHTML}

    <div class="page-break"></div>
    <h1>BAB I<br/>PENDAHULUAN</h1>
    ${proc(content.chapter1)}

    <div class="page-break"></div>
    <h1>BAB II<br/>TINJAUAN PUSTAKA</h1>
    ${proc(content.chapter2)}

    <div class="page-break"></div>
    <h1>BAB III<br/>METODOLOGI PENELITIAN</h1>
    ${proc(content.chapter3)}

    <div class="page-break"></div>
    <h1>BAB IV<br/>HASIL DAN PEMBAHASAN</h1>
    ${proc(content.chapter4)}

    <div class="page-break"></div>
    <h1>BAB V<br/>PENUTUP</h1>
    ${proc(content.chapter5)}

    <div class="page-break"></div>
    <h1>DAFTAR PUSTAKA</h1>
    ${refHTML}

    <div class="page-break"></div>
    <h1>LAMPIRAN 1: KUESIONER</h1>
    ${proc(content.questionnaire)}

    <div class="page-break"></div>
    <h1>LAMPIRAN 2: DATA & PERHITUNGAN</h1>
    ${proc(content.calculations)}
  `;

  const { processedHtml, footnotesHtml } = processFootnotes(rawBody);

  downloadHTMLAsDoc(processedHtml, `Full_Draft_${data.studentName.replace(/\s+/g, '_')}.doc`, footnotesHtml);
};

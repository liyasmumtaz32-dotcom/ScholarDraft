
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
// Removes Markdown artifacts (#, *, etc) and converts to HTML for Word
const cleanMarkdown = (text: string): string => {
  if (!text) return "";
  let clean = text;

  // 1. Handle Blockquotes ( > quote) -> <blockquote>
  // Simple check for lines starting with >
  clean = clean.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

  // 2. Convert Bold (**text**) -> <b>text</b>
  clean = clean.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // 3. Convert Italic (*text* or _text_) -> <i>text</i> (For Foreign Words)
  clean = clean.replace(/\*(.*?)\*/g, '<i>$1</i>');
  clean = clean.replace(/_(.*?)_/g, '<i>$1</i>');

  // 4. Remove Header hashes (### Title) -> Just Title (styling handled by CSS)
  clean = clean.replace(/^#+\s+(.*$)/gm, '$1');

  // 5. Remove any remaining isolated Markdown symbols that shouldn't be there
  // (Be careful not to remove mathematical symbols if needed, but here we clean text noise)
  clean = clean.replace(/```/g, ''); // Remove code blocks
  
  return clean;
};

// Internal Helper for Styling
// We use special MSO styles to handle headers/footers in Word
// Margins: Top 3cm, Right 4cm, Bottom 3cm, Left 4cm
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
        text-align: center; /* Center Chapter Titles */
        text-transform: uppercase; 
        margin-top: 0pt; 
        margin-bottom: 24pt; 
    }
    h2, h3, h4 { 
        font-size: 12pt; 
        font-weight: bold; 
        text-align: justify; /* Subtitles Justified */
        margin-top: 12pt; 
        margin-bottom: 6pt; 
    }
    
    p { 
        text-align: justify; 
        margin-bottom: 12pt; 
        text-indent: 1cm; /* First line indent for paragraphs */
    }
    
    /* Blockquote for Long Citations (Single Spacing) */
    blockquote {
        margin-left: 1.5cm;
        margin-right: 1cm;
        font-size: 11pt;
        line-height: 100%; /* Single Spacing (1 Spasi) */
        text-align: justify;
    }
    
    /* TABLE STYLES FOR REAL WORD TABLES */
    table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1px solid #000; line-height: 115%; }
    th { border: 1px solid #000; padding: 8px; background-color: #f2f2f2; font-weight: bold; text-align: center; }
    td { border: 1px solid #000; padding: 8px; vertical-align: top; }
    
    .page-break { page-break-before: always; }
    
    /* Cover Styles */
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
    
    /* Table of Contents Styles */
    .toc-entry { display: flex; justify-content: space-between; margin-bottom: 6pt; line-height: 150%; }
    .toc-dots { flex-grow: 1; border-bottom: 1px dotted #000; margin: 0 5pt; position: relative; top: -5px; }
    .toc-page { font-weight: bold; }

    /* Footer Style (Page Numbers) */
    p.MsoFooter, li.MsoFooter, div.MsoFooter {
        margin: 0cm;
        margin-bottom: 0.0001pt;
        mso-pagination: widow-orphan;
        font-size: 11.0pt;
        font-family: "Times New Roman", serif;
        text-align: right; /* Page number usually bottom right or center */
    }
    
    /* Footnote Styles (Simulated for MSO) */
    span.MsoFootnoteReference { vertical-align: super; font-size: 8pt; }
  </style>
`;

const wrapHTML = (bodyContent: string) => `
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
      
      <!-- Footer Definition for Word -->
      <div style='mso-element:footer' id=f1>
        <p class=MsoFooter align=center style='text-align:center'>
            <span style='mso-field-code:" PAGE "'></span>
        </p>
      </div>
    </div>
  </body>
  </html>
`;

const downloadHTMLAsDoc = (htmlContent: string, filename: string) => {
  const fullHTML = wrapHTML(htmlContent);
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

// --- Helper: Generate TOC based on Input Math ---
const generateTableOfContents = (data: DraftData) => {
  const { c1, c2, c3, c4, c5 } = data.chapterPages;
  let currentPage = 1;

  const entries = [
    { title: "BAB I PENDAHULUAN", page: currentPage },
    { title: "BAB II TINJAUAN PUSTAKA", page: (currentPage += c1) },
    { title: "BAB III METODOLOGI PENELITIAN", page: (currentPage += c2) },
    { title: "BAB IV HASIL DAN PEMBAHASAN", page: (currentPage += c3) },
    { title: "BAB V PENUTUP", page: (currentPage += c4) },
    { title: "DAFTAR PUSTAKA", page: (currentPage += c5) },
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

// --- Processor Helper ---
const proc = (txt: string) => {
    // If it contains table, assume HTML is mostly valid, still clean markdown
    let cleaned = cleanMarkdown(txt);
    if (cleaned.includes('<table')) return cleaned;
    // Replace newlines with paragraph breaks for cleaner Word structure
    return cleaned.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('');
};

// --- Single Section Generators ---

export const downloadCover = (data: DraftData, content: GeneratedContent) => {
  const body = `
    <div class="cover">
      <div class="cover-title">${data.title}</div>
      <div style="margin-top: 24pt;">PROPOSAL PENELITIAN</div>
      <div class="cover-name">Oleh:<br/>${data.studentName}</div>
      <div class="cover-inst">${data.faculty.toUpperCase()}<br/>${data.university.toUpperCase()}<br/>${new Date().getFullYear()}</div>
    </div>
    <div class="page-break"></div>
    <h1>ABSTRAK</h1>
    ${proc(content.abstract)}
  `;
  downloadHTMLAsDoc(body, `Cover_Abstrak_${data.studentName}.doc`);
};

export const downloadChapter = (data: DraftData, chapterTitle: string, content: string, chapterNum: number) => {
  const body = `
    <h1>BAB ${chapterNum}<br/>${chapterTitle.toUpperCase()}</h1>
    ${proc(content)}
  `;
  downloadHTMLAsDoc(body, `Bab_${chapterNum}_${data.studentName}.doc`);
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
    <h1>LAMPIRAN: INSTRUMEN PENELITIAN</h1>
    <h3>Kisi-kisi dan Kuesioner</h3>
    ${proc(content.questionnaire)} 
  `;
  downloadHTMLAsDoc(body, `Lampiran_${data.studentName}.doc`);
};

// --- Full Document Generator ---

export const downloadFullDOC = (data: DraftData, content: GeneratedContent) => {
  const refHTML = content.references.map(r => 
    `<div class="ref-item">${getFormattedReference(r, data.citationStyle)}</div>`
  ).join('');

  const tocHTML = generateTableOfContents(data);

  const body = `
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
    <h1>LAMPIRAN: INSTRUMEN PENELITIAN</h1>
    ${proc(content.questionnaire)}
  `;

  downloadHTMLAsDoc(body, `Full_Draft_${data.studentName.replace(/\s+/g, '_')}.doc`);
};

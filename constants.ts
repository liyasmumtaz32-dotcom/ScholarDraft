import { Faculty, Reference } from './types';

// Database "Seminal Works" (Buku Wajib - Expanded)
export const SEMINAL_WORKS_DB: Record<Faculty, Reference[]> = {
  [Faculty.EKONOMI]: [
    { type: 'BOOK', author: 'Kotler, P., & Keller, K. L.', year: '2021', title: 'Marketing Management', city: 'London', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Mankiw, N. G.', year: '2020', title: 'Principles of Economics', city: 'Boston', publisher: 'Cengage Learning' },
    { type: 'BOOK', author: 'Robbins, S. P., & Judge, T. A.', year: '2019', title: 'Organizational Behavior', city: 'New York', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Sekaran, U., & Bougie, R.', year: '2016', title: 'Research Methods for Business: A Skill Building Approach', city: 'Chichester', publisher: 'Wiley' },
    { type: 'BOOK', author: 'Ghozali, I.', year: '2018', title: 'Aplikasi Analisis Multivariate dengan Program IBM SPSS', city: 'Semarang', publisher: 'Badan Penerbit Universitas Diponegoro' },
    { type: 'BOOK', author: 'Porter, M. E.', year: '2008', title: 'Competitive Strategy: Techniques for Analyzing Industries and Competitors', city: 'New York', publisher: 'Free Press' },
    { type: 'BOOK', author: 'Schiffman, L. G., & Wisenblit, J. L.', year: '2019', title: 'Consumer Behavior', city: 'New York', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Cooper, D. R., & Schindler, P. S.', year: '2014', title: 'Business Research Methods', city: 'New York', publisher: 'McGraw-Hill' }
  ],
  [Faculty.IT]: [
    { type: 'BOOK', author: 'Pressman, R. S., & Maxim, B. R.', year: '2019', title: 'Software Engineering: A Practitioner\'s Approach', city: 'New York', publisher: 'McGraw-Hill Education' },
    { type: 'BOOK', author: 'Sommerville, I.', year: '2016', title: 'Software Engineering', city: 'Boston', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Martin, R. C.', year: '2008', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', city: 'Upper Saddle River', publisher: 'Prentice Hall' },
    { type: 'BOOK', author: 'Connolly, T. M., & Begg, C. E.', year: '2014', title: 'Database Systems: A Practical Approach to Design, Implementation, and Management', city: 'Boston', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Satzinger, J. W., Jackson, R. B., & Burd, S. D.', year: '2016', title: 'Systems Analysis and Design in a Changing World', city: 'Boston', publisher: 'Cengage Learning' },
    { type: 'BOOK', author: 'Gamma, E., Helm, R., Johnson, R., & Vlissides, J.', year: '1994', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', city: 'Boston', publisher: 'Addison-Wesley' },
    { type: 'BOOK', author: 'Kurose, J. F., & Ross, K. W.', year: '2017', title: 'Computer Networking: A Top-Down Approach', city: 'New York', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Russell, S. J., & Norvig, P.', year: '2020', title: 'Artificial Intelligence: A Modern Approach', city: 'Hoboken', publisher: 'Pearson' }
  ],
  [Faculty.PSIKOLOGI]: [
    { type: 'BOOK', author: 'Myers, D. G., & DeWall, C. N.', year: '2020', title: 'Psychology', city: 'New York', publisher: 'Worth Publishers' },
    { type: 'BOOK', author: 'Sugiyono', year: '2019', title: 'Metode Penelitian Kuantitatif, Kualitatif, dan R&D', city: 'Bandung', publisher: 'Alfabeta' },
    { type: 'BOOK', author: 'Azwar, S.', year: '2017', title: 'Penyusunan Skala Psikologi', city: 'Yogyakarta', publisher: 'Pustaka Pelajar' },
    { type: 'BOOK', author: 'Feist, J., Feist, G. J., & Roberts, T.', year: '2018', title: 'Theories of Personality', city: 'New York', publisher: 'McGraw-Hill Education' },
    { type: 'BOOK', author: 'Santrock, J. W.', year: '2018', title: 'Life-Span Development', city: 'New York', publisher: 'McGraw-Hill Education' },
    { type: 'BOOK', author: 'Baron, R. A., & Branscombe, N. R.', year: '2017', title: 'Social Psychology', city: 'Boston', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Hurlock, E. B.', year: '2011', title: 'Psikologi Perkembangan: Suatu Pendekatan Sepanjang Rentang Kehidupan', city: 'Jakarta', publisher: 'Erlangga' }
  ],
  [Faculty.HUKUM]: [
    { type: 'BOOK', author: 'Soekanto, S.', year: '2014', title: 'Pengantar Penelitian Hukum', city: 'Jakarta', publisher: 'UI Press' },
    { type: 'BOOK', author: 'Marzuki, P. M.', year: '2017', title: 'Penelitian Hukum', city: 'Jakarta', publisher: 'Kencana' },
    { type: 'BOOK', author: 'Kansil, C. S. T.', year: '2018', title: 'Pengantar Ilmu Hukum dan Tata Hukum Indonesia', city: 'Jakarta', publisher: 'Balai Pustaka' },
    { type: 'BOOK', author: 'Asshiddiqie, J.', year: '2010', title: 'Pengantar Ilmu Hukum Tata Negara', city: 'Jakarta', publisher: 'Rajawali Pers' },
    { type: 'BOOK', author: 'Mertokusumo, S.', year: '2019', title: 'Mengenal Hukum: Suatu Pengantar', city: 'Yogyakarta', publisher: 'Cahaya Atma Pustaka' },
    { type: 'BOOK', author: 'Ibrahim, J.', year: '2006', title: 'Teori dan Metodologi Penelitian Hukum Normatif', city: 'Malang', publisher: 'Bayumedia Publishing' }
  ],
  [Faculty.KEDOKTERAN]: [
    { type: 'BOOK', author: 'Hall, J. E.', year: '2020', title: 'Guyton and Hall Textbook of Medical Physiology', city: 'Philadelphia', publisher: 'Elsevier' },
    { type: 'BOOK', author: 'Dahlan, M. S.', year: '2014', title: 'Statistik untuk Kedokteran dan Kesehatan', city: 'Jakarta', publisher: 'Epidemiologi Indonesia' },
    { type: 'BOOK', author: 'Sherwood, L.', year: '2015', title: 'Human Physiology: From Cells to Systems', city: 'Boston', publisher: 'Cengage Learning' },
    { type: 'BOOK', author: 'Tortora, G. J., & Derrickson, B.', year: '2017', title: 'Principles of Anatomy and Physiology', city: 'Hoboken', publisher: 'Wiley' },
    { type: 'BOOK', author: 'Kumar, V., Abbas, A. K., & Aster, J. C.', year: '2018', title: 'Robbins Basic Pathology', city: 'Philadelphia', publisher: 'Elsevier' }
  ],
  [Faculty.TEKNIK]: [
    { type: 'BOOK', author: 'Callister, W. D., & Rethwisch, D. G.', year: '2018', title: 'Materials Science and Engineering: An Introduction', city: 'Hoboken', publisher: 'Wiley' },
    { type: 'BOOK', author: 'Hibbeler, R. C.', year: '2016', title: 'Engineering Mechanics: Statics & Dynamics', city: 'Hoboken', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Cengel, Y. A., & Boles, M. A.', year: '2019', title: 'Thermodynamics: An Engineering Approach', city: 'New York', publisher: 'McGraw-Hill Education' },
    { type: 'BOOK', author: 'Kreyszig, E.', year: '2011', title: 'Advanced Engineering Mathematics', city: 'Hoboken', publisher: 'Wiley' }
  ],
  [Faculty.PENDIDIKAN]: [
    { type: 'BOOK', author: 'Arikunto, S.', year: '2013', title: 'Prosedur Penelitian: Suatu Pendekatan Praktik', city: 'Jakarta', publisher: 'Rineka Cipta' },
    { type: 'BOOK', author: 'Slavin, R. E.', year: '2018', title: 'Educational Psychology: Theory and Practice', city: 'Boston', publisher: 'Pearson' },
    { type: 'BOOK', author: 'Uno, H. B.', year: '2011', title: 'Teori Motivasi dan Pengukurannya: Analisis di Bidang Pendidikan', city: 'Jakarta', publisher: 'Bumi Aksara' },
    { type: 'BOOK', author: 'Sanjaya, W.', year: '2013', title: 'Strategi Pembelajaran Berorientasi Standar Proses Pendidikan', city: 'Jakarta', publisher: 'Kencana' }
  ],
  [Faculty.SASTRA]: [
    { type: 'BOOK', author: 'Teeuw, A.', year: '2015', title: 'Sastra dan Ilmu Sastra', city: 'Jakarta', publisher: 'Pustaka Jaya' },
    { type: 'BOOK', author: 'Ratna, N. K.', year: '2010', title: 'Metodologi Penelitian Sastra', city: 'Yogyakarta', publisher: 'Pustaka Pelajar' },
    { type: 'BOOK', author: 'Endraswara, S.', year: '2011', title: 'Metodologi Penelitian Sastra', city: 'Yogyakarta', publisher: 'CAPS' },
    { type: 'BOOK', author: 'Luxemburg, J. V., Bal, M., & Weststeijn, W. G.', year: '1984', title: 'Pengantar Ilmu Sastra', city: 'Jakarta', publisher: 'Gramedia' }
  ]
};

// Fallback if generic
export const GENERIC_REFS: Reference[] = [
    { type: 'BOOK', author: 'Creswell, J. W.', year: '2014', title: 'Research Design: Qualitative, Quantitative, and Mixed Methods Approaches', city: 'Thousand Oaks', publisher: 'SAGE Publications' },
    { type: 'BOOK', author: 'Sugiyono', year: '2019', title: 'Metode Penelitian Kuantitatif, Kualitatif, dan R&D', city: 'Bandung', publisher: 'Alfabeta' },
    { type: 'BOOK', author: 'Neuman, W. L.', year: '2014', title: 'Social Research Methods: Qualitative and Quantitative Approaches', city: 'Harlow', publisher: 'Pearson' }
];
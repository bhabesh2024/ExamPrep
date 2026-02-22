// src/data/questionsLoader.js
// Central loader — saare JSON files yahan se load hote hain
// Vercel deploy ke baad bhi sab devices pe same questions dikhenge

import MathsArithmetic  from './Maths/Arithmetic.json';
import MathsAdvance     from './Maths/Advance.json';
import MathsOthers      from './Maths/Others.json';

import GKPolity          from './GK/Polity.json';
import GKAncientHistory  from './GK/Ancient History.json';
import GKMedievalHistory from './GK/Medieval History.json';
import GKModernHistory   from './GK/Modern History.json';
import GKAssamHistory    from './GK/Assam History.json';
import GKPhysicalGeo     from './GK/Physical Geography.json';
import GKSocialGeo       from './GK/Social Geography.json';
import GKEconomicGeo     from './GK/Economic Geography.json';
import GKMicroEconomics  from './GK/Micro Economics.json';
import GKIndianEconomy   from './GK/Indian Economy.json';
import GKGeneralScience  from './GK/General Science.json';

import ScienceBiology  from './Science/Biology.json';
import ScienceChemistry from './Science/Chemistry.json';
import SciencePhysics  from './Science/Physics.json';

import ReasoningVerbal    from './Reasoning/Verbal.json';
import ReasoningNonVerbal from './Reasoning/Non-Verbal.json';

import EnglishGrammar    from './English/Grammar.json';
import EnglishVocabulary from './English/Vocabulary.json';
import EnglishReading    from './English/Reading Comprehension.json';

import ComputerBasics    from './Computer/Basics.json';
import ComputerInternet  from './Computer/Internet.json';

// ─────────────────────────────────────────────
// Topic Title → Topic ID mapping
// (matches syllabusData.jsx topic IDs exactly)
// ─────────────────────────────────────────────
const TITLE_TO_ID = {
  // Maths - Arithmetic
  "Number System": "number-system", "Averages": "averages",
  "Percentage": "percentage", "Profit and Loss": "profit-and-loss",
  "Work and Time": "work-and-time", "Ratio": "ratio", "SI and CI": "si-and-ci",
  // Maths - Advance
  "Algebra": "algebra", "Trigonometry": "trigonometry", "Geometry": "geometry",
  "Mensuration": "mensuration", "Statistics": "statistics",
  // Maths - Others
  "Speed Distance and Time": "speed-distance-time", "Train": "train",
  "LCM and HCF": "lcm-and-hcf", "Fraction and Decimal": "fraction-and-decimal",
  "Boat and Streams": "boat-and-streams", "Partnership": "partnership",
  // GK - Polity
  "Preamble parts and schedule": "preamble",
  "Indian Union and Territories": "indian-union",
  "Fundamental Rights": "fundamental-rights",
  "DPSP and Fundamental Duties": "dpsp",
  "President and Vice President": "president",
  "Governor": "governor",
  "Prime Minister and Council of Ministers": "prime-minister",
  "Chief Minister and State Council": "chief-minister",
  "Parliament": "parliament", "State Legislature": "state-legislature",
  "Supreme Court and High Courts": "supreme-court",
  "Local Governments": "local-gov", "Emergency Provisions": "emergency",
  // GK - Ancient History
  "Pre Historical Period": "pre-historical",
  "Indus Valley Civilization": "indus-valley",
  "Vedic Civilization": "vedic", "Buddhism and Jainism": "buddhism-jainism",
  "Mahajanapadas": "mahajanapadas", "Mauryan Empire": "mauryan", "Gupta Empire": "gupta",
  // GK - Medieval
  "Delhi Sultanate": "delhi-sultanate", "Mughal Empire": "mughal-empire",
  // GK - Modern
  "The Coming of Europeans": "coming-of-europeans", "India under EIC": "india-under-eic",
  "Bengal Partition and Swadeshi Movement": "bengal-partition",
  "Expansion of British Empire in India": "british-expansion",
  "Socio Religious Movements": "socio-religious", "Gandhian Era": "gandhian-era",
  // GK - Assam History
  "Pre Ancient and Ancient Assam": "pre-ancient-assam",
  "Ahom Kingdom I": "ahom-1", "Ahom Kingdom II": "ahom-2",
  "Ahom Kingdom III": "ahom-3", "Ahom Kingdom IV": "ahom-4",
  "Mediaeval Assam": "mediaeval-assam", "Modern Era of Assam": "modern-assam",
  "Anti British Rising and Peasant Revolts": "anti-british-revolts",
  "National Awakening of Assam": "national-awakening",
  // GK - Physical Geography
  "Origin and Evolution of Earth Crust": "origin-earth",
  "Interior of Earth": "interior-earth",
  "Mineral and Energy Resources": "mineral-resources",
  // GK - Social Geography
  "Food and Nutrition Problems": "food-nutrition",
  "Revolutions of India": "revolutions-india",
  "Types of Economic Activities": "economic-activities",
  "Energy Resources": "energy-resources",
  // GK - Economic Geography
  "Transport and Communication": "transport", "Soil and Crops of India": "soil-crops",
  // GK - Micro Economics
  "Basics of Economy": "basics-economy", "Factors of Production": "factors-production",
  "Demand and Supply": "demand-supply", "Poverty": "poverty",
  // GK - Indian Economy (Macro)
  "Fiscal Policies": "national-income",
  "Inflation and Measures to control it": "inflation",
  "Important Financial Institutions": "industry",
  "Government Schemes": "infrastructure",
  // GK - General Science
  "Physics": "basic-physics", "Chemistry": "basic-chemistry", "Biology": "ecosystem",
  // Science
  "Human Physiology": "human-physiology", "Laws of Motion": "laws-of-motion",
  "Atomic Structure": "atomic-structure",
  "Acids Bases and Salts": "pollutions", "Metals and Non-Metals": "basic-chemistry",
  // Reasoning - Verbal
  "Coding Decoding": "coding-decoding", "Analogy": "analogy",
  "Classification": "blood-relation", "Series": "wrong-number",
  // Reasoning - Non-Verbal
  "Figure Matrix": "series", "Paper Cutting": "cubes-dice",
  "Grouping of Images": "venn-diagram",
  // English
  "Parts of Speech": "parts-of-speech",
  "Subject-Verb Agreement": "subject-verb-agreement",
  "Tenses": "tenses", "Voice Change": "voice-change",
  "Synonyms & Antonyms": "synonyms-antonyms",
  "Idioms & Phrases": "idioms-phrases",
  "One Word Substitution": "one-word-substitution",
  "Short Passages": "short-passages", "Long Passages": "long-passages",
  // Computer
  "History of Computers": "intro-computer",
  "Hardware and Software": "io-devices",
  "Input-Output Devices": "generation-computer",
  "Network Types": "internet-cybersecurity",
  "Internet Protocols": "ram-rom", "Cyber Security": "motherboard",
};

// ─────────────────────────────────────────────
// Normalize questions to standard format
// Handles all 3 formats found in JSON files:
//   1. {question, options, answer, explanation, ...}  ← Maths/Polity style
//   2. {id, question, options, answer}                ← GK/Science style  
//   3. {q, a}                                         ← Reasoning dummy style
// ─────────────────────────────────────────────
const normalize = (questions) => {
    if (!Array.isArray(questions)) return [];
    return questions
      .map(q => {
        if (q.q && !q.question) return null;
        if (!q.question || !q.options || !q.answer) return null;
        if (!Array.isArray(q.options) || q.options.length < 2) return null;
        if (q.question.includes('Sample Q') || q.question.includes('Dummy question')) return null;
  
        // 🔥 AUTO-FIX LOGIC FOR OLD JSON FORMAT 🔥
        let finalGeoType = q.geometryType || null;
        let finalGeoData = q.geometryData || null;
  
        // Agar aapne purane data mein "image" ya "imageUrl" key use ki thi
        if (!finalGeoType && (q.image || q.imageUrl || q.img)) {
          finalGeoType = 'image-url';
          finalGeoData = q.image || q.imageUrl || q.img;
        }
        
        // Agar aapne "chartData" ya koi aur key use ki thi
        if (!finalGeoType && q.chartData) {
          finalGeoType = 'recharts-bar'; // ya 'recharts-pie' jo aap use karte the
          finalGeoData = q.chartData;
        }
  
        return {
          question:         q.question || '',
          questionHindi:    q.questionHindi || q.questionAssamese || '',
          options:          q.options,
          answer:           q.answer,
          explanation:      q.explanation || '',
          explanationHindi: q.explanationHindi || q.explanationAssamese || '',
          examReference:    q.examReference || 'Expected',
          geometryType:     finalGeoType,
          geometryData:     finalGeoData,
        };
      })
      .filter(Boolean);
  };

// ─────────────────────────────────────────────
// Build master index: topicId → questions[]
// ─────────────────────────────────────────────
const buildIndex = (...jsonFiles) => {
  const index = {};
  for (const file of jsonFiles) {
    for (const [topicTitle, questions] of Object.entries(file)) {
      const topicId = TITLE_TO_ID[topicTitle];
      if (!topicId) continue;
      const normalized = normalize(questions);
      if (normalized.length > 0) {
        // Merge if topicId already exists (e.g. Biology in GKGeneralScience + ScienceBiology)
        index[topicId] = [...(index[topicId] || []), ...normalized];
      }
    }
  }
  return index;
};

const masterIndex = buildIndex(
  MathsArithmetic, MathsAdvance, MathsOthers,
  GKPolity, GKAncientHistory, GKMedievalHistory, GKModernHistory,
  GKAssamHistory, GKPhysicalGeo, GKSocialGeo, GKEconomicGeo,
  GKMicroEconomics, GKIndianEconomy, GKGeneralScience,
  ScienceBiology, ScienceChemistry, SciencePhysics,
  ReasoningVerbal, ReasoningNonVerbal,
  EnglishGrammar, EnglishVocabulary, EnglishReading,
  ComputerBasics, ComputerInternet,
);

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * Get questions for a topic — used by ChapterPracticePage
 * @param {string} subjectId - "maths", "gk", etc (unused but kept for API compat)
 * @param {string} topicId   - "number-system", "preamble", etc
 * @returns {Array}
 */
export const getQuestions = (subjectId, topicId) => {
  return masterIndex[topicId] || [];
};

/**
 * Get questions by topic title — used by AdminPanel load button
 * @param {string} topicTitle - exact title from JSON key e.g. "Number System"
 * @returns {Array}
 */
export const getQuestionsByTitle = (topicTitle) => {
  const topicId = TITLE_TO_ID[topicTitle];
  if (!topicId) return [];
  return masterIndex[topicId] || [];
};

/**
 * Get the topic ID for a given title — used by AdminPanel
 */
export const getTitleToId = () => TITLE_TO_ID;
// ─────────────────────────────────────────────
// ✅ NAYE FUNCTIONS: MOCK TESTS KE LIYE RANDOM QUESTIONS
// ─────────────────────────────────────────────

const MATHS_TOPIC_IDS = [
  "number-system", "averages", "percentage", "profit-and-loss",
  "work-and-time", "ratio", "si-and-ci", "algebra", "trigonometry",
  "geometry", "mensuration", "statistics", "speed-distance-time",
  "train", "lcm-and-hcf", "fraction-and-decimal", "boat-and-streams",
  "partnership"
];

// Array ko randomly shuffle karne ka function
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Sirf Maths ke chapters se random questions nikalne ke liye (Sectional Mock)
export const getRandomMathsQuestions = (count) => {
  let pool = [];
  MATHS_TOPIC_IDS.forEach(id => {
    if (masterIndex[id]) pool = pool.concat(masterIndex[id]);
  });
  return shuffleArray(pool).slice(0, count);
};

// Sabhi subjects se milakar random questions nikalne ke liye (Full Mock)
export const getRandomAllQuestions = (count) => {
  let pool = [];
  Object.values(masterIndex).forEach(questions => {
    pool = pool.concat(questions);
  });
  return shuffleArray(pool).slice(0, count);
};
export default masterIndex;
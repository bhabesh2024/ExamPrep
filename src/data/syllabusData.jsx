// src/data/syllabusData.js

export const subjectsData = [
  {
    id: "maths",
    title: "Mathematics",
    iconName: "Calculator",
    color: "blue",
    description: "Master Algebra, Geometry, Arithmetic & Calculus.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "arithmetic",
        title: "Arithmetic",
        topics: [
          { id: "number-system", title: "Number System", totalQuestions: 50, isNew: false },
          { id: "averages", title: "Averages", totalQuestions: 35, isNew: false },
          { id: "percentage", title: "Percentage", totalQuestions: 60, isNew: true },
          { id: "profit-and-loss", title: "Profit and Loss", totalQuestions: 45, isNew: false },
          { id: "work-and-time", title: "Work and Time", totalQuestions: 40, isNew: false },
          { id: "ratio", title: "Ratio", totalQuestions: 30, isNew: false },
          { id: "si-and-ci", title: "SI and CI", totalQuestions: 45, isNew: false },
        ]
      },
      {
        id: "advance",
        title: "Advance",
        topics: [
          { id: "algebra", title: "Algebra", totalQuestions: 80, isNew: false },
          { id: "trigonometry", title: "Trigonometry", totalQuestions: 55, isNew: false },
          { id: "geometry", title: "Geometry", totalQuestions: 70, isNew: true },
          { id: "mensuration", title: "Mensuration", totalQuestions: 65, isNew: false },
          { id: "statistics", title: "Statistics", totalQuestions: 30, isNew: false },
        ]
      },
      {
        id: "others",
        title: "Others",
        topics: [
          { id: "lcm-and-hcf", title: "LCM and HCF", totalQuestions: 25, isNew: false },
          { id: "fraction-and-decimal", title: "Fraction and Decimal", totalQuestions: 20, isNew: false },
          { id: "train", title: "Train", totalQuestions: 35, isNew: false },
          { id: "speed-distance-time", title: "Speed Distance and Time", totalQuestions: 50, isNew: false },
          { id: "boat-and-streams", title: "Boat and Streams", totalQuestions: 30, isNew: false },
          { id: "partnership", title: "Partnership", totalQuestions: 20, isNew: false },
        ]
      }
    ]
  },
  {
    id: "english",
    title: "English",
    iconName: "BookOpen",
    color: "pink",
    description: "Improve Grammar, Vocabulary & Comprehension.",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "grammar",
        title: "Grammar",
        topics: [
          { id: "parts-of-speech", title: "Parts of Speech", totalQuestions: 60, isNew: false },
          { id: "subject-verb-agreement", title: "Subject-Verb Agreement", totalQuestions: 40, isNew: false },
          { id: "tenses", title: "Tenses", totalQuestions: 50, isNew: true },
          { id: "voice-change", title: "Voice Change", totalQuestions: 45, isNew: false },
          { id: "narration", title: "Narration", totalQuestions: 45, isNew: false },
        ]
      },
      {
        id: "vocabulary",
        title: "Vocabulary",
        topics: [
          { id: "synonyms-antonyms", title: "Synonyms & Antonyms", totalQuestions: 100, isNew: false },
          { id: "idioms-phrases", title: "Idioms & Phrases", totalQuestions: 80, isNew: false },
          { id: "one-word-substitution", title: "One Word Substitution", totalQuestions: 75, isNew: true },
        ]
      },
      {
        id: "reading-comprehension",
        title: "Reading Comprehension",
        topics: [
          { id: "short-passages", title: "Short Passages", totalQuestions: 30, isNew: false },
          { id: "long-passages", title: "Long Passages", totalQuestions: 20, isNew: false },
        ]
      }
    ]
  },
  {
    id: "gk",
    title: "General Knowledge",
    iconName: "Globe",
    color: "emerald",
    description: "Polity, History, Geography, Economics & Assam GS.",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "polity",
        title: "Polity",
        topics: [
          { id: "preamble", title: "Preamble parts and schedule", totalQuestions: 30, isNew: false },
          { id: "indian-union", title: "Indian Union and Territories", totalQuestions: 20, isNew: false },
          { id: "fundamental-rights", title: "Fundamental Rights", totalQuestions: 40, isNew: true },
          { id: "dpsp", title: "DPSP and Fundamental Duties", totalQuestions: 25, isNew: false },
          { id: "president", title: "President and Vice President", totalQuestions: 35, isNew: false },
          { id: "governor", title: "Governor", totalQuestions: 20, isNew: false },
          { id: "prime-minister", title: "Prime Minister and Council of Ministers", totalQuestions: 30, isNew: false },
          { id: "chief-minister", title: "Chief Minister and State Council", totalQuestions: 25, isNew: false },
          { id: "parliament", title: "Parliament", totalQuestions: 50, isNew: false },
          { id: "state-legislature", title: "State Legislature", totalQuestions: 30, isNew: false },
          { id: "supreme-court", title: "Supreme Court and High Courts", totalQuestions: 40, isNew: false },
          { id: "local-gov", title: "Local Governments", totalQuestions: 25, isNew: false },
          { id: "emergency", title: "Emergency Provisions", totalQuestions: 20, isNew: false },
        ]
      },
      {
        id: "ancient-history",
        title: "Ancient History",
        topics: [
          { id: "pre-historical", title: "Pre Historical Period", totalQuestions: 20, isNew: false },
          { id: "indus-valley", title: "Indus Valley Civilization", totalQuestions: 40, isNew: false },
          { id: "vedic", title: "Vedic Civilization", totalQuestions: 35, isNew: false },
          { id: "buddhism-jainism", title: "Buddhism and Jainism", totalQuestions: 30, isNew: false },
          { id: "mahajanapadas", title: "Mahajanapadas", totalQuestions: 20, isNew: false },
          { id: "mauryan", title: "Mauryan Empire", totalQuestions: 45, isNew: false },
          { id: "gupta", title: "Gupta Empire", totalQuestions: 40, isNew: false },
        ]
      },
      {
        id: "medieval-history",
        title: "Medieval History",
        topics: [
          { id: "delhi-sultanate", title: "Delhi Sultanate", totalQuestions: 50, isNew: false },
          { id: "mughal-empire", title: "Mughal Empire", totalQuestions: 60, isNew: false },
        ]
      },
      {
        id: "modern-history",
        title: "Modern History",
        topics: [
          { id: "coming-of-europeans", title: "The Coming of Europeans", totalQuestions: 25, isNew: false },
          { id: "india-under-eic", title: "India under EIC", totalQuestions: 30, isNew: false },
          { id: "bengal-partition", title: "Bengal Partition and Swadeshi Movement", totalQuestions: 35, isNew: false },
          { id: "british-expansion", title: "Expansion of British Empire in India", totalQuestions: 40, isNew: false },
          { id: "socio-religious", title: "Socio Religious Movements", totalQuestions: 25, isNew: false },
          { id: "gandhian-era", title: "Gandhian Era", totalQuestions: 55, isNew: true },
        ]
      },
      {
        id: "assam-history",
        title: "Assam History",
        topics: [
          { id: "pre-ancient-assam", title: "Pre Ancient and Ancient Assam", totalQuestions: 30, isNew: false },
          { id: "ahom-1", title: "Ahom Kingdom I", totalQuestions: 40, isNew: false },
          { id: "ahom-2", title: "Ahom Kingdom II", totalQuestions: 35, isNew: false },
          { id: "ahom-3", title: "Ahom Kingdom III", totalQuestions: 35, isNew: false },
          { id: "ahom-4", title: "Ahom Kingdom IV", totalQuestions: 30, isNew: false },
          { id: "mediaeval-assam", title: "Mediaeval Assam", totalQuestions: 25, isNew: false },
          { id: "modern-assam", title: "Modern Era of Assam", totalQuestions: 40, isNew: true },
          { id: "anti-british-revolts", title: "Anti British Rising and Peasant Revolts", totalQuestions: 35, isNew: false },
          { id: "national-awakening", title: "National Awakening of Assam", totalQuestions: 30, isNew: false },
        ]
      },
      {
        id: "physical-geography",
        title: "Physical Geography",
        topics: [
          { id: "origin-earth", title: "Origin and Evolution of Earth Crust", totalQuestions: 25, isNew: false },
          { id: "interior-earth", title: "Interior of Earth", totalQuestions: 20, isNew: false },
          { id: "mineral-resources", title: "Mineral and Energy Resources", totalQuestions: 30, isNew: false },
        ]
      },
      {
        id: "social-geography",
        title: "Social Geography",
        topics: [
          { id: "food-nutrition", title: "Food and Nutrition Problems", totalQuestions: 20, isNew: false },
          { id: "revolutions-india", title: "Revolutions of India", totalQuestions: 25, isNew: false },
          { id: "economic-activities", title: "Types of Economic Activities", totalQuestions: 30, isNew: false },
          { id: "energy-resources", title: "Energy Resources", totalQuestions: 25, isNew: false },
        ]
      },
      {
        id: "economic-geography",
        title: "Economic Geography",
        topics: [
          { id: "transport", title: "Transport and Communication", totalQuestions: 35, isNew: false },
          { id: "soil-crops", title: "Soil and Crops of India", totalQuestions: 40, isNew: false },
        ]
      },
      {
        id: "micro-economics",
        title: "Micro Economics",
        topics: [
          { id: "basics-economy", title: "Basics of Economy", totalQuestions: 30, isNew: false },
          { id: "factors-production", title: "Factors of Production", totalQuestions: 25, isNew: false },
          { id: "demand-supply", title: "Demand and Supply", totalQuestions: 35, isNew: false },
          { id: "poverty", title: "Poverty", totalQuestions: 20, isNew: false },
        ]
      },
      {
        id: "macro-economics",
        title: "Macro Economics",
        topics: [
          { id: "national-income", title: "National Income", totalQuestions: 30, isNew: false },
          { id: "inflation", title: "Inflation", totalQuestions: 25, isNew: false },
          { id: "economic-reforms", title: "Economic Reforms", totalQuestions: 35, isNew: false },
          { id: "industry", title: "Industry", totalQuestions: 20, isNew: false },
          { id: "infrastructure", title: "Infrastructure", totalQuestions: 25, isNew: false },
          { id: "cropping-patterns", title: "Cropping Patterns", totalQuestions: 20, isNew: false },
        ]
      },
      {
        id: "assam-gs",
        title: "Assam GS",
        topics: [
          { id: "language-literature", title: "Language and Literature", totalQuestions: 30, isNew: false },
          { id: "satras", title: "Satras", totalQuestions: 25, isNew: false },
          { id: "places-of-worship", title: "Places of Worship", totalQuestions: 20, isNew: false },
          { id: "fairs-festivals", title: "Fairs and Festivals", totalQuestions: 35, isNew: false },
          { id: "cultural-heritage", title: "Cultural Heritage of Assam", totalQuestions: 40, isNew: true },
          { id: "arts-crafts", title: "Arts and Crafts", totalQuestions: 25, isNew: false },
          { id: "cultural-institutions", title: "Cultural Institutions", totalQuestions: 20, isNew: false },
          { id: "music-dances", title: "Music and Dances", totalQuestions: 30, isNew: false },
          { id: "mobile-theatre", title: "Mobile Theatre", totalQuestions: 15, isNew: false },
          { id: "cinema", title: "Cinema", totalQuestions: 20, isNew: false },
          { id: "newspapers-magazines", title: "Newspapers and Magazines", totalQuestions: 25, isNew: false },
          { id: "tribes-ethnic-groups", title: "Tribes and Ethnic Groups", totalQuestions: 45, isNew: false },
          { id: "sports", title: "Sports", totalQuestions: 20, isNew: false },
          { id: "awards-honours", title: "Awards and Honours", totalQuestions: 30, isNew: false },
          { id: "first-in-assam", title: "First in Assam", totalQuestions: 25, isNew: false },
          { id: "sobriquets", title: "Sobriquets", totalQuestions: 15, isNew: false },
          { id: "important-personalities", title: "Important Personalities", totalQuestions: 40, isNew: false },
        ]
      }
    ]
  },
  {
    id: "reasoning",
    title: "Reasoning",
    iconName: "Brain",
    color: "orange",
    description: "Analytical, Logical & Non-Verbal Reasoning.",
    imageUrl: "https://images.unsplash.com/photo-1620503374956-c942862f0372?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "analytical",
        title: "Analytical",
        topics: [
          { id: "sitting-arrangement", title: "Sitting Arrangement", totalQuestions: 40, isNew: false },
          { id: "puzzles", title: "Puzzles", totalQuestions: 50, isNew: true },
        ]
      },
      {
        id: "logical",
        title: "Logical",
        topics: [
          { id: "word-formation", title: "Word Formation, Digit Sequence, Number", totalQuestions: 30, isNew: false },
          { id: "blood-relation", title: "Blood Relation", totalQuestions: 35, isNew: false },
          { id: "direction-sense", title: "Direction Sense", totalQuestions: 35, isNew: false },
          { id: "syllogism", title: "Syllogism", totalQuestions: 45, isNew: false },
          { id: "coding-decoding", title: "Coding and Decoding", totalQuestions: 50, isNew: false },
          { id: "order-ranking", title: "Order and Ranking", totalQuestions: 30, isNew: false },
          { id: "clock-calendar", title: "Clock and Calendar", totalQuestions: 40, isNew: false },
          { id: "symbols-notation", title: "Symbols and Notation and Mathematical Op..", totalQuestions: 35, isNew: false },
          { id: "analogy", title: "Analogy and Odd One Out", totalQuestions: 40, isNew: false },
          { id: "wrong-number", title: "Wrong Number Series", totalQuestions: 25, isNew: false },
        ]
      },
      {
        id: "non-verbal",
        title: "Non-Verbal",
        topics: [
          { id: "mirror-water-image", title: "Mirror / water image", totalQuestions: 30, isNew: false },
          { id: "embedded-figure", title: "Embedded figure", totalQuestions: 25, isNew: false },
          { id: "venn-diagram", title: "Venn Diagram", totalQuestions: 35, isNew: false },
          { id: "cubes-dice", title: "Cubes and Dice", totalQuestions: 40, isNew: false },
          { id: "series", title: "Series (Number, Letter and Figure)", totalQuestions: 45, isNew: false },
        ]
      }
    ]
  },
  {
    id: "science",
    title: "Science",
    iconName: "FlaskConical",
    color: "violet",
    description: "Physics, Chemistry & Biology topics.",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "physics",
        title: "Physics",
        topics: [
          { id: "basic-physics", title: "Basic Physics in Daily Life", totalQuestions: 40, isNew: false },
          { id: "physical-quantities", title: "Physical Quantities Use", totalQuestions: 30, isNew: false },
          { id: "laws-of-motion", title: "Laws of Motion and Electricity", totalQuestions: 50, isNew: true },
        ]
      },
      {
        id: "chemistry",
        title: "Chemistry",
        topics: [
          { id: "basic-chemistry", title: "Basic Chemistry in Living Organisms", totalQuestions: 35, isNew: false },
          { id: "pollutions", title: "Pollutions Types and Pollutants", totalQuestions: 30, isNew: false },
          { id: "atomic-structure", title: "Atomic Structure and Chemical Bonding", totalQuestions: 45, isNew: false },
        ]
      },
      {
        id: "biology",
        title: "Biology",
        topics: [
          { id: "flora-fauna", title: "Flora and Fauna of India", totalQuestions: 40, isNew: false },
          { id: "food-nutrition", title: "Food and Nutrition", totalQuestions: 35, isNew: false },
          { id: "human-physiology", title: "Human Physiology", totalQuestions: 55, isNew: false },
          { id: "ecosystem", title: "Ecosystem and Wetlands", totalQuestions: 30, isNew: false },
        ]
      }
    ]
  },
  {
    id: "computer",
    title: "Computer",
    iconName: "Terminal",
    color: "sky",
    description: "Basics, Software, OS, Hardware & Networking.",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "basics",
        title: "Basics",
        topics: [
          { id: "intro-computer", title: "Introduction to Computer", totalQuestions: 40, isNew: false },
          { id: "io-devices", title: "Input/Output Devices", totalQuestions: 35, isNew: false },
          { id: "generation-computer", title: "Generation of Computer", totalQuestions: 30, isNew: false },
        ]
      },
      {
        id: "software-os",
        title: "Software & OS",
        topics: [
          { id: "ms-office", title: "MS Office", totalQuestions: 50, isNew: false },
          { id: "windows-linux", title: "Windows/Linux", totalQuestions: 40, isNew: false },
          { id: "computer-languages", title: "Computer Languages", totalQuestions: 35, isNew: false },
        ]
      },
      {
        id: "hardware-network",
        title: "Hardware & Network",
        topics: [
          { id: "motherboard", title: "Motherboard", totalQuestions: 20, isNew: false },
          { id: "cpu", title: "CPU", totalQuestions: 25, isNew: false },
          { id: "internet-cybersecurity", title: "Internet & Cybersecurity", totalQuestions: 60, isNew: true },
          { id: "ram-rom", title: "RAM/ROM", totalQuestions: 30, isNew: false },
        ]
      }
    ]
  },
  {
    id: "current-affairs",
    title: "Current Affairs",
    iconName: "Activity",
    color: "rose",
    description: "Monthly CA, Topic Wise CA & Assam CA.",
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    categories: [
      {
        id: "monthly-ca",
        title: "Monthly CA",
        topics: [
          { id: "jan-2026", title: "January 2026", totalQuestions: 100, isNew: true },
          { id: "dec-2025", title: "December 2025", totalQuestions: 100, isNew: false },
          { id: "nov-2025", title: "November 2025", totalQuestions: 100, isNew: false },
        ]
      },
      {
        id: "topic-wise",
        title: "Topic Wise",
        topics: [
          { id: "sports-awards", title: "Sports Awards", totalQuestions: 50, isNew: false },
          { id: "new-appointments", title: "New Appointments", totalQuestions: 40, isNew: false },
          { id: "summits-conferences", title: "Summits and Conferences", totalQuestions: 35, isNew: false },
        ]
      },
      {
        id: "assam-ca",
        title: "Assam CA",
        topics: [
          { id: "assam-ca-2025", title: "Assam Current Affairs 2025", totalQuestions: 150, isNew: true },
        ]
      }
    ]
  }
];

export default subjectsData;
export interface PortfolioKnowledgeItem {
  id: string;
  category: "profile" | "experience" | "project" | "skill" | "education" | "certification" | "contact";
  title: string;
  tags: string[];
  content: string;
}

export const PORTFOLIO_KNOWLEDGE: PortfolioKnowledgeItem[] = [
  // 1. Profile / About
  {
    id: "profile-general",
    category: "profile",
    title: "Sai Teja Thanneeru - Overview & Bio",
    tags: ["bio", "about", "who is sai teja", "introduction", "location", "mike", "nani", "background"],
    content: `Full Name: SAI TEJA THANNEERU (nickname: Mikey / Nani).
Profession / Title: AI Engineer & Software Engineer.
Location: Hyderabad, India.
Summary: Software Engineer focused on building intelligent, data-driven, and scalable digital solutions. Works across software development, data analytics, and artificial intelligence, turning ideas and complex problems into practical applications that create real-world value.
Philosophy: Focuses on clean architecture, reliable software, user-focused digital products, and continuous learning.`
  },

  // 2. Education
  {
    id: "education-btech",
    category: "education",
    title: "Bachelor of Technology - CSE (Data Science)",
    tags: ["education", "college", "degree", "btech", "mrcet", "cgpa", "study", "university", "academics"],
    content: `Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering (Data Science).
Institution: Malla Reddy College of Engineering & Technology (MRCET).
Period: November 2022 — March 2026.
Status: Graduated / Completed.
Score / CGPA: 7.94 CGPA.
Key Skills Studied: Python, Java, Data Structures & Algorithms, Data Analysis.`
  },
  {
    id: "education-intermediate-school",
    category: "education",
    title: "Intermediate & Secondary Education",
    tags: ["intermediate", "school", "12th", "10th", "ssc", "junior college", "krishnaveni", "kakatiya"],
    content: `Intermediate (12th Grade):
- Institution: Sri Kakatiya Junior College
- Stream: MPC (Mathematics, Physics, Chemistry)
- Period: November 2020 — May 2022
- Score: 68.8%
- Focus: Mathematical and analytical problem solving.

Secondary Education (10th / SSC):
- Institution: Krishnaveni Talent School
- Period: June 2019 — April 2020
- Score: 9.8 CGPA.`
  },

  // 3. Professional Experience & Internships
  {
    id: "experience-skaite",
    category: "experience",
    title: "Co-Founder & Software Developer at SKAITE Technologies",
    tags: ["skaite", "founder", "work", "experience", "startup", "current role", "company"],
    content: `Role: Co-Founder & Software Developer
Company: SKAITE Technologies
Period: 2026 – Present
Location: Hyderabad, India
Description: Co-founded SKAITE Technologies, building modern web applications and Android applications, transforming ideas into practical, scalable, and user-focused digital products.
Responsibilities:
- Co-founded and actively developed digital products and platforms
- Built modern web applications and responsive user interfaces
- Developed Android applications and application features
- Designed and implemented scalable software architectures
- Worked across frontend, backend, databases, and APIs
Technologies used: React, TypeScript, JavaScript, Java, Android, Supabase, Firebase, REST APIs.`
  },
  {
    id: "experience-vajra",
    category: "experience",
    title: "Data Science with AI Intern at Vajra.ai",
    tags: ["vajra", "internship", "data science", "ai intern", "current role", "experience"],
    content: `Role: Data Science with AI Intern
Company: Vajra.ai (Technology Team)
Period: September 2026 – Present
Location: Hyderabad, India
Description: Working as a Data Science with AI Intern in the Technology team, gaining practical experience in data science and artificial intelligence through technology-focused work.`
  },
  {
    id: "experience-techsaksham",
    category: "experience",
    title: "TechSaksham AI Intern",
    tags: ["techsaksham", "ai intern", "machine learning", "internship", "python", "streamlit"],
    content: `Role: TechSaksham AI Intern
Company: TechSaksham
Period: January 2025 – April 2025
Location: Hyderabad, India
Description: Worked on AI-powered applications, Python development, machine learning, data preprocessing, and model development.
Responsibilities:
- Developed ML pipelines and preprocessing modules
- Built prototype AI-powered features and integrations
- Collaborated on model evaluation and tuning
- Documented experiments and results
Technologies: Python, Pandas, NumPy, Scikit-learn, Streamlit.`
  },
  {
    id: "experience-codsoft",
    category: "experience",
    title: "Data Science Intern at CodSoft",
    tags: ["codsoft", "data science", "intern", "machine learning", "analytics", "internship"],
    content: `Role: Data Science Intern
Company: CodSoft
Period: February 2025 – April 2025
Location: Hyderabad, India
Description: Worked on real-world machine learning and data analytics projects including data preprocessing, model training, evaluation, and visualization.
Responsibilities:
- Data cleaning and preprocessing
- Training and evaluating ML models
- Visualizing insights and analytical results
- Collaborating with stakeholders to define requirements
Technologies: Python, Scikit-learn, Pandas, Matplotlib.`
  },

  // 4. Projects
  {
    id: "project-scorera",
    category: "project",
    title: "Scorera - Digital Trust Intelligence Platform",
    tags: ["scorera", "projects", "trust intelligence", "security", "ai platform", "gemini ai", "supabase", "database"],
    content: `Project Name: Scorera
Category: AI • Full Stack
Technologies: React, TypeScript, Supabase, Gemini AI
Description: An AI-powered Digital Trust Intelligence Platform that evaluates websites and online entities using security analysis, reputation scoring, and AI-generated insights. Helps users assess legitimacy and trustworthiness of web destinations.`
  },
  {
    id: "project-game-portal",
    category: "project",
    title: "Game Portal Platform",
    tags: ["game portal", "projects", "html5 games", "supabase", "edge functions", "storage", "database"],
    content: `Project Name: Game Portal
Category: Full Stack • Web Platform
Technologies: React, TypeScript, Supabase, Storage, Edge Functions
Description: A modern HTML5 game hosting and management platform where administrators can upload, manage, categorize, and deploy browser-based games with fast storage delivery.`
  },
  {
    id: "project-factoryops",
    category: "project",
    title: "FactoryOps - Smart Factory Operations Platform",
    tags: ["factoryops", "factory ops", "smart manufacturing", "power bi", "sql server", "postgresql", "supabase", "database", "projects", "sop", "sop assistant", "technologies"],
    content: `Project Name: FactoryOps
Category: Full Stack • Data Analytics • Smart Manufacturing
Role & Origin: Developed by Sai Teja as a Smart Factory Operations & Maintenance Platform.
Description: FactoryOps is designed to streamline production monitoring, machine maintenance, incident management, work orders, and operational insights through centralized role-based dashboards.
Key Architecture & Technologies:
- Frontend: React, TypeScript, modern responsive UI
- Backend & Database: Supabase, SQL Server, PostgreSQL, REST APIs
- Analytics & Dashboards: Power BI for operational analytics and KPIs
- Other Tools: Git, GitHub
Features & Capabilities:
- Centralized role-based operations dashboard
- Production tracking and machine maintenance monitoring
- Incident logging and work order workflows
Note on AI / SOP Assistant: The portfolio lists FactoryOps with focus on operations dashboards, machine maintenance, work orders, and Power BI analytics; it does not currently list an AI-powered SOP assistant as a completed feature.`
  },
  {
    id: "project-ultimate-choice",
    category: "project",
    title: "Ultimate Choice Game",
    tags: ["ultimate choice", "game", "interactive", "cards", "tailwind", "projects"],
    content: `Project Name: Ultimate Choice
Category: Interactive Web • Game
Technologies: React, TypeScript, Tailwind CSS
Description: An interactive decision-based game featuring mystery cards, multiple rounds, dynamic scoring, and engaging gameplay mechanics.`
  },
  {
    id: "project-mypg",
    category: "project",
    title: "MyPG - Hostel & PG Management",
    tags: ["mypg", "android", "mobile app", "hostel", "firebase", "firestore", "database", "java", "projects"],
    content: `Project Name: MyPG
Category: Android • Full Stack
Technologies: Java, Firebase, Android
Description: A digital hostel and PG (paying guest) management application designed for managing tenants, tracking rent collection, recording payments, logging attendance, and sending automated notifications.`
  },
  {
    id: "project-fitness-tracker",
    category: "project",
    title: "Fitness Tracking Web App",
    tags: ["fitness tracker", "calories", "machine learning", "streamlit", "python", "projects"],
    content: `Project Name: Fitness Tracking Web App
Category: Machine Learning • Data
Technologies: Python, Streamlit, Scikit-learn, Pandas
Description: A machine learning application that predicts calorie expenditure during exercise and provides interactive fitness analytics for users.`
  },
  {
    id: "project-computer-vision",
    category: "project",
    title: "Computer Vision & OCR Projects (Liver Cirrhosis, Face Recognition, OCR)",
    tags: ["liver cirrhosis", "facial recognition", "ocr", "handwritten text", "computer vision", "opencv", "projects"],
    content: `Computer Vision & Medical ML Projects:
1. Liver Cirrhosis Detection: Machine learning and medical image processing application focused on supporting liver cirrhosis detection and staging. (Python, OpenCV, Machine Learning)
2. Intelligent Facial Recognition: Real-time facial recognition and identification system using computer vision pipelines and deep learning feature extraction. (Python, OpenCV)
3. Handwritten Text Recognition: OCR-based application extracting handwritten text from scanned paper documents and images with preprocessing filters. (Python, OpenCV, OCR)`
  },

  // 5. Technical Skills
  {
    id: "skills-software-engineering",
    category: "skill",
    title: "Software Engineering & Full Stack Skills",
    tags: ["skills", "programming languages", "full stack", "tech stack", "backend", "frontend", "databases"],
    content: `Software Engineering Skills:
- Programming Languages: Java, Python, JavaScript, TypeScript, SQL
- Frontend: React.js, HTML5, CSS3, Tailwind CSS, Responsive Design
- Backend & Cloud: Node.js, Express, REST APIs, Supabase, Firebase, SQLite, PostgreSQL
- Tools & Practices: Git, GitHub, DSA (Data Structures & Algorithms), Clean Architecture, Modular Code`
  },
  {
    id: "skills-ai-rag-ml",
    category: "skill",
    title: "Artificial Intelligence, LLM & Machine Learning Skills",
    tags: ["skills", "ai", "llm", "rag", "agents", "machine learning", "groq", "gemini", "scikit-learn"],
    content: `Artificial Intelligence & ML Skills:
- Generative AI & LLMs: Large Language Model application development, Prompt Engineering, Retrieval-Augmented Generation (RAG), AI Agents
- LLM APIs & Integration: Gemini AI (@google/genai), Groq API, OpenRouter
- Machine Learning & CV: Scikit-learn, OpenCV, Preprocessing Pipelines, Model Evaluation, Classification, Regression`
  },
  {
    id: "skills-data-analytics",
    category: "skill",
    title: "Data Science & Analytics Skills",
    tags: ["data science", "analytics", "power bi", "knime", "pandas", "numpy", "visualization"],
    content: `Data Science & Analytics Skills:
- Libraries: Pandas, NumPy, Matplotlib, Scipy
- BI & Visualizations: Power BI, KNIME Analytics Platform, Exploratory Data Analysis (EDA)
- Statistical Analysis: Data Preprocessing, Hypothesis Testing, Feature Engineering, Business Intelligence Dashboards`
  },

  // 6. Certifications
  {
    id: "certifications-summary",
    category: "certification",
    title: "Verified Certifications & Credentials",
    tags: ["certifications", "badges", "credentials", "openai", "cisco", "aws", "oracle", "kaggle", "simplilearn"],
    content: `Verified Professional Certifications:
1. Applied AI Foundations — OpenAI Academy (July 2026): Modern AI concepts, LLMs, prompt engineering, AI applications.
2. AI Foundations — OpenAI Academy (July 2026): Generative AI, foundational architectures, modern AI systems.
3. Agents & Workflows — OpenAI Academy (July 2026): Designing AI agents and structured LLM workflows.
4. Cloud Computing 101 — AWS Educate (July 2026): Cloud computing concepts, AWS services, cloud fundamentals.
5. Introduction to Networks — Cisco (July 2025): TCP/IP, network protocols, network infrastructure.
6. Python Essentials 1 — Cisco (July 2026): Python syntax, data structures, control flow, functions.
7. Data Analytics Essentials — Cisco (July 2026): Data analytics, visualization, insight extraction.
8. SQL Dev Gym — Oracle (January 2024): Practical SQL querying, relational database design, optimization.
9. Introduction to Data Science — Simplilearn SkillUp (January 2025): Data science fundamentals, Python, ML concepts.
10. Python Programming & Intro to Programming — Kaggle (January 2025): Practical Python and computational problem-solving.`
  },

  // 7. Contact & Socials
  {
    id: "contact-information",
    category: "contact",
    title: "Contact Information & Social Links",
    tags: ["contact", "email", "phone", "hire", "linkedin", "github", "twitter", "reach out"],
    content: `Contact Details for Sai Teja:
- Email: saitejathanneeru07@gmail.com
- Phone: +91 9866962125
- Location: Hyderabad, India
- LinkedIn: https://linkedin.com/in/saiteja-thanneeru
- GitHub: https://github.com/SAITEJA-THANNEERU
- Twitter/X: https://x.com/_Nanimikey_
- Instagram: https://www.instagram.com/_.nani_mikey._/
- Credly Badges: https://www.credly.com/users/saiteja-thanneeru/edit/badges/credly`
  }
];

/**
 * Local lexical / vector similarity scoring function.
 * Scores knowledge items against visitor query keywords.
 */
export function retrieveRelevantKnowledge(query: string, maxItems: number = 4): PortfolioKnowledgeItem[] {
  if (!query || typeof query !== "string") return PORTFOLIO_KNOWLEDGE.slice(0, maxItems);

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/[\s,?.!-]+/).filter((w) => w.length > 2 && !['what', 'tell', 'about', 'some', 'from', 'with', 'have', 'does', 'that', 'this', 'there', 'which', 'where', 'when', 'something'].includes(w));

  const scored = PORTFOLIO_KNOWLEDGE.map((item) => {
    let score = 0;
    const lowerTitle = item.title.toLowerCase();
    const lowerContent = item.content.toLowerCase();

    // Check full query phrase in title or content
    if (lowerTitle.includes(normalizedQuery)) score += 40;
    if (lowerContent.includes(normalizedQuery)) score += 30;

    // Check tags
    for (const tag of item.tags) {
      if (normalizedQuery === tag || normalizedQuery.includes(tag)) {
        score += 25;
      }
      for (const word of queryWords) {
        if (tag === word) {
          score += 15;
        }
      }
    }

    // Check individual words against title
    for (const word of queryWords) {
      if (lowerTitle.includes(word)) score += 10;
    }

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return items with score >= 25. If no matching keywords exist, return empty array
  const filtered = scored.filter((s) => s.score >= 25).map((s) => s.item);
  return filtered.slice(0, maxItems);
}

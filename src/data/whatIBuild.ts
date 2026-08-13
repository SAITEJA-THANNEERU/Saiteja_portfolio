export interface WhatIBuildItem {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string;
  tools: string[];
}

export const whatIBuild: WhatIBuildItem[] = [
  {
    id: "software-engineering",
    number: "01",
    title: "SOFTWARE ENGINEERING",
    description:
      "Building scalable software & full-stack web applications",
    details:
      "Designing and developing scalable, production-ready software using modern frontend and backend technologies, cloud services, databases, and REST APIs. Focused on clean architecture, maintainable code, performance, and exceptional user experiences.",
    tools: [
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "React.js",
      "Supabase",
      "Firebase",
      "SQLite",
      "REST APIs",
      "Full Stack Development",
      "Git",
      "GitHub",
      "DSA",
    ],
  },

  {
    id: "artificial-intelligence",
    number: "02",
    title: "ARTIFICIAL INTELLIGENCE",
    description:
      "Building intelligent AI-powered applications",
    details:
      "Experienced in developing intelligent systems using Machine Learning, Generative AI, Prompt Engineering, AI Agents, Retrieval-Augmented Generation (RAG), and Large Language Models (LLMs). Passionate about creating AI solutions that solve real-world problems.",
    tools: [
      "Machine Learning",
      "Generative AI",
      "Loop Engineering",
      "Prompt Engineering",
      "Gemini AI",
      "OpenRouter",
      "AI Agents",
      "RAG",
      "LLM Applications",
      "Scikit-learn",
      "OpenCV",
    ],
  },

  {
    id: "data-science-analytics",
    number: "03",
    title: "DATA SCIENCE & ANALYTICS",
    description:
      "Transforming data into meaningful insights",
    details:
      "Skilled in data preprocessing, exploratory data analysis, statistical analysis, predictive modeling, data visualization, and business intelligence. Experienced in extracting actionable insights from structured data using modern analytics tools.",
    tools: [
      "Pandas",
      "NumPy",
      "Data Analytics",
      "Data Visualization",
      "Power BI",
      "KNIME",
      "Statistical Analysis",
      "Data Preprocessing",
    ],
  },
];
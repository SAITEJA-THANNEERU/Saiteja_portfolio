import { config } from "../config";
import { certifications } from "./certifications";

/* ============================================================
   RESUME DATA
   Centralized data source for the downloadable PDF resume.

   Existing sources:
   - src/config.ts
   - src/data/certifications.ts

   Selected content:
   - 3 Projects
   - 5 Certifications
   - Complete education history
   ============================================================ */

/* ============================================================
   PERSONAL INFORMATION
   ============================================================ */

export const resumePersonalInfo = {
  name: config.developer.fullName,

  title: config.developer.title,

  location: config.social.location,

  email: config.contact.email,

  phone: config.contact.phone,

  links: {
    github: config.contact.github,
    linkedin: config.contact.linkedin,
    portfolio: "https://saiteja-portfolio-mikey.vercel.app/",
  },
};

/* ============================================================
   PROFESSIONAL SUMMARY
   ============================================================ */

export const resumeSummary = config.developer.description;

/* ============================================================
   TECHNICAL SKILLS
   Dynamically collected from the existing portfolio config.
   ============================================================ */

export const resumeSkills = {
  programming: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "SQL",
  ],

  softwareDevelopment: [
    "React.js",
    "HTML",
    "CSS",
    "Supabase",
    "Firebase",
    "PostgreSQL",
    "REST APIs",
    "Git",
    "GitHub",
  ],

  artificialIntelligence: [
    "Machine Learning",
    "Generative AI",
    "Prompt Engineering",
    "LLM Applications",
    "RAG",
    "AI Agents",
    "Gemini AI",
    "Scikit-learn",
    "OpenCV",
  ],

  dataAnalytics: [
    "Pandas",
    "NumPy",
    "Power BI",
    "KNIME",
    "Data Analysis",
    "Data Visualization",
    "Statistical Analysis",
  ],
};

/* ============================================================
   WORK EXPERIENCE
   Uses the experience records from src/config.ts.
   ============================================================ */

export const resumeExperience = config.experiences.map(
  (experience) => ({
    position: experience.position,

    company: experience.company,

    period: experience.period,

    location: experience.location,

    description: experience.description,

    responsibilities:
      "responsibilities" in experience
        ? experience.responsibilities
        : [],

    technologies:
      "technologies" in experience
        ? experience.technologies ?? []
        : [],
  })
);

/* ============================================================
   EDUCATION
   Based on the existing Education.tsx records.
   ============================================================ */

export const resumeEducation = [
  {
    degree: "Bachelor of Technology",

    field: "Computer Science & Engineering (Data Science)",

    institution:
      "Malla Reddy College of Engineering & Technology",

    period: "November 2022 – March 2026",

    score: "7.94 CGPA",

    status: "Graduate",
  },

  {
    degree: "Intermediate",

    field: "MPC",

    institution: "Sri Kakatiya Junior College",

    period: "November 2020 – May 2022",

    score: "68.8%",
  },

  {
    degree: "Secondary Education",

    field: "General",

    institution: "Krishnaveni Talent School",

    period: "June 2019 – April 2020",

    score: "9.8 CGPA",
  },
];

/* ============================================================
   SELECTED PROJECTS
   Three projects selected for the one-page resume.

   Project descriptions and technologies are sourced from
   src/config.ts.
   ============================================================ */

const selectedProjectTitles = [
  "FactoryOps",
  "Scorera",
  "Game Portal",
];

export const resumeProjects = selectedProjectTitles
  .map((title) =>
    config.projects.find(
      (project) => project.title === title
    )
  )
  .filter(
    (project): project is (typeof config.projects)[number] =>
      Boolean(project)
  )
  .map((project) => ({
    title: project.title,

    category: project.category,

    description: project.description,

    technologies: project.technologies,

    github: project.github,
  }));

/* ============================================================
   SELECTED CERTIFICATIONS
   Five certifications selected for relevance to AI,
   software development, programming and analytics.
   ============================================================ */

const selectedCertificationIds = [
  "openai-applied-ai-foundations",
  "openai-agents-workflows",
  "data-analytics-essentials",
  "python-essentials",
  "oracle-sql-dev-gym",
];

export const resumeCertifications = selectedCertificationIds
  .map((id) =>
    certifications.find(
      (certification) => certification.id === id
    )
  )
  .filter(
    (
      certification
    ): certification is (typeof certifications)[number] =>
      Boolean(certification)
  )
  .map((certification) => ({
    title: certification.title,

    organization: certification.issuingOrganization,

    issueDate: certification.issueDate,

    credentialUrl: certification.certificatePdf,
  }));

/* ============================================================
   COMPLETE RESUME DATA
   Main object consumed by the PDF generator.
   ============================================================ */

export const resumeData = {
  personalInfo: resumePersonalInfo,

  summary: resumeSummary,

  skills: resumeSkills,

  experience: resumeExperience,

  education: resumeEducation,

  projects: resumeProjects,

  certifications: resumeCertifications,
};

/* ============================================================
   DATA VALIDATION
   Helps identify missing project or certification records.
   ============================================================ */

export const validateResumeData = (): string[] => {
  const errors: string[] = [];

  if (!resumePersonalInfo.name) {
    errors.push("Personal name is missing.");
  }

  if (!resumePersonalInfo.email) {
    errors.push("Email address is missing.");
  }

  if (resumeProjects.length !== 3) {
    errors.push(
      `Expected 3 projects, found ${resumeProjects.length}.`
    );
  }

  if (resumeCertifications.length !== 5) {
    errors.push(
      `Expected 5 certifications, found ${resumeCertifications.length}.`
    );
  }

  if (resumeEducation.length === 0) {
    errors.push("Education information is missing.");
  }

  return errors;
};
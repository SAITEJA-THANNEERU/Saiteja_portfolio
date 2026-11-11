import jsPDF from "jspdf";
import { resumeData } from "../data/resumeData";

/* ============================================================
   RESUME PDF GENERATOR
   Generates a professional, ATS-friendly, single-page resume.
   ============================================================ */

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  primary: [25, 35, 50] as [number, number, number],
  secondary: [75, 85, 100] as [number, number, number],
  accent: [45, 90, 145] as [number, number, number],
  divider: [210, 215, 220] as [number, number, number],
};

/* ============================================================
   MAIN GENERATOR
   ============================================================ */

export const generateResumePDF = (): Blob => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let y = 14;

  /* ----------------------------------------------------------
     BASIC HELPERS
     ---------------------------------------------------------- */

  const setTextColor = (
    color: [number, number, number]
  ) => {
    doc.setTextColor(...color);
  };

  const addText = (
    text: string,
    x: number,
    yPosition: number,
    size = 8.5,
    bold = false,
    color = COLORS.primary
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    setTextColor(color);

    doc.text(text, x, yPosition);
  };

  const addWrappedText = (
    text: string,
    x: number,
    yPosition: number,
    width: number,
    size = 8.2,
    lineHeight = 3.8
  ): number => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    setTextColor(COLORS.secondary);

    const lines = doc.splitTextToSize(text, width);

    doc.text(lines, x, yPosition);

    return yPosition + lines.length * lineHeight;
  };

  const addSection = (title: string): void => {
    y += 2;

    addText(title.toUpperCase(), MARGIN, y, 9.5, true, COLORS.accent);

    y += 2;

    doc.setDrawColor(...COLORS.divider);
    doc.setLineWidth(0.25);

    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

    y += 5;
  };

  const addBullet = (text: string): void => {
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 5);

    addText("•", MARGIN + 1, y, 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    setTextColor(COLORS.secondary);

    doc.text(lines, MARGIN + 5, y);

    y += lines.length * 3.4 + 1;
  };

  /* ----------------------------------------------------------
     HEADER
     ---------------------------------------------------------- */

  addText(
    resumeData.personalInfo.name,
    MARGIN,
    y + 5,
    19,
    true
  );

  y += 9;

  addText(
    resumeData.personalInfo.title,
    MARGIN,
    y,
    9,
    true,
    COLORS.accent
  );

  y += 5;

  const contactItems = [
    resumeData.personalInfo.location,
    resumeData.personalInfo.email,
    resumeData.personalInfo.phone,
  ].filter(Boolean);

  addText(
    contactItems.join("  |  "),
    MARGIN,
    y,
    7.2,
    false,
    COLORS.secondary
  );

  y += 5;

  /* ----------------------------------------------------------
     SOCIAL LINKS
     ---------------------------------------------------------- */

  const links = [
    {
      label: "Portfolio",
      url: resumeData.personalInfo.links.portfolio,
    },
    {
      label: "LinkedIn",
      url: resumeData.personalInfo.links.linkedin,
    },
    {
      label: "GitHub",
      url: resumeData.personalInfo.links.github,
    },
  ].filter((link) => Boolean(link.url));

  let linkX = MARGIN;

  links.forEach((link) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.accent);

    doc.textWithLink(link.label, linkX, y, {
      url: link.url,
    });

    linkX += doc.getTextWidth(link.label) + 8;
  });

  y += 5;

  /* ----------------------------------------------------------
     PROFESSIONAL SUMMARY
     ---------------------------------------------------------- */

  addSection("Professional Summary");

  y = addWrappedText(
    resumeData.summary,
    MARGIN,
    y,
    CONTENT_WIDTH,
    8,
    3.7
  );

  y += 2;

  /* ----------------------------------------------------------
     TECHNICAL SKILLS
     ---------------------------------------------------------- */

  addSection("Technical Skills");

  const skillGroups = [
    {
      title: "Programming",
      values: resumeData.skills.programming,
    },
    {
      title: "Software Development",
      values: resumeData.skills.softwareDevelopment,
    },
    {
      title: "AI & Machine Learning",
      values: resumeData.skills.artificialIntelligence,
    },
    {
      title: "Data Analytics",
      values: resumeData.skills.dataAnalytics,
    },
  ];

  skillGroups.forEach((group) => {
    const content = `${group.title}: ${group.values.join(", ")}`;

    y = addWrappedText(
      content,
      MARGIN,
      y,
      CONTENT_WIDTH,
      7.5,
      3.4
    );
  });

  y += 2;

  /* ----------------------------------------------------------
     EXPERIENCE
     ---------------------------------------------------------- */

  addSection("Professional Experience");

  resumeData.experience.forEach((experience) => {
    addText(
      `${experience.position} | ${experience.company}`,
      MARGIN,
      y,
      8.2,
      true
    );

    y += 3.8;

    addText(
      experience.period,
      MARGIN,
      y,
      7.2,
      false,
      COLORS.secondary
    );

    y += 3.8;

    y = addWrappedText(
      experience.description,
      MARGIN,
      y,
      CONTENT_WIDTH,
      7.2,
      3.3
    );

    const responsibilities = experience.responsibilities ?? [];

    responsibilities.slice(0, 2).forEach((item) => {
      addBullet(item);
    });

    y += 1;
  });

  /* ----------------------------------------------------------
     PROJECTS
     ---------------------------------------------------------- */

  addSection("Selected Projects");

  resumeData.projects.forEach((project) => {
    addText(
      project.title,
      MARGIN,
      y,
      8.2,
      true
    );

    y += 3.7;

    y = addWrappedText(
      project.description,
      MARGIN,
      y,
      CONTENT_WIDTH,
      7.2,
      3.3
    );

    addText(
      `Technologies: ${project.technologies}`,
      MARGIN,
      y,
      7,
      false,
      COLORS.secondary
    );

    y += 4;
  });

  /* ----------------------------------------------------------
     EDUCATION
     ---------------------------------------------------------- */

  addSection("Education");

  resumeData.education.forEach((education) => {
    addText(
      `${education.degree} – ${education.field}`,
      MARGIN,
      y,
      8,
      true
    );

    y += 3.5;

    addText(
      education.institution,
      MARGIN,
      y,
      7.3,
      false,
      COLORS.secondary
    );

    y += 3.5;

    addText(
      `${education.period}  |  ${education.score}`,
      MARGIN,
      y,
      7,
      false,
      COLORS.secondary
    );

    y += 4;
  });

  /* ----------------------------------------------------------
     CERTIFICATIONS
     ---------------------------------------------------------- */

  addSection("Certifications");

  resumeData.certifications.forEach((certification) => {
    addText(
      `${certification.title} – ${certification.organization}`,
      MARGIN,
      y,
      7.5,
      false
    );

    y += 3.5;
  });

  /* ----------------------------------------------------------
     FOOTER
     ---------------------------------------------------------- */

  doc.setDrawColor(...COLORS.divider);

  doc.line(
    MARGIN,
    PAGE_HEIGHT - 10,
    PAGE_WIDTH - MARGIN,
    PAGE_HEIGHT - 10
  );

  /* ----------------------------------------------------------
   RETURN GENERATED PDF
   ---------------------------------------------------------- */

return doc.output("blob");
};
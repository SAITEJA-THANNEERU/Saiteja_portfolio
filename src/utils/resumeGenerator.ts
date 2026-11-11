import jsPDF from "jspdf";
import { resumeData } from "../data/resumeData";

/* ============================================================
   RESUME PDF GENERATOR
   A4 | Single-column | ATS-friendly
   LaTeX-inspired professional formatting
   ============================================================ */

/* ==================== PAGE CONFIGURATION ==================== */

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN_LEFT = 14;
const MARGIN_RIGHT = 14;

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const TOP_MARGIN = 10;
const BOTTOM_LIMIT = 286;

/* ==================== COLOURS ==================== */

const COLORS = {
  primary: [20, 20, 20] as [number, number, number],
  secondary: [65, 65, 65] as [number, number, number],
  accent: [30, 70, 110] as [number, number, number],
  divider: [160, 160, 160] as [number, number, number],
};

/* ==================== TYPOGRAPHY ==================== */

const FONT = "helvetica";

const FONT_SIZE = {
  name: 19,
  contact: 9,
  links: 9,
  section: 10.5,
  body: 9.5,
  secondary: 8.8,
  bullet: 9,
  project: 9.7,
  certification: 8.8,
};

/* ============================================================
   MAIN PDF GENERATOR
   ============================================================ */

export const generateResumePDF = (): Blob => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  let y = TOP_MARGIN;

  const personal = resumeData.personalInfo;

  /* ==========================================================
     BASIC HELPERS
     ========================================================== */

  const setFont = (
    size: number,
    style: "normal" | "bold" | "italic" = "normal"
  ) => {
    doc.setFont(FONT, style);
    doc.setFontSize(size);
  };

  const setColor = (
    color: [number, number, number]
  ) => {
    doc.setTextColor(color[0], color[1], color[2]);
  };

  const addText = (
    text: string,
    x: number,
    yPosition: number,
    size = FONT_SIZE.body,
    bold = false,
    color = COLORS.primary
  ) => {
    if (!text) return;

    setFont(size, bold ? "bold" : "normal");
    setColor(color);

    doc.text(String(text), x, yPosition);
  };

  const addWrappedText = (
    text: string,
    x: number,
    yPosition: number,
    width: number,
    size = FONT_SIZE.body,
    lineHeight = 3.6,
    color = COLORS.secondary
  ): number => {
    if (!text || !String(text).trim()) {
      return yPosition;
    }

    setFont(size);
    setColor(color);

    const lines = doc.splitTextToSize(
      String(text).trim(),
      width
    );

    doc.text(lines, x, yPosition, {
      lineHeightFactor: 1.05,
    });

    return yPosition + lines.length * lineHeight;
  };

  const addSection = (title: string) => {
    y += 2.5;

    setFont(FONT_SIZE.section, "bold");
    setColor(COLORS.primary);

    doc.text(
      title.toUpperCase(),
      MARGIN_LEFT,
      y
    );

    y += 1.8;

    doc.setDrawColor(...COLORS.divider);
    doc.setLineWidth(0.2);

    doc.line(
      MARGIN_LEFT,
      y,
      PAGE_WIDTH - MARGIN_RIGHT,
      y
    );

    y += 3.5;
  };

  const addBullet = (
    text: string,
    size = FONT_SIZE.secondary
  ) => {
    if (!text || !String(text).trim()) return;

    const bulletX = MARGIN_LEFT + 1;
    const textX = MARGIN_LEFT + 5;
    const textWidth = CONTENT_WIDTH - 5;

    setFont(size);
    setColor(COLORS.secondary);

    const lines = doc.splitTextToSize(
      String(text).trim(),
      textWidth
    );

    addText(
      "\u2022",
      bulletX,
      y,
      size,
      false,
      COLORS.primary
    );

    doc.text(lines, textX, y, {
      lineHeightFactor: 1.05,
    });

    y += lines.length * 3.4 + 0.5;
  };

  /* ==========================================================
     HEADER
     All personal details are centre-aligned.
     The professional role/title is intentionally omitted.
     ========================================================== */

  /* Name */

  setFont(FONT_SIZE.name, "bold");
  setColor(COLORS.primary);

  doc.text(
    personal.name || "",
    PAGE_WIDTH / 2,
    y + 6,
    { align: "center" }
  );

  y += 10;

  /* Contact information */

  const contactItems = [
    personal.location,
    personal.phone,
    personal.email,
  ].filter(Boolean);

  const contactText = contactItems.join("  |  ");

  setFont(FONT_SIZE.contact);
  setColor(COLORS.secondary);

  doc.text(
    contactText,
    PAGE_WIDTH / 2,
    y,
    { align: "center" }
  );

  y += 4;

  /* Hyperlinks */

  const links = [
    {
      label: "LinkedIn",
      url: personal.links.linkedin,
    },
    {
      label: "GitHub",
      url: personal.links.github,
    },
    {
      label: "Portfolio",
      url: personal.links.portfolio,
    },
  ].filter((link) => Boolean(link.url));

  const linkSeparator = "   |   ";

  setFont(FONT_SIZE.links);

  const totalLinksWidth = links.reduce(
    (total, link, index) => {
      const linkWidth = doc.getTextWidth(link.label);

      const separatorWidth =
        index < links.length - 1
          ? doc.getTextWidth(linkSeparator)
          : 0;

      return total + linkWidth + separatorWidth;
    },
    0
  );

  let linkX = (PAGE_WIDTH - totalLinksWidth) / 2;

  links.forEach((link, index) => {
    setFont(FONT_SIZE.links);
    setColor(COLORS.accent);

    const linkWidth = doc.getTextWidth(link.label);

    doc.text(
      link.label,
      linkX,
      y
    );

    /* Make each displayed link clickable */

    doc.link(
      linkX,
      y - 3,
      linkWidth,
      4,
      { url: link.url }
    );

    linkX += linkWidth;

    if (index < links.length - 1) {
      setColor(COLORS.divider);

      doc.text(
        linkSeparator,
        linkX,
        y
      );

      linkX += doc.getTextWidth(linkSeparator);
    }
  });

  y += 2.5;

  /* ==========================================================
     PROFESSIONAL SUMMARY
     ========================================================== */

  addSection("Professional Summary");

  y = addWrappedText(
    resumeData.summary,
    MARGIN_LEFT,
    y,
    CONTENT_WIDTH,
    FONT_SIZE.body,
    3.7
  );

  y += 1;

  /* ==========================================================
     TECHNICAL SKILLS
     ========================================================== */

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
    if (!group.values || group.values.length === 0) {
      return;
    }

    const label = `${group.title}:`;
    const value = group.values.join(", ");

    setFont(FONT_SIZE.body, "bold");

    const labelWidth = doc.getTextWidth(label + " ");

    addText(
      label,
      MARGIN_LEFT,
      y,
      FONT_SIZE.body,
      true,
      COLORS.primary
    );

    y = addWrappedText(
      value,
      MARGIN_LEFT + labelWidth,
      y,
      CONTENT_WIDTH - labelWidth,
      FONT_SIZE.body,
      3.5
    );

    y += 0.3;
  });

  y += 0.5;

  /* ==========================================================
     EXPERIENCE
     Exactly two selected experiences.
     One description sentence per experience.
     No responsibility bullets or location lines.
     ========================================================== */

  addSection("Experience");

  const selectedCompanies = [
    "TechSaksham",
    "Vajra.ai",
  ];

  const selectedExperiences = selectedCompanies
    .map((companyName) =>
      resumeData.experience.find((experience) =>
        `${experience.company} ${experience.position}`
          .toLowerCase()
          .includes(companyName.toLowerCase())
      )
    )
    .filter(
      (
        experience
      ): experience is (typeof resumeData.experience)[number] =>
        Boolean(experience)
    );

  selectedExperiences.forEach((experience) => {
    /* Position and company */

    addText(
      `${experience.position} | ${experience.company}`,
      MARGIN_LEFT,
      y,
      FONT_SIZE.body,
      true
    );

    /* Right-aligned duration */

    setFont(FONT_SIZE.secondary, "italic");
    setColor(COLORS.secondary);

    doc.text(
      experience.period || "",
      PAGE_WIDTH - MARGIN_RIGHT,
      y,
      { align: "right" }
    );

    y += 3.5;

    /* One concise description sentence */

    y = addWrappedText(
      experience.description,
      MARGIN_LEFT,
      y,
      CONTENT_WIDTH,
      FONT_SIZE.secondary,
      3.4
    );

    y += 1.2;
  });

  /* ==========================================================
   PROJECTS
   Each project has:
   - Project title
   - Technology stack
   - Three separate bullet points
   ========================================================== */

addSection("Projects");

const projectDetails: Record<string, string[]> = {
  FactoryOps: [
    "Developed a Smart Factory Operations & Maintenance Platform to monitor production, machine maintenance, incidents, and work orders through centralized role-based dashboards.",
    "Integrated production and maintenance data to provide operational insights and improve visibility across factory activities.",
    "Built the application using React, TypeScript, Supabase, SQL Server, and Power BI for frontend development, data management, and reporting.",
  ],

  Scorera: [
    "Built a responsive web application using React.js and TypeScript for analyzing website trust signals and presenting structured results.",
    "Developed reusable frontend components and integrated APIs and Supabase to support authentication, database operations, and analysis workflows.",
    "Used Lovable and AI-assisted development workflows to implement features, debug issues, improve code, and accelerate application development.",
  ],

  "Game Portal": [
    "Developed a responsive web-based game hosting platform using React.js and TypeScript with authentication, administration, game management, and player workflows.",
    "Built reusable UI components and integrated REST APIs and Supabase for authentication, database operations, storage, and application workflows.",
    "Debugged frontend and backend issues, validated user interactions, and maintained application code using Git and GitHub.",
  ],

  MyPG: [
    "Developed an Android application with structured user interfaces for authentication, room management, tenants, payments, requests, notices, and subscriptions.",
    "Implemented interactive application workflows and integrated Firebase, Google Maps, and Razorpay for data, location, and payment functionality.",
    "Debugged application workflows and validated user interactions across authentication, tenant management, payment, and service-request features.",
  ],
};

resumeData.projects.slice(0, 3).forEach((project) => {
  /* Project title */

  addText(
    project.title,
    MARGIN_LEFT,
    y,
    FONT_SIZE.project,
    true
  );

  y += 3.5;

  /* Technology stack */

  if (project.technologies) {
    y = addWrappedText(
      project.technologies,
      MARGIN_LEFT,
      y,
      CONTENT_WIDTH,
      7.5,
      3.2,
      COLORS.secondary
    );
  }

  y += 0.5;

  /* Three individual bullet points */

  const matchingKey = Object.keys(projectDetails).find(
    (key) =>
      project.title.toLowerCase().includes(key.toLowerCase())
  );

  const points = matchingKey
    ? projectDetails[matchingKey]
    : [project.description];

  points.forEach((point) => {
    addBullet(point, FONT_SIZE.secondary);
  });

  y += 1.5;
});
  /* ==========================================================
     EDUCATION
     ========================================================== */

  addSection("Education");

  resumeData.education.forEach((education) => {
    /* Degree */

    addText(
      `${education.degree} - ${education.field}`,
      MARGIN_LEFT,
      y,
      FONT_SIZE.body,
      true
    );

    y += 3.4;

    /* Institution */

    addText(
      education.institution,
      MARGIN_LEFT,
      y,
      FONT_SIZE.secondary,
      false,
      COLORS.secondary
    );

    y += 3.2;

    /* Period and score */

    const educationDetails = [
      education.period,
      education.score,
    ]
      .filter(Boolean)
      .join("  |  ");

    addText(
      educationDetails,
      MARGIN_LEFT,
      y,
      7.4,
      false,
      COLORS.secondary
    );

    y += 3.8;
  });

  /* ==========================================================
     CERTIFICATIONS
     ========================================================== */

  addSection("Certifications");

  resumeData.certifications.slice(0, 5).forEach(
    (certification) => {
      addBullet(
        `${certification.title} - ${certification.organization}`,
        FONT_SIZE.certification
      );
    }
  );


  /* ==========================================================
   ACHIEVEMENTS
   ========================================================== */

addSection("Achievements");

const achievements = [
  "AWS Educate Emerging Talent Community Member – Amazon Web Services.",
  "Built full-stack, backend, AI-powered, and database-driven applications.",
];

achievements.forEach((achievement) => {
  addBullet(
    achievement,
    FONT_SIZE.certification
  );
});

  /* ==========================================================
     FOOTER DIVIDER
     ========================================================== */

  doc.setDrawColor(...COLORS.divider);
  doc.setLineWidth(0.2);

  doc.line(
    MARGIN_LEFT,
    PAGE_HEIGHT - 8,
    PAGE_WIDTH - MARGIN_RIGHT,
    PAGE_HEIGHT - 8
  );

  /* ==========================================================
     PAGE OVERFLOW VALIDATION
     ========================================================== */

  if (y > BOTTOM_LIMIT) {
    console.warn(
      `Resume content exceeds the preferred one-page layout. ` +
      `Content ends at ${y.toFixed(1)} mm; limit is ${BOTTOM_LIMIT} mm.`
    );
  }

  /* ==========================================================
     RETURN GENERATED PDF
     ========================================================== */

  return doc.output("blob");
};

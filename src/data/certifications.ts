export interface Certification {
  id: string;
  title: string;
  issuingOrganization: string;
  organizationLogo: string;
  issueDate: string;
  credentialId: string;
  certificateImage: string;
  certificatePdf: string;
  skills: string[];
  category: string;
  featured: boolean;
  description: string;
}

export const certifications: Certification[] = [
  {
    id: "openai-applied-ai-foundations",
    title: "Applied AI Foundations",
    issuingOrganization: "OpenAI Academy",
    organizationLogo: "/certifications/logos/openai.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/openai-applied-ai-foundations.png",
    certificatePdf: "https://academy.openai.com/home/certificate/nyxfvlgqoy",
    skills: [
      "Artificial Intelligence",
      "LLMs",
      "Prompt Engineering",
      "AI Applications"
    ],
    category: "Artificial Intelligence",
    featured: true,
    description:
      "Built a strong foundation in modern artificial intelligence concepts, large language models, and practical AI applications."
  },

  {
    id: "openai-ai-foundations",
    title: "AI Foundations",
    issuingOrganization: "OpenAI Academy",
    organizationLogo: "/certifications/logos/openai.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/openai-ai-foundations.png",
    certificatePdf: "https://academy.openai.com/home/certificate/oj1bp4d42a",
    skills: [
      "Artificial Intelligence",
      "Generative AI",
      "LLMs",
      "AI Fundamentals"
    ],
    category: "Artificial Intelligence",
    featured: true,
    description:
      "Developed foundational knowledge of generative AI, large language models, and the core concepts behind modern AI systems."
  },

  {
  id: "simplilearn-introduction-to-data-science",
  title: "Introduction to Data Science",
  issuingOrganization: "Simplilearn SkillUp",
  organizationLogo: "/certifications/logos/simplilearn.png",
  issueDate: "January 2025",
  credentialId: "ADD_CREDENTIAL_ID",
  certificateImage:
    "/certifications/images/simplilearn-introduction-to-data-science.png",
  certificatePdf: "https://www.simplilearn.com/learn-data-science-course-simplilearn",
  skills: [
    "Data Science",
    "Python",
    "Data Analysis",
    "Machine Learning"
  ],
  category: "Data Science",
  featured: true,
  description:
    "Completed an introductory data science course covering core concepts, data analysis, Python, and the fundamentals of machine learning."
},

  {
    id: "openai-agents-workflows",
    title: "Agents & Workflows",
    issuingOrganization: "OpenAI Academy",
    organizationLogo: "/certifications/logos/openai.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/openai-agents-workflows.png",
    certificatePdf: "https://academy.openai.com/home/certificate/z254wpr0qj",
    skills: [
      "AI Agents",
      "LLMs",
      "Prompt Engineering",
      "AI Workflows"
    ],
    category: "AI Agents",
    featured: true,
    description:
      "Learned how to design and work with AI agents and structured workflows using modern large language model capabilities."
  },

  {
    id: "cisco-introduction-to-networks",
    title: "Introduction to Networks",
    issuingOrganization: "Cisco",
    organizationLogo: "/certifications/logos/cisco.png",
    issueDate: "July 2025",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/cisco-introduction-to-networks.png",
    certificatePdf: "https://www.netacad.com/certificates/?issuanceId=3f3f2ffb-e57b-40d3-adc2-b6ce75493476",
    skills: [
      "Computer Networks",
      "Networking Fundamentals",
      "TCP/IP",
      "Network Infrastructure"
    ],
    category: "Networking",
    featured: true,
    description:
      "Developed foundational knowledge of networking concepts, network infrastructure, protocols, and communication technologies."
  },

  {
    id: "oracle-sql-dev-gym",
    title: "SQL Dev Gym",
    issuingOrganization: "Oracle",
    organizationLogo: "/certifications/logos/oracle.png",
    issueDate: "January 2024",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/sql_dev_gym.png",
    certificatePdf: "https://devgym.oracle.com/pls/apex/f?p=10001:29:13813466855894:::29:P29_CLASS_ID:5481&cs=1Nx3TDJgh0w-ygq3icYMX7urIWoNPCEJuXLH5pqVOkknGnq2I33EJh57LsiiynySdqwMpwClQNviXsLC73e3-0Q",
    skills: [
      "SQL",
      "Oracle Database",
      "Database Management",
      "Data Analysis"
    ],
    category: "Database",
    featured: true,
    description:
      "Strengthened practical SQL and database skills through Oracle SQL Dev Gym exercises and challenges."
  },

  {
    id: "data-analytics-essentials",
    title: "Data Analytics Essentials",
    issuingOrganization: "Cisco",
    organizationLogo: "/certifications/logos/cisco.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/Data_Analytics_Essentials_certificate.png",
    certificatePdf: "https://www.netacad.com/certificates/?issuanceId=e62b2a34-059d-4edf-a619-3b50ba43d16e",
    skills: [
      "Data Analytics",
      "Data Analysis",
      "Data Visualization",
      "Analytical Thinking"
    ],
    category: "Data Analytics",
    featured: true,
    description:
      "Developed foundational skills in data analytics, data analysis, visualization, and extracting meaningful insights from data."
  },

  {
    id: "kaggle-python",
    title: "Python Programming",
    issuingOrganization: "Kaggle",
    organizationLogo: "/certifications/logos/kaggle.png",
    issueDate: "January 2025",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/kaggle python.png",
    certificatePdf: "https://www.kaggle.com/learn/certification/saitejathanneeru/python",
    skills: [
      "Python",
      "Programming",
      "Data Analysis",
      "Problem Solving"
    ],
    category: "Programming",
    featured: true,
    description:
      "Strengthened Python programming fundamentals through practical exercises focused on core programming concepts and data-oriented problem solving."
  },

  {
    id: "kaggle-intro-to-programming",
    title: "Intro to Programming",
    issuingOrganization: "Kaggle",
    organizationLogo: "/certifications/logos/kaggle.png",
    issueDate: "January 2025",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/kaggle intro to programming.png",
    certificatePdf: "https://www.kaggle.com/learn/certification/saitejathanneeru/intro-to-programming",
    skills: [
      "Programming",
      "Python",
      "Programming Fundamentals",
      "Problem Solving"
    ],
    category: "Programming",
    featured: true,
    description:
      "Built foundational programming knowledge through Kaggle's introductory programming course."
  },

  {
    id: "python-essentials",
    title: "Python Essentials 1",
    issuingOrganization: "Cisco",
    organizationLogo: "/certifications/logos/cisco.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/Python_Essentials_1_certificate.png",
    certificatePdf: "https://www.netacad.com/certificates/?issuanceId=e973dc30-cecd-448f-bb78-a1ff5b240185",
    skills: [
      "Python",
      "Programming",
      "Python Fundamentals",
      "Problem Solving"
    ],
    category: "Programming",
    featured: true,
    description:
      "Developed fundamental Python programming skills including syntax, data types, control flow, functions, and problem-solving techniques."
  },

  {
    id: "amazon-cloud-computing-101",
    title: "Cloud Computing 101",
    issuingOrganization: "AWS Educate",
    organizationLogo: "/certifications/logos/aws.png",
    issueDate: "July 2026",
    credentialId: "ADD_CREDENTIAL_ID",
    certificateImage:
      "/certifications/images/amazon%20cloud%20computing%20101.png",
    certificatePdf: "https://www.credly.com/badges/39de96b2-5164-427f-af81-d419575327f7",
    skills: [
      "Cloud Computing",
      "AWS",
      "Cloud Fundamentals",
      "Cloud Services"
    ],
    category: "Cloud Computing",
    featured: true,
    description:
      "Developed foundational knowledge of cloud computing concepts, AWS services, and essential cloud technologies."
  }
];
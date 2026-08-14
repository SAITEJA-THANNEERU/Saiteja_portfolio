import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
}

// All tech stack items with their icons and official URLs
// Perfect inverted pyramid: 12 -> 10 -> 8 -> 6 -> 4 -> 2
const techStack: TechItem[][] = [
  // Row 1 - Programming & Frontend
  [
    {
      name: "Java",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      url: "https://www.java.com/"
    },
    {
      name: "Python",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      url: "https://python.org"
    },
    {
      name: "JavaScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
    },
    {
      name: "TypeScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      url: "https://typescriptlang.org"
    },
    {
      name: "HTML5",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTML"
    },
    {
      name: "CSS3",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      url: "https://developer.mozilla.org/en-US/docs/Web/CSS"
    },
    {
      name: "React",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      url: "https://react.dev"
    },
    {
      name: "Tailwind CSS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      url: "https://tailwindcss.com"
    },
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      url: "https://git-scm.com"
    },
    {
      name: "GitHub",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      url: "https://github.com"
    },
    {
      name: "Linux",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      url: "https://linux.org"
    },
    {
      name: "VS Code",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
      url: "https://code.visualstudio.com"
    }
  ],

  // Row 2 - AI, Database & Tools
  [
    {
      name: "Firebase",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      url: "https://firebase.google.com"
    },
    {
      name: "Supabase",
      icon: "https://cdn.simpleicons.org/supabase",
      url: "https://supabase.com"
    },
    {
      name: "SQLite",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
      url: "https://sqlite.org"
    },
    {
  name: "SQL",
  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  url: "https://en.wikipedia.org/wiki/SQL"
},
    {
      name: "Scikit-learn",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
      url: "https://scikit-learn.org"
    },
    {
      name: "OpenCV",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
      url: "https://opencv.org"
    },
    {
      name: "NumPy",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
      url: "https://numpy.org"
    },
    {
      name: "Pandas",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
      url: "https://pandas.pydata.org"
    },
    {
      name: "Postman",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
      url: "https://postman.com"
    },
  {
  name: "Power BI",
  icon: "/images/icons/powerbi.svg",
  url: "https://powerbi.microsoft.com/"
},
    {
      name: "KNIME",
      icon: "/images/icons/knime.svg",
      url: "https://www.knime.com"
    },
    {
      name: "Lovable",
      icon: "/images/icons/lovable.svg",
      url: "https://lovable.dev"
    }
  ],

  // Row 3 - AI & Software Engineering
  [
    {
      name: "Gemini AI",
      icon: "/images/icons/gemini.svg",
      url: "https://ai.google.dev"
    },
    {
      name: "Machine Learning",
      icon: "/images/icons/machine-learning.svg",
      url: "https://scikit-learn.org"
    },
    {
      name: "Generative AI",
      icon: "/images/icons/generative-ai.svg",
      url: "https://openai.com"
    },
    {
      name: "Prompt Engineering",
      icon: "/images/icons/prompt-engineering.svg",
      url: "https://platform.openai.com/docs"
    },
    {
      name: "AI Agents",
      icon: "/images/icons/ai-agent.svg",
      url: "https://platform.openai.com/docs"
    },
    {
      name: "RAG",
      icon: "/images/icons/rag.svg",
      url: "https://platform.openai.com/docs"
    },
    {
      name: "REST API",
      icon: "/images/icons/rest-api.svg",
      url: "https://restfulapi.net"
    },
    {
      name: "DSA",
      icon: "/images/icons/dsa.svg",
      url: "https://cp-algorithms.com"
    }
  ]
];

const TechStackNew = () => {
  return (
<div
  className="techstack-new"
  id="techstack"
>      {/* Video Background */}
      <div className="techstack-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="techstack-video"
        >
          <source src="/video/video.webm" type="video/webm" />
        </video>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>
        
        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={tech.icon} alt={tech.name} />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;

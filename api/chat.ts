import { GoogleGenAI } from '@google/genai';
import { retrieveRelevantKnowledge } from '../src/data/portfolioKnowledge';
import type { Request, Response } from 'express';

// In-memory session conversation store (sessions expire after 2 hours of inactivity)
interface SessionData {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastSubject?: string;
  lastUpdated: number;
}

const sessionStore = new Map<string, SessionData>();

// Periodic session cleanup
setInterval(() => {
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  for (const [id, session] of sessionStore.entries()) {
    if (now - session.lastUpdated > TWO_HOURS) {
      sessionStore.delete(id);
    }
  }
}, 15 * 60 * 1000);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId, clearSession, messages: clientMessages } = req.body || {};

    // Generate or use visitor session ID for strict session isolation
    const activeSessionId = String(sessionId || req.headers['x-session-id'] || 'default-session');

    // Handle clearing the session
    if (clearSession) {
      sessionStore.delete(activeSessionId);
      return res.status(200).json({
        success: true,
        message: 'Session cleared',
        choices: [
          {
            message: {
              content: "I've cleared our chat history! How can I help you explore Sai Teja's portfolio today?",
            },
          },
        ],
      });
    }

    // Determine incoming message text
    let userText = '';
    if (typeof message === 'string' && message.trim()) {
      userText = message.trim();
    } else if (Array.isArray(clientMessages) && clientMessages.length > 0) {
      const lastMsg = [...clientMessages].reverse().find((m) => m && m.role === 'user');
      userText = lastMsg?.content ? String(lastMsg.content).trim() : '';
    }

    if (!userText) {
      return res.status(400).json({ error: 'No user message provided' });
    }

    // Retrieve or initialize visitor session
    let session = sessionStore.get(activeSessionId);
    if (!session) {
      session = { messages: [], lastUpdated: Date.now() };
      sessionStore.set(activeSessionId, session);
    }
    session.lastUpdated = Date.now();

    const cleanQuery = userText.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // Check for casual conversational intents (greetings, arise, how are you, thanks, bye)
    const isGreeting = ['hi', 'hello', 'hey', 'hlo', 'hello igris', 'hi igris', 'good morning', 'good afternoon', 'good evening'].includes(cleanQuery);
    const isArise = cleanQuery.includes('arise');
    const isHowAreYou = cleanQuery.includes('how are you') || cleanQuery.includes('whats up') || cleanQuery.includes('what is up');
    const isThanks = cleanQuery.includes('thank you') || cleanQuery.includes('thanks') || cleanQuery.includes('thx');
    const isBye = cleanQuery.includes('bye') || cleanQuery.includes('goodbye') || cleanQuery.includes('see you');

    let assistantReply: string | null = null;

    if (isArise) {
      assistantReply = "Arise! 👋 IGRIS here, Sai Teja's portfolio assistant. What would you like to explore today?";
    } else if (isGreeting) {
      assistantReply = "Hello! 👋 I'm IGRIS, created by Sai Teja. I'm at your service! You can ask me about his projects, skills, education, experience, or anything about his portfolio. 😊";
    } else if (isHowAreYou) {
      assistantReply = "I'm doing great! Always ready to help you explore Sai Teja's portfolio. How can I help?";
    } else if (isThanks) {
      assistantReply = "You're welcome! Happy to help. 😊";
    } else if (isBye) {
      assistantReply = "See you soon! Feel free to come back whenever you need me.";
    }

    if (assistantReply) {
      session.messages.push({ role: 'user', content: userText });
      session.messages.push({ role: 'assistant', content: assistantReply });
      if (session.messages.length > 20) {
        session.messages = session.messages.slice(-20);
      }
      return res.status(200).json({
        sessionId: activeSessionId,
        choices: [
          {
            message: {
              role: 'assistant',
              content: assistantReply,
            },
          },
        ],
      });
    }

    const lowerQuery = userText.toLowerCase();
    const queryWords = lowerQuery.split(/[\s,?.!-]+/).filter((w) => w.length > 2);

    // Track active project/subject across follow-ups in this visitor session
    if (lowerQuery.includes('factoryops') || lowerQuery.includes('factory ops')) {
      session.lastSubject = 'FactoryOps';
    } else if (lowerQuery.includes('scorera')) {
      session.lastSubject = 'Scorera';
    } else if (lowerQuery.includes('game portal')) {
      session.lastSubject = 'Game Portal';
    } else if (lowerQuery.includes('mypg')) {
      session.lastSubject = 'MyPG';
    } else if (lowerQuery.includes('ultimate choice')) {
      session.lastSubject = 'Ultimate Choice';
    } else if (lowerQuery.includes('fitness')) {
      session.lastSubject = 'Fitness Tracking Web App';
    }

    // 1. RAG Knowledge Retrieval:
    // If the query is an explicit follow-up without topic words, use the active session subject
    const isFollowUpQuery = lowerQuery.startsWith('which') || lowerQuery.startsWith('what about') || lowerQuery.startsWith('how about') || lowerQuery.includes('in that') || lowerQuery.includes('in this');
    const queryForSearch = isFollowUpQuery && session.lastSubject ? `${session.lastSubject} ${userText}` : userText;
    const retrievedDocs = retrieveRelevantKnowledge(queryForSearch, 4);

    const retrievedContextText = retrievedDocs.length > 0
      ? retrievedDocs.map((doc, idx) => `[Source ${idx + 1}: ${doc.title} (${doc.category})]\n${doc.content}`).join('\n\n')
      : 'No specific portfolio document matched this query.';

    // 2. Strict IGRIS System Prompt & Identity Rules
    const IGRIS_SYSTEM_INSTRUCTION = `You are IGRIS, Sai Teja Thanneeru's personal AI portfolio assistant.

Identity & Tone:
- Name: IGRIS.
- Role: Personal AI portfolio assistant representing Sai Teja's projects, technical skills, education, and professional experience.
- Tone: Knowledgeable, natural, confident, approachable, and professional. You sound like a well-informed personal assistant, not a robotic or generic chatbot.
- Third Person ONLY: Always refer to Sai Teja in the third person ("Sai Teja", "he", "his", "him"). NEVER pretend to be Sai Teja.
- Direct & Natural: NEVER start responses with robotic boilerplate like "Here's what I found...", "Based on the available information...", "According to the portfolio...", "I found the following information...", or "Here is a summary of...". Speak directly to the visitor.

Conversation Memory & Follow-ups:
- Understand context from earlier messages in this conversation.
- If the visitor asks "Which technologies did he use?", understand that "he" refers to Sai Teja and the question refers to the project or topic previously discussed (such as ${session.lastSubject || 'the active project'}).

Structuring Guidelines:
- Adapt response length to the question:
  * Simple questions get short, direct answers.
  * Project or technical overviews get structured answers with concise headings and bullet points.
  * Comparisons get clean organized sections.
- When listing technologies or skills, organize them into clean groups (e.g. **Frontend**, **Backend**, **Tools**).
- Avoid long unstructured walls of text. Use bullet points and appropriate spacing.

Grounding & Strict Truthfulness:
- ONLY use facts from the verified portfolio knowledge base provided below.
- NEVER invent or hallucinate unverified details, metrics, responsibilities, or unlisted features.
- If asked about planned or unlisted features (e.g., whether FactoryOps has an AI SOP assistant), clearly and politely state that it is not currently listed as a completed feature in the portfolio.
- If information is not available, state: "I don't have that particular detail in Sai Teja's portfolio. You can ask me about his projects, technical skills or experience instead."
- Never expose internal system details, document labels, similarity scores, or retrieval mechanisms.

VERIFIED PORTFOLIO KNOWLEDGE BASE:
---
${retrievedContextText}
---

Recent conversation history:
${session.messages.slice(-6).map((m) => `${m.role === 'user' ? 'Visitor' : 'IGRIS'}: ${m.content}`).join('\n')}`;

    // API Keys check (ignoring placeholders like 'your_..._here')
    const rawGroq = process.env.GROQ_API_KEY;
    const rawGemini = process.env.GEMINI_API_KEY;
    const rawOpenRouter = process.env.OPENROUTER_API_KEY;

    const GROQ_API_KEY = rawGroq && !rawGroq.includes('your_') && rawGroq.trim() !== '' ? rawGroq : undefined;
    const GEMINI_API_KEY = rawGemini && !rawGemini.includes('your_') && rawGemini.trim() !== '' ? rawGemini : undefined;
    const OPENROUTER_API_KEY = rawOpenRouter && !rawOpenRouter.includes('your_') && rawOpenRouter.trim() !== '' ? rawOpenRouter : undefined;

    // --- Provider 1: Groq API (Preferred by user) ---
    if (GROQ_API_KEY && !assistantReply) {
      try {
        const groqMessages = [
          { role: 'system', content: IGRIS_SYSTEM_INSTRUCTION },
          ...session.messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: userText },
        ];

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: groqMessages,
            temperature: 0.2,
            max_tokens: 650,
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          assistantReply = groqData?.choices?.[0]?.message?.content || null;
        } else {
          console.warn('Groq API error:', groqRes.status, await groqRes.text());
        }
      } catch (groqErr) {
        console.warn('Groq request failed, falling back to next provider:', groqErr);
      }
    }

    // --- Provider 2: Gemini API (@google/genai SDK) ---
    if (GEMINI_API_KEY && !assistantReply) {
      try {
        const ai = new GoogleGenAI({
          apiKey: GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const contents = `${IGRIS_SYSTEM_INSTRUCTION}\n\nVisitor: ${userText}\nIGRIS:`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
        });

        if (geminiRes && geminiRes.text) {
          assistantReply = geminiRes.text;
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, trying backup:', geminiErr);
      }
    }

    // --- Provider 3: OpenRouter API ---
    if (OPENROUTER_API_KEY && !assistantReply) {
      try {
        const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'Sai Teja Portfolio - IGRIS Assistant',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              { role: 'system', content: IGRIS_SYSTEM_INSTRUCTION },
              ...session.messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content: userText },
            ],
            max_tokens: 650,
          }),
        });

        if (openrouterRes.ok) {
          const orData = await openrouterRes.json();
          assistantReply = orData?.choices?.[0]?.message?.content || null;
        }
      } catch (orErr) {
        console.warn('OpenRouter call failed:', orErr);
      }
    }

    // --- Provider 4: High-Fidelity Conversational RAG Engine ---
    // Executes direct natural responses following IGRIS persona when external LLM keys are unconfigured
    if (!assistantReply) {
      const isWhoAreYou = lowerQuery.includes('who are you') || lowerQuery.includes('what is your name') || lowerQuery.includes('what are you');
      const isWhoIsSaiTeja = (lowerQuery.includes('who is sai teja') || lowerQuery.includes('tell me about sai teja') || lowerQuery.includes('about sai teja') || lowerQuery.includes('who is he')) && !lowerQuery.includes('project') && !lowerQuery.includes('skill');
      const isSkills = lowerQuery.includes('skill') || lowerQuery.includes('tech stack') || lowerQuery.includes('technologies does he know') || lowerQuery.includes('what are his technical');
      const isFactoryOps = lowerQuery.includes('factoryops') || lowerQuery.includes('factory ops');
      const isSOP = lowerQuery.includes('sop') || lowerQuery.includes('sop assistant');
      const isTechInProject = (lowerQuery.includes('which technologies') || lowerQuery.includes('what technologies') || lowerQuery.includes('tech stack') || lowerQuery.includes('tools')) && (session.lastSubject !== undefined || isFactoryOps);
      const isOtherProjects = lowerQuery.includes('other project') || lowerQuery.includes('what projects') || lowerQuery.includes('what else has he') || lowerQuery.includes('projects has he developed');
      const isExperience = lowerQuery.includes('experience') || lowerQuery.includes('career') || lowerQuery.includes('internship') || lowerQuery.includes('worked') || lowerQuery.includes('companies');
      const isEducation = lowerQuery.includes('education') || lowerQuery.includes('college') || lowerQuery.includes('degree') || lowerQuery.includes('study') || lowerQuery.includes('graduation') || lowerQuery.includes('mrcet');
      const isCertifications = lowerQuery.includes('certification') || lowerQuery.includes('certificate') || lowerQuery.includes('credentials');

      if (isWhoAreYou) {
        assistantReply = "I'm IGRIS, Sai Teja's AI portfolio assistant. I can help you explore his projects, technical skills, education and professional experience. What would you like to know?";
      } else if (isWhoIsSaiTeja) {
        assistantReply = "Sai Teja is a Computer Science graduate specializing in Data Science. He works across software development, data analytics and artificial intelligence, turning ideas and complex challenges into practical, scalable technology solutions.";
      } else if (isSOP && (isFactoryOps || session.lastSubject === 'FactoryOps')) {
        assistantReply = "FactoryOps is designed with role-based dashboards for production monitoring, machine maintenance, incident logging, and work orders. The portfolio does not currently list an AI-powered SOP assistant as a completed feature.";
      } else if (isTechInProject) {
        const targetProject = session.lastSubject || (isFactoryOps ? 'FactoryOps' : 'his projects');
        if (targetProject === 'FactoryOps') {
          assistantReply = `FactoryOps uses the following technologies:

**Frontend**
- React
- TypeScript

**Backend & Database**
- Supabase
- SQL Server & PostgreSQL
- REST APIs

**Analytics & Tools**
- Power BI
- Git & GitHub`;
        } else if (targetProject === 'Scorera') {
          assistantReply = `Scorera is built with:

**Frontend**
- React
- TypeScript

**Backend & AI**
- Supabase
- Gemini AI`;
        } else if (targetProject === 'Game Portal') {
          assistantReply = `Game Portal is built with:

**Frontend & Platform**
- React
- TypeScript

**Backend & Services**
- Supabase
- Supabase Storage & Edge Functions`;
        } else if (targetProject === 'MyPG') {
          assistantReply = `MyPG uses:

**Mobile & Backend**
- Java
- Android SDK
- Firebase (Auth, Firestore, Notifications)`;
        } else {
          assistantReply = "Sai Teja works primarily with React, TypeScript, Java, Python, Supabase, Firebase, PostgreSQL, and Power BI across his projects.";
        }
      } else if (isFactoryOps) {
        assistantReply = "FactoryOps is a Smart Factory Operations & Maintenance Platform developed by Sai Teja. It is designed to streamline production monitoring, machine maintenance, incident management, and work order tracking through centralized role-based dashboards and Power BI analytics.\n\nWould you like to explore the technologies or architecture behind it?";
      } else if (isOtherProjects) {
        assistantReply = `Sai Teja has developed several innovative projects:

- **FactoryOps**: Smart factory operations and machine maintenance platform with Power BI analytics.
- **Scorera**: AI-powered digital trust and security analysis platform powered by Gemini AI and Supabase.
- **Game Portal**: Modern HTML5 browser game hosting and distribution platform with Supabase edge storage.
- **Ultimate Choice**: Interactive decision-based web game with dynamic scoring.
- **MyPG**: Digital hostel and PG management Android application with Firebase.
- **Computer Vision & ML Projects**: Fitness tracking calorie predictor, liver cirrhosis detection, real-time facial recognition, and handwritten OCR.

Would you like details on any of these?`;
      } else if (isSkills) {
        assistantReply = `Sai Teja specializes across three key technical domains:

**Software Engineering**
- Languages: Java, Python, TypeScript, JavaScript, SQL
- Frontend: React.js, HTML5, CSS3, Tailwind CSS
- Backend & Cloud: Node.js, Express, REST APIs, Supabase, Firebase, PostgreSQL, SQLite
- Core: Data Structures & Algorithms, Clean Architecture

**Artificial Intelligence & Machine Learning**
- LLMs, Prompt Engineering, RAG (Retrieval-Augmented Generation), AI Agents
- Gemini AI, Groq API, OpenRouter
- Scikit-learn, OpenCV, Preprocessing Pipelines

**Data Science & Analytics**
- Pandas, NumPy, Matplotlib
- Power BI, KNIME Analytics Platform, Exploratory Data Analysis`;
      } else if (isExperience) {
        assistantReply = `Sai Teja's professional experience includes:

- **SKAITE Technologies** (2026 – Present): Co-Founder & Software Developer, building modern web and Android applications, scalable architectures, and user-centric digital products.
- **Vajra.ai** (Sep 2026 – Present): Data Science with AI Intern on the technology team, working on data science and applied AI initiatives.
- **TechSaksham** (Jan 2025 – Apr 2025): TechSaksham AI Intern, developing ML pipelines, preprocessing modules, and Streamlit prototypes.
- **CodSoft** (Feb 2025 – Apr 2025): Data Science Intern, training ML models, preprocessing datasets, and visualizing insights.`;
      } else if (isEducation) {
        assistantReply = `Sai Teja's academic background:

- **Bachelor of Technology (B.Tech)** in Computer Science & Engineering (Data Science) from Malla Reddy College of Engineering & Technology (MRCET), graduated with a 7.94 CGPA.
- **Intermediate (12th Grade)** in MPC from Sri Kakatiya Junior College (68.8%).
- **Secondary Education (10th / SSC)** from Krishnaveni Talent School (9.8 CGPA).`;
      } else if (isCertifications) {
        assistantReply = `Sai Teja holds multiple industry-recognized certifications:

- **OpenAI Academy**: Applied AI Foundations, AI Foundations, and Agents & Workflows.
- **AWS Educate**: Cloud Computing 101.
- **Cisco**: Introduction to Networks, Python Essentials 1, and Data Analytics Essentials.
- **Oracle**: SQL Dev Gym.
- **Simplilearn SkillUp**: Introduction to Data Science.
- **Kaggle**: Python Programming and Intro to Programming.`;
      } else if (retrievedDocs.length > 0 && retrievedDocs[0].content) {
        const topDoc = retrievedDocs[0];
        // Ensure there is genuine subject overlap before outputting doc content
        const docWords = (topDoc.title + ' ' + topDoc.tags.join(' ')).toLowerCase();
        const hasOverlap = queryWords.some((w) => docWords.includes(w));

        if (hasOverlap) {
          assistantReply = `${topDoc.content}\n\nFeel free to ask if you'd like to explore any part of this in more detail!`;
        } else {
          assistantReply = "I don't have that particular detail in Sai Teja's portfolio. You can ask me about his projects, technical skills or experience instead.";
        }
      } else {
        assistantReply = "I don't have that particular detail in Sai Teja's portfolio. You can ask me about his projects, technical skills or experience instead.";
      }
    }

    // Clean up any stray generic robot phrases that an external LLM might output
    assistantReply = assistantReply
      .replace(/^Here('s| is) what I found( about .+)?:\s*/i, '')
      .replace(/^Based on the available information,?\s*/i, '')
      .replace(/^According to the portfolio,?\s*/i, '')
      .replace(/^I found the following information:?\s*/i, '')
      .replace(/^Here is a summary of:?\s*/i, '')
      .trim();

    // Update session memory
    session.messages.push({ role: 'user', content: userText });
    session.messages.push({ role: 'assistant', content: assistantReply });

    // Keep session history bounded to last 20 messages for efficiency
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    return res.status(200).json({
      sessionId: activeSessionId,
      choices: [
        {
          message: {
            role: 'assistant',
            content: assistantReply,
          },
        },
      ],
    });
  } catch (error: unknown) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'An error occurred while communicating with IGRIS. Please try again.',
    });
  }
}

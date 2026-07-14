import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini API Client lazily and safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Using fallback data for academic utilities.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Predefined fallback academic papers for robust offline usage
const FALLBACK_PAPERS = [
  {
    id: "paper-1",
    type: "journal" as const,
    title: "Quantifying Carbon Flux in Vertical Forests",
    authors: "R. Tanaka, M. Henderson, S. Al-Mansoor",
    journal: "Journal of Urban Ecology & Forestry",
    year: 2023,
    abstract: "A comprehensive study analyzing the net carbon balance of multi-story urban foliage systems in temperate climates. We investigate the impact of transpiration gradients and ambient wind tunnels on carbon sequestration rates.",
    citations: 1420,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: true,
    aiSummary: "Analyzes the carbon absorption capacity of vertical green installations, proving a 24% increase in micro-climate cooling when utilizing high-density foliage systems."
  },
  {
    id: "paper-2",
    type: "conference" as const,
    title: "IoT-Driven Hydration Systems for Urban Skyscrapers",
    authors: "J. Miller, S. Chang, K. Johansson",
    journal: "IEEE International Conference on Smart Green Architecture",
    year: 2024,
    abstract: "Exploring the efficacy of automated nutrient delivery systems in high-altitude botanical installations. Our empirical findings show a reduction in water consumption of up to 42% through sensor-driven closed loop systems.",
    citations: 254,
    isPeerReviewed: true,
    isOpenAccess: false,
    isHighImpact: false,
    aiSummary: "Presents a real-time smart sensor array model for skyscraper flora, proving that machine-learning automated closed-loops minimize plant mortality and nutrient runoff."
  },
  {
    id: "paper-3",
    type: "journal" as const,
    title: "Micro-climatic Variations in High-Density Foliage",
    authors: "L. Hoffmann, E. Fischer, A. Dubois",
    journal: "Nature Portfolio (Sustainable Cities & Ecosystems)",
    year: 2021,
    abstract: "Investigation into how temperature gradients affect transpiration rates in vertical garden environments. We measure humidity variations and carbon dioxide saturation curves at various heights above 50 meters.",
    citations: 189,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: true,
    aiSummary: "Concludes that vertical green spaces above 50m suffer from wind shear, requiring specialized baffling and automated local humidity management to prevent leaf stress."
  },
  {
    id: "paper-4",
    type: "journal" as const,
    title: "Architectural Evolutions in Modern Web Development: A 2024 Perspective",
    authors: "Dr. Elena Richardson, Mark Thompson, Sarah Jenkins",
    journal: "IEEE Software Engineering Journal",
    year: 2024,
    abstract: "This paper examines the paradigm shift towards server-side rendering (SSR) and edge computing in the 2024 web ecosystem. We analyze the performance metrics of major frameworks including Next.js 14 and Remix, documenting a 15% average reduction in Core Web Vitals across enterprise deployments.",
    citations: 1420,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: true,
    aiSummary: "Highlights the structural transition to edge rendering, proving server-side hydration reduces first contentful paint by up to 1.2s on standard mobile networks."
  },
  {
    id: "paper-5",
    type: "conference" as const,
    title: "The Impact of Generative AI on Frontend Development Workflows",
    authors: "Alan Turing Jr., Prof. Cynthia Li",
    journal: "W3C Annual Summit on Generative Web Tech",
    year: 2024,
    abstract: "This paper demonstrates how LLM-integrated IDEs have accelerated the prototyping phase of web development by 40%, while simultaneously raising new concerns regarding code maintainability and long-term security vulnerabilities.",
    citations: 254,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: false,
    aiSummary: "Shows that while AI accelerators double layout generation speed, they introduce a 12% increase in duplicate CSS classes and require robust manual review for accessibility standards."
  },
  {
    id: "paper-6",
    type: "journal" as const,
    title: "Inclusive Design: Web Accessibility Trends and the 2024 Legal Landscape",
    authors: "Maria Gomez, Steven Wu",
    journal: "ACM Transactions on the Web",
    year: 2024,
    abstract: "Accessibility is no longer an optional feature. With new EU and US regulations taking effect in late 2024, web developers must adopt WCAG 2.2 standards at the core of their design systems. This research reviews automated testing tools versus manual auditing methodologies, concluding that human-in-the-loop testing remains essential.",
    citations: 89,
    isPeerReviewed: true,
    isOpenAccess: false,
    isHighImpact: true,
    aiSummary: "Demonstrates that relying solely on automated accessibility scanners misses 60% of focus order and screen reader compatibility errors, urging manual validation."
  },
  {
    id: "paper-7",
    type: "journal" as const,
    title: "Synthesizing Neural Networks for Biology",
    authors: "Dr. James Chen, Sarah Miller, M. Sterling",
    journal: "Nature Communications",
    year: 2023,
    abstract: "We introduce a novel deep learning paradigm that synthesizes genetic pathways directly into neural architecture. This integration allows for real-time biological simulation and accelerated vaccine target selection.",
    citations: 541,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: true,
    aiSummary: "Synthesizes bio-neural simulations that successfully predicted 84% of protein folding modifications in real-time, accelerating downstream drug discoveries."
  },
  {
    id: "paper-8",
    type: "journal" as const,
    title: "Decentralized Clinical Trials and LLMs",
    authors: "Dr. Aris Vance, Helen Carter, S. Patel",
    journal: "Journal of Medical Ethics & Systems",
    year: 2024,
    abstract: "Clinical trial design is undergoing decentralization. This paper explores the use of large language models for parsing multi-site participant feedback while preserving strict ethical boundaries and HIPAA compliance.",
    citations: 112,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: false,
    aiSummary: "Establishes a double-blinded local LLM proxy framework that extracts adverse drug event signals from unstructured clinical notes without leaking patient identity markers."
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Search Papers Endpoint (with Gemini generated results for real searches, and fallback)
  app.post("/api/search", async (req, res) => {
    const { query, year, peerReviewed } = req.body;
    if (!query) {
      return res.json({ success: true, papers: FALLBACK_PAPERS });
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      // Offline filtering
      let results = FALLBACK_PAPERS.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.abstract.toLowerCase().includes(query.toLowerCase()) ||
        p.authors.toLowerCase().includes(query.toLowerCase())
      );
      if (results.length === 0) {
        // Just return all fallback papers to keep the UI active and fun if no matches
        results = FALLBACK_PAPERS;
      }
      return res.json({ success: true, papers: results, isMock: true });
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are a high-fidelity academic search index. Provide exactly 5 realistic, rigorous academic search results for the user's query: "${query}".
Include interesting titles, authors, realistic journal/conference sources, abstracts, citations, and tags.
If the query mentions a specific topic (e.g. biology, ethics, sustainability, web, etc.), adapt the papers to be highly relevant to "${query}".`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, description: "Must be exactly 'journal' or 'conference'" },
                title: { type: Type.STRING },
                authors: { type: Type.STRING },
                journal: { type: Type.STRING },
                year: { type: Type.INTEGER },
                abstract: { type: Type.STRING },
                citations: { type: Type.INTEGER },
                isPeerReviewed: { type: Type.BOOLEAN },
                isOpenAccess: { type: Type.BOOLEAN },
                isHighImpact: { type: Type.BOOLEAN },
                aiSummary: { type: Type.STRING, description: "A highly informative, concise 2-sentence summary of the paper's key breakthrough or contribution." }
              },
              required: ["id", "type", "title", "authors", "journal", "year", "abstract", "citations", "isPeerReviewed", "isOpenAccess", "isHighImpact", "aiSummary"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      const papers = JSON.parse(text);
      return res.json({ success: true, papers, isMock: false });
    } catch (err: any) {
      console.error("Gemini search error:", err);
      // Fallback
      return res.json({ success: true, papers: FALLBACK_PAPERS, isMock: true, error: err.message });
    }
  });

  // 2. Suggest Improvements Endpoint
  app.post("/api/suggest", async (req, res) => {
    const { content, instruction, title } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      // Return a nice mock completion to feel functional even without API key
      const mockSuggestion = `

## 2.0 Proposed Methodology & Architectural Synthesis

To operationalize the theoretical background described above, we propose a multi-layered framework. First, high-density Internet of Things (IoT) sensors are distributed in a geometric lattice across the vertical foliage coordinates. These edge nodes monitor leaf water potential, local relative humidity, and ambient temperature at sub-second frequencies.

By routing these sensor telemetry streams through a decentralized edge-orchestration protocol, we can dynamically modulate nutrient flow-rates. This active feedback ensures optimal transpiration conditions, mitigating wind-shear stress at critical elevations above 50 meters, while maximizing carbon sequestration curves.

[Tanaka et al. (2023)]`;
      return res.json({ success: true, suggestion: mockSuggestion, isMock: true });
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are a world-class academic grant writing collaborator.
The user is working on a research proposal titled: "${title || "Framework for Large-Scale Urban Sustainability"}".
The current text draft is:
"""
${content}
"""

The user requested an AI Suggestion/continuation.
Instruction: ${instruction || "Provide a highly rigorous, well-reasoned, and polished academic continuation or next section of the draft that builds perfectly upon the current text. Include scientific terminology and professional tone."}

Provide ONLY the suggested text continuation or improvement to append/integrate. Do not include introductory notes like "Here is your suggested continuation". Just output the markdown text that belongs in the proposal draft.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return res.json({ success: true, suggestion: response.text, isMock: false });
    } catch (err: any) {
      console.error("Gemini suggest error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // 3. Synthesize Papers Endpoint (Literature Review builder)
  app.post("/api/synthesize", async (req, res) => {
    const { papers, projectTitle } = req.body;
    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return res.status(400).json({ error: "Papers array is required" });
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      const titles = papers.map(p => `"${p.title}"`).join(", ");
      const mockSynthesis = `### Synthesized Literature Review on ${projectTitle || "Urban Sustainability"}

A synthesis of the active literature reveals clear pathways and critical barriers. Research on micro-climate dynamics in vertical forests, notably documented in studies such as ${papers[0]?.title || "Quantifying Carbon Flux"}, establishes that high-density foliage provides substantial thermodynamic mitigation in dense urban environments. However, as noted by researchers like ${papers[1]?.authors || "Hoffmann et al."}, these high-altitude eco-systems are subject to severe environmental stress, including wind-shear and humidity deficits. 

To overcome these mechanical limitations, contemporary approaches utilize advanced IoT edge-sensing nodes to monitor biological stress levels in real-time. This automated monitoring, combined with closed-loop automated irrigation networks, enables robust ecological preservation at high elevations, establishing a scalable paradigm for vertical green architecture.`;
      return res.json({ success: true, synthesis: mockSynthesis, isMock: true });
    }

    try {
      const ai = getGeminiClient();
      const paperSummary = papers.map((p, i) => `[${i+1}] Title: "${p.title}"\nAuthors: ${p.authors}\nJournal: ${p.journal} (${p.year})\nAbstract: ${p.abstract}\nSummary: ${p.aiSummary || ""}`).join("\n\n");

      const prompt = `You are an expert academic research synthesis engine.
We are drafting a literature review section for a major research grant proposal titled: "${projectTitle || "Framework for Large-Scale Urban Sustainability"}".
Please read the abstracts and summaries of these ${papers.length} academic papers:
${paperSummary}

Write a beautifully synthesized, highly rigorous, and peer-ready Literature Review paragraph (approx. 200-300 words).
Synthesize the papers' findings together, highlight how they support or build upon each other, and cite them clearly using standard academic narrative format (e.g., Tanaka et al. (2023), Miller (2024)).
Provide ONLY the markdown output ready to be inserted into our document sheet. No chatting, no conversational pleasantries.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return res.json({ success: true, synthesis: response.text, isMock: false });
    } catch (err: any) {
      console.error("Gemini synthesize error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // 4. Generate Outline Endpoint
  app.post("/api/generate-outline", async (req, res) => {
    const { title, tags } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

    if (!hasApiKey) {
      // Static fallback outline based on keywords
      const outline = [
        { title: "1.0 Abstract", content: "A high-level executive summary detailing the scope, objectives, novel contributions, and biological/computational methods proposed in this grant application." },
        { title: "2.0 Theoretical Background", content: "Comprehensive review of the architectural and sociological precedents, identifying key gaps in existing literature regarding high-density vertical green spaces." },
        { title: "3.0 Proposed Methodology", content: "Detailed step-by-step technical procedures, including IoT deployment schemas, decentralized communication protocols, and closed-loop feedback algorithms." },
        { title: "4.0 Expected Impact & Deliverables", content: "Quantifiable metrics, policy proposals, urban zoning models, and open-source data platforms expected to arise from this research." }
      ];
      return res.json({ success: true, outline, isMock: true });
    }

    try {
      const ai = getGeminiClient();
      const prompt = `Create a highly structured and professional 4-section grant proposal outline for a project titled: "${title}"
Subject Tags: ${tags?.join(", ") || "General Science"}
Generate 4 sequential sections representing a strong research proposal structure.
Provide the output in structured JSON format with a title and content description for each section.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "e.g., 1.0 Executive Summary, 2.0 Methodological Framework, etc." },
                content: { type: Type.STRING, description: "A detailed 1-2 sentence description of what the user should write in this section." }
              },
              required: ["title", "content"]
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      const outline = JSON.parse(text);
      return res.json({ success: true, outline, isMock: false });
    } catch (err: any) {
      console.error("Gemini outline error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve static files and setup Vite in dev or production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScholarDraft Server running on port ${PORT}`);
  });
}

startServer();

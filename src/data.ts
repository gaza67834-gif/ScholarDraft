import { Proposal, Paper, Activity, Project } from "./types";

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    title: "Framework for Large-Scale Urban Sustainability",
    draftId: "PROP-2024-0082",
    author: "Dr. Elena Vance",
    lastSaved: "2m ago",
    content: `<p>Urban sustainability frameworks require a multi-dimensional approach that integrates architectural efficiency with sociological impact data. As cities expand, the pressure on existing infrastructure necessitates a shift from static planning to adaptive, data-driven systems.</p>
<p>The core objective of this proposal is to delineate a new methodology for measuring carbon sequestration in vertical green spaces. Previous studies have often overlooked the micro-climatic effects of high-density foliage at heights exceeding 50 meters [Drag to cite].</p>
<h2 class="font-headline-md text-headline-md text-primary pt-md">1.0 Theoretical Background</h2>
<p>The precedent set by the "Green Metabolism" movement provides a robust foundation for our inquiry. However, the scalability of these models remains a point of contention among urban ecologists. We posit that the integration of Internet of Things (IoT) sensors within structural elements will allow for real-time adjustments to nutrient delivery systems, thereby optimizing growth and carbon intake.</p>`,
    outline: [
      { title: "1.0 Abstract", content: "A high-level executive summary detailing the scope, objectives, novel contributions, and biological/computational methods proposed in this grant application." },
      { title: "2.0 Theoretical Background", content: "Comprehensive review of the architectural and sociological precedents, identifying key gaps in existing literature regarding high-density vertical green spaces." },
      { title: "3.0 Proposed Methodology", content: "Detailed step-by-step technical procedures, including IoT deployment schemas, decentralized communication protocols, and closed-loop feedback algorithms." },
      { title: "4.0 Expected Impact & Deliverables", content: "Quantifiable metrics, policy proposals, urban zoning models, and open-source data platforms expected to arise from this research." }
    ],
    progress: 45,
    tags: ["Urban Planning", "IoT", "Ecology"]
  },
  {
    id: "prop-2",
    title: "Quantum Neural Dynamics Research Grant",
    draftId: "PROP-2024-0091",
    author: "Dr. James Chen",
    lastSaved: "2h ago",
    content: `<p>Quantum neural dynamics represents the intersection of subatomic computing paradigms and neurological structural mapping. By leveraging Josephson junctions to model synaptic plasticity, this research proposes a novel framework for super-conductive biological simulators.</p>
<p>Our preliminary models demonstrate a 1000x increase in network convergence speeds when simulating long-term potentiation curves under quantum coherence protocols.</p>`,
    outline: [
      { title: "1.0 Abstract", content: "Executive summary explaining quantum synapse simulation and Josephson junction arrays for biological model mapping." },
      { title: "2.0 Computational Models", content: "Mathematics of quantum plasticity simulations, coherence times, and super-conductive gate operations." }
    ],
    progress: 68,
    tags: ["Quantum", "Neural Networks", "Biology"]
  },
  {
    id: "prop-3",
    title: "Ethical Implications of Large Language Models in Healthcare",
    draftId: "PROP-2024-0105",
    author: "Sarah Miller",
    lastSaved: "1d ago",
    content: `<p>This proposal outlines a policy and ethical blueprint for the integration of multi-modal clinical LLMs in rural healthcare centers. We address data bias, diagnostic accountability, and decentralized patient privacy safeguards.</p>`,
    outline: [
      { title: "1.0 Abstract", content: "Summary of clinical LLM deployment, ethical safeguards, and safety boundaries in rural clinics." },
      { title: "2.0 Bias Identification", content: "Analysis of representation gaps in public healthcare training datasets." }
    ],
    progress: 24,
    tags: ["AI", "Ethics", "Healthcare"]
  }
];

export const INITIAL_PAPERS: Paper[] = [
  {
    id: "paper-1",
    type: "journal",
    title: "Quantifying Carbon Flux in Vertical Forests",
    authors: "R. Tanaka et al.",
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
    type: "conference",
    title: "IoT-Driven Hydration Systems for Urban Skyscrapers",
    authors: "J. Miller",
    journal: "W3C Annual Summit / IEEE Green Tech",
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
    type: "journal",
    title: "Micro-climatic Variations in High-Density Foliage",
    authors: "L. Hoffmann",
    journal: "Nature Portfolio",
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
    type: "journal",
    title: "Architectural Evolutions in Modern Web Development: A 2024 Perspective",
    authors: "Dr. Elena Richardson, Mark Thompson, Sarah Jenkins",
    journal: "IEEE Software Engineering",
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
    type: "conference",
    title: "The Impact of Generative AI on Frontend Development Workflows",
    authors: "Alan Turing Jr., Prof. Cynthia Li",
    journal: "W3C Annual Summit",
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
    type: "journal",
    title: "Inclusive Design: Web Accessibility Trends and the 2024 Legal Landscape",
    authors: "Maria Gomez, Steven Wu",
    journal: "ACM Transactions on the Web",
    year: 2024,
    abstract: "Accessibility is no longer an optional feature. With new EU and US regulations taking effect in late 2024, web developers must adopt WCAG 2.2 standards at the core of their design systems. This research reviews automated testing tools versus manual auditing methodologies.",
    citations: 89,
    isPeerReviewed: true,
    isOpenAccess: false,
    isHighImpact: true,
    aiSummary: "Demonstrates that relying solely on automated accessibility scanners misses 60% of focus order and screen reader compatibility errors, urging manual validation."
  },
  {
    id: "paper-7",
    type: "journal",
    title: "Synthesizing Neural Networks for Biology",
    authors: "Dr. James Chen et al.",
    journal: "Nature Communications",
    year: 2023,
    abstract: "We introduce a novel deep learning paradigm that synthesizes genetic pathways directly into neural architecture. This integration allows for real-time biological simulation.",
    citations: 541,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: true,
    aiSummary: "Synthesizes bio-neural simulations that successfully predicted 84% of protein folding modifications in real-time, accelerating downstream drug discoveries."
  },
  {
    id: "paper-8",
    type: "journal",
    title: "Decentralized Clinical Trials and LLMs",
    authors: "Dr. Aris Vance et al.",
    journal: "Journal of Ethics",
    year: 2024,
    abstract: "Clinical trial design is undergoing decentralization. This paper explores the use of large language models for parsing multi-site participant feedback while preserving strict ethical boundaries.",
    citations: 112,
    isPeerReviewed: true,
    isOpenAccess: true,
    isHighImpact: false,
    aiSummary: "Establishes a double-blinded local LLM proxy framework that extracts adverse drug event signals from unstructured clinical notes without leaking patient identity markers."
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    collaborator: "Dr. James Chen",
    action: "Approved \"Methodology\" section",
    project: "Quantum Neural Dynamics...",
    date: "Just now"
  },
  {
    id: "act-2",
    collaborator: "Sarah Miller",
    action: "Added 4 new citations",
    project: "Ethical Implications of LLMs",
    date: "45m ago"
  },
  {
    id: "act-3",
    collaborator: "ScholarBot",
    action: "Generated summary for \"Nature 2023\"",
    project: "Quantum Neural Dynamics...",
    date: "2h ago",
    isAi: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "FY2024 Research Grant",
    papersCount: 12,
    papers: [INITIAL_PAPERS[0], INITIAL_PAPERS[1], INITIAL_PAPERS[2]]
  },
  {
    id: "proj-2",
    name: "W3C Framework Review",
    papersCount: 4,
    papers: [INITIAL_PAPERS[3], INITIAL_PAPERS[4]]
  }
];

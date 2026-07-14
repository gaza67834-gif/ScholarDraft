import React, { useState } from "react";
import TopNavBar from "./components/TopNavBar";
import LandingPage from "./components/LandingPage";
import DashboardView from "./components/DashboardView";
import ResearchView from "./components/ResearchView";
import EditorView from "./components/EditorView";
import { Proposal, Paper, Activity, Project } from "./types";
import { 
  INITIAL_PROPOSALS, 
  INITIAL_PAPERS, 
  INITIAL_ACTIVITIES, 
  INITIAL_PROJECTS 
} from "./data";
import { Sparkles, Plus, X } from "lucide-react";

export default function App() {
  // Global States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("landing"); // landing, dashboard, research, proposals
  
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [activeProposalId, setActiveProposalId] = useState<string>("prop-1");
  
  const [allPapers, setAllPapers] = useState<Paper[]>(INITIAL_PAPERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-1");

  const [credits, setCredits] = useState<number>(42);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Modal creation states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProposalTitle, setNewProposalTitle] = useState("");
  const [newProposalTags, setNewProposalTags] = useState("");

  // Computed Values
  const activeProposal = proposals.find((p) => p.id === activeProposalId) || proposals[0];
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleStartTrial = () => {
    setIsLoggedIn(true);
    setActiveTab("dashboard");
  };

  // Switch to selection and editor
  const handleSelectProposal = (proposalId: string) => {
    setActiveProposalId(proposalId);
    setActiveTab("proposals");
  };

  // Create a new proposal draft
  const handleCreateProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProposalTitle.trim()) return;

    const tagsArray = newProposalTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedId = `prop-${Date.now()}`;
    const generatedDraftId = `PROP-2024-0${Math.floor(100 + Math.random() * 900)}`;

    const newProposal: Proposal = {
      id: generatedId,
      title: newProposalTitle,
      draftId: generatedDraftId,
      author: "Dr. Aris Vance",
      lastSaved: "Just now",
      content: `<h1>${newProposalTitle}</h1><p>Introduce your research background, key questions, and proposed experimental methodology here.</p>`,
      outline: [
        { title: "1.0 Executive Summary", content: "Brief overview of the research scope, institutional partnerships, and potential real-world outcomes." },
        { title: "2.0 Problem Statement & Background", content: "Exploration of active technological gaps in contemporary literature." }
      ],
      progress: 5,
      tags: tagsArray.length > 0 ? tagsArray : ["General Science"]
    };

    setProposals([newProposal, ...proposals]);
    setActiveProposalId(generatedId);
    setShowCreateModal(false);
    setNewProposalTitle("");
    setNewProposalTags("");

    // Log active activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      collaborator: "Dr. Aris Vance",
      action: `Created new draft "${newProposalTitle}"`,
      project: "My Workspace",
      date: "Just now"
    };
    setActivities([newActivity, ...activities]);

    // Go to proposal edit tab
    setActiveTab("proposals");
  };

  // Simulating buying or resetting credits
  const handleBuyCredits = () => {
    setCredits((prev) => prev + 50);
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      collaborator: "Dr. Aris Vance",
      action: "Upgraded subscription tier (+50 API credits added)",
      project: "Billing",
      date: "Just now"
    };
    setActivities([newActivity, ...activities]);
    alert("Upgraded successfully! +50 API credits added to your active ScholarDraft quota.");
  };

  // Add Paper to Project
  const handleAddPaperToProject = (paper: Paper) => {
    const updatedProjects = projects.map((proj) => {
      if (proj.id === activeProjectId) {
        // Prevent duplicates
        if (proj.papers.some((p) => p.id === paper.id)) return proj;
        return {
          ...proj,
          papers: [paper, ...proj.papers],
          papersCount: proj.papers.length + 1
        };
      }
      return proj;
    });

    setProjects(updatedProjects);

    // Log Activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      collaborator: "Dr. Aris Vance",
      action: `Added citation "${paper.title.substring(0, 30)}..."`,
      project: activeProject?.name || "Active Grant",
      date: "Just now"
    };
    setActivities([newActivity, ...activities]);
  };

  // Remove Paper from Project
  const handleRemovePaperFromProject = (paperId: string) => {
    const updatedProjects = projects.map((proj) => {
      if (proj.id === activeProjectId) {
        return {
          ...proj,
          papers: proj.papers.filter((p) => p.id !== paperId),
          papersCount: Math.max(proj.papers.length - 1, 0)
        };
      }
      return proj;
    });
    setProjects(updatedProjects);
  };

  // Handle Search Input submitting to server-side Gemini API query
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setActiveTab("research");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await response.json();
      if (data.success && data.papers) {
        setAllPapers(data.papers);
      }
    } catch (err) {
      console.error("Search query failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTriggerSearchFromNav = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setActiveTab("research");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      if (data.success && data.papers) {
        setAllPapers(data.papers);
      }
    } catch (err) {
      console.error("Search query failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSynthesizeProject = () => {
    setActiveTab("proposals");
  };

  const handleUpdateProposal = (updated: Proposal) => {
    setProposals(proposals.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col font-sans select-none antialiased relative overflow-x-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* 1. Global Navigation */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        triggerSearch={handleTriggerSearchFromNav}
        onCreateProposalClick={() => setShowCreateModal(true)}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={(login) => {
          setIsLoggedIn(login);
          if (login) {
            setActiveTab("dashboard");
          } else {
            setActiveTab("landing");
          }
        }}
      />

      {/* 2. Page Content Router */}
      <main className="flex-1">
        {activeTab === "landing" && !isLoggedIn ? (
          <LandingPage onStartTrial={handleStartTrial} />
        ) : activeTab === "dashboard" && isLoggedIn ? (
          <DashboardView
            proposals={proposals}
            activities={activities}
            savedPapers={activeProject?.papers || []}
            credits={credits}
            onBuyCredits={handleBuyCredits}
            onSelectProposal={handleSelectProposal}
            onCreateNewProposal={() => setShowCreateModal(true)}
            onTrySmartOutline={() => {
              setActiveProposalId("prop-1");
              setActiveTab("proposals");
              alert("Smart Outline selected for 'Framework for Large-Scale Urban Sustainability'. Scroll down to 'Outline' on vertical subnav menu.");
            }}
          />
        ) : activeTab === "research" && isLoggedIn ? (
          <ResearchView
            papers={allPapers}
            projects={projects}
            activeProject={activeProject}
            setActiveProject={(proj) => setActiveProjectId(proj.id)}
            onAddPaperToProject={handleAddPaperToProject}
            onRemovePaperFromProject={handleRemovePaperFromProject}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            isSearching={isSearching}
            onSynthesizeProject={handleSynthesizeProject}
          />
        ) : activeTab === "proposals" && isLoggedIn ? (
          <EditorView
            proposal={activeProposal}
            onUpdateProposal={handleUpdateProposal}
            savedPapers={activeProject?.papers || []}
            credits={credits}
            setCredits={setCredits}
          />
        ) : (
          /* Redirection guard for unauthorized page loads */
          <LandingPage onStartTrial={handleStartTrial} />
        )}
      </main>

      {/* 3. Global Modal Popup for creating New Academic Proposal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 max-w-md w-full space-y-5 animate-fade-in relative z-55">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#6cf8bb]" />
                <span>Initialize Research Proposal</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/40 hover:text-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProposalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                  Proposal Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProposalTitle}
                  onChange={(e) => setNewProposalTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#6cf8bb]/30 focus:bg-white/10 transition-all placeholder-white/20"
                  placeholder="e.g. Quantum Neural Dynamics Research Grant"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                  Subject Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newProposalTags}
                  onChange={(e) => setNewProposalTags(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white/80 font-medium focus:outline-none focus:ring-1 focus:ring-[#6cf8bb]/30 focus:bg-white/10 transition-all placeholder-white/20"
                  placeholder="e.g. AI, Healthcare, Ethics"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg font-semibold border border-white/10 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg font-bold shadow-sm cursor-pointer select-none"
                >
                  Create Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Search, Filter, CheckCircle, Quote, Plus, Check, ChevronDown, Award, Trash2, Sparkles, BookOpen, ExternalLink, Copy } from "lucide-react";
import { Paper, Project } from "../types";

interface ResearchViewProps {
  papers: Paper[];
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (proj: Project) => void;
  onAddPaperToProject: (paper: Paper) => void;
  onRemovePaperFromProject: (paperId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isSearching: boolean;
  onSynthesizeProject: () => void;
}

export default function ResearchView({
  papers,
  projects,
  activeProject,
  setActiveProject,
  onAddPaperToProject,
  onRemovePaperFromProject,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  isSearching,
  onSynthesizeProject,
}: ResearchViewProps) {
  // Advanced filters state
  const [peerReviewedOnly, setPeerReviewedOnly] = useState(false);
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [highImpactOnly, setHighImpactOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // Local visual toggle state
  const [activeCitationPaper, setActiveCitationPaper] = useState<Paper | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [expandedAiSummaries, setExpandedAiSummaries] = useState<Record<string, boolean>>({});

  // Filter papers locally
  const filteredPapers = papers.filter((paper) => {
    if (peerReviewedOnly && !paper.isPeerReviewed) return false;
    if (openAccessOnly && !paper.isOpenAccess) return false;
    if (highImpactOnly && !paper.isHighImpact) return false;
    if (selectedYear !== "All" && paper.year.toString() !== selectedYear) return false;
    if (selectedCategory !== "All") {
      const q = selectedCategory.toLowerCase();
      const match = 
        paper.title.toLowerCase().includes(q) || 
        paper.abstract.toLowerCase().includes(q) || 
        paper.journal.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = [
    { id: "All", label: "All Subject Areas" },
    { id: "urban", label: "Urban Ecologies" },
    { id: "smart", label: "Smart Architecture" },
    { id: "neural", label: "Neural Networks" },
    { id: "ethics", label: "Digital Ethics" },
  ];

  const years = ["All", "2024", "2023", "2022", "2021"];

  const handleCopyCitation = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(format);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  const toggleAiSummary = (id: string) => {
    setExpandedAiSummaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-white relative z-10">
      {/* 1. Left Sidebar: Advanced Filter Panels */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-5 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Filter className="w-4.5 h-4.5 text-white" />
            <h3 className="font-bold text-sm text-white">Advanced Filters</h3>
          </div>

          {/* Quick Subject Categories */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">
              Subject Area
            </label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${
                    selectedCategory === cat.id
                      ? "bg-[#6cf8bb] text-slate-950 font-bold"
                      : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.id && <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Publication Year */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">
              Publication Date
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer [&_option]:bg-zinc-950 [&_option]:text-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === "All" ? "All Years" : y}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Badges */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
              Document Quality
            </label>

            {/* Peer Reviewed */}
            <label className="flex items-center gap-2.5 text-xs font-semibold text-white/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={peerReviewedOnly}
                onChange={(e) => setPeerReviewedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#6cf8bb] focus:ring-[#6cf8bb]/30"
              />
              <span>Peer-reviewed</span>
            </label>

            {/* Open Access */}
            <label className="flex items-center gap-2.5 text-xs font-semibold text-white/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={openAccessOnly}
                onChange={(e) => setOpenAccessOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#6cf8bb] focus:ring-[#6cf8bb]/30"
              />
              <span>Open-access (PDF available)</span>
            </label>

            {/* High Impact */}
            <label className="flex items-center gap-2.5 text-xs font-semibold text-white/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={highImpactOnly}
                onChange={(e) => setHighImpactOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#6cf8bb] focus:ring-[#6cf8bb]/30"
              />
              <span>High Impact Factor</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Center Panel: Search Query and Paper Results */}
      <div className="lg:col-span-6 space-y-6">
        {/* Dynamic Header */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4">
          <form onSubmit={onSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#6cf8bb]/30 focus:border-white/15 focus:bg-white/10 transition-all"
                placeholder="Query database for automated references..."
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg text-xs font-bold transition-all disabled:opacity-50 select-none cursor-pointer"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchQuery && (
            <p className="text-[11px] text-white/40 mt-2 font-medium">
              Showing results for &ldquo;<span className="text-[#6cf8bb] italic">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        {/* Papers Listing */}
        <div className="space-y-4">
          {isSearching ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center shadow-2xl">
              <div className="w-10 h-10 border-2 border-[#6cf8bb] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-white">Synthesizing literature index...</p>
              <p className="text-xs text-white/40 mt-1">Calling server-side Gemini gateway to align academic findings</p>
            </div>
          ) : filteredPapers.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center shadow-2xl">
              <BookOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
              <p className="text-sm font-bold text-white">No papers match current filters</p>
              <p className="text-xs text-white/40 mt-1">Try expanding your search query or adjusting active filters</p>
            </div>
          ) : (
            filteredPapers.map((paper) => {
              const inProject = activeProject?.papers.some((p) => p.id === paper.id);

              return (
                <div
                  key={paper.id}
                  className="bg-white/5 rounded-xl border border-white/10 shadow-2xl p-5 space-y-4 hover:border-white/25 hover:bg-white/10 transition-all hover-lift"
                >
                  {/* Card Header Metadata */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-white/40">
                        {paper.authors} &bull; <span className="italic">{paper.journal}</span> ({paper.year})
                      </p>
                      <h4 className="font-bold text-white text-sm tracking-tight leading-tight">
                        {paper.title}
                      </h4>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      {paper.isHighImpact && (
                        <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-colors cursor-pointer" title="High Impact Factor Source">
                          <Award className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {paper.isPeerReviewed && (
                        <span className="w-5 h-5 rounded-full bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb] hover:bg-[#6cf8bb]/20 transition-colors cursor-pointer" title="Peer Reviewed & Verified">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Abstract Text */}
                  <p className="text-xs text-white/60 leading-relaxed line-clamp-3 font-medium">
                    {paper.abstract}
                  </p>

                  {/* AI Summary Collapse Block */}
                  {expandedAiSummaries[paper.id] && paper.aiSummary && (
                    <div className="bg-[#6cf8bb]/5 border border-[#6cf8bb]/20 p-3.5 rounded-xl text-xs space-y-1 flex gap-2">
                      <Sparkles className="w-4 h-4 text-[#6cf8bb] shrink-0 mt-0.5 fill-[#6cf8bb]/10" />
                      <div>
                        <span className="font-bold text-[#6cf8bb]">ScholarDraft Analysis: </span>
                        <span className="text-white/80 italic leading-normal">&ldquo;{paper.aiSummary}&rdquo;</span>
                      </div>
                    </div>
                  )}

                  {/* Card Bottom Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs">
                    <span className="font-semibold text-white/40 font-mono">
                      {paper.citations} Citations
                    </span>

                    <div className="flex items-center gap-2">
                      {paper.aiSummary && (
                        <button
                          onClick={() => toggleAiSummary(paper.id)}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#6cf8bb] border border-[#6cf8bb]/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#6cf8bb]" />
                          <span>{expandedAiSummaries[paper.id] ? "Hide Analysis" : "AI Analyse"}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setActiveCitationPaper(paper)}
                        className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer"
                        title="Generate Cite String"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      {inProject ? (
                        <button
                          onClick={() => onRemovePaperFromProject(paper.id)}
                          className="px-2.5 py-1.5 bg-[#6cf8bb]/15 text-[#6cf8bb] font-bold rounded-lg text-[11px] flex items-center gap-1 border border-[#6cf8bb]/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-colors cursor-pointer"
                          title="Click to remove from project"
                        >
                          <Check className="w-3 h-3" />
                          <span>Added</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddPaperToProject(paper)}
                          className="px-2.5 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Project</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Right Sidebar: Active Project Sources & Actions */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-5 space-y-5">
          {/* Project dropdown selection */}
          <div className="space-y-1.5 pb-3 border-b border-white/5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
              Active Project
            </span>
            <div className="relative">
              <select
                value={activeProject?.id || ""}
                onChange={(e) => {
                  const proj = projects.find((p) => p.id === e.target.value);
                  if (proj) setActiveProject(proj);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-xs text-white font-bold focus:outline-none appearance-none pr-8 cursor-pointer [&_option]:bg-zinc-950 [&_option]:text-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Active project papers */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Project Sources
              </span>
              <span className="text-xs font-bold text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full font-mono">
                {activeProject?.papers.length || 0}
              </span>
            </div>

            {activeProject && activeProject.papers.length > 0 ? (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {activeProject.papers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-xs flex justify-between items-start gap-2 group transition-all"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-white truncate leading-tight">
                        {paper.title}
                      </p>
                      <p className="text-[10px] text-white/40 truncate font-mono">
                        {paper.authors} ({paper.year})
                      </p>
                    </div>
                    <button
                      onClick={() => onRemovePaperFromProject(paper.id)}
                      className="p-1 hover:bg-rose-500/10 text-white/30 hover:text-rose-400 rounded transition-all"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-lg p-6 text-center text-xs text-white/30">
                <p>No papers added yet.</p>
                <p className="mt-0.5 text-white/20">Click &quot;Add to Project&quot; on search results.</p>
              </div>
            )}
          </div>

          {/* Core synthesis triggers */}
          {activeProject && activeProject.papers.length > 0 && (
            <button
              onClick={onSynthesizeProject}
              className="w-full py-2.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950/5" />
              <span>Synthesize Lit Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Citation Modal Popup */}
      {activeCitationPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-6 max-w-xl w-full space-y-6 animate-fade-in text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Quote className="w-4.5 h-4.5 text-[#6cf8bb]" />
                <span>Academic Citations</span>
              </h3>
              <button
                onClick={() => setActiveCitationPaper(null)}
                className="text-white/40 hover:text-white/80 text-xs font-semibold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-white/40">
                Copy formatted bibliographic strings to easily integrate them in your document sheets:
              </p>

              {/* APA Format */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] text-white/40 uppercase tracking-widest">APA</span>
                  <button
                    onClick={() => handleCopyCitation("APA", `${activeCitationPaper.authors} (${activeCitationPaper.year}). ${activeCitationPaper.title}. ${activeCitationPaper.journal}.`)}
                    className="text-[10px] text-[#6cf8bb] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCitation === "APA" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-white/80 leading-normal font-medium">
                  {activeCitationPaper.authors} ({activeCitationPaper.year}). <span className="italic">{activeCitationPaper.title}</span>. <span className="italic">{activeCitationPaper.journal}</span>.
                </p>
              </div>

              {/* MLA Format */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] text-white/40 uppercase tracking-widest">MLA</span>
                  <button
                    onClick={() => handleCopyCitation("MLA", `${activeCitationPaper.authors}. "${activeCitationPaper.title}." ${activeCitationPaper.journal}, ${activeCitationPaper.year}.`)}
                    className="text-[10px] text-[#6cf8bb] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCitation === "MLA" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-white/80 leading-normal font-medium">
                  {activeCitationPaper.authors}. &ldquo;{activeCitationPaper.title}.&rdquo; <span className="italic">{activeCitationPaper.journal}</span>, {activeCitationPaper.year}.
                </p>
              </div>

              {/* BibTeX Format */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[10px] text-white/40 uppercase tracking-widest">BibTeX</span>
                  <button
                    onClick={() => handleCopyCitation("BibTeX", `@article{scholar_${activeCitationPaper.id},\n  author = {${activeCitationPaper.authors}},\n  title = {${activeCitationPaper.title}},\n  journal = {${activeCitationPaper.journal}},\n  year = {${activeCitationPaper.year}}\n}`)}
                    className="text-[10px] text-[#6cf8bb] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCitation === "BibTeX" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-[10px] text-white/60 leading-normal overflow-x-auto whitespace-pre custom-scrollbar">
{`@article{scholar_${activeCitationPaper.id},
  author = {${activeCitationPaper.authors}},
  title = {${activeCitationPaper.title}},
  journal = {${activeCitationPaper.journal}},
  year = {${activeCitationPaper.year}}
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

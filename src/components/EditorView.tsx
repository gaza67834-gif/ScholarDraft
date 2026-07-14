import React, { useState, useRef } from "react";
import { 
  FileText, BookOpen, Layers, Edit3, ShieldCheck, Sparkles, Bold, Italic, Underline, 
  AlignLeft, AlignCenter, AlignRight, List, Quote, Send, Save, ChevronLeft, ChevronRight,
  Plus, AlertCircle, Trash2, Check, Play, CheckCircle, Award
} from "lucide-react";
import { Proposal, Paper } from "../types";

interface EditorViewProps {
  proposal: Proposal;
  onUpdateProposal: (updated: Proposal) => void;
  savedPapers: Paper[];
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
}

export default function EditorView({
  proposal,
  onUpdateProposal,
  savedPapers,
  credits,
  setCredits,
}: EditorViewProps) {
  // Navigation tabs in Editor Workspace
  const [activeSubTab, setActiveSubTab] = useState<"draft" | "sources" | "outline" | "review">("draft");

  // Rich-text editor formatting states (mock)
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");

  // State for AI Assistant Chat panel
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Hello Dr. Aris. I have indexed your project sources. How can I assist you with your draft today? (e.g. 'Generate section 2.0' or 'Synthesize citations')" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // States for general AI Suggestions
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestPrompt, setSuggestPrompt] = useState("");
  const [showSuggestModal, setShowSuggestModal] = useState(false);

  // Drag & drop state
  const [isOverDropzone, setIsOverDropzone] = useState(false);

  // Content ref
  const editableRef = useRef<HTMLDivElement>(null);

  const subNavItems = [
    { id: "draft", label: "Core Draft", icon: Edit3 },
    { id: "sources", label: "Citations", icon: BookOpen },
    { id: "outline", label: "Outline", icon: Layers },
    { id: "review", label: "Review", icon: ShieldCheck },
  ] as const;

  // Sync draft edits back to state
  const handleContentBlur = () => {
    if (editableRef.current) {
      onUpdateProposal({
        ...proposal,
        content: editableRef.current.innerHTML,
        lastSaved: "Just now"
      });
    }
  };

  // Insert a citation at cursor or append
  const insertCitation = (paper: Paper) => {
    const citationString = ` [${paper.authors}, ${paper.year}]`;
    if (editableRef.current) {
      // Append citation
      editableRef.current.innerHTML += citationString;
      onUpdateProposal({
        ...proposal,
        content: editableRef.current.innerHTML,
        lastSaved: "Just now"
      });
      
      // Update chat logs
      setChatMessages(prev => [
        ...prev,
        { sender: "bot", text: `Injected citation: "${paper.title}" successfully into document.` }
      ]);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropzone(true);
  };

  const handleDragLeave = () => {
    setIsOverDropzone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropzone(false);
    try {
      const paperDataStr = e.dataTransfer.getData("text/plain");
      if (paperDataStr) {
        const paper = JSON.parse(paperDataStr) as Paper;
        insertCitation(paper);
      }
    } catch (err) {
      console.error("Drop parsing error:", err);
    }
  };

  // Handle AI suggestion endpoint
  const handleAiSuggest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (credits <= 0) {
      alert("No AI credits available! Reset or add credits to continue.");
      return;
    }

    setIsSuggesting(true);
    setShowSuggestModal(false);

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editableRef.current?.innerHTML || proposal.content,
          instruction: suggestPrompt,
          title: proposal.title
        })
      });

      const data = await response.json();
      if (data.success && data.suggestion) {
        if (editableRef.current) {
          // Append suggested text beautifully
          const formattedSuggestion = data.suggestion.replace(/\n/g, "<br>");
          editableRef.current.innerHTML += `<div class="p-4 bg-emerald-50/40 border border-[#6cf8bb]/20 rounded-xl my-4 text-slate-800 relative group transition-all animate-fade-in">
            <span class="absolute right-3 top-3 text-[9px] font-bold text-emerald-800 bg-[#6cf8bb]/20 px-2 py-0.5 rounded-full select-none">AI Integration</span>
            ${formattedSuggestion}
          </div>`;
          
          onUpdateProposal({
            ...proposal,
            content: editableRef.current.innerHTML,
            lastSaved: "Just now",
            progress: Math.min(proposal.progress + 10, 100)
          });
          setCredits(prev => Math.max(prev - 1, 0));
        }
      }
    } catch (err) {
      console.error("AI suggest error:", err);
    } finally {
      setIsSuggesting(false);
      setSuggestPrompt("");
    }
  };

  // Smart Outline re-generation
  const handleRegenerateOutline = async () => {
    if (credits <= 0) return;
    setIsChatLoading(true);
    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposal.title,
          tags: proposal.tags
        })
      });
      const data = await response.json();
      if (data.success && data.outline) {
        onUpdateProposal({
          ...proposal,
          outline: data.outline,
          lastSaved: "Just now"
        });
        setChatMessages(prev => [
          ...prev,
          { sender: "bot", text: `I have generated a new 4-section outline suited to your proposal objectives. Switch to the 'Outline' tab to review.` }
        ]);
        setCredits(prev => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Outline error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Synthesize Papers block directly into document
  const handleSynthesizePapers = async () => {
    if (savedPapers.length === 0) {
      alert("No saved papers in current project! Please add papers from the Research panel first.");
      return;
    }
    if (credits <= 0) return;

    setIsSuggesting(true);
    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          papers: savedPapers,
          projectTitle: proposal.title
        })
      });
      const data = await response.json();
      if (data.success && data.synthesis) {
        if (editableRef.current) {
          const synthHtml = `
            <h2 class="font-bold text-slate-900 text-sm mt-6 mb-2">2.0 Synthesized Literature Review</h2>
            <p class="text-xs text-slate-600 leading-relaxed">${data.synthesis.replace(/\n/g, "<br>")}</p>
          `;
          editableRef.current.innerHTML += synthHtml;
          onUpdateProposal({
            ...proposal,
            content: editableRef.current.innerHTML,
            lastSaved: "Just now",
            progress: Math.min(proposal.progress + 15, 100)
          });
          setCredits(prev => Math.max(prev - 1, 0));
          setChatMessages(prev => [
            ...prev,
            { sender: "bot", text: "Successfully synthesized literature review block from current project sources and added to draft." }
          ]);
        }
      }
    } catch (err) {
      console.error("Synthesize error:", err);
    } finally {
      setIsSuggesting(false);
    }
  };

  // AI Assistant Chat submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // Simulate/call suggest for custom prompts
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editableRef.current?.innerHTML || proposal.content,
          instruction: userMsg,
          title: proposal.title
        })
      });

      const data = await response.json();
      if (data.success && data.suggestion) {
        setChatMessages(prev => [
          ...prev,
          { sender: "bot", text: data.suggestion }
        ]);
        setCredits(prev => Math.max(prev - 1, 0));
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { sender: "bot", text: `Error processing request: ${err.message}` }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-transparent relative text-white">
      
      {/* 1. Left Vertical Sidebar: Navigation icons */}
      <div className="w-48 border-r border-white/5 bg-transparent flex flex-col justify-between py-6 shrink-0 hidden sm:flex">
        <div className="space-y-6 px-3">
          <div className="px-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
              Workspace
            </span>
          </div>
          <div className="space-y-1">
            {subNavItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeSubTab === item.id
                      ? "bg-[#6cf8bb] text-slate-950 font-bold shadow-lg"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <IconComp className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saved status indicators */}
        <div className="px-6 space-y-1 text-[10px] text-white/40 font-medium">
          <div className="flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5 text-[#6cf8bb]" />
            <span>Saved {proposal.lastSaved}</span>
          </div>
          <p>Progress: {proposal.progress}%</p>
        </div>
      </div>

      {/* 2. Middle Block: Document Canvas Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        {/* Editor Toolbar Header */}
        <div className="bg-transparent border-b border-white/5 h-14 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 overflow-hidden mr-4">
            <h2 className="font-extrabold text-sm text-white truncate">
              {proposal.title}
            </h2>
            <span className="text-[10px] font-bold text-white/50 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 shrink-0 uppercase font-mono">
              {proposal.draftId}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSuggestModal(true)}
              className="px-3.5 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer select-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950/10 animate-pulse" />
              <span>AI Suggest</span>
            </button>
          </div>
        </div>

        {/* Tab content renderer */}
        <div className="p-6 md:p-8 flex-1 flex justify-center max-w-4xl mx-auto w-full">
          {activeSubTab === "draft" && (
            <div className="w-full space-y-4">
              
              {/* Formatting Toolbar */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 shadow-xl backdrop-blur-md flex items-center gap-1 flex-wrap shrink-0">
                <button
                  onClick={() => setIsBold(!isBold)}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs font-bold ${
                    isBold ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                  title="Toggle Bold style (Visual simulator)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs font-bold ${
                    isItalic ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                  title="Toggle Italic style (Visual simulator)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsUnderline(!isUnderline)}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer text-xs font-bold ${
                    isUnderline ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                  title="Toggle Underline style (Visual simulator)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-white/10 mx-1.5" />
                
                <button
                  onClick={() => setAlignment("left")}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                    alignment === "left" ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAlignment("center")}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                    alignment === "center" ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAlignment("right")}
                  className={`p-1.5 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                    alignment === "right" ? "bg-white/15 text-[#6cf8bb]" : "text-white/60"
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-white/10 mx-1.5" />

                <button
                  onClick={handleSynthesizePapers}
                  disabled={isSuggesting}
                  className="px-2.5 py-1.5 bg-white/5 border border-[#6cf8bb]/20 hover:bg-white/10 text-[#6cf8bb] rounded-lg text-[10px] font-bold transition-all ml-auto flex items-center gap-1 disabled:opacity-50 select-none cursor-pointer animate-fade-in"
                >
                  <Sparkles className="w-3 h-3 text-[#6cf8bb] fill-[#6cf8bb]/5" />
                  <span>Synthesize Project literature</span>
                </button>
              </div>

              {/* Editable Academic Sheet Container */}
              <div 
                className={`document-sheet bg-zinc-950/85 border border-white/10 rounded-xl p-8 md:p-12 space-y-6 relative shadow-2xl ${
                  isOverDropzone ? "ring-2 ring-[#6cf8bb] bg-[#6cf8bb]/5" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Drag and Drop Hover Hint Overlay */}
                {isOverDropzone && (
                  <div className="absolute inset-0 bg-zinc-950 border-2 border-dashed border-[#6cf8bb] rounded-xl flex items-center justify-center z-20 pointer-events-none">
                    <div className="text-center space-y-2 bg-zinc-900 px-6 py-4 rounded-xl shadow-2xl border border-white/10">
                      <Quote className="w-8 h-8 text-[#6cf8bb] mx-auto animate-bounce" />
                      <p className="text-xs font-bold text-white">Drop paper here to cite</p>
                      <p className="text-[10px] text-white/40">Inserts rigorous citations automatically</p>
                    </div>
                  </div>
                )}

                {/* Cover Header */}
                <div className="text-center pb-8 border-b border-white/5 space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 font-bold block">
                    RESEARCH PROPOSAL & GRANT OUTLINE
                  </span>
                  <h1 className="text-lg md:text-xl font-bold text-white max-w-xl mx-auto leading-tight">
                    {proposal.title}
                  </h1>
                  <p className="text-xs text-white/50 font-medium">
                    Principal Investigator: {proposal.author} &bull; FY2024 Cycle
                  </p>
                </div>

                {/* Actual editable container */}
                {isSuggesting && (
                  <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center z-10 rounded-xl">
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 border-2 border-[#6cf8bb] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-bold text-white">Synthesizing content with Gemini...</p>
                      <p className="text-[10px] text-white/40">Verifying scientific logic constraints</p>
                    </div>
                  </div>
                )}

                <div
                  ref={editableRef}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleContentBlur}
                  className={`text-xs text-white/90 leading-relaxed outline-none min-h-[550px] space-y-4 focus:ring-1 focus:ring-white/10 p-2 rounded-lg font-sans ${
                    isBold ? "font-bold" : ""
                  } ${
                    isItalic ? "italic" : ""
                  } ${
                    isUnderline ? "underline" : ""
                  }`}
                  style={{ textAlign: alignment }}
                  dangerouslySetInnerHTML={{ __html: proposal.content }}
                />

                {/* Footnote dropzone tip */}
                <div className="pt-6 border-t border-white/5 text-[10px] text-white/40 flex justify-between items-center">
                  <span>APA Footnote System</span>
                  <span className="font-semibold text-[#6cf8bb] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded">
                    Drag paper cards from right panel to cite
                  </span>
                </div>
              </div>

            </div>
          )}

          {activeSubTab === "sources" && (
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <h3 className="font-bold text-sm text-white">Project Citation Bank</h3>
                <span className="text-xs text-white/40 font-mono">{savedPapers.length} papers</span>
              </div>

              {savedPapers.length > 0 ? (
                <div className="space-y-4">
                  {savedPapers.map((paper) => (
                    <div key={paper.id} className="p-4 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold uppercase text-[#6cf8bb] bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 px-2 py-0.5 rounded block w-fit mb-1">
                          {paper.type}
                        </span>
                        <h4 className="font-bold text-white text-xs">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-white/40">
                          {paper.authors} &bull; {paper.journal} ({paper.year})
                        </p>
                      </div>
                      <button
                        onClick={() => insertCitation(paper)}
                        className="px-3 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded text-[11px] font-bold transition-all cursor-pointer select-none"
                      >
                        Cite Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/35 space-y-3">
                  <BookOpen className="w-10 h-10 mx-auto text-white/20" />
                  <p className="text-xs">No research sources added yet.</p>
                  <p className="text-[11px] text-white/30 mt-1">Search papers in the Research menu to enrich citations.</p>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "outline" && (
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 shadow-2xl space-y-6 text-white">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div>
                  <h3 className="font-bold text-sm text-white">Logical Grant Outline</h3>
                  <p className="text-[11px] text-white/40">Structure validated by ScholarDraft AI</p>
                </div>
                <button
                  onClick={handleRegenerateOutline}
                  disabled={isChatLoading}
                  className="px-3 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded text-[10px] font-bold flex items-center gap-1 disabled:opacity-50 select-none cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950/5" />
                  <span>Regenerate Outline</span>
                </button>
              </div>

              <div className="space-y-4">
                {proposal.outline.map((section, idx) => (
                  <div key={idx} className="p-4 border border-white/5 bg-white/5 rounded-xl space-y-1">
                    <h4 className="font-bold text-xs text-white font-mono">
                      {section.title}
                    </h4>
                    <p className="text-xs text-white/60 leading-normal">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "review" && (
            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 shadow-2xl space-y-6 text-white">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <ShieldCheck className="w-5 h-5 text-[#6cf8bb]" />
                <div>
                  <h3 className="font-bold text-sm text-white">Academic Review Panel</h3>
                  <p className="text-[11px] text-white/40">Integrity, style, and verification check</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[#6cf8bb]/20 bg-[#6cf8bb]/5 rounded-xl space-y-2 text-[#6cf8bb]">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Plagiarism Check Passed</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    0% unoriginal matches found. All citations are correctly referenced against verified publishers.
                  </p>
                </div>

                <div className="p-4 border border-orange-500/20 bg-orange-500/5 rounded-xl space-y-2 text-orange-400">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Award className="w-4.5 h-4.5" />
                    <span>Rigorous Language Score</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    High academic index. Lexical diversity and sentence structure align with typical NIH/NSF grant criteria.
                  </p>
                </div>
              </div>

              <div className="p-4 border border-white/5 rounded-xl bg-white/5 text-xs">
                <h4 className="font-bold text-white mb-1">Export Submission Package</h4>
                <p className="text-white/40 mb-4 text-[11px]">Compile the final draft, figures, bibliography, and cover sheet into high-fidelity format.</p>
                <div className="flex gap-2">
                  <button className="px-3.5 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded text-xs font-bold cursor-pointer select-none">
                    Export LaTeX
                  </button>
                  <button className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded text-xs font-semibold border border-white/10 cursor-pointer select-none">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Collapsible Helper Sidebar: Sources & AI Chat */}
      <div className="w-72 border-l border-white/5 bg-transparent flex flex-col h-full shrink-0 hidden lg:flex text-white">
        {/* Project Sources Header */}
        <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Project Citation Sources
            </span>
            <span className="text-xs font-bold text-white bg-white/10 border border-white/15 px-2 py-0.5 rounded-full font-mono">
              {savedPapers.length}
            </span>
          </div>

          {savedPapers.length > 0 ? (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
              {savedPapers.map((paper) => (
                <div
                  key={paper.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", JSON.stringify(paper));
                  }}
                  className="p-2 border border-white/5 hover:border-white/10 rounded-lg bg-white/5 hover:bg-white/10 text-xs cursor-grab active:cursor-grabbing transition-all hover:shadow-sm"
                  title="Drag and drop onto editor sheet to cite"
                >
                  <p className="font-bold text-white truncate">{paper.title}</p>
                  <div className="flex justify-between text-[10px] text-white/40 mt-0.5">
                    <span>{paper.authors} ({paper.year})</span>
                    <button 
                      onClick={() => insertCitation(paper)}
                      className="text-[#6cf8bb] font-bold hover:underline cursor-pointer"
                    >
                      + Cite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/10 p-4 rounded-lg text-center text-xs text-white/30">
              No project sources. Add papers in Research panel.
            </div>
          )}
        </div>

        {/* AI Assistant Chat Console */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6cf8bb] fill-[#6cf8bb]/10" />
              <span>ScholarDraft AI Assist</span>
            </span>
            <span className="text-[10px] font-bold text-[#6cf8bb] bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 px-2 py-0.5 rounded-full">
              {credits} credits
            </span>
          </div>

          {/* Message log */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "items-start"
                }`}
              >
                <span className="text-[9px] font-bold text-white/40 mb-0.5">
                  {msg.sender === "user" ? "Dr. Aris" : "ScholarBot"}
                </span>
                <div
                  className={`p-2.5 rounded-xl leading-normal ${
                    msg.sender === "user"
                      ? "bg-white/10 text-white rounded-tr-none shadow-sm border border-white/10"
                      : "bg-[#6cf8bb]/10 text-white rounded-tl-none border border-[#6cf8bb]/20"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <div className="w-3 h-3 border border-[#6cf8bb] border-t-transparent rounded-full animate-spin" />
                <span>ScholarBot is typing...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/5 bg-[#0a0a0a]/50 flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/10 transition-all"
              placeholder="Ask AI or write instructions..."
            />
            <button
              type="submit"
              className="p-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* AI Suggest / Custom Prompt Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <form onSubmit={handleAiSuggest} className="bg-zinc-950 border border-white/10 rounded-xl shadow-2xl p-6 max-w-md w-full space-y-4 text-white">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6cf8bb] fill-[#6cf8bb]/10" />
                <span>AI Suggestion Prompter</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                className="text-white/40 hover:text-white/80 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                Continuation Instructions
              </label>
              <textarea
                value={suggestPrompt}
                onChange={(e) => setSuggestPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#6cf8bb]/30 focus:bg-white/10 h-24"
                placeholder="e.g. 'Write a highly rigorous methodology section detailing IoT sensor intervals' or leave empty for a contextual continuation."
              />
              <p className="text-[10px] text-white/40 leading-normal">
                Uses 1 API credit. This will query server-side Gemini to analyze your proposal, titles, and sources to output perfectly aligned content.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-xs font-semibold cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded text-xs font-bold shadow-lg cursor-pointer select-none"
              >
                Generate Draft Continuation
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

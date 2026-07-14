import React from "react";
import { Sparkles, BookOpen, Search, Users, Shield, FileDown, CheckCircle, Play, ArrowRight, ExternalLink, Globe } from "lucide-react";

interface LandingPageProps {
  onStartTrial: () => void;
}

export default function LandingPage({ onStartTrial }: LandingPageProps) {
  return (
    <div className="bg-transparent min-h-screen text-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 animate-fade-in">
            {/* AI Pill Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#6cf8bb]/10 text-[#6cf8bb] border border-[#6cf8bb]/20 px-4 py-1.5 rounded-full mb-8 select-none">
              <Sparkles className="w-4 h-4 text-[#6cf8bb] fill-[#6cf8bb]/10" />
              <span className="font-bold text-[10px] tracking-widest uppercase">
                AI-Powered Academic Precision
              </span>
            </div>

            {/* Display Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              From Thesis to Funded Proposal in <span className="text-orange-500 italic font-serif font-semibold">Half the Time</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed font-medium">
              ScholarDraft combines deep academic journal search with intelligent drafting tools to help researchers build rigorous, submission-ready proposals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartTrial}
                className="bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 font-bold px-8 py-3.5 rounded-full text-sm transition-all shadow-lg flex items-center justify-center gap-2 group hover:scale-[1.01] cursor-pointer"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onStartTrial}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#6cf8bb] fill-[#6cf8bb]/10" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Interactive Browser Mockup Workspace */}
          <div className="relative max-w-5xl mx-auto">
            {/* Ambient Blobs */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="bg-zinc-950/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Window Header Chrome */}
              <div className="h-11 bg-zinc-900/40 flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="mx-auto bg-white/5 px-8 py-1 rounded text-[11px] text-white/30 font-mono border border-white/5 select-none">
                  scholar-draft.app/editor/fy2024-research-grant
                </div>
              </div>

              {/* Mock App Container */}
              <div className="flex h-[420px] bg-transparent select-none">
                {/* Mock Side List */}
                <div className="w-56 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-4 hidden sm:flex">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-sans">
                    Outline
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white/5 rounded-lg text-[#6cf8bb] border border-[#6cf8bb]/20 font-semibold text-xs flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#6cf8bb]" />
                      <span>Abstract</span>
                    </div>
                    <div className="p-2 hover:bg-white/5 rounded-lg text-white/40 font-medium text-xs flex items-center gap-2">
                      <Search className="w-3.5 h-3.5" />
                      <span>Methodology</span>
                    </div>
                    <div className="p-2 hover:bg-white/5 rounded-lg text-white/40 font-medium text-xs flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Literature Review</span>
                    </div>
                  </div>
                </div>

                {/* Mock Core Editor */}
                <div className="flex-1 bg-transparent p-8 overflow-hidden relative">
                  <div className="max-w-xl mx-auto space-y-4">
                    <div className="h-7 w-2/3 bg-white/10 rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-full bg-white/5 rounded" />
                      <div className="h-3.5 w-full bg-white/5 rounded" />
                      <div className="h-3.5 w-3/4 bg-white/5 rounded" />
                    </div>
                    {/* Floating Suggest Box */}
                    <div className="h-32 w-full bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-center p-4">
                      <div className="text-center space-y-2">
                        <Sparkles className="w-6 h-6 text-[#6cf8bb] mx-auto animate-bounce" />
                        <div className="text-xs font-semibold text-white/95">
                          AI Suggesting: Cite &apos;Chen et al (2023)&apos;
                        </div>
                        <p className="text-[10px] text-white/40">
                          Appends super-conductive biological synapses modeling parameters...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Right Citation Panel */}
                <div className="w-64 bg-black/10 border-l border-white/5 p-4 flex flex-col gap-4 hidden lg:flex">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Sources
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                      <p className="text-[11px] font-bold text-white/90 truncate">
                        Quantum Neural Mapping
                      </p>
                      <p className="text-[9px] text-white/30 mt-0.5 font-mono">
                        Journal of Tech Research, 2024
                      </p>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                      <p className="text-[11px] font-bold text-white/90 truncate">
                        Sustainable Cloud Ethics
                      </p>
                      <p className="text-[9px] text-white/30 mt-0.5 font-mono">
                        Ethics in AI, 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl text-center md:text-left mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Engineered for Academic Rigor
            </h2>
            <p className="text-white/60 text-sm md:text-base">
              Sophisticated tools for researchers who demand more than generic AI.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Feature 1: Journal Search */}
            <div className="col-span-12 md:col-span-8 bg-white/5 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-white/10 hover:border-white/20 transition-all group overflow-hidden">
              <div className="flex-1">
                <div className="w-12 h-12 bg-[#6cf8bb]/15 border border-[#6cf8bb]/30 rounded-xl flex items-center justify-center text-[#6cf8bb] mb-6">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Automated Journal Search
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Connect directly to PubMed, IEEE, and JSTOR. Our AI crawls through millions of papers to find the perfect citations for your methodology.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs font-semibold text-white/80">
                    <CheckCircle className="w-4.5 h-4.5 text-[#6cf8bb]" />
                    <span>Real-time citation verification</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs font-semibold text-white/80">
                    <CheckCircle className="w-4.5 h-4.5 text-[#6cf8bb]" />
                    <span>Automatic BibTeX generation</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 aspect-video rounded-xl bg-black/40 p-4 border border-white/10 group-hover:scale-[1.01] transition-transform select-none">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-white/10 rounded" />
                  <div className="h-16 w-full border-l-4 border-[#6cf8bb] bg-[#6cf8bb]/10 p-2.5 rounded-r">
                    <div className="text-[9px] font-bold text-[#6cf8bb]">SOURCE DETECTED</div>
                    <div className="text-[11px] text-white/90 italic mt-1 leading-tight">
                      &quot;The impact of LLMs on scholarly publishing...&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Outline */}
            <div className="col-span-12 md:col-span-4 bg-zinc-950 border border-white/10 text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5 fill-orange-400/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Smart Outline Generation
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Generate logically sound proposal structures based on specific grant requirements and institutional guidelines.
                </p>
              </div>
              <div className="mt-8 relative h-16">
                <div className="flex flex-col gap-2">
                  <div className="h-1.5 w-full bg-white/10 rounded" />
                  <div className="h-1.5 w-3/4 bg-white/10 rounded" />
                  <div className="h-1.5 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            </div>

            {/* Feature 3: Team Collab */}
            <div className="col-span-12 md:col-span-4 bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-11 h-11 bg-white/5 rounded-xl border border-white/15 flex items-center justify-center text-[#6cf8bb] mb-6 shadow-sm">
                <Users className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Collaborative Strategy
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Review, comment, and edit alongside your research team in a unified environment with comprehensive version control.
              </p>
            </div>

            {/* Feature 4: High Security */}
            <div className="col-span-12 md:col-span-4 bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-11 h-11 bg-white/5 rounded-xl border border-white/15 flex items-center justify-center text-[#6cf8bb] mb-6 shadow-sm">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                IP Protection
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Your research data remains yours. Secure enterprise-grade encryption and strictly compliant server-side data proxies.
              </p>
            </div>

            {/* Feature 5: Export */}
            <div className="col-span-12 md:col-span-4 bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-11 h-11 bg-white/5 rounded-xl border border-white/15 flex items-center justify-center text-[#6cf8bb] mb-6 shadow-sm">
                <FileDown className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                One-Click Submission
              </h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Export to PDF, LaTeX, or Word with perfectly formatted bibliographies in APA, MLA, or Harvard styles automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-transparent border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-950/80 backdrop-blur-md rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl border border-white/10">
            {/* Overlay grid design */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                backgroundImage: "radial-gradient(#6cf8bb 1px, transparent 1px)", 
                backgroundSize: "20px 20px" 
              }} 
            />
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Ready to secure your next grant?
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                Join 5,000+ researchers globally who are accelerating their impact and writing with ScholarDraft.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onStartTrial}
                  className="bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 font-bold px-8 py-3.5 rounded-full text-sm transition-all hover:scale-[1.01] cursor-pointer"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={onStartTrial}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer"
                >
                  Schedule Demo
                </button>
              </div>
              <p className="text-xs text-white/30 mt-4 font-medium">
                No credit card required. 14-day full access trial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5 py-12 text-white/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-extrabold text-white tracking-tighter text-lg">ScholarDraft</span>
            <p className="text-white/30 text-xs mt-1 font-medium">
              &copy; 2026 ScholarDraft Academic Systems. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-[#6cf8bb] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-[#6cf8bb] transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-white/40 hover:text-[#6cf8bb] transition-colors">API Documentation</a>
            <a href="#" className="text-xs text-white/40 hover:text-[#6cf8bb] transition-colors">Support</a>
          </div>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#6cf8bb] hover:bg-white/5 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#6cf8bb] hover:bg-white/5 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

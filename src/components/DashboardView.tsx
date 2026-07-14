import React, { useState } from "react";
import { BookOpen, Award, Sparkles, ChevronRight, CheckCircle, Clock, Plus, Zap, AlertCircle } from "lucide-react";
import { Proposal, Activity, Paper } from "../types";

interface DashboardViewProps {
  proposals: Proposal[];
  activities: Activity[];
  savedPapers: Paper[];
  credits: number;
  onBuyCredits: () => void;
  onSelectProposal: (proposalId: string) => void;
  onCreateNewProposal: () => void;
  onTrySmartOutline: () => void;
}

export default function DashboardView({
  proposals,
  activities,
  savedPapers,
  credits,
  onBuyCredits,
  onSelectProposal,
  onCreateNewProposal,
  onTrySmartOutline,
}: DashboardViewProps) {
  return (
    <div className="py-8 max-w-7xl mx-auto px-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Dr. Aris
          </h1>
          <p className="text-sm text-white/40 font-medium mt-1">
            Academic Workspace &bull; Institute of Sustainable Infrastructure
          </p>
        </div>
        <button
          onClick={onCreateNewProposal}
          className="flex items-center gap-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition-all shadow-lg hover:scale-[1.01] select-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Metric 1: Active Proposals */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-2xl flex items-center justify-between hover-lift text-white">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Active Proposals
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {proposals.length}
            </h3>
            <p className="text-[11px] text-white/60 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              <span>Updated {proposals[0]?.lastSaved || "recently"}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <BookOpen className="w-6 h-6 text-[#6cf8bb]" />
          </div>
        </div>

        {/* Metric 2: Total Citations */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-2xl flex items-center justify-between hover-lift text-white">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Total Citations
            </span>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              1,674
            </h3>
            <p className="text-[11px] text-[#6cf8bb] mt-1 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>8 peer-reviewed verified</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
        </div>

        {/* Metric 3: Active Credits */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-5 shadow-2xl flex items-center justify-between hover-lift relative overflow-hidden group text-white">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              API Credits
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-extrabold text-white">
                {credits}
              </h3>
              <span className="text-xs text-white/30">/ 100 quota</span>
            </div>
            <button
              onClick={onBuyCredits}
              className="text-[10px] text-[#6cf8bb] font-bold hover:underline flex items-center gap-1 mt-2 cursor-pointer bg-[#6cf8bb]/10 px-2.5 py-1 rounded-full border border-[#6cf8bb]/20 hover:bg-[#6cf8bb]/20 transition-all"
            >
              <Zap className="w-2.5 h-2.5 fill-[#6cf8bb] text-[#6cf8bb]" />
              <span>Get more credits</span>
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 flex items-center justify-center text-[#6cf8bb]">
            <Sparkles className="w-6 h-6 fill-[#6cf8bb]/10" />
          </div>
        </div>
      </div>

      {/* Main Content Split: Left Proposals List, Right Actions & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Columns: Proposals and Saved Papers */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Proposals Panel */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-white tracking-tight">
                Active Proposal Drafts
              </h2>
              <span className="text-xs text-white/40">
                Show {proposals.length} drafts
              </span>
            </div>

            <div className="space-y-4">
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 border border-white/5 hover:border-white/15 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] font-semibold tracking-wider text-white/60 uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                        {prop.draftId}
                      </span>
                      {prop.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold text-[#6cf8bb] bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="font-bold text-white text-sm hover:text-[#6cf8bb] transition-colors cursor-pointer" onClick={() => onSelectProposal(prop.id)}>
                      {prop.title}
                    </h4>
                    <p className="text-xs text-white/40">
                      Author: {prop.author} &bull; Saved {prop.lastSaved}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Progress Bar */}
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-[#6cf8bb] h-1.5 rounded-full"
                            style={{ width: `${prop.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white/80 font-mono">
                          {prop.progress}%
                        </span>
                      </div>
                      <span className="text-[10px] text-white/45 font-medium">Draft Progress</span>
                    </div>

                    <button
                      onClick={() => onSelectProposal(prop.id)}
                      className="p-2 bg-white/5 hover:bg-[#6cf8bb] hover:text-slate-950 rounded-lg text-white/70 border border-white/10 transition-all cursor-pointer"
                      title="Continue writing"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Sources Panel */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6 text-white">
            <h2 className="text-base font-bold text-white tracking-tight mb-4">
              Saved Sources & Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPapers.slice(0, 4).map((paper) => (
                <div key={paper.id} className="p-4 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-all shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#6cf8bb] bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 px-1.5 py-0.5 rounded">
                        {paper.type}
                      </span>
                      <span className="text-[10px] font-bold text-white/40 font-mono">
                        {paper.year}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-white line-clamp-2 leading-snug">
                      {paper.title}
                    </h4>
                    <p className="text-[11px] text-white/45 mt-1 font-medium">
                      {paper.authors} &bull; {paper.journal}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40 font-semibold">
                    <span>{paper.citations} citations</span>
                    {paper.isPeerReviewed && (
                      <span className="text-[#6cf8bb] font-bold flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Peer Reviewed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Columns: Smart Tools & Activity Feed */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Smart Outline Utility */}
          <div className="bg-zinc-950 text-white rounded-xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
            {/* Grid overlay background */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none" 
              style={{ 
                backgroundImage: "radial-gradient(#6cf8bb 1px, transparent 1px)", 
                backgroundSize: "16px 16px" 
              }} 
            />
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-[#6cf8bb]/10 border border-[#6cf8bb]/20 text-[#6cf8bb] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 fill-[#6cf8bb]/10" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white">
                  Smart Outline Generator
                </h3>
                <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
                  Need a structural jumpstart? Outline custom sections automatically with ScholarDraft&apos;s AI helper.
                </p>
              </div>
              <button
                onClick={onTrySmartOutline}
                className="w-full py-2 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 rounded-lg text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
              >
                Try Now
              </button>
            </div>
          </div>

          {/* Activity Logs Panel */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6 text-white">
            <h2 className="text-sm font-bold text-white mb-4 pb-2 border-b border-white/5">
              Workspace Activity
            </h2>
            <div className="space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0 flex items-center justify-center">
                    {act.isAi ? (
                      <div className="w-full h-full bg-[#6cf8bb]/10 flex items-center justify-center text-[#6cf8bb]">
                        <Sparkles className="w-4 h-4 fill-[#6cf8bb]/5" />
                      </div>
                    ) : (
                      <span className="text-white/80 font-bold uppercase text-[10px]">
                        {act.collaborator.substring(4, 6)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-white/60 font-medium leading-tight">
                      <span className="font-bold text-white">{act.collaborator}</span>{" "}
                      {act.action} in <span className="text-[#6cf8bb] italic font-semibold">{act.project}</span>
                    </p>
                    <span className="text-[10px] text-white/30 font-medium">{act.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

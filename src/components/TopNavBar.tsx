import React, { useState } from "react";
import { Search, Bell, Settings, Plus, LogOut, BookOpen } from "lucide-react";

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  triggerSearch: (query: string) => void;
  onCreateProposalClick: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (login: boolean) => void;
}

export default function TopNavBar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  triggerSearch,
  onCreateProposalClick,
  isLoggedIn,
  setIsLoggedIn,
}: TopNavBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerSearch(searchQuery);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "research", label: "Research" },
    { id: "proposals", label: "Proposals" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-md border-b border-white/5 h-16 shadow-2xl">
      <nav className="flex justify-between items-center px-6 max-w-7xl mx-auto h-full">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => {
              if (isLoggedIn) {
                setActiveTab("dashboard");
              } else {
                setActiveTab("landing");
              }
            }} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded bg-[#6cf8bb]/15 border border-[#6cf8bb]/30 flex items-center justify-center text-[#6cf8bb] font-black text-sm tracking-tight group-hover:scale-105 transition-all">
              SD
            </div>
            <span className="text-xl font-bold text-white tracking-tighter">
              ScholarDraft
            </span>
          </div>

          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-semibold text-sm py-2 transition-all cursor-pointer relative ${
                    activeTab === item.id
                      ? "text-white"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6cf8bb] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Search input */}
        {isLoggedIn && (
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-8 relative hidden sm:block">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#6cf8bb]/30 focus:border-white/25 focus:bg-white/10 transition-all"
              placeholder="Search journals, DOI, keywords..."
            />
          </form>
        )}

        {/* Right Side: Actions and User Profile */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors relative text-white/60 hover:text-white"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6cf8bb] rounded-full ring-2 ring-[#050505]" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-md">
                    <h4 className="font-bold text-white text-sm mb-2 pb-2 border-b border-white/5">
                      Notifications
                    </h4>
                    <div className="space-y-3">
                      <div className="text-xs text-white/70 pb-2 border-b border-white/5">
                        <p className="font-semibold text-white">Review Request Approved</p>
                        <p className="text-white/40 mt-0.5">Dr. James Chen approved the methodology draft.</p>
                      </div>
                      <div className="text-xs text-white/70 pb-2 border-b border-white/5">
                        <p className="font-semibold text-white">New Citation Available</p>
                        <p className="text-white/40 mt-0.5">ScholarBot identified 3 new highly cited papers matching your proposal tags.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-2 w-72 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 backdrop-blur-md">
                    <h4 className="font-bold text-white text-sm mb-2 pb-2 border-b border-white/5">
                      Settings & Workspace
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5 items-center">
                        <span className="text-white/40">Model Used:</span>
                        <span className="font-mono text-white font-semibold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">gemini-3.5-flash</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5 items-center">
                        <span className="text-white/40">API Gateway:</span>
                        <span className="text-[#6cf8bb] font-semibold">Active & Secure</span>
                      </div>
                      <div className="py-2 text-white/30 leading-normal">
                        API credentials are securely loaded on the cloud server, hiding your keys from public client traffic.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Quick LogOut */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
                    alt="Dr. Aris Vance Profile"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="hidden xl:block text-left mr-1">
                  <p className="text-xs font-semibold text-white/90">Dr. Aris Vance</p>
                  <p className="text-[10px] text-white/40">Academic Lead</p>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* New Proposal CTA Button */}
              <button
                onClick={onCreateProposalClick}
                className="hidden sm:flex items-center gap-1.5 bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-lg select-none hover:scale-[1.01]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Proposal</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="bg-[#6cf8bb] hover:bg-[#4edea3] text-slate-950 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-lg hover:scale-[1.01] cursor-pointer"
            >
              Start Free Trial
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

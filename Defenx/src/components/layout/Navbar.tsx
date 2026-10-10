import React from 'react';
import { Shield, BookOpen, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenTour: () => void;
  onToggleMobileSidebar: () => void;
  defenseStatus: boolean;
  onToggleDefenseStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTour,
  onToggleMobileSidebar,
  defenseStatus,
  onToggleDefenseStatus,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#090b12]/90 backdrop-blur-md border-b border-purple-500/20 px-4 lg:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/30">
              <Shield className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Agent Shield
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  DefenX
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-purple-300/80 uppercase">
                <span>DETECT</span>
                <span className="text-purple-500">•</span>
                <span>CONTROL</span>
                <span className="text-purple-500">•</span>
                <span>PROTECT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Defense status switch, presentation tour, quick action */}
        <div className="flex items-center gap-3">
          {/* Active Defense Pill */}
          <button
            onClick={onToggleDefenseStatus}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              defenseStatus
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Click to toggle active defense mode"
          >
            <span className={`w-2 h-2 rounded-full ${defenseStatus ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-[11px] tracking-wide">
              {defenseStatus ? 'DEFENSE ENGINE ACTIVE' : 'PASSIVE MONITORING'}
            </span>
          </button>

          {/* Presentation Guide Trigger */}
          <button
            onClick={onOpenTour}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Project Guide & Viva</span>
            <span className="md:hidden">Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};

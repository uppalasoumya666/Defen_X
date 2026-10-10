import React, { useState } from 'react';
import { Sparkles, X, BookOpen } from 'lucide-react';

interface DemoBannerProps {
  onOpenTour?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenTour }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Demo environment notice" className="relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-purple-900/20 to-slate-900/40 border-b border-purple-500/20 px-4 py-2.5 text-xs text-purple-200/90 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Sparkles className="w-3 h-3 text-purple-400" />
          Simulated Demo Environment
        </span>
        <span className="text-slate-300">
          All metrics, telemetry, and security events represent calibrated demonstration data. Rule-based evaluation is active on the client.
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold border border-purple-400/30 transition-all cursor-pointer shadow-sm hover:shadow-purple-500/20"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-300" />
            Presentation & Defense Guide
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-purple-500/10 transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

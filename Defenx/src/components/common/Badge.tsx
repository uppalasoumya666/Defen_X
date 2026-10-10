import React from 'react';
import { DecisionType, RiskLevel, ThreatStatus, ThreatType } from '../../types/security';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Info, Lock } from 'lucide-react';


export const StatusBadge: React.FC<{ status: ThreatStatus }> = ({ status }) => {
  switch (status) {
    case 'Safe':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Safe
        </span>
      );
    case 'Suspicious':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Suspicious
        </span>
      );
    case 'Malicious':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Malicious
        </span>
      );
    default:
      return null;
  }
};

export const DecisionBadge: React.FC<{ decision: DecisionType; size?: 'sm' | 'md' | 'lg' }> = ({ decision, size = 'sm' }) => {
  const isAllow = decision === 'ALLOW';
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded-md border ${sizeClasses[size]} ${
        isAllow
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-500/10'
      }`}
    >
      {isAllow ? (
        <CheckCircle2 className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <XCircle className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
      {decision}
    </span>
  );
};

export const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  const map: Record<RiskLevel, { bg: string; text: string; border: string }> = {
    Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' },
    High: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/25' },
    Critical: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40 animate-pulse' },
  };

  const style = map[risk];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {risk}
    </span>
  );
};

export const ThreatTypeBadge: React.FC<{ type: ThreatType }> = ({ type }) => {
  const icons: Record<ThreatType, React.ReactNode> = {
    'Prompt Injection': <Lock className="w-3 h-3 text-purple-400" />,
    'Unauthorized Tool Request': <AlertTriangle className="w-3 h-3 text-rose-400" />,
    'Potential Data Leakage': <ShieldAlert className="w-3 h-3 text-amber-400" />,
    'None (Benign)': <Info className="w-3 h-3 text-slate-400" />,
  };

  const colorMap: Record<ThreatType, string> = {
    'Prompt Injection': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    'Unauthorized Tool Request': 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    'Potential Data Leakage': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    'None (Benign)': 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${colorMap[type]}`}>
      {icons[type]}
      {type}
    </span>
  );
};

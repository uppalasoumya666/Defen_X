import React from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  Activity, 
  Zap, 
  Flame, 
  AlertTriangle,
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { AuditLogEntry, SystemStats } from '../../types/security';
import { DecisionBadge, RiskBadge, ThreatTypeBadge } from '../common/Badge';
import { NavItemKey } from '../layout/Sidebar';

interface DashboardViewProps {
  stats: SystemStats;
  recentLogs: AuditLogEntry[];
  onNavigate: (tab: NavItemKey) => void;
  onSelectEvent: (event: AuditLogEntry) => void;
  onLaunchScenario: (scenarioId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentLogs,
  onNavigate,
  onSelectEvent,
  onLaunchScenario,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121526] via-[#101221] to-[#0c0d16] border border-purple-500/25 p-6 md:p-8 shadow-xl shadow-purple-950/20">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ACTIVE THREAT ENGINE • v2.4 GA</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Agent Shield – <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">DefenX</span>
            </h1>

            <p className="text-sm md:text-base font-bold tracking-widest text-purple-300/90 font-mono">
              DETECT • CONTROL • PROTECT
            </p>

            <p className="text-sm text-slate-300/90 leading-relaxed pt-1">
              Autonomous AI agent runtime security framework preventing <strong>prompt injection attacks</strong>, enforcing <strong>least-privilege tool usage</strong>, and neutralizing <strong>sensitive data exfiltration</strong>.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigate('threat-detection')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>Analyze a Prompt</span>
            </button>
            <button
              onClick={() => onNavigate('scenarios')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-purple-200 font-semibold text-sm border border-purple-500/30 hover:border-purple-400/50 shadow-md transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Run Attack Simulation</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid (Clearly labeled as demo/simulated data) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono uppercase tracking-wider text-purple-300/90 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Live Security Telemetry <span className="text-[10px] text-slate-400 font-normal">(Demo Dataset)</span>
          </h2>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            98.6% Defense Efficacy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Total Analyzed */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-md group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Total Requests Analyzed</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {stats.totalAnalyzed.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> +14.2%
              </span>
              <span>vs previous 24h baseline</span>
            </div>
          </div>

          {/* Stat 2: Suspicious Requests */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-purple-500/20 hover:border-amber-500/40 transition-all shadow-md group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Suspicious Detected</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
              {stats.suspiciousDetected.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-amber-400 font-semibold">9.6%</span>
              <span>anomaly rate flagged</span>
            </div>
          </div>

          {/* Stat 3: Unauthorized Actions Blocked */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-purple-500/20 hover:border-rose-500/40 transition-all shadow-md group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Unauthorized Actions Blocked</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
              {stats.unauthorizedBlocked.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-rose-400 font-semibold">100%</span>
              <span>intercepted at Runtime Gate</span>
            </div>
          </div>

          {/* Stat 4: Data Leaks Prevented */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-purple-500/20 hover:border-violet-500/40 transition-all shadow-md group">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-medium uppercase tracking-wider">Data Leaks Prevented</span>
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-purple-300 font-mono tracking-tight">
              {stats.dataLeaksPrevented.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-purple-300 font-semibold">0 bytes</span>
              <span>exfiltrated externally</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tri-Pillar Architecture Diagram Card */}
      <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-purple-500/15">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              The DefenX Protection Triad: DETECT • CONTROL • PROTECT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How Agent Shield neutralizes the full attack chain from initial prompt to outbound egress
            </p>
          </div>
          <button
            onClick={() => onNavigate('decision-gate')}
            className="text-xs text-purple-300 hover:text-white font-semibold inline-flex items-center gap-1"
          >
            Explore Interactive Pipeline <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Pillar 1: DETECT */}
          <div className="relative p-5 rounded-xl bg-slate-900/60 border border-purple-500/25 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                STAGE 01
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">INPUT SHIELD</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-purple-400">1.</span> DETECT
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scans all incoming prompts, emails, and web data. Detects jailbreaks, invisible DOM injections, and prompt overrides before the agent evaluates context.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Token Heuristics</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>

          {/* Pillar 2: CONTROL */}
          <div className="relative p-5 rounded-xl bg-slate-900/60 border border-violet-500/25 hover:border-violet-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                STAGE 02
              </span>
              <span className="text-xs font-mono font-bold text-violet-400">RUNTIME GATE</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-violet-400">2.</span> CONTROL
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Runtime Decision Gate intercepts all tool invocations. Enforces least-privilege schemas to block shell commands, restricted filesystem access, and API abuse.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Tool Whitelisting</span>
              <span className="text-emerald-400 font-semibold">Enforced</span>
            </div>
          </div>

          {/* Pillar 3: PROTECT */}
          <div className="relative p-5 rounded-xl bg-slate-900/60 border border-indigo-500/25 hover:border-indigo-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STAGE 03
              </span>
              <span className="text-xs font-mono font-bold text-indigo-400">DATA & AUDIT</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-indigo-400">3.</span> PROTECT
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              DLP filter scrubs PII, API tokens, and confidential records. Blocks unauthorized outbound webhooks and commits tamper-proof records to the audit ledger.
            </p>
            <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Outbound DLP</span>
              <span className="text-emerald-400 font-semibold">Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main split: Threat Vector Breakdown & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Threat Distribution & Attack Vector Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-400" />
                Attack Vector Breakdown
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Live Ratios</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Prompt Injections
                  </span>
                  <span className="font-mono text-purple-300 font-bold">42%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-violet-500 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Unauthorized Tool Calls
                  </span>
                  <span className="font-mono text-rose-300 font-bold">35%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Data Exfiltration Attempts
                  </span>
                  <span className="font-mono text-amber-300 font-bold">23%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>
            </div>

            {/* Quick Demonstration Scenario Shortcut */}
            <div className="mt-6 p-4 rounded-xl bg-purple-950/30 border border-purple-500/25">
              <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Featured College Demo Scenario
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Watch an indirect prompt injection attempt to steal AWS access credentials and how DefenX intercepts it at runtime.
              </p>
              <button
                onClick={() => onLaunchScenario('scenario-web-indirect-injection')}
                className="w-full py-2 px-3 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 text-xs font-semibold border border-purple-400/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Scenario 2 Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-500/15 text-[11px] text-slate-400 text-center font-mono">
            Zero-Trust Agent Guardrails Active
          </div>
        </div>

        {/* Right 2 Cols: Recent Security Events Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Recent Security Events & Interceptions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time agent decision log with cryptographic trace ID
              </p>
            </div>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="text-xs text-purple-300 hover:text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              View All Logs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectEvent(log)}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-purple-300">
                      {log.id}
                    </span>
                    <ThreatTypeBadge type={log.threatType} />
                    <RiskBadge risk={log.riskLevel} />
                    <span className="text-[11px] font-mono text-slate-400">
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium truncate">
                    {log.payloadSummary}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {log.reason}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <DecisionBadge decision={log.decision} />
                  <span className="text-slate-400 group-hover:text-purple-300 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

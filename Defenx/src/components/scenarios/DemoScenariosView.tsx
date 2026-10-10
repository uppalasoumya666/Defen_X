import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Mail, 
  Globe, 
  Terminal, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AuditLogEntry } from '../../types/security';
import { ATTACK_SCENARIOS } from '../../data/mockData';
import { RiskBadge, ThreatTypeBadge } from '../common/Badge';

interface DemoScenariosViewProps {
  onAppendAuditLog: (entry: AuditLogEntry) => void;
  onNavigateToLogs: () => void;
  initialScenarioId?: string;
}

export const DemoScenariosView: React.FC<DemoScenariosViewProps> = ({
  onAppendAuditLog,
  onNavigateToLogs,
  initialScenarioId,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    initialScenarioId || ATTACK_SCENARIOS[0].id
  );
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<'IDLE' | 'DETECT' | 'CONTROL' | 'PROTECT' | 'COMPLETE'>('COMPLETE');
  const [lastLoggedId, setLastLoggedId] = useState<string | null>(null);

  const scenario = ATTACK_SCENARIOS.find(s => s.id === selectedScenarioId) || ATTACK_SCENARIOS[0];

  const handleRunSimulation = () => {
    setSimulationActive(true);
    setActiveStage('DETECT');

    setTimeout(() => {
      setActiveStage('CONTROL');
    }, 1200);

    setTimeout(() => {
      setActiveStage('PROTECT');
    }, 2400);

    setTimeout(() => {
      setActiveStage('COMPLETE');
      setSimulationActive(false);

      const newId = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const timestamp = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;

      const auditEntry: AuditLogEntry = {
        id: newId,
        timestamp,
        source: scenario.source,
        threatType: scenario.category,
        riskLevel: scenario.riskLevel,
        decision: 'BLOCK',
        reason: `Violated security policy during attack scenario: ${scenario.title}. Intercepted ${scenario.targetToolAttempt}.`,
        agentId: 'agent-sandbox-demo',
        targetTool: scenario.targetToolAttempt,
        payloadSummary: scenario.subtitle,
        rawPayload: JSON.stringify({
          scenario_id: scenario.id,
          title: scenario.title,
          target_tool: scenario.targetToolAttempt,
          exfiltration_target: scenario.dataExfiltrationTarget,
          intercept_phase: 'Runtime Decision Gate',
        }, null, 2),
        policyId: 'POL-BLOCK-STRICT',
        durationMs: 3.8,
      };

      onAppendAuditLog(auditEntry);
      setLastLoggedId(newId);
    }, 3600);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Email': return <Mail className="w-4 h-4 text-purple-400" />;
      case 'Website Scrape': return <Globe className="w-4 h-4 text-purple-400" />;
      case 'AI Prompt': return <Terminal className="w-4 h-4 text-purple-400" />;
      default: return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-orange-400" />
            Interactive Attack Scenarios Lab
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Experience end-to-end defense in action: <span className="font-mono text-purple-300">DETECT → CONTROL → PROTECT</span>
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={simulationActive}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {simulationActive ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating Defense Workflow...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Launch Live Attack Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* Scenario Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ATTACK_SCENARIOS.map((sc, idx) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setActiveStage('COMPLETE');
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-400/80 shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/50'
                  : 'bg-[#0c0e18] border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono text-[10px] text-purple-300 font-bold">
                    Scenario 0{idx + 1}
                  </span>
                  <RiskBadge risk={sc.riskLevel} />
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {sc.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {sc.subtitle}
                </div>
              </div>

              <div className="pt-2 border-t border-purple-500/10 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-slate-400">
                  {getSourceIcon(sc.source)}
                  <span>{sc.source}</span>
                </span>
                <span className="text-rose-400 font-mono text-[10px] font-semibold">
                  BLOCK
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detailed Demonstration Arena */}
      <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/25 space-y-6 shadow-xl">
        {/* Scenario Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ACTIVE LAB SCENARIO
              </span>
              <ThreatTypeBadge type={scenario.category} />
              <RiskBadge risk={scenario.riskLevel} />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              {scenario.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {scenario.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Target Tool Call</div>
              <div className="text-xs font-mono font-bold text-rose-400">{scenario.targetToolAttempt}</div>
            </div>
          </div>
        </div>

        {/* Input Raw Attack Vector Content */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
            <span>Inbound Attacker Payload ({scenario.source})</span>
            <span className="text-slate-400 font-mono text-[11px]">Simulated Ingestion</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#08090f] border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {scenario.sampleInput}
          </pre>
        </div>

        {/* DETECT • CONTROL • PROTECT Tri-Stage Workflow Runner */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center justify-between">
            <span>Execution Workflow: DETECT • CONTROL • PROTECT</span>
            <span className="text-slate-400">
              {simulationActive ? 'Simulation In Progress...' : 'Ready for Re-run'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stage 1: DETECT */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                activeStage === 'DETECT'
                  ? 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-500/40 shadow-xl'
                  : 'bg-slate-900/60 border-purple-500/25'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  STAGE 1
                </span>
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  DETECT
                </span>
              </div>

              <h3 className="text-xs font-bold text-white mb-1.5">
                {scenario.detectPhase.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {scenario.detectPhase.details}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Flagged Signals:</span>
                <div className="flex flex-wrap gap-1">
                  {scenario.detectPhase.signals.map((sig, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage 2: CONTROL */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                activeStage === 'CONTROL'
                  ? 'bg-violet-950/40 border-violet-400 ring-2 ring-violet-500/40 shadow-xl'
                  : 'bg-slate-900/60 border-violet-500/25'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  STAGE 2
                </span>
                <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  CONTROL
                </span>
              </div>

              <h3 className="text-xs font-bold text-white mb-1.5">
                {scenario.controlPhase.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {scenario.controlPhase.details}
              </p>

              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs font-mono text-rose-300">
                {scenario.controlPhase.action}
              </div>
            </div>

            {/* Stage 3: PROTECT */}
            <div
              className={`p-5 rounded-xl border transition-all ${
                activeStage === 'PROTECT' || activeStage === 'COMPLETE'
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  STAGE 3
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PROTECT
                </span>
              </div>

              <h3 className="text-xs font-bold text-white mb-1.5">
                {scenario.protectPhase.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {scenario.protectPhase.details}
              </p>

              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold">
                {scenario.protectPhase.result}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & Audit notification */}
        <div className="pt-4 border-t border-purple-500/15 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Simulated demonstration outcome • Zero data leakage</span>
          </div>

          {lastLoggedId && (
            <button
              onClick={onNavigateToLogs}
              className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1.5 bg-purple-600/20 px-3 py-1.5 rounded-lg border border-purple-500/30 cursor-pointer transition-colors"
            >
              <span>View Logged Event ({lastLoggedId}) in Audit Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

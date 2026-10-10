import React from 'react';
import { X, Shield, ArrowRight, Sparkles } from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNav: (page: string) => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose, onSelectNav }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d0f18] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/50 p-6 md:p-8 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-lg shadow-purple-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Agent Shield – DefenX
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PROJECT DEFENSE GUIDE
                </span>
              </div>
              <p className="text-sm text-purple-300 font-semibold tracking-wide">
                DETECT • CONTROL • PROTECT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="space-y-6 mt-6 text-sm">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-purple-950/40 via-violet-900/20 to-slate-900/40 border border-purple-500/20 rounded-xl p-4">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Project Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">Agent Shield – DefenX</strong> is an advanced, lightweight cybersecurity guardrail framework engineered specifically for autonomous AI agents. Unlike traditional firewalls that only monitor IP packets, DefenX addresses the new attack vectors of LLM agents: <strong>Prompt Injections</strong>, <strong>Unauthorized Tool Executions</strong>, and <strong>Sensitive Data Exfiltration</strong>.
            </p>
          </div>

          {/* Core Problem -> Solution Chain */}
          <div>
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
              The Threat Vector & Defense Hierarchy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30">
                <div className="text-rose-400 font-mono text-xs font-bold uppercase mb-1">Vector 1: Inbound Attack</div>
                <div className="text-white font-semibold mb-1">Prompt Injection</div>
                <p className="text-xs text-slate-400">
                  Adversary embeds jailbreaks or hidden instruction resets in prompts, emails, or scraped web text.
                </p>
                <div className="mt-3 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  DefenX Pillar: <span className="text-emerald-400 font-bold">DETECT</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30">
                <div className="text-amber-400 font-mono text-xs font-bold uppercase mb-1">Vector 2: Privilege Escalation</div>
                <div className="text-white font-semibold mb-1">Unauthorized Tool Usage</div>
                <p className="text-xs text-slate-400">
                  Agent is coerced into calling destructive tools like shell.exec, file deletion, or database drops.
                </p>
                <div className="mt-3 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  DefenX Pillar: <span className="text-emerald-400 font-bold">CONTROL</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <div className="text-purple-400 font-mono text-xs font-bold uppercase mb-1">Vector 3: Exfiltration</div>
                <div className="text-white font-semibold mb-1">Sensitive Data Leakage</div>
                <p className="text-xs text-slate-400">
                  Confidential PII, credentials, or AWS keys are exfiltrated to external webhooks or emails.
                </p>
                <div className="mt-3 text-xs font-semibold text-purple-400 flex items-center gap-1">
                  DefenX Pillar: <span className="text-emerald-400 font-bold">PROTECT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tri-Pillar Architecture */}
          <div>
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
              The Three Core Pillars (Motto: DETECT • CONTROL • PROTECT)
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-950/20 border border-purple-500/20">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-white">DETECT: Multi-Stage Inbound Inspection</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Analyzes user inputs, scraped HTML, and incoming emails using heuristic pattern matchers, entropy scanners, and regex signatures to uncover overt and covert jailbreaks before the LLM processes them.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-950/20 border border-purple-500/20">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-white">CONTROL: Runtime Decision Gate</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Intercepts every agent tool call in real-time. Enforces fine-grained permission schemas (Least Privilege) to guarantee that an LLM agent cannot trigger arbitrary shell commands, restricted filesystem traversal, or unapproved APIs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-950/20 border border-purple-500/20">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-white">PROTECT: Outbound DLP & Immutable Audit Trail</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Inspects all agent outputs and external HTTP calls. Redacts Social Security Numbers, credit cards, and cloud access keys, blocking data exfiltration and logging every event into a tamper-evident audit ledger.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Presentation Steps */}
          <div>
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">
              Recommended College Viva / Demo Sequence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => { onClose(); onSelectNav('dashboard'); }}
                className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                  Step 1: Dashboard Overview
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-slate-400 mt-1">
                  Show active metrics, defense score (98.6%), and the live threat distribution breakdown.
                </p>
              </button>

              <button
                onClick={() => { onClose(); onSelectNav('threat-detection'); }}
                className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                  Step 2: Threat Detection Module
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-slate-400 mt-1">
                  Load preset attacks (Jailbreak, Web Injection) and click "Analyze for Threats" to show live scanning.
                </p>
              </button>

              <button
                onClick={() => { onClose(); onSelectNav('decision-gate'); }}
                className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                  Step 3: Runtime Decision Gate
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-slate-400 mt-1">
                  Walk through the visual pipeline: Incoming Request ➔ Threat Detection ➔ Policy Check ➔ ALLOW/BLOCK.
                </p>
              </button>

              <button
                onClick={() => { onClose(); onSelectNav('scenarios'); }}
                className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-left transition-all group cursor-pointer"
              >
                <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between">
                  Step 4: Interactive Scenarios Lab
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-slate-400 mt-1">
                  Execute the 4 real-world attack scenarios and watch DETECT ➔ CONTROL ➔ PROTECT in action.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            DefenX Cybersecurity Framework • Client Prototype Ready
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            Start Exploring Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

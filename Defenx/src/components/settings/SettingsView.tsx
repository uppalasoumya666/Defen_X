import React, { useState } from 'react';
import { 
  Sliders, 
  Shield, 
  Terminal, 
  Check, 
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sensitivity, setSensitivity] = useState<'Standard' | 'Strict' | 'Paranoid'>('Strict');
  const [autoRedactPII, setAutoRedactPII] = useState(true);
  const [blockAllShell, setBlockAllShell] = useState(true);
  const [outboundAllowlistOnly, setOutboundAllowlistOnly] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-purple-400" />
            Security Policies & Guardrail Settings
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Configure agent runtime bounds, tool authorization schemas, and DLP filters
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Policies Saved & Applied' : 'Save Policy Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guardrail Sensitivity */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Guardrail Inspection Sensitivity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Calibrate heuristic threshold for prompt injection and evasion tokens
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
              {sensitivity}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['Standard', 'Strict', 'Paranoid'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSensitivity(level)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  sensitivity === level
                    ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{level}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {level === 'Standard' && 'Default tolerance'}
                  {level === 'Strict' && 'Recommended'}
                  {level === 'Paranoid' && 'Zero tolerance'}
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Strict Outbound DLP PII Redaction</div>
                <div className="text-[11px] text-slate-400">Scrub SSNs, credit cards, and API secrets from output</div>
              </div>
              <input
                type="checkbox"
                checked={autoRedactPII}
                onChange={(e) => setAutoRedactPII(e.target.checked)}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Block Arbitrary Shell Execution</div>
                <div className="text-[11px] text-slate-400">Disallow shell.execute, bash, and cmd tools universally</div>
              </div>
              <input
                type="checkbox"
                checked={blockAllShell}
                onChange={(e) => setBlockAllShell(e.target.checked)}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Cryptographic Outbound Egress Allowlist</div>
                <div className="text-[11px] text-slate-400">Block all HTTP fetch/webhook calls to unverified hosts</div>
              </div>
              <input
                type="checkbox"
                checked={outboundAllowlistOnly}
                onChange={(e) => setOutboundAllowlistOnly(e.target.checked)}
                className="w-4 h-4 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Tool Authorization Schema */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/15">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Tool Authorization Schema (Least Privilege)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explicit permission matrix controlling agent capability boundaries
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { tool: 'web_search', desc: 'Read-only public web search queries', status: 'ALLOWED', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { tool: 'document_parser', desc: 'Local PDF and text parsing in sandbox', status: 'ALLOWED', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              { tool: 'database_readonly_query', desc: 'SELECT queries on sanitized customer views', status: 'RESTRICTED', style: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
              { tool: 'fs.read_file', desc: 'Arbitrary filesystem read requests', status: 'SANDBOXED', style: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
              { tool: 'fs.write_file / fs.delete', desc: 'Filesystem modification or deletion', status: 'DENIED', style: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
              { tool: 'shell.execute / bash', desc: 'Arbitrary terminal command execution', status: 'BLOCKED', style: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
              { tool: 'email.send_external', desc: 'Outbound dispatch without human sign-off', status: 'BLOCKED', style: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
            ].map((t, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-purple-200">{t.tool}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{t.desc}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.style}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

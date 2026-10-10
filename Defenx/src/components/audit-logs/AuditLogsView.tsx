import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  X, 
  Copy, 
  Check
} from 'lucide-react';
import { AuditLogEntry, DecisionType, RiskLevel, ThreatType } from '../../types/security';
import { DecisionBadge, RiskBadge, ThreatTypeBadge } from '../common/Badge';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  selectedEvent: AuditLogEntry | null;
  onSelectEvent: (event: AuditLogEntry | null) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  selectedEvent,
  onSelectEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | DecisionType>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [threatFilter, setThreatFilter] = useState<'ALL' | ThreatType>('ALL');
  const [copied, setCopied] = useState(false);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.payloadSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.agentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDecision = decisionFilter === 'ALL' || log.decision === decisionFilter;
    const matchesRisk = riskFilter === 'ALL' || log.riskLevel === riskFilter;
    const matchesThreat = threatFilter === 'ALL' || log.threatType === threatFilter;

    return matchesSearch && matchesDecision && matchesRisk && matchesThreat;
  });

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Source', 'Threat Category', 'Risk Level', 'Decision', 'Reason', 'Agent ID'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.source}"`,
      `"${l.threatType}"`,
      `"${l.riskLevel}"`,
      `"${l.decision}"`,
      `"${l.reason.replace(/"/g, '""')}"`,
      `"${l.agentId}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `defenx_audit_logs_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `defenx_audit_logs_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-purple-400" />
            Audit Logs & Tamper-Evident Ledger
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Complete cryptographic event trail for all agent requests, evaluated policies, and runtime decisions
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-200 text-xs font-semibold border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-white text-xs font-semibold border border-purple-400/40 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0c0e18] border border-purple-500/20 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Event ID, reason, agent identifier, or payload text..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#08090f] border border-purple-500/25 focus:border-purple-400 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Decision Filter */}
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value as any)}
              className="bg-slate-900 border border-purple-500/30 text-purple-200 rounded-lg px-2.5 py-2 outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Decisions</option>
              <option value="ALLOW">ALLOW only</option>
              <option value="BLOCK">BLOCK only</option>
            </select>

            {/* Risk Level Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-slate-900 border border-purple-500/30 text-purple-200 rounded-lg px-2.5 py-2 outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>

            {/* Threat Category Filter */}
            <select
              value={threatFilter}
              onChange={(e) => setThreatFilter(e.target.value as any)}
              className="bg-slate-900 border border-purple-500/30 text-purple-200 rounded-lg px-2.5 py-2 outline-none font-medium cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Prompt Injection">Prompt Injection</option>
              <option value="Unauthorized Tool Request">Unauthorized Tool</option>
              <option value="Potential Data Leakage">Data Leakage</option>
              <option value="None (Benign)">Benign</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
          <span>Showing {filteredLogs.length} of {logs.length} audit records</span>
          {filteredLogs.length !== logs.length && (
            <button
              onClick={() => { setSearchQuery(''); setDecisionFilter('ALL'); setRiskFilter('ALL'); setThreatFilter('ALL'); }}
              className="text-purple-300 hover:text-purple-200 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="p-4 md:p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-500/20 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3">Event ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Request Type</th>
                <th className="py-3 px-3">Threat Category</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Decision</th>
                <th className="py-3 px-3">Reason for Decision</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => onSelectEvent(log)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-purple-300 group-hover:text-purple-200">
                    {log.id}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {log.source}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <ThreatTypeBadge type={log.threatType} />
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge risk={log.riskLevel} />
                  </td>
                  <td className="py-3 px-3">
                    <DecisionBadge decision={log.decision} />
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-sm truncate">
                    {log.reason}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(log);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all cursor-pointer"
                      title="Inspect event details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No matching security events found. Try adjusting your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0d0f18] border border-purple-500/30 rounded-2xl shadow-2xl p-6 text-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-purple-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-600 text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-mono">
                      Forensic Audit Entry: {selectedEvent.id}
                    </h2>
                    <DecisionBadge decision={selectedEvent.decision} />
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedEvent.timestamp} • Latency: {selectedEvent.durationMs}ms
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectEvent(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Threat Category</span>
                <span className="font-semibold text-white truncate block">{selectedEvent.threatType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Risk Level</span>
                <RiskBadge risk={selectedEvent.riskLevel} />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Agent Identifier</span>
                <span className="font-mono text-purple-300 truncate block">{selectedEvent.agentId}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Target Tool</span>
                <span className="font-mono text-rose-300 truncate block">{selectedEvent.targetTool || 'None'}</span>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Decision Justification & Rule Match
              </span>
              <p className="text-xs text-slate-200 bg-[#08090f] p-3 rounded-xl border border-purple-500/15 leading-relaxed">
                {selectedEvent.reason}
              </p>
            </div>

            {/* Payload summary */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Payload Summary
              </span>
              <div className="text-xs text-slate-300 bg-[#08090f] p-3 rounded-xl border border-slate-800 font-mono">
                {selectedEvent.payloadSummary}
              </div>
            </div>

            {/* Raw JSON Forensics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Raw Cryptographic Forensic Record (JSON)
                </span>
                <button
                  onClick={() => handleCopyJSON(selectedEvent.rawPayload)}
                  className="text-xs text-purple-300 hover:text-white inline-flex items-center gap-1 cursor-pointer font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-[#05060a] border border-slate-800 text-[11px] font-mono text-purple-200 overflow-x-auto max-h-48 leading-relaxed">
                {selectedEvent.rawPayload}
              </pre>
            </div>

            {/* Footer close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onSelectEvent(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

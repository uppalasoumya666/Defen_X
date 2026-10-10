import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Terminal, 
  Play, 
  Pause, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { AuditLogEntry, BlockedToolCall } from '../../types/security';
import { INITIAL_BLOCKED_TOOLS } from '../../data/mockData';
import { DecisionBadge, RiskBadge, ThreatTypeBadge } from '../common/Badge';

interface SecurityMonitoringViewProps {
  recentEvents: AuditLogEntry[];
  onSelectEvent: (event: AuditLogEntry) => void;
}

export const SecurityMonitoringView: React.FC<SecurityMonitoringViewProps> = ({
  recentEvents,
  onSelectEvent,
}) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [blockedTools] = useState<BlockedToolCall[]>(INITIAL_BLOCKED_TOOLS);
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>('ALL');

  // Simulated live event pulse counter
  const [livePulse, setLivePulse] = useState(0);

  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setLivePulse(prev => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredBlockedTools = selectedToolFilter === 'ALL'
    ? blockedTools
    : blockedTools.filter(t => t.toolName.toLowerCase().includes(selectedToolFilter.toLowerCase()));

  // Hourly traffic points for SVG chart (24-hour window)
  const trafficData = [
    { hour: '00:00', total: 420, blocked: 24 },
    { hour: '02:00', total: 310, blocked: 18 },
    { hour: '04:00', total: 280, blocked: 12 },
    { hour: '06:00', total: 540, blocked: 35 },
    { hour: '08:00', total: 980, blocked: 82 },
    { hour: '10:00', total: 1450, blocked: 140 },
    { hour: '12:00', total: 1680, blocked: 165 },
    { hour: '14:00', total: 1520, blocked: 130 },
    { hour: '16:00', total: 1780, blocked: 174 },
    { hour: '18:00', total: 1340, blocked: 110 },
    { hour: '20:00', total: 920, blocked: 78 },
    { hour: '22:00', total: 640, blocked: 45 },
  ];

  const maxTotal = Math.max(...trafficData.map(d => d.total));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-purple-400" />
            Security Monitoring & Live Telemetry
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time tracking of agent requests, blocked tool executions, and security event timelines (Simulated Data)
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveStreaming(prev => !prev)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-purple-600/30 text-purple-200 border-purple-400/50 shadow-sm shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {isLiveStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-purple-300" />
                <span>Streaming Live</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>Stream Paused</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inbound Request Volume vs Blocked Threat Volume (Custom SVG Interactive Chart) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                24-Hour Request Volume vs. Blocked Threats
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly throughput breakdown across agent API gateway
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                Total Requests
              </span>
              <span className="flex items-center gap-1.5 text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Blocked Threats
              </span>
            </div>
          </div>

          {/* SVG Bar / Area visualization */}
          <div className="h-56 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {trafficData.map((d, i) => {
              const heightPct = Math.round((d.total / maxTotal) * 100);
              const blockedPct = Math.max(8, Math.round((d.blocked / d.total) * 100 * 2));

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-slate-900 border border-purple-500/40 text-[10px] p-2 rounded-lg pointer-events-none shadow-xl text-center whitespace-nowrap">
                    <div className="font-bold text-white">{d.hour}</div>
                    <div className="text-slate-300">Total: {d.total}</div>
                    <div className="text-rose-400 font-bold">Blocked: {d.blocked}</div>
                  </div>

                  {/* Combined bar */}
                  <div className="w-full max-w-[28px] bg-slate-800/80 rounded-t-md overflow-hidden flex flex-col justify-end transition-all group-hover:bg-slate-700/80" style={{ height: `${heightPct}%` }}>
                    <div className="w-full bg-gradient-to-t from-violet-600 to-purple-500 flex-1" />
                    <div className="w-full bg-rose-500 shadow-sm" style={{ height: `${blockedPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2 px-2 text-[10px] font-mono text-slate-400">
            {trafficData.map((d, i) => (
              <span key={i} className="hidden sm:inline">{d.hour}</span>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Security Posture Gauges */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                Security Posture Gauges
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                OPTIMAL
              </span>
            </div>

            <div className="space-y-4">
              {/* Defense Efficiency */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Defense Interception Rate</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">98.6%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full" style={{ width: '98.6%' }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-400">Zero false-negative breaches recorded in current cycle</div>
              </div>

              {/* False Positive Rate */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">False Positive Anomaly</span>
                  <span className="font-mono font-bold text-purple-300 text-sm">0.8%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '0.8%' }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-400">Well below enterprise threshold of 2.0%</div>
              </div>

              {/* Mean Latency */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Mean Inspection Latency</span>
                  <span className="font-mono font-bold text-violet-300 text-sm">3.4 ms</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: '15%' }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-400">Zero overhead to agent conversation fluidity</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center pt-2 border-t border-purple-500/10">
            Active Guardrail Node: defenx-us-east-cluster
          </div>
        </div>
      </div>

      {/* Blocked Tool Calls Inspector Table */}
      <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-400" />
              Blocked Tool Calls Inspector
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Agent tool execution attempts intercepted by the Runtime Decision Gate
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter Tool:</span>
            <select
              value={selectedToolFilter}
              onChange={(e) => setSelectedToolFilter(e.target.value)}
              className="bg-slate-900 border border-purple-500/30 text-xs text-purple-200 rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="ALL">All Tools</option>
              <option value="shell">Shell / Bash</option>
              <option value="email">Email</option>
              <option value="fs">Filesystem</option>
              <option value="database">Database</option>
              <option value="http">HTTP / Webhook</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Intercept ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Agent Identifier</th>
                <th className="py-2.5 px-3">Target Tool</th>
                <th className="py-2.5 px-3">Attempted Parameters</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Prevention Rule</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredBlockedTools.map((call) => (
                <tr key={call.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-purple-300">{call.id}</td>
                  <td className="py-3 px-3 text-slate-400">{call.timestamp}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{call.agentId}</td>
                  <td className="py-3 px-3 text-rose-400 font-bold">{call.toolName}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate font-sans">
                    {JSON.stringify(call.attemptedParameters)}
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge risk={call.riskLevel} />
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">{call.preventionRule}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      {call.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Security Events & Suspicious Request History */}
      <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Security Events & Suspicious Request History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live chronological stream of flagged agent interactions and decision states (Simulated Data)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Events Ingested: {recentEvents.length + livePulse}</span>
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {recentEvents.slice(0, 6).map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-purple-300">{event.id}</span>
                  <ThreatTypeBadge type={event.threatType} />
                  <RiskBadge risk={event.riskLevel} />
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {event.timestamp}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                    {event.source}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium truncate">
                  {event.payloadSummary}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {event.reason}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <DecisionBadge decision={event.decision} />
                <span className="text-slate-400 group-hover:text-purple-300 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

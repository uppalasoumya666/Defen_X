import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  GitBranch, 
  Activity, 
  FileText, 
  Sliders, 
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';

export type NavItemKey = 
  | 'dashboard'
  | 'threat-detection'
  | 'decision-gate'
  | 'monitoring'
  | 'audit-logs'
  | 'scenarios'
  | 'settings';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  blockedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  blockedCount,
}) => {
  const navItems = [
    {
      key: 'dashboard' as NavItemKey,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'System overview & telemetry',
    },
    {
      key: 'threat-detection' as NavItemKey,
      label: 'Threat Detection',
      icon: ShieldAlert,
      badge: 'Analyze',
      description: 'Input prompt & token scanner',
    },
    {
      key: 'decision-gate' as NavItemKey,
      label: 'Runtime Decision Gate',
      icon: GitBranch,
      badge: 'Pipeline',
      description: 'ALLOW / BLOCK visual workflow',
    },
    {
      key: 'monitoring' as NavItemKey,
      label: 'Security Monitoring',
      icon: Activity,
      badge: 'Live',
      description: 'Tool calls & event feed',
    },
    {
      key: 'audit-logs' as NavItemKey,
      label: 'Audit Logs',
      icon: FileText,
      badge: null,
      description: 'Forensics & tamper-proof ledger',
    },
    {
      key: 'scenarios' as NavItemKey,
      label: 'Attack Scenarios Lab',
      icon: Flame,
      badge: '4 Demos',
      description: 'Interactive DETECT • CONTROL • PROTECT',
    },
    {
      key: 'settings' as NavItemKey,
      label: 'Settings & Policies',
      icon: Sliders,
      badge: null,
      description: 'Guardrail tuning & tool rules',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0a0c14] border-r border-purple-500/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-10`}
      >
        {/* Top brand section in mobile */}
        <div className="p-4 border-b border-purple-500/10 lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Agent Shield – DefenX</div>
              <div className="text-[10px] text-purple-400 font-mono">DETECT • CONTROL • PROTECT</div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Security Core
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-white border border-purple-500/40 shadow-sm shadow-purple-600/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                          : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-4 border-t border-purple-500/15 bg-[#08090f]/70">
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Blocked Threats</span>
              <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                {blockedCount} Total
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Guardrails Synchronized (v2.4)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

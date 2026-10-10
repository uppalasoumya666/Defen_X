import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavItemKey } from './components/layout/Sidebar';
import { DemoBanner } from './components/common/DemoBanner';
import { PresentationModal } from './components/common/PresentationModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ThreatDetectionView } from './components/threat-detection/ThreatDetectionView';
import { DecisionGateView } from './components/decision-gate/DecisionGateView';
import { SecurityMonitoringView } from './components/monitoring/SecurityMonitoringView';
import { AuditLogsView } from './components/audit-logs/AuditLogsView';
import { DemoScenariosView } from './components/scenarios/DemoScenariosView';
import { SettingsView } from './components/settings/SettingsView';
import { INITIAL_AUDIT_LOGS, INITIAL_SYSTEM_STATS } from './data/mockData';
import { AuditLogEntry, SystemStats, ThreatAnalysisResult } from './types/security';
import { convertAnalysisToAuditEntry } from './utils/securityEngine';

export function App() {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [defenseStatus, setDefenseStatus] = useState(true);

  // Core Data States
  const [stats, setStats] = useState<SystemStats>(INITIAL_SYSTEM_STATS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [selectedEvent, setSelectedEvent] = useState<AuditLogEntry | null>(null);

  // Active scenario selection from dashboard
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scenario-web-indirect-injection');

  // Payload passed from Threat Detection to Decision Gate
  const [forwardedToGatePayload, setForwardedToGatePayload] = useState<ThreatAnalysisResult | null>(null);

  // Handle new threat scan
  const handleAppendAuditLog = (result: ThreatAnalysisResult) => {
    const newEntry = convertAnalysisToAuditEntry(result);
    setAuditLogs(prev => [newEntry, ...prev]);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalAnalyzed: prev.totalAnalyzed + 1,
      suspiciousDetected: result.status !== 'Safe' ? prev.suspiciousDetected + 1 : prev.suspiciousDetected,
      unauthorizedBlocked: result.decision === 'BLOCK' ? prev.unauthorizedBlocked + 1 : prev.unauthorizedBlocked,
      dataLeaksPrevented: result.threatType === 'Potential Data Leakage' ? prev.dataLeaksPrevented + 1 : prev.dataLeaksPrevented,
    }));
  };

  const handleAppendScenarioLog = (entry: AuditLogEntry) => {
    setAuditLogs(prev => [entry, ...prev]);
    setStats(prev => ({
      ...prev,
      totalAnalyzed: prev.totalAnalyzed + 1,
      suspiciousDetected: prev.suspiciousDetected + 1,
      unauthorizedBlocked: prev.unauthorizedBlocked + 1,
      dataLeaksPrevented: entry.threatType === 'Potential Data Leakage' ? prev.dataLeaksPrevented + 1 : prev.dataLeaksPrevented,
    }));
  };

  const handleSendToDecisionGate = (result: ThreatAnalysisResult) => {
    setForwardedToGatePayload(result);
    setActiveTab('decision-gate');
  };

  const handleLaunchScenarioFromDashboard = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setActiveTab('scenarios');
  };

  return (
    <div className="min-h-screen bg-[#08090e] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Demo Disclaimer Banner */}
      <DemoBanner onOpenTour={() => setIsTourOpen(true)} />

      {/* Main Top Navigation Header */}
      <Navbar
        onOpenTour={() => setIsTourOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        defenseStatus={defenseStatus}
        onToggleDefenseStatus={() => setDefenseStatus(prev => !prev)}
      />

      {/* App Body with Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          blockedCount={stats.unauthorizedBlocked}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto px-4 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              recentLogs={auditLogs}
              onNavigate={setActiveTab}
              onSelectEvent={(event) => {
                setSelectedEvent(event);
                setActiveTab('audit-logs');
              }}
              onLaunchScenario={handleLaunchScenarioFromDashboard}
            />
          )}

          {activeTab === 'threat-detection' && (
            <ThreatDetectionView
              onSendToDecisionGate={handleSendToDecisionGate}
              onAppendAuditLog={handleAppendAuditLog}
            />
          )}

          {activeTab === 'decision-gate' && (
            <DecisionGateView
              initialPayload={forwardedToGatePayload}
              onSendToAuditLog={handleAppendAuditLog}
            />
          )}

          {activeTab === 'monitoring' && (
            <SecurityMonitoringView
              recentEvents={auditLogs}
              onSelectEvent={(event) => {
                setSelectedEvent(event);
                setActiveTab('audit-logs');
              }}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogsView
              logs={auditLogs}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
          )}

          {activeTab === 'scenarios' && (
            <DemoScenariosView
              key={activeScenarioId}
              initialScenarioId={activeScenarioId}
              onAppendAuditLog={handleAppendScenarioLog}
              onNavigateToLogs={() => setActiveTab('audit-logs')}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* College Project Presentation & Defense Modal */}
      <PresentationModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectNav={(page) => {
          setActiveTab(page as NavItemKey);
          setIsTourOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;

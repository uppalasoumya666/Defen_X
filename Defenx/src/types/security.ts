export type ThreatStatus = 'Safe' | 'Suspicious' | 'Malicious';

export type ThreatType = 
  | 'Prompt Injection' 
  | 'Unauthorized Tool Request' 
  | 'Potential Data Leakage' 
  | 'None (Benign)';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type DecisionType = 'ALLOW' | 'BLOCK';

export type RequestSource = 'AI Prompt' | 'Email' | 'Website Scrape' | 'Document' | 'Tool Output' | 'API Payload';

export interface ThreatAnalysisResult {
  id: string;
  timestamp: string;
  source: RequestSource;
  rawContent: string;
  status: ThreatStatus;
  threatType: ThreatType;
  riskLevel: RiskLevel;
  confidenceScore: number; // 0 - 100
  explanation: string;
  recommendedAction: string;
  highlightedIndicators: string[];
  suggestedToolInterception?: string;
  piiDetected?: string[];
  decision: DecisionType;
  policyViolated?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  source: RequestSource;
  threatType: ThreatType;
  riskLevel: RiskLevel;
  decision: DecisionType;
  reason: string;
  agentId: string;
  targetTool?: string;
  payloadSummary: string;
  rawPayload: string;
  policyId?: string;
  durationMs: number;
}

export interface SecurityPolicy {
  id: string;
  code: string;
  name: string;
  category: 'Prompt Injection' | 'Tool Authorization' | 'Data Protection' | 'Network Egress';
  description: string;
  enabled: boolean;
  strictness: 'Standard' | 'Strict' | 'Paranoid';
  actionOnTrigger: 'BLOCK' | 'QUARANTINE' | 'ALERT';
}

export interface BlockedToolCall {
  id: string;
  timestamp: string;
  agentId: string;
  toolName: string;
  attemptedParameters: Record<string, any>;
  riskLevel: RiskLevel;
  preventionRule: string;
  status: 'Intercepted & Blocked' | 'Quarantined';
}

export interface AttackScenario {
  id: string;
  title: string;
  subtitle: string;
  category: ThreatType;
  description?: string;
  riskLevel: RiskLevel;
  source: RequestSource;
  sampleInput: string;
  targetToolAttempt?: string;
  dataExfiltrationTarget?: string;
  detectPhase: {
    title: string;
    details: string;
    signals: string[];
  };
  controlPhase: {
    title: string;
    details: string;
    action: string;
  };
  protectPhase: {
    title: string;
    details: string;
    result: string;
  };
}

export interface SystemStats {
  totalAnalyzed: number;
  suspiciousDetected: number;
  unauthorizedBlocked: number;
  dataLeaksPrevented: number;
  threatDistribution: {
    promptInjection: number;
    unauthorizedTools: number;
    dataLeakage: number;
    benign: number;
  };
  defenseEfficiencyRate: number;
}

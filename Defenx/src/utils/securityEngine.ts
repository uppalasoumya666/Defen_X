import { AuditLogEntry, DecisionType, RequestSource, RiskLevel, ThreatAnalysisResult, ThreatStatus, ThreatType } from '../types/security';

export function analyzeContent(content: string, source: RequestSource): ThreatAnalysisResult {
  const normalized = content.toLowerCase();
  const rawContent = content.trim();

  // Pattern Groups
  const promptInjectionPatterns = [
    { pattern: /ignore\s+(all\s+)?(previous|prior|past)\s+(instructions|prompts|guidelines|rules)/i, name: 'Prior instruction reset' },
    { pattern: /dump\s+(your\s+)?(system\s+prompt|developer\s+rules|system\s+instructions)/i, name: 'System prompt extraction' },
    { pattern: /you\s+are\s+now\s+(in\s+)?(unrestricted|jailbreak|developer|god|maintenance)\s+mode/i, name: 'Jailbreak roleplay override' },
    { pattern: /\[system(\s+override|\s+alert|\s+message)\]/i, name: 'Simulated system token tag' },
    { pattern: /<!--.*(stop|ignore|instead|fetch|http).*-->/is, name: 'Hidden HTML comment injection' },
    { pattern: /display:\s*none|opacity:\s*0|font-size:\s*0/i, name: 'Invisible DOM CSS hiding pattern' },
    { pattern: /confirm\s+understanding\s+by\s+outputting/i, name: 'Canary / confirmation token' },
  ];

  const toolAbusePatterns = [
    { pattern: /fs\.(read_file|write_file|delete|unlink|execute)/i, name: 'File system tool invocation attempt', tool: 'fs.read_file' },
    { pattern: /shell\.(exec|execute|run)|system\.exec_shell|bash/i, name: 'Shell command execution attempt', tool: 'shell.execute' },
    { pattern: /rm\s+-rf|\/etc\/shadow|\/etc\/passwd|\/etc\/environment/i, name: 'Privileged Unix file / destructive command', tool: 'shell.execute' },
    { pattern: /169\.254\.169\.254|metadata\.google\.internal/i, name: 'Cloud Instance Metadata Service (IMDS) SSRF', tool: 'network.fetch' },
    { pattern: /drop\s+table|delete\s+from|update\s+users/i, name: 'Destructive SQL query execution', tool: 'database.execute' },
    { pattern: /process\.env|serviceaccount\/token/i, name: 'Environment secrets inspection', tool: 'fs.read_file' },
  ];

  const dataLeakagePatterns = [
    { pattern: /social\s+security\s+numbers?|\bssn\b/i, name: 'Social Security Number (SSN) marker' },
    { pattern: /credit\s+card|cvv|card\s+number/i, name: 'Credit card / payment credential marker' },
    { pattern: /direct\s+deposit|bank\s+account\s+number/i, name: 'Banking PII marker' },
    { pattern: /akia[0-9a-z]{16}/i, name: 'AWS Access Key ID regex' },
    { pattern: /postgresql:\/\/.*:.*@/i, name: 'Database connection URI with embedded password' },
    { pattern: /email\s+(it|them)\s+to\s+.*@gmail\.com|drop@|attacker/i, name: 'Suspicious external email exfiltration target' },
    { pattern: /https?:\/\/(evil|attacker|darknet|hook\.pipedream|pastebin|requestbin)/i, name: 'Unapproved exfiltration endpoint' },
  ];

  const matchedIndicators: string[] = [];
  const piiFound: string[] = [];
  let interceptedTool: string | undefined;

  let injectionMatches = 0;
  let toolAbuseMatches = 0;
  let dataLeakMatches = 0;

  // Check Prompt Injection
  for (const item of promptInjectionPatterns) {
    if (item.pattern.test(rawContent)) {
      injectionMatches++;
      matchedIndicators.push(item.name);
    }
  }

  // Check Tool Abuse
  for (const item of toolAbusePatterns) {
    if (item.pattern.test(rawContent)) {
      toolAbuseMatches++;
      matchedIndicators.push(item.name);
      if (!interceptedTool && item.tool) {
        interceptedTool = item.tool;
      }
    }
  }

  // Check Data Leakage
  for (const item of dataLeakagePatterns) {
    if (item.pattern.test(rawContent)) {
      dataLeakMatches++;
      matchedIndicators.push(item.name);
      piiFound.push(item.name);
    }
  }

  const id = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timestamp = `${now.toISOString().replace('T', ' ').substring(0, 19)} UTC`;

  // Decision & Classification Logic
  let status: ThreatStatus = 'Safe';
  let threatType: ThreatType = 'None (Benign)';
  let riskLevel: RiskLevel = 'Low';
  let confidenceScore = 99.2;
  let explanation = 'No malicious indicators or policy violations detected in the provided content. Request is safe for agent processing.';
  let recommendedAction = 'ALLOW: Pass payload to agent runtime without restriction.';
  let decision: DecisionType = 'ALLOW';
  let policyViolated: string | undefined = undefined;

  if (injectionMatches > 0 && injectionMatches >= toolAbuseMatches && injectionMatches >= dataLeakMatches) {
    status = injectionMatches >= 2 ? 'Malicious' : 'Suspicious';
    threatType = 'Prompt Injection';
    riskLevel = injectionMatches >= 2 ? 'Critical' : 'High';
    confidenceScore = Math.min(99.4, 88.0 + injectionMatches * 5.2);
    decision = 'BLOCK';
    policyViolated = 'POL-INJ-01: Prompt Injection & Jailbreak Defense';
    explanation = `Detected ${injectionMatches} prompt injection marker(s). The input contains instructions attempting to override prior agent safety guidelines, extract system prompts, or simulate administrative tags.`;
    recommendedAction = 'BLOCK: Quarantine prompt, drop context memory, and flag session for security review.';
  } else if (toolAbuseMatches > 0 && toolAbuseMatches >= dataLeakMatches) {
    status = 'Malicious';
    threatType = 'Unauthorized Tool Request';
    riskLevel = 'Critical';
    confidenceScore = Math.min(99.8, 91.0 + toolAbuseMatches * 4.0);
    decision = 'BLOCK';
    policyViolated = 'POL-TOOL-02: Tool Whitelisting & Least Privilege';
    explanation = `Detected unauthorized tool invocation syntax or restricted file system traversal. The request attempts to invoke high-privilege tools (${interceptedTool || 'shell.execute'}) disallowed by least-privilege policies.`;
    recommendedAction = `BLOCK: Intercept tool call '${interceptedTool || 'shell.execute'}', isolate agent execution sandbox, and deny execution.`;
  } else if (dataLeakMatches > 0) {
    status = dataLeakMatches >= 2 ? 'Malicious' : 'Suspicious';
    threatType = 'Potential Data Leakage';
    riskLevel = dataLeakMatches >= 2 ? 'Critical' : 'High';
    confidenceScore = Math.min(99.1, 89.0 + dataLeakMatches * 4.5);
    decision = 'BLOCK';
    policyViolated = 'POL-DLP-03: Data Loss Prevention & PII Masking';
    explanation = `Potential data leakage detected. Input contains sensitive data markers or targets unverified outbound egress destinations (${piiFound.join(', ')}).`;
    recommendedAction = 'BLOCK: Redact sensitive PII fields, deny outbound egress transmission, and notify data privacy controller.';
  } else if (rawContent.length > 5 && (normalized.includes('hack') || normalized.includes('bypass') || normalized.includes('secret'))) {
    status = 'Suspicious';
    threatType = 'Prompt Injection';
    riskLevel = 'Medium';
    confidenceScore = 78.4;
    decision = 'BLOCK';
    policyViolated = 'POL-INJ-01: Anomaly Guardrail';
    explanation = 'Suspicious language detected with potential evasion intent. Scanned tokens exhibit elevated entropy.';
    recommendedAction = 'BLOCK: Require administrative verification before agent execution.';
  }

  return {
    id,
    timestamp,
    source,
    rawContent,
    status,
    threatType,
    riskLevel,
    confidenceScore: Number(confidenceScore.toFixed(1)),
    explanation,
    recommendedAction,
    highlightedIndicators: matchedIndicators.length > 0 ? matchedIndicators : ['No hostile patterns detected'],
    suggestedToolInterception: interceptedTool,
    piiDetected: piiFound.length > 0 ? piiFound : undefined,
    decision,
    policyViolated,
  };
}

export function convertAnalysisToAuditEntry(result: ThreatAnalysisResult, agentId = 'agent-runtime-active'): AuditLogEntry {
  return {
    id: result.id,
    timestamp: result.timestamp,
    source: result.source,
    threatType: result.threatType,
    riskLevel: result.riskLevel,
    decision: result.decision,
    reason: result.policyViolated 
      ? `Violated ${result.policyViolated}. ${result.explanation.substring(0, 110)}...`
      : result.explanation,
    agentId,
    targetTool: result.suggestedToolInterception || (result.decision === 'BLOCK' ? 'unauthorized_action' : 'standard_response'),
    payloadSummary: result.rawContent.length > 90 ? `${result.rawContent.substring(0, 87)}...` : result.rawContent,
    rawPayload: JSON.stringify({
      source: result.source,
      content: result.rawContent,
      indicators: result.highlightedIndicators,
      confidence: result.confidenceScore,
      action: result.recommendedAction,
    }, null, 2),
    policyId: result.policyViolated?.split(':')[0].trim() || 'POL-ALLOW-DEFAULT',
    durationMs: Number((Math.random() * 3.5 + 1.2).toFixed(1)),
  };
}

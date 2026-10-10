import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  FileText, 
  Mail, 
  Globe, 
  Terminal
} from 'lucide-react';
import { RequestSource, ThreatAnalysisResult } from '../../types/security';
import { PRESET_INPUTS } from '../../data/mockData';
import { analyzeContent } from '../../utils/securityEngine';
import { DecisionBadge, RiskBadge, StatusBadge, ThreatTypeBadge } from '../common/Badge';

interface ThreatDetectionViewProps {
  onSendToDecisionGate: (result: ThreatAnalysisResult) => void;
  onAppendAuditLog: (result: ThreatAnalysisResult) => void;
}

export const ThreatDetectionView: React.FC<ThreatDetectionViewProps> = ({
  onSendToDecisionGate,
  onAppendAuditLog,
}) => {
  const [sourceType, setSourceType] = useState<RequestSource>('AI Prompt');
  const [inputText, setInputText] = useState(PRESET_INPUTS[0].text);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [currentResult, setCurrentResult] = useState<ThreatAnalysisResult | null>(() => 
    analyzeContent(PRESET_INPUTS[0].text, 'AI Prompt')
  );
  const [copied, setCopied] = useState(false);
  const [logAddedNotice, setLogAddedNotice] = useState(false);

  const sourceTabs: { type: RequestSource; icon: React.ReactNode; label: string }[] = [
    { type: 'AI Prompt', icon: <Terminal className="w-4 h-4" />, label: 'AI Prompts' },
    { type: 'Email', icon: <Mail className="w-4 h-4" />, label: 'Email Content' },
    { type: 'Website Scrape', icon: <Globe className="w-4 h-4" />, label: 'Website Text' },
    { type: 'Document', icon: <FileText className="w-4 h-4" />, label: 'External Document' },
  ];

  const handleAnalyze = () => {
    if (!inputText.trim()) return;

    setIsScanning(true);
    setScanStep(1);

    // Multi-phase scanner simulation
    setTimeout(() => {
      setScanStep(2);
    }, 450);

    setTimeout(() => {
      setScanStep(3);
    }, 850);

    setTimeout(() => {
      const result = analyzeContent(inputText, sourceType);
      setCurrentResult(result);
      setIsScanning(false);
      setScanStep(0);
      onAppendAuditLog(result);
      setLogAddedNotice(true);
      setTimeout(() => setLogAddedNotice(false), 3500);
    }, 1250);
  };

  const handleLoadPreset = (preset: typeof PRESET_INPUTS[0]) => {
    setInputText(preset.text);
    setSourceType(preset.type);
    setCurrentResult(null);
  };

  const handleCopy = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/20">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            Threat Detection Module
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Rule-based input inspection scanning for Prompt Injections, Unauthorized Tool Invocations, and Data Leakage
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
            Engine: Rule-Based Guardrails (Simulated)
          </span>
        </div>
      </div>

      {/* Preset Quick-Load Buttons */}
      <div className="p-4 rounded-xl bg-[#0c0e18] border border-purple-500/20 space-y-2">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Quick Test Presets (Select to test common attack vectors):
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_INPUTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-900/30 text-purple-200 border border-purple-500/25 hover:border-purple-400/50 transition-all cursor-pointer font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main split: Input form vs Analysis Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Source Type Selector Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                Select Request Source Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sourceTabs.map((tab) => (
                  <button
                    key={tab.type}
                    onClick={() => setSourceType(tab.type)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      sourceType === tab.type
                        ? 'bg-purple-600/30 text-white border-purple-400/60 shadow-sm shadow-purple-600/20'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Input Content for Inspection
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{inputText.length} chars</span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                    title="Copy text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter AI prompt, paste email content, or input raw scraped website text here..."
                rows={9}
                className="w-full p-3.5 rounded-xl bg-[#08090f] border border-purple-500/25 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none text-slate-200 font-mono text-xs leading-relaxed resize-y placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleAnalyze}
              disabled={isScanning || !inputText.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>
                    {scanStep === 1 && 'Step 1/3: Token & Heuristic Inspection...'}
                    {scanStep === 2 && 'Step 2/3: Policy & Tool Rule Matching...'}
                    {scanStep === 3 && 'Step 3/3: Evaluating Decision Gate...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-purple-200" />
                  <span>Analyze for Threats</span>
                </>
              )}
            </button>

            {logAddedNotice && (
              <p className="mt-2 text-center text-xs text-emerald-400 font-mono animate-in fade-in">
                ✓ Auto-logged into tamper-evident Audit Log
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Analysis Result Card */}
        <div className="p-6 rounded-2xl bg-[#0c0e18] border border-purple-500/20 flex flex-col justify-between space-y-4">
          {isScanning ? (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-purple-600/20 border border-purple-400/40 animate-pulse">
                <RefreshCw className="w-8 h-8 text-purple-300 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-white">Running Multi-Stage Threat Analysis</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Scanning for prompt injections, regex credential patterns, and unauthorized tool invocation syntaxes.
                </p>
              </div>
            </div>
          ) : currentResult ? (
            <div className="space-y-4">
              {/* Top Result Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Status:</span>
                  <StatusBadge status={currentResult.status} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Risk:</span>
                  <RiskBadge risk={currentResult.riskLevel} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Gate:</span>
                  <DecisionBadge decision={currentResult.decision} />
                </div>
              </div>

              {/* Threat Type & Confidence */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Detected Threat Type</span>
                  <ThreatTypeBadge type={currentResult.threatType} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Detection Confidence</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {currentResult.confidenceScore}% Match
                  </span>
                </div>
                {currentResult.policyViolated && (
                  <div className="flex items-start justify-between text-xs pt-1 border-t border-slate-800">
                    <span className="text-slate-400 font-medium shrink-0 mr-2">Policy Rule</span>
                    <span className="font-mono text-rose-300 font-semibold text-right">
                      {currentResult.policyViolated}
                    </span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Explanation of Detected Issue
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#08090f] p-3 rounded-xl border border-purple-500/15">
                  {currentResult.explanation}
                </p>
              </div>

              {/* Highlighted Indicators */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Extracted Indicators of Compromise (IoC)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentResult.highlightedIndicators.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/15 text-purple-200 border border-purple-500/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Recommended Security Action
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentResult.recommendedAction}
                </p>
              </div>

              {/* Handoff to Decision Gate CTA */}
              <div className="pt-2">
                <button
                  onClick={() => onSendToDecisionGate(currentResult)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-200 hover:text-white font-semibold text-xs border border-purple-500/30 hover:border-purple-400/60 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Pass this payload to Runtime Decision Gate</span>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center space-y-3 text-center text-slate-500">
              <Zap className="w-10 h-10 text-slate-600" />
              <p className="text-xs max-w-xs">
                Enter or select a preset and click "Analyze for Threats" to review rule-based detection results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

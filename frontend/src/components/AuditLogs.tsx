import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ClipboardList, 
  Sliders, 
  Lock, 
  Save, 
  CheckCircle2,
  Clock,
  FileCheck
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'LOGS' | 'RULES'>('LOGS');

  // Rules state
  const [rules, setRules] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('onionsure_rules') || JSON.stringify({
        version: '2026.1',
        minDiameterMm: 45,
        maxDiameterMm: 65,
        reviewThreshold: 90,
        allowSproutingInGradeA: false,
        allowBlackMoldInGradeA: false,
        strictExportNeckSeal: true
      }));
    } catch {
      return {
        version: '2026.1',
        minDiameterMm: 45,
        maxDiameterMm: 65,
        reviewThreshold: 90,
        allowSproutingInGradeA: false,
        allowBlackMoldInGradeA: false,
        strictExportNeckSeal: true
      };
    }
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const saveRules = () => {
    localStorage.setItem('onionsure_rules', JSON.stringify(rules));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const sampleAuditLogs = [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString(),
      event: 'ACTUATOR_DIVERT_TRIGGERED',
      details: 'Gate 1 deflected to BIN_1_GOOD (+45°)',
      entity: 'MG996R-SERVO',
      status: 'VERIFIED'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
      event: 'CNN_INFERENCE_EXECUTION',
      details: 'Sample #104: 56.4mm, Clean tunic, 98.4% Confidence',
      entity: 'EDGE-JETSON',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toLocaleTimeString(),
      event: 'ARUCO_OPTICAL_CALIBRATION',
      details: 'Ratio locked: 7.42 px/mm using reference marker 4x4_50',
      entity: 'VISION-CAM-1',
      status: 'CALIBRATED'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
      event: 'CERTIFICATE_GENERATED',
      details: 'Lot BATCH-TN-7821 signed with SHA-256 integrity seal',
      entity: 'LEDGER-ENGINE',
      status: 'SEALED'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toLocaleTimeString(),
      event: 'OFFICER_SESSION_AUTHENTICATED',
      details: 'Officer K. Murugesan logged into Trichy APMC terminal',
      entity: 'AUTH-SUBSYSTEM',
      status: 'AUTHENTICATED'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-6 border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="chip chip-good text-xs font-black tracking-wider mb-1">
              AUDITABILITY & DETERMINISTIC RULE GOVERNANCE
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Audit Trail & Procurement Grading Rules
            </h1>
            <p className="text-slate-300 text-sm mt-0.5">
              Strictly decoupled deterministic rule engine ensuring explainable decisions and tamper-evident logs.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#09130d] p-1 rounded-xl border border-emerald-950">
            <button
              onClick={() => setActiveSubTab('LOGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'LOGS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tamper-Proof Audit Trail
            </button>
            <button
              onClick={() => setActiveSubTab('RULES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'RULES' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grading Rule Profile
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'LOGS' ? (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-emerald-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Immutable Hardware & Inference Audit Trail
              </h3>
            </div>
            <span className="chip chip-cyan text-xs font-mono">APPEND-ONLY LEDGER</span>
          </div>

          <div className="space-y-3">
            {sampleAuditLogs.map((log, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#0b1610] border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <FileCheck size={16} />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white flex items-center gap-2">
                      <span>{log.event}</span>
                      <span className="text-[10px] text-slate-500">• {log.entity}</span>
                    </div>
                    <div className="text-slate-400 mt-0.5">{log.details}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[11px]">
                  <span className="chip chip-good text-[10px]">{log.status}</span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card max-w-2xl mx-auto p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-emerald-400" />
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Procurement Grading Profile ({rules.version})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Configurable Specification</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="label">Rule Specification Version</label>
              <input
                className="field"
                value={rules.version}
                onChange={e => setRules({ ...rules, version: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Minimum Diameter (mm)</label>
                <input
                  type="number"
                  className="field font-mono"
                  value={rules.minDiameterMm}
                  onChange={e => setRules({ ...rules, minDiameterMm: +e.target.value })}
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Grade A threshold (default: 45mm)</span>
              </div>
              <div>
                <label className="label">Maximum Diameter (mm)</label>
                <input
                  type="number"
                  className="field font-mono"
                  value={rules.maxDiameterMm}
                  onChange={e => setRules({ ...rules, maxDiameterMm: +e.target.value })}
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Grade A threshold (default: 65mm)</span>
              </div>
            </div>

            <div>
              <label className="label">Confidence Threshold for Auto-Pass (%)</label>
              <input
                type="number"
                className="field font-mono"
                value={rules.reviewThreshold}
                onChange={e => setRules({ ...rules, reviewThreshold: +e.target.value })}
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Predictions below this trigger Manual Officer Review</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b1610] border border-emerald-950 space-y-2">
              <div className="font-bold text-slate-300">Mandatory Exclusion Criteria:</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Zero Sprouting Tolerance for Grade A (Automated diversion to Reject Bin)</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Zero Aspergillus Rot Tolerance (Immediate high-priority ejection)</span>
              </div>
            </div>

            <button
              onClick={saveRules}
              className="btn btn-primary w-full text-xs"
            >
              <Save size={14} /> Save Grading Rule Version
            </button>

            {savedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 text-center font-bold text-xs border border-emerald-800 animate-fade-in">
                ✓ Rule Version {rules.version} Saved to Local Storage
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

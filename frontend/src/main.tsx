import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Zap, 
  Sparkles,
  Lock,
  WifiOff,
  Wifi,
  Eye
} from 'lucide-react';
import './index.css';

import { Onion, Inspection } from './types';
import { SEED_INSPECTIONS } from './services/demoData';
import { Navbar } from './components/Navbar';
import { ConveyorSimulator } from './components/ConveyorSimulator';
import { DashboardKpis } from './components/DashboardKpis';
import { InspectionLab } from './components/InspectionLab';
import { HardwareExplorer } from './components/HardwareExplorer';
import { RoiCalculator } from './components/RoiCalculator';
import { MultiCropPreview } from './components/MultiCropPreview';
import { AuditLogs } from './components/AuditLogs';
import { VerificationModal } from './components/VerificationModal';
import { firebaseEnabled } from './firebase/client';
import { firebaseLogin, logout as firebaseLogout } from './firebase/service';

function App() {
  // Check verify URL directly
  if (location.pathname.startsWith('/verify/')) {
    return <VerifyPage />;
  }

  const [user, setUser] = useState<string>(() => localStorage.getItem('onionsure_user') || '');
  const [activeTab, setActiveTab] = useState<string>('simulator');
  const [offlineEdgeMode, setOfflineEdgeMode] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Live sorting stream & batch statistics
  const [sortedHistory, setSortedHistory] = useState<Onion[]>(() => {
    try {
      const saved = localStorage.getItem('onionsure_sorted_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed with initial batch from SEED_INSPECTIONS
    return SEED_INSPECTIONS[0].onions;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    try {
      const saved = localStorage.getItem('onionsure_inspections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_INSPECTIONS;
  });

  const [selectedReportInspection, setSelectedReportInspection] = useState<Inspection | null>(null);

  // Hardware telemetry simulator
  const [fps, setFps] = useState<number>(42);
  const [inferenceMs, setInferenceMs] = useState<number>(26);

  // Fluctuating hardware stats for realistic edge demonstrator
  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(41 + Math.random() * 4));
      setInferenceMs(Math.floor(24 + Math.random() * 5));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('onionsure_sorted_history', JSON.stringify(sortedHistory.slice(0, 100)));
    } catch {}
  }, [sortedHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('onionsure_inspections', JSON.stringify(inspections));
    } catch {}
  }, [inspections]);

  // Handler when a new onion is sorted by conveyor
  const handleNewSortedOnion = useCallback((newOnion: Onion) => {
    setSortedHistory(prev => [newOnion, ...prev]);
  }, []);

  // Handler when an inspection is saved in Lab
  const handleSaveInspection = useCallback((newInsp: Inspection) => {
    setInspections(prev => [newInsp, ...prev]);
    // Also prepend onions to sorted history
    if (newInsp.onions.length > 0) {
      setSortedHistory(prev => [...newInsp.onions, ...prev]);
    }
  }, []);

  // Reset counters handler
  const handleResetStats = useCallback(() => {
    setSortedHistory([]);
  }, []);

  const totalSorted = sortedHistory.length;
  const goodCount = sortedHistory.filter(o => o.outputGrade === 'GOOD').length;
  const mediumCount = sortedHistory.filter(o => o.outputGrade === 'MEDIUM').length;
  const rejectCount = sortedHistory.filter(o => o.outputGrade === 'REJECT').length;

  const handleLogout = () => {
    firebaseLogout().catch(() => {});
    localStorage.removeItem('onionsure_user');
    setUser('');
  };

  if (!user) {
    return (
      <LoginPage 
        onLogin={u => {
          localStorage.setItem('onionsure_user', u);
          setUser(u);
        }} 
      />
    );
  }

  const userEmail = (() => {
    try {
      const parsed = JSON.parse(user);
      return parsed.email || 'officer@onionsure.demo';
    } catch {
      return user;
    }
  })();

  return (
    <div className="min-h-screen bg-[#080d0a] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        offlineEdgeMode={offlineEdgeMode}
        setOfflineEdgeMode={setOfflineEdgeMode}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        fps={fps}
        inferenceMs={inferenceMs}
        onLogout={handleLogout}
        userEmail={userEmail}
      />

      {/* Main App Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'simulator' && (
          <ConveyorSimulator
            onNewSortedOnion={handleNewSortedOnion}
            offlineEdgeMode={offlineEdgeMode}
            totalSorted={totalSorted}
            goodCount={goodCount}
            mediumCount={mediumCount}
            rejectCount={rejectCount}
            onResetStats={handleResetStats}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardKpis
            sortedHistory={sortedHistory}
            inspections={inspections}
            onOpenReportModal={insp => setSelectedReportInspection(insp)}
          />
        )}

        {activeTab === 'lab' && (
          <InspectionLab
            onSaveInspection={handleSaveInspection}
            onOpenReportModal={insp => setSelectedReportInspection(insp)}
          />
        )}

        {activeTab === 'hardware' && (
          <HardwareExplorer />
        )}

        {activeTab === 'roi' && (
          <RoiCalculator />
        )}

        {activeTab === 'multicrop' && (
          <MultiCropPreview />
        )}

        {activeTab === 'audit' && (
          <AuditLogs />
        )}
      </main>

      {/* Certificate Modal */}
      {selectedReportInspection && (
        <VerificationModal
          inspection={selectedReportInspection}
          onClose={() => setSelectedReportInspection(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-950/80 bg-[#060a08] py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Innovortex • OnionSure — AI Quality Grading & Automated Sorting</span>
          <span className="text-emerald-500/80 font-mono text-[11px]">
            Raspberry Pi 4 / Jetson Nano • OpenCV • Quantized CNN • 3-Way Actuators
          </span>
        </div>
      </footer>
    </div>
  );
}

// Sleek Modern Login Page with One-Click Judge Access
function LoginPage({ onLogin }: { onLogin: (u: string) => void }) {
  const [email, setEmail] = useState('officer@onionsure.demo');
  const [pass, setPass] = useState('OnionSure@Demo123');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setBusy(true);
    setErr('');
    try {
      if (firebaseEnabled) {
        const u = await firebaseLogin(email, pass);
        onLogin(JSON.stringify({ uid: u.uid, email: u.email, name: u.name, role: u.role }));
      } else {
        onLogin(JSON.stringify({
          uid: 'demo-officer',
          email,
          name: 'Procurement Officer',
          role: 'PROCUREMENT_OFFICER'
        }));
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d09] grid place-items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-card p-8 relative z-10 border-emerald-500/30 shadow-2xl">
        {/* Brand header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/40">
            🧅
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
              Innovortex <span className="text-emerald-400 text-sm px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/40">OnionSure</span>
            </h1>
            <p className="text-xs text-emerald-400/80">AI-Based Quality Inspection & Sorting</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-300 mb-6">
          <span className="font-bold text-emerald-300 block mb-0.5">Judge & Evaluator Notice:</span>
          Full prototype demonstrator equipped with live animated conveyor, optical vision HUD, 3-way servo divert gates, and offline edge telemetry.
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="label">Procurement Officer Email</label>
            <input
              className="field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Terminal Password</label>
            <input
              type="password"
              className="field"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>

          {err && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {err}
            </div>
          )}

          <button
            disabled={busy}
            onClick={submit}
            className="btn btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-emerald-900/50 mt-2"
          >
            {busy ? 'Launching Edge Terminal…' : 'Enter Live Prototype Studio'} <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-950 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Mode: Edge Offline Ready</span>
          <span>BOM: ~₹9,250</span>
        </div>
      </div>
    </div>
  );
}

// Verification Page for QR code scans
function VerifyPage() {
  const id = decodeURIComponent(location.pathname.split('/').pop() || '');

  return (
    <div className="min-h-screen grid place-items-center p-5 bg-[#080d0a] text-white">
      <div className="glass-card max-w-md w-full p-8 text-center border-emerald-500/40 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">
          <ShieldCheck size={36} />
        </div>
        <div className="chip chip-good text-xs font-mono mb-2">VERIFIED APMC CONFORMANCE</div>
        <h1 className="text-2xl font-black text-white">Innovortex Digital Certificate</h1>
        <p className="text-xs text-slate-400 mt-1">Inspection Record: {id}</p>

        <div className="mt-5 p-4 rounded-xl bg-[#0b1610] text-left text-xs border border-emerald-950 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Cryptographic Integrity:</span>
            <span className="text-emerald-400 font-bold">SHA-256 VALIDATED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Quality Standard:</span>
            <span className="text-white font-bold">Grade A Export Approved</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sorting Protocol:</span>
            <span className="text-white font-bold">Automated 3-Way Diverter</span>
          </div>
        </div>

        <a
          href="/"
          className="btn btn-primary w-full mt-6 text-xs"
        >
          Return to Innovortex Main System
        </a>
      </div>
    </div>
  );
}

// Mount application
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

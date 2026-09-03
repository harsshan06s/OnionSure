import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Sliders, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Cpu, 
  Eye, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { Onion, OutputGrade, JudgePreset } from '../types';
import { JUDGE_PRESETS, generateRandomSample } from '../services/demoData';
import { soundFx } from '../services/audio';

interface ConveyorSimulatorProps {
  onNewSortedOnion: (onion: Onion) => void;
  offlineEdgeMode: boolean;
  totalSorted: number;
  goodCount: number;
  mediumCount: number;
  rejectCount: number;
  onResetStats: () => void;
}

interface ConveyorItem {
  onion: Onion;
  progress: number; // 0 to 100%
  id: number;
  stage: 'APPROACHING' | 'INSPECTION' | 'SORTING' | 'DROPPED';
}

export const ConveyorSimulator: React.FC<ConveyorSimulatorProps> = ({
  onNewSortedOnion,
  offlineEdgeMode,
  totalSorted,
  goodCount,
  mediumCount,
  rejectCount,
  onResetStats
}) => {
  // Conveyor engine states
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [conveyorSpeed, setConveyorSpeed] = useState<number>(1.2); // Speed multiplier
  const [items, setItems] = useState<ConveyorItem[]>([]);
  const [inspectedOnion, setInspectedOnion] = useState<Onion | null>(JUDGE_PRESETS[0] as unknown as Onion);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [activeGate, setActiveGate] = useState<1 | 2 | 3 | null>(1);
  const [servoAngle, setServoAngle] = useState<number>(45);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-good-1');
  const [showVisionOverlay, setShowVisionOverlay] = useState<boolean>(true);

  const nextIdRef = useRef<number>(101);
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const requestAnimRef = useRef<number | null>(null);

  // Function to spawn a specific or random onion onto conveyor
  const spawnOnion = useCallback((preset?: JudgePreset) => {
    let onion: Onion;
    if (preset) {
      onion = {
        id: nextIdRef.current++,
        diameterMm: preset.diameterMm,
        condition: preset.condition,
        confidence: preset.confidence,
        decision: preset.decision,
        outputGrade: preset.grade,
        reason: preset.reason,
        surfaceScore: preset.grade === 'GOOD' ? 95 : preset.grade === 'MEDIUM' ? 82 : 44,
        colorProfile: {
          hue: 'Crimson',
          rgbHex: preset.colorHex,
          uniformity: preset.grade === 'GOOD' ? 96 : 74
        },
        defectAreaPercent: preset.defectPercent,
        actuatorTarget: preset.actuatorGate === 1 ? 'BIN_1_GOOD' : preset.actuatorGate === 2 ? 'BIN_2_MEDIUM' : 'BIN_3_REJECT',
        servoAngle: preset.actuatorGate === 1 ? 45 : preset.actuatorGate === 2 ? 0 : -45
      };
    } else {
      onion = generateRandomSample(nextIdRef.current++);
    }

    setItems(prev => [...prev, {
      onion,
      progress: 0,
      id: onion.id,
      stage: 'APPROACHING'
    }]);
  }, []);

  // Main animation frame loop for conveyor movement
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isRunning) {
        // Automatically spawn onion periodically if auto-conveyor running
        const now = Date.now();
        const spawnInterval = 3200 / conveyorSpeed;
        if (now - lastSpawnTimeRef.current > spawnInterval) {
          spawnOnion();
          lastSpawnTimeRef.current = now;
        }

        // Advance positions of existing items
        setItems(prevItems => {
          const updated: ConveyorItem[] = [];

          for (const item of prevItems) {
            const newProgress = item.progress + (18 * conveyorSpeed * delta);

            // Stage 1: Crossing into inspection chamber (around 40% to 50%)
            if (item.progress < 45 && newProgress >= 45) {
              setInspectedOnion(item.onion);
              setFlashActive(true);
              soundFx.playCameraTrigger();
              setTimeout(() => setFlashActive(false), 250);

              // Predict actuator gate
              const gate = item.onion.outputGrade === 'GOOD' ? 1 : item.onion.outputGrade === 'MEDIUM' ? 2 : 3;
              const angle = gate === 1 ? 45 : gate === 2 ? 0 : -45;
              setActiveGate(gate);
              setServoAngle(angle);
              soundFx.playActuator();
              soundFx.playGradeTone(item.onion.outputGrade);
            }

            // Stage 2: Diverting into physical bins (at 90% progress)
            if (item.progress < 90 && newProgress >= 90) {
              onNewSortedOnion(item.onion);
            }

            // Keep until 100%
            if (newProgress < 100) {
              updated.push({
                ...item,
                progress: newProgress,
                stage: newProgress < 40 ? 'APPROACHING' : newProgress < 65 ? 'INSPECTION' : 'SORTING'
              });
            }
          }
          return updated;
        });
      }

      requestAnimRef.current = requestAnimationFrame(animate);
    };

    requestAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestAnimRef.current) cancelAnimationFrame(requestAnimRef.current);
    };
  }, [isRunning, conveyorSpeed, spawnOnion, onNewSortedOnion]);

  // Handle Judge Preset Click
  const handleSelectPreset = (preset: JudgePreset) => {
    setSelectedPresetId(preset.id);
    spawnOnion(preset);
  };

  // Keyboard shortcut: Space to drop next onion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        spawnOnion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spawnOnion]);

  const activeOnion = inspectedOnion || (JUDGE_PRESETS[0] as unknown as Onion);

  return (
    <div className="space-y-6">
      {/* Top Banner / Problem Statement Card */}
      <div className="glass-card p-4 sm:p-5 relative overflow-hidden border-emerald-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="chip chip-good text-[11px] font-black tracking-wider">
                INNOVORTEX HARDWARE PROTOTYPE PIPELINE
              </span>
              <span className="chip chip-cyan text-[11px] font-mono">
                {offlineEdgeMode ? 'LOCAL EDGE CNN RUNNING' : 'HYBRID TELEMETRY'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Conveyor & 3-Way Actuator Sorting Demonstrator
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Real-time physical simulation of the Innovortex 5-module flow: 
              <strong className="text-emerald-400"> Camera Capture</strong> → 
              <strong className="text-emerald-400"> Preprocessing</strong> → 
              <strong className="text-emerald-400"> CNN Visual Analysis</strong> → 
              <strong className="text-emerald-400"> Deterministic Grading Engine</strong> → 
              <strong className="text-emerald-400"> 3-Way Servo Sorting</strong> into dedicated bins.
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex items-center gap-3 bg-[#0a140e]/80 p-3 rounded-2xl border border-emerald-900/40">
            <div className="text-center px-3 border-r border-emerald-950">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Sorted</span>
              <span className="text-2xl font-black text-white font-mono">{totalSorted}</span>
            </div>
            <div className="text-center px-3 border-r border-emerald-950">
              <span className="text-[10px] font-bold text-emerald-400 block uppercase">🟢 Good</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{goodCount}</span>
            </div>
            <div className="text-center px-3 border-r border-emerald-950">
              <span className="text-[10px] font-bold text-amber-400 block uppercase">🟠 Med</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{mediumCount}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-red-400 block uppercase">🔴 Reject</span>
              <span className="text-2xl font-black text-red-400 font-mono">{rejectCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Physical Simulation Canvas & Vision HUD Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: The Interactive Animated Conveyor Belt & Bins */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-card p-5 relative overflow-hidden">
            {/* Header controls for conveyor */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-950">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span className="text-sm font-black text-slate-200 uppercase tracking-wider">
                  {isRunning ? 'Conveyor Active • 45 RPM' : 'Conveyor Paused'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`btn py-1.5 px-3 text-xs font-bold ${
                    isRunning ? 'btn-secondary text-amber-300' : 'btn-primary'
                  }`}
                >
                  {isRunning ? <><Pause size={14} /> Pause Belt</> : <><Play size={14} /> Run Belt</>}
                </button>

                <button
                  onClick={() => spawnOnion()}
                  className="btn btn-primary py-1.5 px-3 text-xs font-bold"
                  title="Or press Spacebar"
                >
                  <Zap size={14} /> Feed Onion
                </button>

                <button
                  onClick={onResetStats}
                  className="btn btn-outline py-1.5 px-2 text-xs"
                  title="Reset counters"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Visual Conveyor Track Canvas */}
            <div className="relative bg-[#070d09] rounded-2xl border-2 border-emerald-950 p-4 min-h-[300px] flex flex-col justify-between overflow-hidden shadow-inner">
              {/* Camera Inspection Chamber Structure (Located at 45% of width) */}
              <div className="absolute top-2 bottom-20 left-[40%] w-[20%] bg-[#132219]/90 border-2 border-cyan-500/50 rounded-xl z-20 pointer-events-none flex flex-col items-center justify-between p-2 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                {/* Camera Housing & Status LED */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-300 px-1 border-b border-cyan-900/60 pb-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Camera size={12} className="text-cyan-400" /> CAM-1
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                </div>

                {/* Controlled Lighting Chamber Notice (Challenge 1 in PDF) */}
                <div className="text-[9px] text-cyan-200/60 font-mono text-center uppercase tracking-widest leading-tight">
                  Enclosed<br />Light Box<br />5500K CRI95
                </div>

                {/* Laser scanline sweep */}
                <div className="laser-scanner-line"></div>

                {/* Optical Breakbeam Sensor */}
                <div className="w-full text-[9px] font-mono text-emerald-400 text-center bg-emerald-950/60 py-0.5 rounded border border-emerald-800/40">
                  IR TRIGGER: {items.some(i => i.stage === 'INSPECTION') ? 'TRIGGERED' : 'READY'}
                </div>
              </div>

              {/* Optical Strobe Flash Effect */}
              {flashActive && (
                <div className="absolute inset-0 bg-cyan-100/30 z-30 pointer-events-none flash-trigger"></div>
              )}

              {/* Belt Surface Track */}
              <div className="relative mt-8 mb-6">
                <div className="text-[10px] font-mono text-slate-500 mb-1 flex justify-between">
                  <span>◀ FEED HOPPER</span>
                  <span className="text-cyan-400 font-bold">INSPECTION ZONE (45mm-65mm)</span>
                  <span className="text-emerald-400 font-bold">ACTUATOR GATES ▶</span>
                </div>

                {/* The Animated Moving Belt */}
                <div className={`h-24 rounded-xl conveyor-belt-track ${isRunning ? (conveyorSpeed > 1.5 ? 'conveyor-belt-fast' : 'conveyor-belt-running') : ''} border border-emerald-900/40 relative shadow-2xl overflow-hidden`}>
                  {/* Guide rails */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-emerald-800/40 border-b border-emerald-700/20"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-800/40 border-t border-emerald-700/20"></div>

                  {/* Render Moving Onions along the belt */}
                  {items.map(item => {
                    const gradeColor = 
                      item.onion.outputGrade === 'GOOD' ? 'from-emerald-600 to-emerald-900 border-emerald-400' :
                      item.onion.outputGrade === 'MEDIUM' ? 'from-amber-600 to-amber-900 border-amber-400' :
                      'from-red-600 to-red-950 border-red-400';

                    return (
                      <div
                        key={item.id}
                        style={{
                          left: `${item.progress * 0.9}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          transition: 'left 0.05s linear'
                        }}
                        className="absolute z-10 flex flex-col items-center select-none cursor-pointer"
                        onClick={() => setInspectedOnion(item.onion)}
                      >
                        {/* Onion physical visual representation with real image */}
                        <div className={`w-14 h-14 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-lg relative transition-all hover:scale-110 bg-[#08110b] ${
                          item.onion.outputGrade === 'GOOD' ? 'border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                          item.onion.outputGrade === 'MEDIUM' ? 'border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                          'border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                        }`}>
                          <img 
                            src={item.onion.imageUrl || '/dataset/healthy_red.jpg'} 
                            alt="Onion" 
                            className="w-full h-full object-cover" 
                          />
                          {item.onion.condition === 'sprouted' && (
                            <span className="absolute -top-1 -right-1 text-xs bg-black/80 rounded-full px-0.5" title="Sprouted">🌱</span>
                          )}
                          {item.onion.condition === 'rotten' && (
                            <span className="absolute inset-0 bg-red-950/40 border border-red-500/50 flex items-center justify-center text-[10px]" title="Rotten">⚠️</span>
                          )}
                        </div>
                        {/* Mini ID & Grade Tag */}
                        <span className="text-[9px] font-mono font-black mt-1 px-1 bg-black/80 rounded text-slate-300 border border-slate-700">
                          #{item.onion.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actuator Diverter Mechanism & 3 Physical Bins */}
              <div className="mt-2 pt-3 border-t border-emerald-950">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Cpu size={14} className="text-emerald-400" />
                    3-WAY SERVO ACTUATOR GATES
                  </span>
                  <span className="text-[11px] text-cyan-300">
                    SERVO ANGLE: <strong className="text-white font-bold">{servoAngle}°</strong> | PULSE: 1500µs
                  </span>
                </div>

                {/* 3 Physical Bins Row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Bin 1: Good Grade A */}
                  <div className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                    activeGate === 1 
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'bg-[#0e1a12]/60 border-emerald-900/40'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} /> BIN 1: GOOD
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200">
                        +45°
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Grade A Export (45-65mm)</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-mono font-black text-emerald-300">{goodCount}</span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {totalSorted ? `${Math.round((goodCount / totalSorted) * 100)}%` : '0%'}
                      </span>
                    </div>
                    {/* Fill bar */}
                    <div className="h-1.5 bg-emerald-950 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${Math.min(100, (goodCount / Math.max(1, totalSorted)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bin 2: Medium Grade B / URS */}
                  <div className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                    activeGate === 2 
                      ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'bg-[#18140c]/60 border-amber-900/40'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                        <AlertTriangle size={13} /> BIN 2: MEDIUM
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200">
                        0°
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Grade B Domestic / Processing</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-mono font-black text-amber-300">{mediumCount}</span>
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        {totalSorted ? `${Math.round((mediumCount / totalSorted) * 100)}%` : '0%'}
                      </span>
                    </div>
                    {/* Fill bar */}
                    <div className="h-1.5 bg-amber-950 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${Math.min(100, (mediumCount / Math.max(1, totalSorted)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bin 3: Reject */}
                  <div className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                    activeGate === 3 
                      ? 'bg-red-950/80 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                      : 'bg-[#1a0e10]/60 border-red-900/40'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-red-400 flex items-center gap-1">
                        <XCircle size={13} /> BIN 3: REJECT
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-900/80 text-red-200">
                        -45°
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">Rotten / Sprouted / Damaged</div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-2xl font-mono font-black text-red-300">{rejectCount}</span>
                      <span className="text-[11px] font-mono text-red-400 font-bold">
                        {totalSorted ? `${Math.round((rejectCount / totalSorted) * 100)}%` : '0%'}
                      </span>
                    </div>
                    {/* Fill bar */}
                    <div className="h-1.5 bg-red-950 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-red-400 transition-all duration-300"
                        style={{ width: `${Math.min(100, (rejectCount / Math.max(1, totalSorted)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conveyor Speed Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#0b140f] p-3 rounded-xl border border-emerald-950">
              <div className="flex items-center gap-2">
                <Sliders size={14} className="text-emerald-400" />
                <span className="text-slate-300 font-bold">Conveyor Belt Speed:</span>
                <span className="font-mono text-emerald-400 font-bold">{conveyorSpeed.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { label: '0.8x Slow', val: 0.8 },
                  { label: '1.2x Normal', val: 1.2 },
                  { label: '2.0x Fast', val: 2.0 },
                  { label: '3.0x Turbo', val: 3.0 }
                ].map(s => (
                  <button
                    key={s.label}
                    onClick={() => setConveyorSpeed(s.val)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                      conveyorSpeed === s.val 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-emerald-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Judge Sample Selector Buttons (For Rapid Presentation) */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                Judge 1-Click Test Presets (Instant Demonstration)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Click sample to drop onto belt</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {JUDGE_PRESETS.map(preset => {
                const isSelected = selectedPresetId === preset.id;
                const badgeColor = 
                  preset.grade === 'GOOD' ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' :
                  preset.grade === 'MEDIUM' ? 'border-amber-500/50 bg-amber-950/40 text-amber-300' :
                  'border-red-500/50 bg-red-950/40 text-red-300';

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      isSelected 
                        ? 'border-emerald-400 bg-emerald-900/30 shadow-md' 
                        : 'border-emerald-950/80 bg-[#0d1611]/60 hover:border-emerald-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-black flex-shrink-0">
                        <img src={preset.imageUrl || '/dataset/healthy_red.jpg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${badgeColor}`}>
                        {preset.grade}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {preset.diameterMm}mm • {preset.condition}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Real-Time Optical AI Computer Vision HUD */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-card p-5 relative overflow-hidden border-cyan-500/30">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-950">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-cyan-400" />
                <span className="text-sm font-black text-white tracking-wide">
                  COMPUTER VISION INSPECTION HUD
                </span>
              </div>
              <button
                onClick={() => setShowVisionOverlay(!showVisionOverlay)}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900"
              >
                {showVisionOverlay ? 'AI OVERLAY: ON' : 'AI OVERLAY: OFF'}
              </button>
            </div>

            {/* Live Camera Frame Preview with Optical AI Bounding Box */}
            <div className="relative aspect-video rounded-2xl bg-black border-2 border-cyan-950 overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Camera metadata watermark */}
              <div className="absolute top-2 left-2 z-20 flex items-center gap-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded border border-cyan-800/40 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>FOV: 1080p @ 60FPS</span>
              </div>

              <div className="absolute top-2 right-2 z-20 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded border border-cyan-800/40 text-emerald-400">
                CNN INFERENCE: 26ms
              </div>

              {/* Strobe flash inside camera preview */}
              {flashActive && <div className="absolute inset-0 bg-white/40 z-30 flash-trigger"></div>}

              {/* Onion Visual Container with Real Dataset Photo */}
              <div className="relative w-44 h-44 rounded-2xl flex items-center justify-center p-2">
                {/* Visual Bulb with Real Dataset Photo */}
                <div className="w-36 h-36 rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-black relative flex items-center justify-center">
                  <img 
                    src={activeOnion.imageUrl || '/dataset/healthy_red.jpg'} 
                    alt="Inspected Onion" 
                    className="w-full h-full object-cover" 
                  />
                  {activeOnion.condition === 'sprouted' && (
                    <div className="absolute top-1 right-1 bg-emerald-500/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-300 shadow animate-bounce">
                      SPROUT DETECTED
                    </div>
                  )}
                  {activeOnion.condition === 'rotten' && (
                    <div className="absolute inset-0 bg-red-950/40 border border-red-500/50 flex items-center justify-center">
                      <span className="text-[10px] font-black text-red-300 bg-black/90 px-2 py-0.5 rounded border border-red-500">
                        BLACK MOLD ROT
                      </span>
                    </div>
                  )}
                </div>

                {/* AI Bounding Box & Segmentation Contour Overlay */}
                {showVisionOverlay && (
                  <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none transition-all ${
                    activeOnion.outputGrade === 'GOOD' ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                    activeOnion.outputGrade === 'MEDIUM' ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                    'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  }`}>
                    {/* Bounding box corners */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></div>

                    {/* Top Tag */}
                    <div className="absolute -top-6 left-0 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-cyan-800">
                      Ø {activeOnion.diameterMm} mm • {activeOnion.confidence}% CONF
                    </div>

                    {/* Crosshair Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none">
                      <div className="w-full h-0.5 bg-cyan-400 absolute top-1/2 -translate-y-1/2"></div>
                      <div className="h-full w-0.5 bg-cyan-400 absolute left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom camera HUD overlay */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span>DEFECT: <strong className="text-white">{activeOnion.defectAreaPercent || 0}%</strong></span>
                <span>COLOR: <strong className="text-white">{activeOnion.colorProfile?.hue || 'Red'}</strong></span>
                <span>SURFACE: <strong className="text-white">{activeOnion.surfaceScore || 90}/100</strong></span>
              </div>
            </div>

            {/* AI Decision & Grading Rule Engine Breakdown */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#09130d] border border-emerald-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  AI DECISION & PHYSICAL ACTUATION
                </span>
                <span className={`chip ${
                  activeOnion.outputGrade === 'GOOD' ? 'chip-good' :
                  activeOnion.outputGrade === 'MEDIUM' ? 'chip-medium' :
                  'chip-reject'
                }`}>
                  {activeOnion.outputGrade} ({activeOnion.decision})
                </span>
              </div>

              {/* Explainable Reasoning */}
              <p className="text-xs text-slate-300 leading-relaxed font-medium bg-[#0f1b13] p-2.5 rounded-lg border border-emerald-900/30">
                {activeOnion.reason}
              </p>

              {/* Physical Routing Command */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <ArrowRight size={14} className="text-cyan-400" />
                  ACTUATOR ROUTING:
                </span>
                <span className="font-black text-white px-2 py-0.5 rounded bg-emerald-900/80">
                  {activeOnion.actuatorTarget || (activeOnion.outputGrade === 'GOOD' ? 'BIN_1_GOOD' : activeOnion.outputGrade === 'MEDIUM' ? 'BIN_2_MEDIUM' : 'BIN_3_REJECT')}
                </span>
              </div>
            </div>

            {/* 2-Layer AI Architecture Breakdown (From PDF Page 2) */}
            <div className="mt-4 pt-3 border-t border-cyan-950/80 text-[11px] text-slate-400 space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-cyan-300 font-bold">
                <span>LAYER 1: Visual CNN Feature Extraction</span>
                <span>PASSED</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pl-2">
                <span>• Diameter Contour Fit:</span>
                <span className="text-white font-bold">{activeOnion.diameterMm} mm</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pl-2">
                <span>• Skin Texture & Necrosis:</span>
                <span className="text-white font-bold">{activeOnion.defectAreaPercent}% Area</span>
              </div>

              <div className="flex justify-between items-center text-emerald-300 font-bold pt-1">
                <span>LAYER 2: Deterministic Grading Rule</span>
                <span>APPLIED</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pl-2">
                <span>• Target Bin Allocation:</span>
                <span className="text-emerald-400 font-bold">{activeOnion.outputGrade} BIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

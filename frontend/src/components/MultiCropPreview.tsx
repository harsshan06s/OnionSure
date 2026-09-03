import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Cpu, 
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';
import { CROP_PROFILES } from '../services/demoData';
import { CropProfile, CropCategory } from '../types';

export const MultiCropPreview: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropCategory>('onion');

  const activeProfile = CROP_PROFILES.find(c => c.id === selectedCrop) || CROP_PROFILES[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-6 border-emerald-500/30">
        <div className="chip chip-cyan text-xs font-black tracking-wider mb-1">
          FUTURE SCALABILITY & EXPANDABLE ARCHITECTURE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Multi-Crop Agricultural Grading Platform
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl">
          Innovortex is designed from the ground up as an expandable platform. While optimized today for onions, the vision pipeline, lighting box, and 3-way sorting actuators seamlessly adapt to other high-volume horticulture crops like <strong>Potatoes</strong> and <strong>Tomatoes</strong> with zero mechanical redesign.
        </p>
      </div>

      {/* Crop Selector Tabs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {CROP_PROFILES.map(crop => {
          const isSelected = selectedCrop === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`glass-card p-5 text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : 'hover:border-emerald-700/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{crop.icon}</span>
                <span className={`chip text-[10px] font-mono font-bold ${
                  crop.status === 'ACTIVE' ? 'chip-good' :
                  crop.status === 'EXPERIMENTAL' ? 'chip-cyan' :
                  'chip-medium'
                }`}>
                  {crop.status}
                </span>
              </div>
              <div className="text-base font-black text-white">{crop.name}</div>
              <div className="text-xs text-slate-400 italic mt-0.5">{crop.botanicalName}</div>
            </button>
          );
        })}
      </div>

      {/* Deep-dive Specifications for Selected Crop */}
      <div className="glass-card p-6 space-y-6 border-emerald-500/20">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{activeProfile.icon}</span>
            <div>
              <h2 className="text-xl font-black text-white">
                {activeProfile.name} Specification Profile
              </h2>
              <span className="text-xs text-emerald-400 font-mono">
                Model: Quantized MobileNet-V3 Horticulture Engine
              </span>
            </div>
          </div>
          <span className="chip chip-good text-xs font-mono font-bold">
            100% ACTUATOR COMPATIBLE
          </span>
        </div>

        {/* Feature Specs Grid */}
        <div className="grid md:grid-cols-2 gap-5 text-xs">
          {/* Targeted Pathologies & Defects */}
          <div className="p-4 rounded-xl bg-[#0b1610] border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs">
              <Eye size={16} /> Targeted Pathologies & Defects
            </div>
            <p className="text-slate-300">
              The CNN classification pipeline detects the following specific defects for this crop:
            </p>
            <ul className="space-y-1.5 pt-1">
              {activeProfile.targetDefects.map((defect, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{defect}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grading Standards & Diverter Rules */}
          <div className="p-4 rounded-xl bg-[#0b1610] border border-emerald-900/50 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-black uppercase text-xs">
              <Sliders size={16} /> Deterministic Grading Rules
            </div>
            <p className="text-slate-300">
              Configurable grading thresholds governing 3-way servo diversion:
            </p>
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
              {activeProfile.gradingStandards}
            </div>
          </div>
        </div>

        {/* Optical Sensor & Lighting Chamber Adaptation */}
        <div className="p-4 rounded-xl bg-[#0e1c14] border border-emerald-800/40 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-black uppercase text-xs">
            <Cpu size={16} /> Optical Calibration & Lighting Box Tuning
          </div>
          <p className="text-slate-300">
            {activeProfile.sensorCalibration}
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span>Demonstrates that Innovortex is a hardware-agnostic platform capable of servicing multiple harvest seasons across diverse Indian agro-climatic zones.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

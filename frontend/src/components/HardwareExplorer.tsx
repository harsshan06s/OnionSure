import React from 'react';
import { 
  Cpu, 
  Camera, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  IndianRupee, 
  Zap, 
  WifiOff, 
  HardDrive, 
  AlertCircle,
  CheckCircle2,
  Box,
  Terminal,
  Activity
} from 'lucide-react';
import { HARDWARE_BOM } from '../services/demoData';

export const HardwareExplorer: React.FC = () => {
  const totalBOMCost = HARDWARE_BOM.reduce((acc, item) => acc + item.costInr, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-6 border-emerald-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="chip chip-good text-xs font-black tracking-wider mb-1">
              EDGE HARDWARE & SYSTEM ARCHITECTURE
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Low-Cost Portable Edge Architecture
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Innovortex is engineered specifically for rural mandis and farm gates. Rather than relying on cloud latency or prohibitive ₹20 Lakh+ industrial optical sorters, our edge system delivers sub-30ms sorting on low-cost hardware costing under <strong className="text-emerald-400">₹9,250 total</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#0a140e] p-3 rounded-2xl border border-emerald-900/50">
            <div className="text-center px-4 border-r border-emerald-950">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Innovortex Prototype BOM</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">₹{totalBOMCost.toLocaleString()}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Industrial Sorters</span>
              <span className="text-2xl font-black text-red-400 font-mono">₹20,00,000+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Stage Modular Pipeline Flow (from PDF Page 2 & Section 13) */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-950">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              6-Stage Technical Pipeline (Innovortex Flow)
            </h3>
            <p className="text-xs text-slate-400">Strict modular decoupling from image capture to physical sorting</p>
          </div>
          <span className="chip chip-cyan text-[10px] font-mono">FULLY MODULAR</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Module 1 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-cyan-800/40 relative">
            <div className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Module 1</div>
            <div className="text-sm font-black text-white mt-1">Image Capture</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              60 FPS macro camera inside enclosed 5500K CRI95 light box.
            </p>
          </div>

          {/* Module 2 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-cyan-800/40 relative">
            <div className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Module 2</div>
            <div className="text-sm font-black text-white mt-1">Preprocessing</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              Background removal, contour segmentation, OpenCV ArUco calibration.
            </p>
          </div>

          {/* Module 3 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-emerald-800/40 relative">
            <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Module 3</div>
            <div className="text-sm font-black text-white mt-1">Edge CNN Engine</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              Quantized INT8 MobileNet-V3 / YOLOv8 feature detection in 24ms.
            </p>
          </div>

          {/* Module 4 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-emerald-800/40 relative">
            <div className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Module 4</div>
            <div className="text-sm font-black text-white mt-1">Grading Engine</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              Deterministic rule engine converting features into Good / Medium / Reject.
            </p>
          </div>

          {/* Module 5 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-amber-800/40 relative">
            <div className="text-[10px] font-bold text-amber-400 uppercase font-mono">Module 5</div>
            <div className="text-sm font-black text-white mt-1">Physical Actuator</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              3-way MG996R servo gates diverts produce into dedicated bins.
            </p>
          </div>

          {/* Module 6 */}
          <div className="p-3.5 rounded-xl bg-[#0b1610] border border-cyan-800/40 relative">
            <div className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Module 6</div>
            <div className="text-sm font-black text-white mt-1">Dashboard & Audit</div>
            <p className="text-slate-400 mt-1 text-[11px] leading-snug">
              Real-time telemetry, local SQLite audit logs, and PDF verification.
            </p>
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-950">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <IndianRupee size={18} className="text-emerald-400" />
              Low-Cost Hardware Bill of Materials (BOM)
            </h3>
            <p className="text-xs text-slate-400">Total cost breakdown for building the hackathon physical prototype</p>
          </div>
          <span className="chip chip-good text-xs font-mono font-black">
            SAVINGS: 99.6% VS INDUSTRIAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-950 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">SUBSYSTEM</th>
                <th className="py-2.5 px-3">PROPOSED HARDWARE</th>
                <th className="py-2.5 px-3">FUNCTION & SPECIFICATION</th>
                <th className="py-2.5 px-3">PROTOTYPE COST (₹)</th>
                <th className="py-2.5 px-3 text-slate-500">INDUSTRIAL ALTERNATIVE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-medium">
              {HARDWARE_BOM.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-950/20 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                    <Box size={14} className="text-emerald-400" /> {item.component}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {item.model}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {item.role}
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-400 text-sm">
                    ₹{item.costInr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {item.industrialAlt}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-950/30 font-black text-white">
                <td colSpan={3} className="py-3 px-3 uppercase text-right tracking-wider">
                  Total Prototype Hardware Build:
                </td>
                <td className="py-3 px-3 font-mono text-emerald-300 text-base">
                  ₹{totalBOMCost.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-slate-400">
                  ~₹20,00,000+ (Typical commercial optical sorter)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* The 4 Major Engineering Challenges & Solutions (Directly from PDF Section 9) */}
      <div className="glass-card p-6">
        <div className="mb-4 pb-3 border-b border-emerald-950">
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-400" />
            Engineering Challenges & Innovortex Technical Solutions
          </h3>
          <p className="text-xs text-slate-400">How the prototype directly overcomes real-world agricultural constraints</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {/* Challenge 1 */}
          <div className="p-4 rounded-xl bg-[#0d1711] border border-emerald-900/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase text-[11px]">Challenge 1: Appearance Variability</span>
              <span className="chip chip-good text-[9px]">SOLVED</span>
            </div>
            <p className="text-slate-300">
              <strong>Issue:</strong> Field onions vary drastically in dust, loose tunic skin, and erratic outdoor lighting.
            </p>
            <p className="text-emerald-300 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <strong>Innovortex Solution:</strong> Controlled enclosed illumination chamber with dual-cross polarized LEDs + heavy HSV color jitter data augmentation during CNN training.
            </p>
          </div>

          {/* Challenge 2 */}
          <div className="p-4 rounded-xl bg-[#0d1711] border border-emerald-900/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase text-[11px]">Challenge 2: Speed vs. Hardware Cost</span>
              <span className="chip chip-good text-[9px]">SOLVED</span>
            </div>
            <p className="text-slate-300">
              <strong>Issue:</strong> GPU servers are too expensive and power-hungry for small rural mandis.
            </p>
            <p className="text-emerald-300 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <strong>Innovortex Solution:</strong> INT8 Post-Training Quantization (PTQ) + ONNX Runtime execution on Raspberry Pi 4 / Jetson Nano delivering 42 FPS at &lt;5W power consumption.
            </p>
          </div>

          {/* Challenge 3 */}
          <div className="p-4 rounded-xl bg-[#0d1711] border border-emerald-900/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase text-[11px]">Challenge 3: Limited Defect Datasets</span>
              <span className="chip chip-good text-[9px]">SOLVED</span>
            </div>
            <p className="text-slate-300">
              <strong>Issue:</strong> Public agricultural datasets lack subtle post-harvest diseases like soft neck rot or early apical emergence.
            </p>
            <p className="text-emerald-300 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <strong>Innovortex Solution:</strong> Transfer learning on InceptionV3 / MobileNet using regional farm partnership datasets (e.g. Karnataka & Maharashtra onion clusters).
            </p>
          </div>

          {/* Challenge 4 */}
          <div className="p-4 rounded-xl bg-[#0d1711] border border-emerald-900/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 uppercase text-[11px]">Challenge 4: Actuator Fatigue & Wear</span>
              <span className="chip chip-good text-[9px]">SOLVED</span>
            </div>
            <p className="text-slate-300">
              <strong>Issue:</strong> High-frequency sorting mechanisms can jam or fail under continuous produce flow.
            </p>
            <p className="text-emerald-300 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <strong>Innovortex Solution:</strong> Dual metal-gear servos with cushioned silicone contact paddles for the prototype, transitioning to industrial 24V solenoids rated for 2,000,000 cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

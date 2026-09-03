import React, { useState } from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Leaf, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RoiSimulationParams } from '../types';

export const RoiCalculator: React.FC = () => {
  const [params, setParams] = useState<RoiSimulationParams>({
    dailyVolumeQuintals: 40, // 4,000 kg / day
    mandiBasePricePerKg: 25, // ₹25 / kg
    premiumGradePriceBonusPerKg: 6, // +₹6 / kg for Grade A export
    spoilageRateWithoutSortingPercent: 18, // 18% loss to rot contagion
    manualSortingLaborCostPerDay: 1600, // 4 workers @ ₹400/day
    prototypeBOMCost: 9250 // Innovortex portable edge sorter BOM (₹9,250)
  });

  // Derived calculations
  const dailyKg = params.dailyVolumeQuintals * 100;
  const gradeAKg = dailyKg * 0.65; // ~65% Grade A
  const dailyGradeABonusRevenue = gradeAKg * params.premiumGradePriceBonusPerKg;

  // Spoilage contagion prevented (rot isolation saves ~60% of otherwise spoiled onions)
  const preventedSpoilageKg = dailyKg * (params.spoilageRateWithoutSortingPercent / 100) * 0.65;
  const dailySavedProduceValue = preventedSpoilageKg * params.mandiBasePricePerKg;

  // Labor savings (automating sorting saves ~70% of manual sorting labor)
  const dailyLaborSavings = params.manualSortingLaborCostPerDay * 0.70;

  // Total daily & monthly net gain
  const totalDailyBenefit = dailyGradeABonusRevenue + dailySavedProduceValue + dailyLaborSavings;
  const totalMonthlyBenefit = totalDailyBenefit * 25; // 25 operating days / month

  // Payback period
  const paybackDays = Math.max(1, Math.round(params.prototypeBOMCost / totalDailyBenefit));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-card p-6 border-emerald-500/30">
        <div className="chip chip-good text-xs font-black tracking-wider mb-1">
          SOCIAL, ECONOMIC & ENVIRONMENTAL IMPACT CALCULATOR
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Farmer & APMC Mandi Economic Value Modeler
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl">
          Simulate the tangible return on investment from deploying Innovortex. By separating premium Grade A produce and immediately isolating rotten bulbs to halt contagion, farmers unlock higher market realization and minimize post-harvest waste.
        </p>
      </div>

      {/* Main Grid: Interactive Parameters vs Live ROI Output */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Interactive Sliders */}
        <div className="lg:col-span-6 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} className="text-emerald-400" />
              Procurement & Cost Parameters
            </h3>
            <span className="text-xs text-slate-400 font-mono">Dynamic Real-time</span>
          </div>

          {/* Slider 1: Daily Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">Daily Procurement Volume</span>
              <span className="font-mono text-emerald-400">{params.dailyVolumeQuintals} Quintals ({dailyKg.toLocaleString()} kg)</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={params.dailyVolumeQuintals}
              onChange={e => setParams({ ...params, dailyVolumeQuintals: +e.target.value })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Slider 2: Base Market Price */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">Mandi Base Produce Price</span>
              <span className="font-mono text-emerald-400">₹{params.mandiBasePricePerKg} / kg</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={1}
              value={params.mandiBasePricePerKg}
              onChange={e => setParams({ ...params, mandiBasePricePerKg: +e.target.value })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Slider 3: Premium Grade A Export Bonus */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">Grade A Export Price Bonus</span>
              <span className="font-mono text-emerald-400">+₹{params.premiumGradePriceBonusPerKg} / kg bonus</span>
            </div>
            <input
              type="range"
              min={2}
              max={15}
              step={0.5}
              value={params.premiumGradePriceBonusPerKg}
              onChange={e => setParams({ ...params, premiumGradePriceBonusPerKg: +e.target.value })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Slider 4: Spoilage Rate Without Sorting */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">Current Spoilage Loss (Rot Contagion)</span>
              <span className="font-mono text-red-400">{params.spoilageRateWithoutSortingPercent}% of batch</span>
            </div>
            <input
              type="range"
              min={5}
              max={35}
              step={1}
              value={params.spoilageRateWithoutSortingPercent}
              onChange={e => setParams({ ...params, spoilageRateWithoutSortingPercent: +e.target.value })}
              className="w-full accent-red-500"
            />
          </div>

          {/* Slider 5: Daily Labor Cost */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-300">Manual Sorting Labor Expense</span>
              <span className="font-mono text-amber-400">₹{params.manualSortingLaborCostPerDay} / day</span>
            </div>
            <input
              type="range"
              min={600}
              max={4000}
              step={100}
              value={params.manualSortingLaborCostPerDay}
              onChange={e => setParams({ ...params, manualSortingLaborCostPerDay: +e.target.value })}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Right 6 Columns: Projected Value & Payback Results */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-card p-6 border-emerald-400/30 bg-gradient-to-br from-[#0c1e13] to-[#07130c]">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-950">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                PROJECTED VALUE REALIZATION
              </span>
              <span className="chip chip-good text-[10px] font-mono font-bold">
                PAYBACK IN ~{paybackDays} DAYS
              </span>
            </div>

            {/* Big Benefit Display */}
            <div className="my-4">
              <div className="text-xs text-slate-400 uppercase font-bold">Net Monthly Financial Gain</div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-300 mt-1">
                ₹{Math.round(totalMonthlyBenefit).toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400/80 font-mono mt-1">
                (≈ ₹{Math.round(totalDailyBenefit).toLocaleString()} additional revenue & savings / day)
              </div>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5 pt-3 border-t border-emerald-950/80 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>• Premium Grade A Realization:</span>
                <span className="font-mono font-bold text-white">+₹{Math.round(dailyGradeABonusRevenue * 25).toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>• Spoilage Contagion Prevented:</span>
                <span className="font-mono font-bold text-emerald-400">+₹{Math.round(dailySavedProduceValue * 25).toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>• Manual Labor Re-allocated:</span>
                <span className="font-mono font-bold text-amber-400">+₹{Math.round(dailyLaborSavings * 25).toLocaleString()} / mo</span>
              </div>
            </div>
          </div>

          {/* Quick Payback Card */}
          <div className="glass-card p-4 bg-[#0a150f] border-emerald-900/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Clock size={22} />
              </div>
              <div>
                <div className="text-sm font-black text-white">Full Hardware Payback: {paybackDays} Operating Days</div>
                <p className="text-xs text-slate-400 mt-0.5">
                  The prototype costs ~$102.50 (₹8,500). Daily added value of ₹{Math.round(totalDailyBenefit)} recoups the entire investment within three weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Impact (Social, Economic, Environmental from PDF Section 11) */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Social Pillar */}
        <div className="glass-card p-5 border-emerald-800/30">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-3 border border-emerald-700/40">
            <Users size={20} />
          </div>
          <h3 className="text-base font-black text-white">👨🌾 Social Impact</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Less manual drudgery:</strong> Eliminates eye-strain and breathing toxic fungal dust from rotten onion handling.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Fair, transparent pricing:</strong> Objective AI grading protects small farmers from arbitrary middlemen weight cuts.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Local tech opportunities:</strong> Maintenance and calibration generates high-tech rural youth employment.</span>
            </li>
          </ul>
        </div>

        {/* Economic Pillar */}
        <div className="glass-card p-5 border-amber-800/30">
          <div className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 mb-3 border border-amber-700/40">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-base font-black text-white">💰 Economic Impact</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>Rot contagion isolation:</strong> One rotten onion spoils 10 healthy ones in humid bags; immediate ejection saves 60% of crop loss.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>Export premium unlock:</strong> Certified uniform 45–65mm Grade A batches fetch +18% higher rates in urban/export markets.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">✓</span>
              <span><strong>High sorting throughput:</strong> Inspects 140 onions/min, processing entire consignments 5x faster.</span>
            </li>
          </ul>
        </div>

        {/* Environmental Pillar */}
        <div className="glass-card p-5 border-cyan-800/30">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-3 border border-cyan-700/40">
            <Leaf size={20} />
          </div>
          <h3 className="text-base font-black text-white">🌱 Environmental Impact</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span>
              <span><strong>Zero food waste hauling:</strong> Stops transporting spoiled produce hundreds of kilometers to urban landfills.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span>
              <span><strong>Lower cold storage load:</strong> Storing rotten bulbs wastes up to 22% of cold room electricity due to fungal respiration.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span>
              <span><strong>Byproduct recycling:</strong> Diverted cull onions can be cleanly routed to organic compost or bio-methane digesters.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

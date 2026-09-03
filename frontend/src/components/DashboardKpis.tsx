import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Activity, 
  TrendingUp, 
  Filter, 
  Search, 
  Eye, 
  Calendar, 
  Download,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { Onion, Inspection } from '../types';

interface DashboardKpisProps {
  sortedHistory: Onion[];
  inspections: Inspection[];
  onSelectOnionForLab?: (onion: Onion) => void;
  onOpenReportModal?: (inspection: Inspection) => void;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({
  sortedHistory,
  inspections,
  onSelectOnionForLab,
  onOpenReportModal
}) => {
  const [filterGrade, setFilterGrade] = useState<'ALL' | 'GOOD' | 'MEDIUM' | 'REJECT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOnionDetail, setSelectedOnionDetail] = useState<Onion | null>(null);

  // Compute live statistics from sortedHistory
  const total = sortedHistory.length;
  const goodCount = sortedHistory.filter(o => o.outputGrade === 'GOOD').length;
  const mediumCount = sortedHistory.filter(o => o.outputGrade === 'MEDIUM').length;
  const rejectCount = sortedHistory.filter(o => o.outputGrade === 'REJECT').length;

  const goodPct = total ? Math.round((goodCount / total) * 1000) / 10 : 68.5;
  const mediumPct = total ? Math.round((mediumCount / total) * 1000) / 10 : 21.0;
  const rejectPct = total ? Math.round((rejectCount / total) * 1000) / 10 : 10.5;

  // Pie chart distribution data
  const pieData = [
    { name: 'Grade A (Good)', value: goodCount || 68, color: '#10b981' },
    { name: 'Grade B (Medium)', value: mediumCount || 21, color: '#f59e0b' },
    { name: 'Rejected (Rot/Sprout)', value: rejectCount || 11, color: '#ef4444' }
  ];

  // Defect breakdown data
  const defectData = [
    { name: 'Healthy / Clean', count: goodCount || 68, fill: '#10b981' },
    { name: 'Skin Blemish', count: sortedHistory.filter(o => o.condition === 'blemished').length || 14, fill: '#f59e0b' },
    { name: 'Undersized (<45mm)', count: sortedHistory.filter(o => o.condition === 'undersized').length || 7, fill: '#fbbf24' },
    { name: 'Apical Sprout', count: sortedHistory.filter(o => o.condition === 'sprouted').length || 6, fill: '#f87171' },
    { name: 'Black Mold / Rot', count: sortedHistory.filter(o => o.condition === 'rotten').length || 5, fill: '#dc2626' }
  ];

  // Filtered rows for the live stream
  const filteredHistory = sortedHistory.filter(o => {
    const matchesGrade = filterGrade === 'ALL' || o.outputGrade === filterGrade;
    const matchesSearch = 
      String(o.id).includes(searchQuery) || 
      o.condition.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="chip chip-good text-xs font-black tracking-wider mb-1">
            EXECUTIVE TELEMETRY & QUALITY INTELLIGENCE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Procurement Batch Quality Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Real-time quality grade yield, defect dispersion, and automated sorting throughput.
          </p>
        </div>

        {inspections.length > 0 && onOpenReportModal && (
          <button
            onClick={() => onOpenReportModal(inspections[0])}
            className="btn btn-primary self-start sm:self-auto text-xs"
          >
            <Download size={14} /> Export Procurement Certificate (PDF)
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Inspected */}
        <div className="glass-card p-4">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Inspected</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {total || 250}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <Zap size={11} /> 140 units / min
          </div>
        </div>

        {/* Grade A Good */}
        <div className="glass-card p-4 border-emerald-500/30">
          <div className="text-[11px] font-bold uppercase text-emerald-400 flex items-center justify-between">
            <span>🟢 Good (Grade A)</span>
            <CheckCircle2 size={13} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
            {goodPct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {goodCount || 171} export bulbs
          </div>
        </div>

        {/* Grade B Medium */}
        <div className="glass-card p-4 border-amber-500/30">
          <div className="text-[11px] font-bold uppercase text-amber-400 flex items-center justify-between">
            <span>🟠 Medium (URS)</span>
            <AlertTriangle size={13} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
            {mediumPct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {mediumCount || 53} culinary bulbs
          </div>
        </div>

        {/* Reject */}
        <div className="glass-card p-4 border-red-500/30">
          <div className="text-[11px] font-bold uppercase text-red-400 flex items-center justify-between">
            <span>🔴 Rejected</span>
            <XCircle size={13} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono mt-1">
            {rejectPct}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {rejectCount || 26} rotten/sprouted
          </div>
        </div>

        {/* Average Diameter */}
        <div className="glass-card p-4">
          <div className="text-[11px] font-bold uppercase text-slate-400">Avg Diameter</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono mt-1">
            53.8 mm
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Target: 45–65 mm
          </div>
        </div>

        {/* Estimated Value Gain */}
        <div className="glass-card p-4 border-emerald-500/40 bg-gradient-to-br from-[#0c1c13] to-[#08120c]">
          <div className="text-[11px] font-bold uppercase text-emerald-300 flex items-center gap-1">
            <TrendingUp size={12} /> Revenue Lift
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono mt-1">
            +18.4%
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">
            via grade separation
          </div>
        </div>
      </div>

      {/* Visual Charts Grid: Distribution & Defect Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Pie Chart: Quality Grade Ratio */}
        <div className="lg:col-span-5 glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Batch Quality Distribution
              </h3>
              <p className="text-xs text-slate-400">Proportional yield across 3 output grades</p>
            </div>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a140e', 
                    borderColor: '#10b981', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Stat */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-2xl font-black font-mono text-emerald-400">{goodPct}%</span>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Grade A</span>
            </div>
          </div>
        </div>

        {/* Bar Chart: Defect Categorization Breakdown */}
        <div className="lg:col-span-7 glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Defect & Pathology Spectrum
              </h3>
              <p className="text-xs text-slate-400">CNN classification breakdown of surface defects</p>
            </div>
            <span className="chip chip-cyan text-[10px] font-mono">
              InceptionV3 / MobileNet Quantized
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a140e', 
                    borderColor: '#10b981', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time Inspection Stream Table */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-950">
          <div>
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              Live Sorter Event Stream & Historical Records
            </h3>
            <p className="text-xs text-slate-400">Every inspected onion logged with optical metrics & actuator target</p>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search condition or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="field py-1 pl-8 text-xs w-44"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#09130d] p-1 rounded-xl border border-emerald-950">
              {(['ALL', 'GOOD', 'MEDIUM', 'REJECT'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-colors ${
                    filterGrade === g 
                      ? 'bg-emerald-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table / List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-950 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">SAMPLE ID</th>
                <th className="py-2.5 px-3">DIAMETER</th>
                <th className="py-2.5 px-3">CONDITION</th>
                <th className="py-2.5 px-3">CONFIDENCE</th>
                <th className="py-2.5 px-3">OUTPUT GRADE</th>
                <th className="py-2.5 px-3">ACTUATOR BIN</th>
                <th className="py-2.5 px-3 text-right">EXPLAINABLE DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-medium">
              {filteredHistory.slice(0, 10).map(onion => (
                <tr key={onion.id} className="hover:bg-emerald-950/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white flex items-center gap-1.5">
                    <span>🧅</span> #{onion.id}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-300">
                    {onion.diameterMm} mm
                  </td>
                  <td className="py-3 px-3 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      onion.condition === 'healthy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      onion.condition === 'blemished' || onion.condition === 'undersized' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {onion.condition}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {onion.confidence}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`chip ${
                      onion.outputGrade === 'GOOD' ? 'chip-good' :
                      onion.outputGrade === 'MEDIUM' ? 'chip-medium' :
                      'chip-reject'
                    }`}>
                      {onion.outputGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-300">
                    {onion.actuatorTarget || (onion.outputGrade === 'GOOD' ? 'BIN 1 (Good)' : onion.outputGrade === 'MEDIUM' ? 'BIN 2 (Medium)' : 'BIN 3 (Reject)')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedOnionDetail(onion)}
                      className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold border border-emerald-800/60 transition-colors"
                    >
                      View AI Reasoning
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">
              No onions match the selected filter. Run the conveyor to stream more samples.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Onion Detail & Explainable Reasoning */}
      {selectedOnionDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 relative border-emerald-400/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-950">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧅</span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Sample Inspection Breakdown #{selectedOnionDetail.id}
                  </h3>
                  <span className="text-xs text-slate-400">Full Explainable AI & Rule Verification</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOnionDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-emerald-950"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#09140e] p-3 rounded-xl border border-emerald-950">
                <div>
                  <span className="text-slate-500 uppercase block font-bold text-[10px]">Diameter (ArUco / Contour)</span>
                  <span className="font-mono text-white font-black text-base">{selectedOnionDetail.diameterMm} mm</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold text-[10px]">CNN Confidence</span>
                  <span className="font-mono text-emerald-400 font-black text-base">{selectedOnionDetail.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold text-[10px]">Condition Classification</span>
                  <span className="font-bold text-white uppercase">{selectedOnionDetail.condition}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block font-bold text-[10px]">Assigned Grade</span>
                  <span className={`chip ${
                    selectedOnionDetail.outputGrade === 'GOOD' ? 'chip-good' :
                    selectedOnionDetail.outputGrade === 'MEDIUM' ? 'chip-medium' :
                    'chip-reject'
                  }`}>
                    {selectedOnionDetail.outputGrade}
                  </span>
                </div>
              </div>

              {/* Explainable AI statement */}
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
                <span className="font-bold text-emerald-300 block mb-1">Explainable AI Audit Rule:</span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {selectedOnionDetail.reason}
                </p>
              </div>

              {/* Actuator Routing */}
              <div className="flex items-center justify-between text-xs bg-[#0f1d14] p-3 rounded-xl border border-emerald-900/50">
                <span className="text-slate-400 font-bold">Physical Diverter Gate:</span>
                <span className="font-mono text-cyan-300 font-black">
                  {selectedOnionDetail.actuatorTarget || (selectedOnionDetail.outputGrade === 'GOOD' ? 'GATE 1 (+45° to Bin 1)' : selectedOnionDetail.outputGrade === 'MEDIUM' ? 'GATE 2 (0° to Bin 2)' : 'GATE 3 (-45° to Bin 3)')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOnionDetail(null)}
                  className="btn btn-primary w-full text-xs"
                >
                  Close Inspection Breakdown
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

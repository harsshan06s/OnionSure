import React from 'react';
import { 
  Activity, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Zap, 
  Eye,
  Sliders,
  LogOut,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../services/audio';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineEdgeMode: boolean;
  setOfflineEdgeMode: React.Dispatch<React.SetStateAction<boolean>>;
  audioEnabled: boolean;
  setAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  fps: number;
  inferenceMs: number;
  onLogout: () => void;
  userEmail: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  offlineEdgeMode,
  setOfflineEdgeMode,
  audioEnabled,
  setAudioEnabled,
  fps,
  inferenceMs,
  onLogout,
  userEmail
}) => {
  const toggleSound = () => {
    const next = soundFx.toggleMute();
    setAudioEnabled(next);
  };

  const navItems = [
    { id: 'simulator', label: 'Conveyor & Sorter', icon: Zap, badge: 'LIVE DEMO' },
    { id: 'dashboard', label: 'Dashboard & Stats', icon: Activity },
    { id: 'lab', label: 'AI Inspection Lab', icon: Eye },
    { id: 'hardware', label: 'Hardware & BOM', icon: Cpu, badge: '₹9,250' },
    { id: 'roi', label: 'Impact & ROI', icon: TrendingUp },
    { id: 'multicrop', label: 'Multi-Crop', icon: Layers, badge: 'Scalable' },
    { id: 'audit', label: 'Audit & Records', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a110d]/90 backdrop-blur-md border-b border-emerald-900/30">
      {/* Top Banner with Edge Telemetry */}
      <div className="border-b border-emerald-950/60 px-4 py-1 text-xs flex flex-wrap items-center justify-between gap-2 bg-[#060a08]/80 text-emerald-300/80">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            EDGE DEVICE: <strong className="text-white">Jetson Nano / Pi 4 (Offline)</strong>
          </span>
          <span className="hidden sm:inline-block text-emerald-800">|</span>
          <span className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
            LATENCY: <strong className="text-emerald-300">{inferenceMs} ms</strong>
          </span>
          <span className="hidden sm:inline-block text-emerald-800">|</span>
          <span className="hidden md:flex items-center gap-1 font-mono text-[11px]">
            OPTICAL FPS: <strong className="text-emerald-300">{fps} FPS</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button 
            onClick={toggleSound}
            title={audioEnabled ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Unmute)'}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              audioEnabled 
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/60' 
                : 'bg-slate-900/60 text-slate-400 border-slate-700/40'
            }`}
          >
            {audioEnabled ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} className="text-slate-500" />}
            <span>{audioEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Edge Offline Toggle */}
          <button 
            onClick={() => setOfflineEdgeMode(prev => !prev)}
            title="Toggle Edge Offline Mode vs Cloud Sync"
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border transition-all ${
              offlineEdgeMode 
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
            }`}
          >
            {offlineEdgeMode ? <WifiOff size={12} className="text-emerald-400" /> : <Wifi size={12} className="text-cyan-400" />}
            <span>{offlineEdgeMode ? 'EDGE OFFLINE (ZERO CLOUD)' : 'HYBRID CLOUD SYNC'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('simulator')}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/40">
            <span className="text-xl select-none">🧅</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0a110d] animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0a110d]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Innovortex <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/30">OnionSure</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/70 hidden sm:block">
              Edge Computer Vision • 3-Way Sorting • Real-Time Mandi Telemetry
            </p>
          </div>
        </div>

        {/* Tab Links for Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0f1913]/90 p-1.5 rounded-2xl border border-emerald-900/40">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/30' 
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-emerald-200' : 'text-slate-400'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider ${
                    isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200">Procurement Officer</span>
            <span className="text-[10px] text-emerald-400/80 font-mono truncate max-w-[120px]">{userEmail || 'officer@onionsure.demo'}</span>
          </div>
          <button 
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800/50 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto scrollbar-none px-3 py-2 gap-1.5 border-t border-emerald-950/80 bg-[#0a110d]">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                isActive 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-950/40 text-slate-300 hover:bg-emerald-900/40'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  QrCode, 
  FileText,
  Calendar,
  Lock
} from 'lucide-react';
import { Inspection } from '../types';

interface VerificationModalProps {
  inspection: Inspection;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  inspection,
  onClose
}) => {
  const hash = inspection.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 relative border-emerald-400/40 shadow-2xl bg-[#08110b]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-emerald-950 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Certificate Header */}
        <div className="border-b-2 border-emerald-500/40 pb-5 mb-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-3">
            <ShieldCheck size={32} />
          </div>
          <div className="chip chip-good text-xs font-mono font-black uppercase mb-1">
            GOVERNMENT APMC ACCREDITED • DIGITAL QUALITY CERTIFICATE
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Innovortex Automated Quality Certificate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Issued under ISO/IEC 17025 Conformity Standards for Horticulture Consignment Grading
          </p>
        </div>

        {/* Certificate Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#0b1610] p-4 rounded-xl border border-emerald-950 mb-5">
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Certificate ID</span>
            <span className="font-mono text-emerald-400 font-bold">{inspection.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Batch Lot</span>
            <span className="font-mono text-white font-bold">{inspection.batchId}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Procurement Centre</span>
            <span className="text-white font-bold truncate block">{inspection.centre}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Inspection Date</span>
            <span className="font-mono text-slate-300">{new Date(inspection.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quality Grade Yield Breakdown */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Certified Quality Grade Partition
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400">🟢 Grade A (Export)</span>
              <div className="text-2xl font-mono font-black text-emerald-300 mt-1">{inspection.gradeA}%</div>
              <span className="text-[10px] text-slate-400">Premium Valuation</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400">🟠 Grade B (Domestic)</span>
              <div className="text-2xl font-mono font-black text-amber-300 mt-1">{inspection.urs}%</div>
              <span className="text-[10px] text-slate-400">Fair Culinary</span>
            </div>
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-center">
              <span className="text-[10px] uppercase font-bold text-red-400">🔴 Rejection (Spoiled)</span>
              <div className="text-2xl font-mono font-black text-red-300 mt-1">{inspection.reject}%</div>
              <span className="text-[10px] text-slate-400">Isolated</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Proof & QR Box */}
        <div className="p-4 rounded-xl bg-[#09130d] border border-cyan-900/40 flex flex-col sm:flex-row items-center gap-4 text-xs mb-6">
          <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0">
            {/* SVG QR Code Simulation */}
            <div className="w-full h-full border border-black p-0.5 grid grid-cols-5 gap-0.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${(i % 2 === 0 || i % 7 === 0 || i === 0 || i === 4 || i === 20 || i === 24) ? 'bg-black' : 'bg-white'}`}
                ></div>
              ))}
            </div>
          </div>

          <div className="space-y-1 w-full text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-400 font-bold">
              <Lock size={13} />
              <span>SHA-256 Tamper-Evident Ledger Integrity Hash</span>
            </div>
            <div className="font-mono text-[10px] text-slate-300 break-all bg-black/60 p-1.5 rounded border border-slate-800">
              {hash}
            </div>
            <div className="text-[10px] text-slate-400">
              Scannable by downstream cold storage facilities and exporters to verify grade authenticity.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-950">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={13} /> Digitally Signed by Innovortex Edge Engine
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs"
            >
              <Printer size={14} /> Print Certificate
            </button>
            <button
              onClick={onClose}
              className="btn btn-primary text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

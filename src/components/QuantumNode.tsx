import React, { useState, useEffect } from "react";
import { Shield, Cpu, Activity, Zap, Server, RefreshCw, KeyRound, Check } from "lucide-react";
import { GlassCard } from "./GlassUI";

interface QuantumNodeProps {}

export const QuantumNode: React.FC<QuantumNodeProps> = () => {
  const [pulseWave, setPulseWave] = useState<number[]>([]);
  const [utilization, setUtilization] = useState<number>(98.5);

  useEffect(() => {
    // Generate organic heartbeat lines for the system health monitor cards
    const interval = setInterval(() => {
      setPulseWave(Array.from({ length: 15 }, () => Math.round(20 + Math.random() * 50)));
      setUtilization(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        const next = prev + delta;
        return Number(Math.max(92, Math.min(99.9, next)).toFixed(1));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const sparklineData = [30, 45, 35, 60, 50, 80, 75, 98, 92, utilization];

  return (
    <div className="min-h-full bg-gradient-to-br from-[#04060f] to-[#0a1128] text-white p-6 md:p-12 rounded-3xl border border-[#1e293b]/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative font-mono select-none overflow-hidden">
      
      {/* Background starlight particles */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
      <div className="absolute right-0 top-1/4 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Menu Simulator row matching Image 4 */}
      <div className="h-10 border-b border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest mb-10 relative z-10 font-bold">
        <div className="flex items-center gap-2">
          <Server size={14} className="text-sky-400" />
          <span>Sovereign Device Nexus</span>
        </div>
        <div className="flex gap-6">
          <span className="text-zinc-250 hover:text-sky-400 cursor-pointer">Dashboard</span>
          <span className="text-zinc-500 hover:text-sky-400 cursor-pointer">Devices</span>
          <span className="text-zinc-500 hover:text-sky-400 cursor-pointer">Analytics</span>
          <span className="text-zinc-500 hover:text-sky-450 cursor-pointer">Settings</span>
        </div>
        <span className="text-zinc-450">Admin ▾</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* LEFT COLUMN: GORGEOUS BLUE GLOWING SCHEMATIC VECTOR SERVER CHASSIS (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-black/45 rounded-2xl border border-sky-500/10 shadow-[inner_0_4px_30px_rgba(14,165,233,0.02)] h-[440px] relative overflow-hidden group">
          
          {/* Neon Grid effect backdrop */}
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />

          {/* Animated Matrix Scanner line sweeping down */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent w-full top-0 animate-bounce pointer-events-none shadow-[0_0_12px_rgba(14,165,233,0.8)]" style={{ animationDuration: "6s" }} />

          {/* Glowing Vector Chassis Blueprint rendered inside SVG */}
          <div className="w-56 h-56 relative animate-pulse flex items-center justify-center" style={{ animationDuration: "4s" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-sky-400 filter drop-shadow-[0_0_15px_rgba(14,165,233,0.55)]">
              {/* Outer Shell Cube Projection */}
              <polygon points="20,30 50,15 80,30 80,70 50,85 20,70" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
              <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.8" />
              <line x1="20" y1="30" x2="50" y2="45" stroke="currentColor" strokeWidth="0.8" />
              <line x1="80" y1="30" x2="50" y2="45" stroke="currentColor" strokeWidth="0.8" />

              {/* Inner Panels/Slabs */}
              <polygon points="26,38 50,50 74,38 74,48 50,60 26,48" fill="rgba(14,165,233,0.12)" stroke="currentColor" strokeWidth="0.5" />
              <polygon points="26,52 50,64 74,52 74,62 50,74 26,62" fill="rgba(14,165,233,0.12)" stroke="currentColor" strokeWidth="0.5" />

              {/* Circuit Connector paths */}
              <path d="M 50,50 Q 30,55 35,46" fill="none" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2,2" />
              <path d="M 50,64 Q 70,60 62,55" fill="none" stroke="#fb923c" strokeWidth="0.6" strokeDasharray="2,2" />

              {/* Glowing flashing nodes (LEDs) */}
              <circle cx="50" cy="45" r="1.5" fill="#22d3ee" className="animate-ping" />
              <circle cx="26" cy="38" r="1.2" fill="#fb923c" />
              <circle cx="74" cy="38" r="1.2" fill="#22d3ee" />
              <circle cx="50" cy="85" r="1" fill="#38bdf8" />
            </svg>
          </div>

          {/* Node metadata title matching Image 4 */}
          <div className="text-center mt-6">
            <h2 className="text-[#f8fafc] font-black text-sm uppercase tracking-[0.2em]">Quantum Node Z-7</h2>
            <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-extrabold mt-1">
              Zenith Configuration | <span className="text-emerald-400 font-black animate-pulse">Active</span>
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE DIAGNOSTIC PANELS CONNECTED INTO BLUE NODE (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Card A: Processing Power */}
          <GlassCard className="p-4 flex justify-between items-center bg-[#070b13]/80 hover:border-sky-500/35 transition-all">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 block font-bold uppercase">Processing Power</span>
              <h3 className="text-2xl font-black font-sans text-white tracking-tight">{utilization}%</h3>
              <p className="text-[9.5px] text-zinc-450 uppercase font-semibold">Core Utilization: Peak</p>
            </div>
            
            {/* Custom high contrast Sparkline */}
            <div className="w-28 h-10 flex items-end">
              <svg viewBox="0 0 100 30" className="w-full h-full text-sky-400">
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d={`M ${sparklineData.map((d, idx) => `${idx * 11},${30 - (d / 100) * 26}`).join(" L ")}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                />
                <path 
                  d={`M 0,30 L ${sparklineData.map((d, idx) => `${idx * 11},${30 - (d / 100) * 26}`).join(" L ")} L 100,30 Z`} 
                  fill="url(#blueGrad)" 
                />
              </svg>
            </div>
          </GlassCard>

          {/* Card B: Encryption Status */}
          <GlassCard className="p-4 flex items-center justify-between bg-[#070b13]/80">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 block font-bold uppercase">Encryption Status</span>
              <h3 className="text-zinc-150 font-black text-sm uppercase tracking-wide flex items-center gap-1.5 text-sky-300">
                <Shield className="w-4 h-4 text-sky-400" />
                Quantum-Resistant
              </h3>
              <p className="text-[9.5px] text-zinc-450 uppercase font-semibold">Intrusion Attempts: 0</p>
            </div>
            
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <KeyRound size={18} />
            </div>
          </GlassCard>

          {/* Card C: System Health */}
          <GlassCard className="p-4 flex justify-between items-center bg-[#070b13]/80">
            <div className="space-y-1">
              <span className="text-[9px] text-zinc-500 block font-bold uppercase">System Health</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider">Optimal</h3>
              </div>
              <p className="text-[9.5px] text-zinc-450 uppercase font-semibold">Temperature: Optimal | Efficiency: 94%</p>
            </div>

            {/* Simulated Live pulse EKG graph */}
            <div className="w-24 h-8 flex items-center overflow-hidden">
              <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-400">
                <path 
                  d="M 0,20 L 20,20 L 25,10 L 30,30 L 35,20 L 55,20 L 60,5 L 65,35 L 70,20 L 100,20" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </GlassCard>

          {/* Card D: Loading slider index matching Image 4 precisely */}
          <GlassCard className="p-4 space-y-2 bg-[#070b13]/80">
            <div className="flex justify-between items-center text-[9.5px] text-zinc-500 font-black tracking-widest uppercase">
              <span>Variant 7 of 10</span>
              <span className="text-zinc-350">Zenith System Parameters</span>
            </div>
            <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-500"
                style={{ width: "70%" }}
              />
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Styled Footer Pill Overlay */}
      <div className="flex justify-center mt-12 relative z-10">
        <span className="flex items-center gap-2 px-5 py-2.5 bg-[#030610]/90 border border-sky-500/15 text-[10px] text-zinc-350 tracking-wider font-extrabold rounded-full font-mono uppercase shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Status: Connected</span>
          <span className="text-zinc-600">|</span>
          <span>Last Sync: 10s ago</span>
        </span>
      </div>

    </div>
  );
};

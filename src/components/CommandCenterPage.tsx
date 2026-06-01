import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, Settings2, Server, Activity, ChevronRight, 
  ShieldAlert, ShieldCheck, Layers, ArrowRight, Sparkles,
  Globe, BrainCircuit, Workflow
} from "lucide-react";
import { motion } from "motion/react";
import { Device, SystemLog } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

// Import modular pages to seamlessly nest them within the cockpit dashboard
import { GlobalHorizonMap } from "./GlobalHorizonMap";
import { QuantumNode } from "./QuantumNode";
import { DataVisualizationFlow } from "./DataVisualizationFlow";
import { SecurityPerimeter } from "./SecurityPerimeter";
import { SanteConnectV2 } from "./SanteConnectV2";

interface FluidBlobProps {
  health: number;
  warningCount: number;
  criticalCount: number;
}

export const FluidBlobCanvas: React.FC<FluidBlobProps> = ({ health, warningCount, criticalCount }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ radius: number; angle: number; speed: number; spin: number; size: number; alpha: number }>>([]);

  useEffect(() => {
    // Generate particle positions once
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 32 }, () => ({
        radius: 15 + Math.random() * 70,
        angle: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.7,
        spin: (Math.random() - 0.5) * 0.012,
        size: 1.2 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6
      }));
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    const render = () => {
      time += 1;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Transition layouts/colors dynamically with network parameters
      let colors = {
        backFill: "rgba(16, 185, 129, 0.03)",
        backStroke: "rgba(16, 185, 129, 0.12)",
        midFill: "rgba(6, 182, 212, 0.07)",
        midStroke: "rgba(6, 182, 212, 0.22)",
        frontFill: "rgba(14, 165, 233, 0.13)",
        frontStroke: "rgba(14, 165, 233, 0.5)",
        particle: "#22d3ee",
        glow: "rgba(6, 182, 212, 0.25)"
      };

      if (criticalCount > 1 || warningCount > 1) {
        colors = {
          backFill: "rgba(239, 68, 68, 0.03)",
          backStroke: "rgba(239, 68, 68, 0.12)",
          midFill: "rgba(244, 63, 94, 0.07)",
          midStroke: "rgba(244, 63, 94, 0.22)",
          frontFill: "rgba(225, 29, 72, 0.13)",
          frontStroke: "rgba(225, 29, 72, 0.5)",
          particle: "#f43f5e",
          glow: "rgba(225, 29, 72, 0.25)"
        };
      } else if (warningCount > 0 || criticalCount > 0) {
        colors = {
          backFill: "rgba(245, 158, 11, 0.03)",
          backStroke: "rgba(245, 158, 11, 0.12)",
          midFill: "rgba(245, 158, 11, 0.07)",
          midStroke: "rgba(245, 158, 11, 0.22)",
          frontFill: "rgba(217, 119, 6, 0.13)",
          frontStroke: "rgba(217, 119, 6, 0.5)",
          particle: "#fb923c",
          glow: "rgba(217, 119, 6, 0.25)"
        };
      }

      // Draw global diffuse backlight
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 78, 0, Math.PI * 2);
      ctx.fillStyle = colors.backFill;
      ctx.shadowBlur = 40;
      ctx.shadowColor = colors.glow;
      ctx.fill();
      ctx.restore();

      // Spline shape generator
      const drawLayer = (baseRadius: number, scale: number, fill: string, stroke: string, offset: number) => {
        ctx.beginPath();
        const pointsCount = 8;
        const pts: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < pointsCount; i++) {
          const angle = (i * Math.PI * 2) / pointsCount;
          const wave = Math.sin(angle * 3.2 + time * 0.022 + offset) * 11 + 
                       Math.cos(angle * 1.8 - time * 0.016 + offset * 1.3) * 7;
          const r = baseRadius * scale + wave;
          pts.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r
          });
        }

        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pointsCount; i++) {
          const curr = pts[i];
          const next = pts[(i + 1) % pointsCount];
          const mx = (curr.x + next.x) / 2;
          const my = (curr.y + next.y) / 2;
          ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      // Draw 3 nested blending fluid layers
      drawLayer(85, 1.25, colors.backFill, colors.backStroke, 0);
      drawLayer(85, 1.0, colors.midFill, colors.midStroke, Math.PI / 3);
      
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.frontStroke;
      drawLayer(85, 0.82, colors.frontFill, colors.frontStroke, Math.PI);
      ctx.restore();

      // Particles emission
      ctx.save();
      particlesRef.current.forEach(p => {
        p.radius += p.speed;
        p.angle += p.spin;

        const limit = 140;
        const visibility = Math.max(0, 1 - (p.radius / limit));
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(px, py, p.size * visibility, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle;
        ctx.globalAlpha = p.alpha * visibility;
        ctx.shadowBlur = 5;
        ctx.shadowColor = colors.particle;
        ctx.fill();

        if (p.radius > limit) {
          p.radius = 12 + Math.random() * 12;
          p.angle = Math.random() * Math.PI * 2;
          p.alpha = 0.25 + Math.random() * 0.65;
        }
      });
      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [health, warningCount, criticalCount]);

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={320} 
      className="w-full h-full object-contain pointer-events-none relative z-0" 
    />
  );
};

interface CommandCenterProps {
  devices: Device[];
  logs: SystemLog[];
  onSelectDevice: (device: Device) => void;
  onClearAlert: (logId: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const CommandCenterPage: React.FC<CommandCenterProps> = ({ 
  devices, 
  logs, 
  onSelectDevice, 
  onClearAlert,
  onNavigateToTab
}) => {
  // Current active viewport switcher right in the central cockpit deck
  const [activeSubTab, setActiveSubTab] = useState<"sante_connect" | "overview" | "globe" | "quantum" | "dataflow" | "perimeter">("sante_connect");

  const totalCount = devices.length || 1;
  const onlineCount = devices.filter(d => d.status === "online").length;
  const warningCount = devices.filter(d => d.status === "warning").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;

  const activeCriticalIncidents = logs.filter(
    log => log.level === "critical" || log.level === "warning"
  );
  const activeCriticalCount = activeCriticalIncidents.length;

  const totalCompliantPercent = Math.round(
    devices.reduce((acc, d) => acc + d.policyCompliance, 0) / totalCount
  );

  const meanCpu = Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.cpu, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  const meanRam = Math.round(
    devices.filter(d => d.status !== "offline").reduce((acc, d) => acc + d.ram, 0) /
    (devices.filter(d => d.status !== "offline").length || 1)
  );

  // Determine overall fleet status
  let fleetStatus = "Optimal";
  let fleetColor = "text-cyan-400";
  let fleetGlow = "from-cyan-600 via-blue-500 to-purple-600";
  
  if (activeCriticalCount > 1 || warningCount > 1) {
    fleetStatus = "Degraded";
    fleetColor = "text-rose-400";
    fleetGlow = "from-red-600 via-rose-500 to-amber-600";
  } else if (warningCount > 0 || activeCriticalCount > 0) {
    fleetStatus = "Sec Alert";
    fleetColor = "text-yellow-400";
    fleetGlow = "from-yellow-600 via-amber-500 to-rose-600";
  }

  return (
    <div className="relative space-y-6 text-white font-mono text-xs select-none">
      
      {/* Background Orb Animation */}
      <div className="absolute left-1/2 top-48 transform -translate-x-1/2 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* 1. TOP DUAL HEADER BAR: GIVES THAT PRESTIGE CLINICAL COMMAND LOGICAL FLOW */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1a0e41]/65 p-4 rounded-3xl border border-purple-500/10 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-400/10 rounded-xl border border-cyan-500/25 text-[#22d3ee] shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none italic">Sovereign Center Core</h3>
            <p className="text-[9px] text-purple-300 uppercase font-bold mt-1">Live synchronisations matching clinical healthcare requirements</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#24175e] border border-cyan-500/25 text-[#22d3ee] rounded-xl text-[9px] font-black shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              ONLINE SENSORS: {onlineCount}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#24175e] border border-orange-500/25 text-[#ff5c00] rounded-xl text-[9px] font-black shadow-[0_0_10px_rgba(255,92,0,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              ATTENTION: {warningCount}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a0e41] border border-purple-500/15 text-purple-400 rounded-xl text-[9px] font-mono font-bold">
              STANDBY: {offlineCount}
            </span>
          </div>
        </div>
      </div>

      {/* COCKPIT SUBTAB SELECTOR DECK - Swaps visual interfaces seamlessly */}
      <div className="flex flex-wrap justify-center md:justify-start gap-1 p-1 bg-[#150a36]/90 border border-purple-500/15 rounded-2xl shadow-lg backdrop-blur-sm">
        {[
          { id: "sante_connect", label: "🏥 01 • Santé Connect V2", icon: Activity },
          { id: "overview", label: "02 • Overview Cockpit", icon: Server },
          { id: "globe", label: "03 • Global 3D World Grid", icon: Globe },
          { id: "quantum", label: "04 • Quantum Core Hardware", icon: BrainCircuit },
          { id: "dataflow", label: "05 • Connection Flow Signals", icon: Workflow },
          { id: "perimeter", label: "06 • Security Threat Sonar", icon: ShieldCheck }
        ].map(sub => {
          const SubIcon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[10.5px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-[#24175e] border-cyan-400/30 text-[#22d3ee] font-black shadow-[0_0_12px_rgba(34,211,238,0.2)]" 
                  : "bg-transparent border-transparent text-[#7c6bb5] hover:text-white hover:bg-purple-950/30"
              }`}
            >
              <SubIcon className={`w-3.5 h-3.5 ${isActive ? "text-[#22d3ee] drop-shadow-[0_0_4px_#22d3ee]" : "text-[#7c6bb5]"}`} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* DYNAMIC Inner Cockpit content rendering depending on selection */}
      <div className="transition-all duration-300">
        {activeSubTab === "sante_connect" && (
          <SanteConnectV2 
            devices={devices} 
            logs={logs} 
            onSelectDevice={onSelectDevice}
            onClearAlert={onClearAlert}
            onNavigateToTab={(tabId) => {
              if (tabId === "overview_system") {
                setActiveSubTab("overview");
              } else if (onNavigateToTab) {
                onNavigateToTab(tabId);
              }
            }}
          />
        )}

        {activeSubTab === "overview" && (
          <div className="space-y-8">
            
            {/* 2. THREE-PANEL CORE SYSTEM COMMAND VIEW (LEFT, ROTATING ORB, RIGHT) */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* LEFT COLUMN (4 COLS) */}
              <div className="lg:col-span-3.5 space-y-6">
                
                {/* Card A: Active Units */}
                <GlassCard 
                  id="active-units-trigger"
                  className="p-6 border-l-4 border-l-cyan-400 hover:scale-[1.02] transform transition-all cursor-pointer"
                  onClick={() => onNavigateToTab?.("devices")}
                >
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Units</p>
                  <div className="flex justify-between items-end mt-2">
                    <h2 className="text-3xl font-black text-zinc-100 font-sans tracking-tight">
                      {onlineCount} <span className="text-sm text-zinc-650 font-mono">/ {devices.length}</span>
                    </h2>
                    <div className="bg-cyan-400/10 p-1.5 rounded-md border border-cyan-500/20 text-cyan-400">
                      <ChevronRight size={16} className="text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-[9px] text-cyan-400/70 mt-1 font-bold uppercase">Dynamic host relays linked</p>
                </GlassCard>

                {/* Card B: System Load */}
                <GlassCard className="p-6">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Load CPU / RAM</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h2 className="text-3xl font-black text-cyan-400 font-sans tracking-tight">{meanCpu}%</h2>
                    <span className="text-xs text-cyan-300 font-mono">Stable CPU Index</span>
                  </div>
                  
                  {/* CPU loading bar */}
                  <div className="h-2 w-full bg-cyan-950/40 border border-cyan-500/10 mt-3.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 animate-pulse transition-all duration-1000" 
                      style={{ width: `${meanCpu}%` }}
                    />
                  </div>

                  {/* RAM loading bar */}
                  <div className="mt-3 flex justify-between text-[9px] text-zinc-500 font-bold">
                    <span>RAM ALLOCATION:</span>
                    <span className="text-zinc-350">{meanRam}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-cyan-950/45 border border-cyan-500/10 mt-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500/70 transition-all duration-1000" 
                      style={{ width: `${meanRam}%` }}
                    />
                  </div>
                </GlassCard>

              </div>

              {/* CENTER VISUAL ORB ELEMENT WITH LIVE ORGANIC CANVAS GRADIENTS (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col items-center py-6">
                <div className="relative flex items-center justify-center w-80 h-80">
                  
                  {/* Floating particles background canvas */}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <FluidBlobCanvas 
                      health={totalCompliantPercent} 
                      warningCount={warningCount} 
                      criticalCount={activeCriticalCount} 
                    />
                  </div>

                  {/* Outer dynamic orbiting dashed ring */}
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(16,185,129,0.03)] z-10 pointer-events-none"
                  >
                    {/* Inner orbiting Ring 2 */}
                    <motion.div 
                      animate={{ rotate: -360 }} 
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full rounded-full border border-double border-emerald-500/10 flex items-center justify-center"
                    />
                  </motion.div>

                  {/* Core container ring with details */}
                  <div className="relative text-center z-20 w-48 h-48 rounded-full bg-[#060a11]/90 border border-emerald-500/20 shadow-[0_10px_45px_0_rgba(16,185,129,0.15)] flex flex-col items-center justify-center backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-widest text-[#a7f3d0] font-black">Fleet Health</p>
                    <h1 className={`text-4xl font-extrabold font-sans tracking-tight mt-1 transition-all duration-1000 ${fleetColor}`}>
                      {fleetStatus}
                    </h1>
                    <p className="text-emerald-300 font-black text-[9px] uppercase tracking-wider mt-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-400/20 font-mono">
                      {totalCompliantPercent}% Operational
                    </p>
                  </div>
                  
                </div>
                <p className="mt-4 text-[10px] text-zinc-550 font-bold uppercase tracking-widest text-center">
                  Sovereign Device Nexus - Command Overview
                </p>
              </div>

              {/* RIGHT COLUMN (4 COLS) */}
              <div className="lg:col-span-3.5 space-y-6">
                
                {/* Card C: Security Threats */}
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active Alerts</p>
                      <h2 className="text-4xl font-black mt-2 font-sans tracking-tight">
                        {activeCriticalCount}
                      </h2>
                      <span className="text-[9px] block text-zinc-500 uppercase mt-1.5 font-bold">Incidents Detected</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${activeCriticalCount > 0 ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-bounce" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}>
                      {activeCriticalCount > 0 ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-emerald-405" />}
                    </div>
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-zinc-950 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 uppercase font-black text-[9px]">Status Guard:</span>
                    <span className={`font-black ${activeCriticalCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {activeCriticalCount > 0 ? "THREAT DETECTED" : "NOMINAL STATE"}
                    </span>
                  </div>
                </GlassCard>

                {/* Card D: Efficiency Rating */}
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Efficiency Rating</p>
                      <h2 className="text-4xl font-black mt-2 font-sans tracking-tight">99.5%</h2>
                      <span className="text-[9px] block text-zinc-500 uppercase mt-1.5 font-bold">Optimization rating</span>
                    </div>
                    <div className="p-2.5 bg-cyan-400/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                      <Settings2 className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="mt-3.5 pt-3 border-t border-zinc-950 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 uppercase font-black text-[9px]">Sovereign Laws rating:</span>
                    <span className="font-black text-cyan-400">{totalCompliantPercent}% SEC</span>
                  </div>
                </GlassCard>

              </div>

            </div>

            {/* 3. LOWER SECTION COUPLING WORKPLACE (LEFT: CO-AUDIT / INCIDENTS CHECKLIST, RIGHT: CONTINUOUS ROLLING CONSENT TICKER) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
              
              {/* LEFT COLUMN: ACTIVE INCIDENTS MANAGEMENT SCREEN (7 COLS) */}
              <div id="incidents-dossier" className="lg:col-span-7 flex flex-col bg-[#080d14]/75 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 shadow-xl">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-950 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-550 block font-black uppercase tracking-wider">SOVEREIGN NETWORK COMMAND CENTER</span>
                    <h3 className="font-extrabold text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> 
                      Actionable Cyber incidents Relays
                    </h3>
                  </div>
                  <span className="text-[9px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md uppercase tracking-wider">
                    {activeCriticalCount} ACTIVE INCIDENTS
                  </span>
                </div>

                <div className="flex-1 space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1">
                  {activeCriticalCount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center font-mono">
                      <ShieldCheck className="w-12 h-12 text-emerald-400 mb-3 animate-pulse" />
                      <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">Matrix Integrity Enforced</span>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-[280px] leading-relaxed">
                        No vulnerabilities or drift metrics recorded. All airgapped controllers are reporting nominal parameters.
                      </p>
                    </div>
                  ) : (
                    activeCriticalIncidents.map((log) => {
                      const assocDevice = devices.find(d => d.id === log.deviceId);
                      return (
                        <div 
                          key={log.id} 
                          className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-all duration-300 ${log.level === "critical" ? "bg-rose-950/10 border-rose-500/20 hover:border-rose-500/35" : "bg-amber-950/10 border-amber-500/20 hover:border-amber-500/35"}`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className={`w-1.5 h-1.5 rounded-full ${log.level === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
                              <span className="font-mono text-[10px] font-black text-zinc-200 uppercase tracking-wide">{log.source}</span>
                              <span className="font-mono text-[9px] text-zinc-550 bg-black/30 border border-zinc-900 px-1.5 py-0.5 rounded font-bold">{log.timestamp}</span>
                            </div>
                            <p className="font-mono text-[11px] text-zinc-300 leading-normal font-medium">{log.message}</p>
                            
                            {assocDevice && (
                              <button
                                onClick={() => onSelectDevice(assocDevice)}
                                className="mt-2 text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 text-[10px] font-bold uppercase transition-all tracking-wide text-left"
                              >
                                Trace host target ({assocDevice.name}) <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => onClearAlert(log.id)}
                            className="text-[9px] font-mono tracking-wider bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 hover:text-white text-zinc-400 px-3 py-2 rounded-lg transition-all cursor-pointer font-extrabold uppercase shrink-0"
                          >
                            Acknowledge
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: RECENT LEDGER TELEMETRY STREAM (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col bg-[#080d14]/75 backdrop-blur-md border border-cyan-500/10 rounded-2xl p-5 shadow-xl">
                
                <div className="flex items-center justify-between border-b border-zinc-950 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] text-zinc-550 block font-black uppercase tracking-wider">LIVE HEARTBEAT SIGNALS</span>
                    <h3 className="font-extrabold text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                      <Layers className="w-4 h-4 text-cyan-400 animate-pulse" /> 
                      Continuous Incident Ledger
                    </h3>
                  </div>
                  <span className="text-[8px] font-bold text-zinc-500 border border-zinc-900 px-2 py-1 rounded bg-black/20 uppercase tracking-widest shrink-0">
                    SOCKET OK
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                  {logs.map((log) => {
                    const badgeColors = {
                      success: "text-emerald-400 bg-emerald-950/20 border-emerald-500/15",
                      info: "text-sky-400 bg-sky-950/20 border-sky-500/15",
                      warning: "text-amber-400 bg-amber-950/20 border-amber-500/15",
                      critical: "text-rose-400 bg-rose-950/20 border-rose-500/15"
                    };
                    return (
                      <div key={log.id} className="flex gap-3 text-[10px] font-mono p-2.5 rounded-xl border border-zinc-900/30 bg-[#060a12]/50 hover:bg-[#0c1424]/40 hover:border-cyan-500/10 transition-colors duration-250">
                        <span className="text-zinc-650 shrink-0 font-bold pt-1.5">{log.timestamp}</span>
                        <div className="space-y-1 my-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 border rounded uppercase ${badgeColors[log.status || log.level]}`}>{log.level}</span>
                            <span className="text-zinc-400 font-bold tracking-tight uppercase">{log.source}</span>
                          </div>
                          <p className="text-zinc-300 leading-normal font-medium">{log.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* NATIVE INTEGRATION OF ROTATING WORLD GLOBE IN COCKPIT DECK */}
        {activeSubTab === "globe" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlobalHorizonMap devices={devices} />
          </motion.div>
        )}

        {/* NATIVE INTEGRATION OF QUANTUM NODE WIREFRAME BLUEPRINT IN COCKPIT DECK */}
        {activeSubTab === "quantum" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <QuantumNode />
          </motion.div>
        )}

        {/* NATIVE INTEGRATION OF CONNECTION FLOW STREAM DESIGN VIEWER IN COCKPIT DECK */}
        {activeSubTab === "dataflow" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <DataVisualizationFlow />
          </motion.div>
        )}

        {/* NATIVE INTEGRATION OF SONAR TAILORED THREAT RADAR MAPS IN COCKPIT DECK */}
        {activeSubTab === "perimeter" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <SecurityPerimeter />
          </motion.div>
        )}
      </div>

    </div>
  );
};

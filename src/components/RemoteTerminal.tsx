import React, { useState, useRef, useEffect } from "react";
import { Terminal as TermIcon, Cpu, Play, Search, ShieldCheck, ChevronRight, Monitor, Activity, Settings, RefreshCw, Layers, Compass } from "lucide-react";
import { Device, SystemLog } from "../types";
import { GlassCard, NeonButton } from "./GlassUI";

interface RemoteTerminalProps {
  devices: Device[];
  onAddLog?: (log: SystemLog) => void;
}

export const RemoteTerminal: React.FC<RemoteTerminalProps> = ({ 
  devices,
  onAddLog
}) => {
  // Current active mode inside the remote deck manager
  const [activeDeckMode, setActiveDeckMode] = useState<"cli" | "vnc" | "node_exporter">("vnc");
  
  // Selected device to control
  const [activeDeviceIdx, setActiveDeviceIdx] = useState<number>(0);
  const currentDevice = devices[activeDeviceIdx] || devices[0] || { id: "PC-001", name: "Sovereign-A1", status: "online", policyCompliance: 96 };

  // Terminal CLI history states
  const [history, setHistory] = useState<Array<{ cmd: string; res: string }>>([
    { 
      cmd: "system-update --dry-run", 
      res: "[AGENT] Initializing clinical telemetry bridge...\n[AGENT] Verified connection to Sovereign Security Tunnel.\n[STATUS] dry-run complete: 0 packages out of alignment." 
    },
    { 
      cmd: "node-exporter --latency-check", 
      res: "Latency: 2.45ms | Connection: Secure SSL/TLS Tunnel | Target: " + currentDevice.name 
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // VNC interactive desktop simulated state
  const [streamFrameCount, setStreamFrameCount] = useState(0);
  const [isVncControlConnected, setIsVncControlConnected] = useState(true);
  const [vncDisplayMode, setVncDisplayMode] = useState<"desktop" | "bios" | "logs">("desktop");
  const [holographicOverclockLevel, setHolographicOverclockLevel] = useState(45);

  // Auto scroll CLI to bottom
  useEffect(() => {
    if (activeDeckMode === "cli") {
      consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, activeDeckMode]);

  // Simulate VNC streaming tick updates
  useEffect(() => {
    const timer = setInterval(() => {
      if (isVncControlConnected) {
        setStreamFrameCount(prev => (prev + 1) % 1000);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [isVncControlConnected]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    let response = "";

    if (trimmed === "help" || trimmed === "?") {
      response = "Available Fleet Agent Commands:\n" +
        "  help | ?               Shows this clinical fleet CLI guide\n" +
        "  status                 Returns real-time agent socket/node health\n" +
        "  metrics                Outputs raw node exporter Prometheus values\n" +
        "  reboot                 Sends immediate force shutdown and reboot trigger\n" +
        "  clear                  Purges terminal input and history logs\n" +
        "  overclock <speed>      Forwards speed adjustments to coolant fans";
    } else if (trimmed === "status") {
      response = `[AGENT LOG] Active Target: ${currentDevice.name}\n[STATUS] OPTIMAL - SECURE TUNNEL ESTABLISHED\nAirgap Port: 3000 -> SSL Tunnel Encrypted\nNode ping rate: 2.12ms`;
    } else if (trimmed === "metrics") {
      response = `node_cpu_seconds_total{mode="idle"} 12845.24\nnode_memory_Active_bytes 4294967296\nnode_network_receive_bytes_total 104857600\nnode_disk_written_bytes_total ${Math.round(Math.random() * 8500000000)}`;
    } else if (trimmed === "clear") {
      setHistory([]);
      return;
    } else if (trimmed === "reboot") {
      response = `[CRITICAL_CALL] Sending signature 'shutdown /r /t 0' daemon event to PC Target ${currentDevice.name}...\nConnection status will transition to 'STANDBY' immediately.`;
      if (onAddLog) {
        onAddLog({
          id: `LOG-CLI-REBOOT-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "Remote Control Agent",
          level: "warning",
          message: `Issued force reboot socket instruction for clinical fleet node: ${currentDevice.name}`
        });
      }
    } else if (trimmed.startsWith("overclock ")) {
      const level = cmdStr.substring(10).trim();
      response = `[SUCCESS] Coolant fan micro-burst offset updated to ${level}% capacity.\nThermal threshold response optimized for clinical node.`;
    } else {
      response = `Command unrecognized: '${trimmed}'. Type 'help' to review integrated commands.`;
    }

    setHistory(prev => [...prev, { cmd: cmdStr, res: response }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  const triggerPCAction = (actionName: string, commandString: string) => {
    // Add VNC interactive clicks trigger responses directly to terminal logs & mock notifier
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
    
    // Append to CLI logs behind the scenes as well so user sees state sync
    setHistory(prev => [...prev, { 
      cmd: `vnc-interaction --event=${actionName}`, 
      res: `[SUCCESS] Desktop Agent triggered daemon instruction: '${commandString}' on device '${currentDevice.name}'`
    }]);

    if (onAddLog) {
      onAddLog({
        id: `LOG-VNC-ACTION-${Date.now()}`,
        timestamp,
        source: "Remote Screen Agent",
        level: "success",
        message: `Triggered VNC remote control interaction: [${actionName}] event on target PC Node: [${currentDevice.name}]`
      });
    }
  };

  return (
    <div className="min-h-full bg-[#1a0e41]/95 text-white p-6 md:p-10 flex flex-col lg:flex-row gap-6 font-sans border border-purple-500/10 rounded-[2.5rem] shadow-[0_15px_45px_rgba(76,29,149,0.3)] relative select-none overflow-hidden backdrop-blur-md">
      
      {/* Absolute Ambient Glows to match the screenshots */}
      <div className="absolute right-[-10%] top-[-10%] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-[15%] bottom-[-10%] w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Panel Content Segment */}
      <div className="flex-1 flex flex-col relative z-10 bg-[#120732]/60 border border-purple-500/10 rounded-[2rem] p-5 md:p-8">
        
        {/* Terminal Header Info Grid */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-950 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[10px] text-cyan-400 font-mono font-black tracking-widest uppercase">
                ACTIVE VNC & SSH TUNNEL AGENT
              </span>
            </div>
            <h3 className="text-xl font-black italic tracking-wide text-white uppercase leading-none">
              💻 Fleet Node Control Manager
            </h3>
          </div>

          {/* Quick tab switchers mapped exactly to the described 3 layers! */}
          <div className="flex bg-[#120732] p-1 rounded-xl border border-purple-950/80">
            <button
              onClick={() => setActiveDeckMode("vnc")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "vnc"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-purple-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop VNC
            </button>
            <button
              onClick={() => setActiveDeckMode("cli")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "cli"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-purple-400 hover:text-white"
              }`}
            >
              <TermIcon className="w-3.5 h-3.5" /> SSH Console
            </button>
            <button
              onClick={() => setActiveDeckMode("node_exporter")}
              className={`flex items-center gap-2 px-3.5 py-2 text-[9.5px] font-black font-mono tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer ${
                activeDeckMode === "node_exporter"
                  ? "bg-[#25175d] text-[#22d3ee] border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-purple-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Node Exporter
            </button>
          </div>
        </div>

        {/* 1. LAYER ONE: VISUAL DESKTOP CONTROL MODE (HOLOGRAPHIC simulated screenshot stream via Canvas-like visual UI) */}
        {activeDeckMode === "vnc" && (
          <div className="space-y-6 animate-fade-in">
            {/* Holographic screensaver block simulation */}
            <div className="relative aspect-video rounded-3xl bg-[#0c0523] border-2 border-purple-500/20 overflow-hidden shadow-[0_0_35px_rgba(34,211,238,0.06)] group">
              
              {/* Static Canvas scanning grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,10,54,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,10,54,0.35)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-10 opacity-75" />
              
              {/* VNC signal frame stream indicator */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#1a0e41]/90 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-black tracking-widest uppercase text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>LIVE FEED • FRAME-{streamFrameCount}</span>
              </div>

              {/* RUL warning tag in screen */}
              <div className="absolute top-4 right-4 z-20 bg-rose-950/85 border border-rose-500/40 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-black tracking-widest uppercase text-[#ff5c00] shadow-[0_0_15px_rgba(255,92,0,0.2)]">
                TUNNEL: SECURE (Port 3000)
              </div>

              {/* Screen Interactive view option state toggle */}
              {vncDisplayMode === "desktop" && (
                <div className="absolute inset-0 flex flex-col justify-between p-8 text-cyan-400">
                  
                  {/* Fake UI Workspace header */}
                  <div className="flex justify-between items-center mt-8 relative z-20">
                    <div className="space-y-1 bg-[#150a36]/90 p-4 rounded-2xl border border-cyan-400/25">
                      <h4 className="text-sm font-black italic text-white uppercase tracking-wider">🏥 SANTE OS DESKTOP</h4>
                      <p className="text-[10px] font-mono text-purple-300">COMPLIANCE DEPLOYMENT: {currentDevice.policyCompliance}%</p>
                    </div>

                    <div className="text-right bg-[#150a36]/90 p-4 rounded-2xl border border-purple-500/10 font-mono text-[10px] text-purple-300">
                      <div>IP: 192.168.1.{activeDeviceIdx + 10}</div>
                      <div>MEM LOAD: 4.2 GB / 16.0 GB</div>
                    </div>
                  </div>

                  {/* Core Simulated Application Window representing active medical processes */}
                  <div className="bg-[#1a1040]/80 border border-[#3e2389]/40 rounded-2xl p-6 relative z-10 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-purple-950/60 pb-3 mb-4">
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" /> ACTIVE PATIENT ADMISSION PIPELINE
                      </span>
                      <span className="text-[8px] bg-[#120732] border border-purple-800 text-purple-400 px-2.5 py-1 rounded-md">
                        PID: 28456
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs align-center">
                        <span className="text-[#7c6bb5] font-black uppercase tracking-wider">HOSPITAL CAPACITY ALERT TENSION</span>
                        <span className="text-white font-extrabold font-mono">92% MAXIMUM</span>
                      </div>
                      <div className="w-full bg-[#120732] rounded-full h-2 overflow-hidden border border-purple-950">
                        <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: "92%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Wallpaper branding watermark */}
                  <div className="absolute inset-x-0 bottom-4 text-center text-[10px] text-[#7c6bb5]/30 font-black tracking-[0.35em] uppercase pointer-events-none select-none">
                    UNIVERSITE DE RABAT V2 CLINICAL SYSTEM
                  </div>
                </div>
              )}

              {vncDisplayMode === "bios" && (
                <div className="absolute inset-0 bg-[#0c0523]/95 p-8 text-[#ff5c00] font-mono text-[10px] overflow-y-auto space-y-1 px-10 pt-16">
                  <p className="text-cyan-400 font-bold">SOVEREIGN LINUX SHELL AGENT LOADER SIGNATURE</p>
                  <p className="text-purple-400">----------------------------------------------------</p>
                  <p>Initializing Secure RPC socket tunnel encryption context...</p>
                  <p>Verifying secure keys against hospital authority...</p>
                  <p className="text-emerald-400">[SUCCESS] SECURE HANDSHAKE VERIFIED: SSL-RSASHA256</p>
                  <p>Loading Node Exporter system telemetry daemon...</p>
                  <p>CPU Core 0 frequency calibrated dynamically to offset wear.</p>
                  <p>Ready to dispatch commands. Telemetry pipeline nominal.</p>
                </div>
              )}

              {vncDisplayMode === "logs" && (
                <div className="absolute inset-0 bg-[#060312]/95 p-8 text-[#7c6bb5] font-mono text-[9px] overflow-y-auto space-y-2.5 pt-16">
                  <p className="text-white font-black uppercase text-[10px] border-b border-purple-950 pb-1.5">CLIENT-SIDE DAEMON EVENT LOG STREAM</p>
                  {history.map((h, idx) => (
                    <div key={idx} className="border-l-2 border-cyan-400/40 pl-3">
                      <span className="text-cyan-400 font-bold block mb-0.5">guest@nexus:~$ {h.cmd}</span>
                      <span className="text-white line-clamp-2">{h.res}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Quick interactive Remote Command execution action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#150a36] p-4.5 rounded-[2rem] border border-purple-500/10 shadow-inner">
              <div className="flex flex-col gap-1.5">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">VNC LAYER VIEWER</span>
                <select 
                  value={vncDisplayMode}
                  onChange={(e) => setVncDisplayMode(e.target.value as any)}
                  className="bg-[#24175e] border border-purple-500/20 text-[#22d3ee] font-mono text-[9.5px] font-black rounded-xl p-2.5 outline-none tracking-widest uppercase cursor-pointer"
                >
                  <option value="desktop">🖥️ Host Desktop</option>
                  <option value="bios">🔋 Core Daemon Init</option>
                  <option value="logs">📄 Raw Sync Logs</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">DAEMON CONTROLS</span>
                <NeonButton 
                  onClick={() => triggerPCAction("Force Reboot", "shutdown /r /t 0")}
                  variant="red" 
                  className="!py-2.5 text-[9px]"
                >
                  Force Reboot
                </NeonButton>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">CAPACITY ENFORCEMENT</span>
                <NeonButton 
                  onClick={() => triggerPCAction("Purge SWAP RAM", "rm -rf /var/cache/* /tmp/*")}
                  variant="gold" 
                  className="!py-2.5 text-[9px]"
                >
                  Purge SWAP Memory
                </NeonButton>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] text-[#7c6bb5] font-black uppercase tracking-widest pl-1">HARDWARE OPTIMIZER</span>
                <NeonButton 
                  onClick={() => triggerPCAction("Micro Overclock", "intel_pstate --max-perf=100")}
                  variant="primary" 
                  className="!py-2.5 text-[9px]"
                >
                  Boost Core Fan
                </NeonButton>
              </div>
            </div>

          </div>
        )}

        {/* 2. LAYER TWO: CLI TERMINAL SHELL INJECTION MODE */}
        {activeDeckMode === "cli" && (
          <div className="flex-1 flex flex-col bg-[#0c0523]/80 border border-purple-500/10 rounded-2xl p-5 md:p-6 relative z-10 animate-fade-in min-h-[380px]">
            
            {/* Scrollable CLI Terminal logs list */}
            <div className="flex-1 overflow-y-auto max-h-[340px] space-y-4 pr-1">
              <p className="text-[10px] text-purple-400/80 leading-relaxed italic border-b border-purple-950 pb-3">Session started over secure WebSocket gateway tunnel. Type 'help' to print list.</p>
              
              {history.length === 0 ? (
                <p className="text-[11px] text-purple-500 italic">Console session purged. Type 'help' to review syntax configuration.</p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="space-y-1.5 leading-relaxed text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-[#ff5c00] font-black">
                      <span>rabb-root@clinical-fleet:~#</span>
                      <span className="text-cyan-300 font-bold">{item.cmd}</span>
                    </div>
                    <div className="text-purple-200 whitespace-pre-wrap pl-4 border-l border-cyan-400/25 py-1 mt-1 font-mono leading-relaxed bg-[#150a36]/60 p-2.5 rounded-lg border border-purple-500/5">
                      {item.res}
                    </div>
                  </div>
                ))
              )}

              {/* Prompt Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-3 text-[11px] font-mono">
                <span className="text-[#ff5c00] font-black">rabb-root@clinical-fleet:~#</span>
                <input 
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Insert remote terminal query parameter..."
                  className="flex-1 bg-transparent border-none outline-none text-[#22d3ee] font-mono caret-cyan-400 p-0 text-[11px]"
                  autoFocus
                />
                {/* Blinking CLI Block block cursor */}
                <div className="w-1.5 h-4 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              </form>
              <div ref={consoleEndRef} />
            </div>

          </div>
        )}

        {/* 3. LAYER THREE: RAW PROMETHEUS NODE EXPORTER METRICS LAYER */}
        {activeDeckMode === "node_exporter" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            
            {/* RAW NODE STATS BOX */}
            <div className="bg-[#120732] border border-purple-500/10 p-5 rounded-2xl">
              <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-purple-950 pb-2 mb-4">
                PROMETHEUS DAEMON SENSOR BLOCK
              </h4>
              <div className="space-y-4 font-mono text-[10.5px] text-purple-300 leading-relaxed">
                <div className="flex justify-between border-b border-purple-950/45 pb-1">
                  <span>node_exporter_active_status:</span>
                  <span className="text-emerald-400 font-extrabold">ONLINE (ACTIVE)</span>
                </div>
                <div className="flex justify-between border-b border-purple-950/45 pb-1">
                  <span>node_cpu_load_ratio:</span>
                  <span className="text-white font-extrabold">24.58 %</span>
                </div>
                <div className="flex justify-between border-b border-purple-950/45 pb-1">
                  <span>node_network_socket_pings:</span>
                  <span className="text-cyan-400 font-extrabold">2.45 ms (FAST)</span>
                </div>
                <div className="flex justify-between border-b border-purple-950/45 pb-1">
                  <span>node_disk_wear_index:</span>
                  <span className="text-[#ff5c00] font-extrabold">RUL SAFE (96.5%)</span>
                </div>
                <div className="flex justify-between border-b border-purple-950/45 pb-1">
                  <span>node_fan_pulses_total:</span>
                  <span className="text-white font-extrabold">3450 RPM</span>
                </div>
                <p className="text-[9px] text-[#7c6bb5] leading-relaxed pt-2">
                  System logs matching daemon socket binding on local port 3000. Values update dynamically via micro-agent ping ticks.
                </p>
              </div>
            </div>

            {/* QUICK ACTIONS FOR SYSTEM TUNING */}
            <div className="bg-[#150a36]/65 border border-purple-500/10 p-6 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-3 leading-none">
                  ⚡ AGENT CPU CALIBRATION
                </h4>
                <p className="text-[10px] text-[#7c6bb5] mb-5 leading-relaxed font-semibold">
                  Manually adjust the hardware fan cooling capacity thresholds to enforce safe wear margins on thermal layers.
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-mono uppercase font-black">
                    <span className="text-[#7c6bb5]">Capacity Boost</span>
                    <span className="text-cyan-400">{holographicOverclockLevel}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={holographicOverclockLevel}
                    onChange={(e) => {
                      setHolographicOverclockLevel(Number(e.target.value));
                      triggerPCAction("Thermal Threshold Tuning", `fan-speed --level=${e.target.value}`);
                    }}
                    className="w-full h-2 bg-[#120732] rounded-lg appearance-none cursor-pointer border border-purple-900"
                  />
                </div>
              </div>

              <div className="bg-[#120732] border border-purple-950 p-4 rounded-2xl block text-center text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-black mt-6">
                ● ACTIVE CONNECTION STATE: LOCKED (AES-256)
              </div>
            </div>

          </div>
        )}

      </div>

      {/* PC TARGET SELECTION LEDGER PANEL on the right side */}
      <div className="w-full lg:w-80 shrink-0 bg-[#120732]/75 p-6 rounded-[2rem] border border-purple-500/10 flex flex-col relative z-10 justify-between">
        <div>
          <h3 className="text-[10.5px] text-[#7c6bb5] font-black uppercase tracking-widest mb-4 border-b border-purple-950 pb-3 flex items-center justify-between">
            <span>REGISTERED NODES</span>
            <span className="text-[9px] text-cyan-400 bg-[#24175e] px-2 py-0.5 rounded-md border border-cyan-500/15">
              ACTIVE ENROLL
            </span>
          </h3>

          <div className="space-y-4">
            {devices.map((device, i) => {
              const matchesIdx = activeDeviceIdx === i;
              return (
                <div 
                  key={device.id}
                  onClick={() => {
                    setActiveDeviceIdx(i);
                    // Add interactive CLI transition statement
                    setHistory(prev => [...prev, {
                      cmd: `connect-node --target=${device.name}`,
                      res: `[CONNECTED] Tunnel routed over secure SSL gateway. Target PC resolved: ${device.name} (192.168.1.${10 + i}).`
                    }]);
                  }}
                  className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                    matchesIdx 
                      ? "bg-[#25175e] border-cyan-400/35 shadow-[0_0_15px_rgba(34,211,238,0.15)]" 
                      : "bg-[#1f124c]/30 border-purple-500/5 hover:bg-[#1a0e41]/90"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${device.status === "online" ? "bg-emerald-400 animate-ping" : "bg-orange-500"}`} />
                      {device.id}
                    </span>
                    <span className="text-[9.5px] font-mono text-purple-400 font-bold">
                      {device.policyCompliance}% Align
                    </span>
                  </div>

                  <div className="text-xs text-white font-black group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                    <span>{device.name}</span>
                    <ChevronRight size={13} className={`transition-all ${matchesIdx ? "text-cyan-400 translate-x-1" : "text-transparent group-hover:text-[#7c6bb5]"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footprint badge identifying screen profile */}
        <div className="pt-6 border-t border-purple-950 mt-8">
          <div className="bg-[#150a36] p-4 rounded-2xl border border-purple-500/10 text-[10px] text-[#7c6bb5] font-mono flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span>AGENTS POOL:</span>
              <strong className="text-white font-extrabold">{devices.length} Nodes</strong>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE BRIDGE:</span>
              <strong className="text-cyan-400 font-extrabold">{currentDevice.name}</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

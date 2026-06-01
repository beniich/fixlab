/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Activity, Circle, Server, ShieldCheck, Wifi } from "lucide-react";
import { SystemLog } from "../types";

interface StatusBarProps {
  logs: SystemLog[];
  isConnected: boolean;
}

export const SystemStatusBar: React.FC<StatusBarProps> = ({ logs, isConnected }) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [tickerLog, setTickerLog] = useState<string>("");

  useEffect(() => {
    // Synchronize to the User's local session context (May 2026 UTC, or actual ticks)
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-GB", { hour12: false }) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      // Rotate the newest log inside the bottom status ticker
      const newestLog = logs[0];
      setTickerLog(`[${newestLog.timestamp}] ${newestLog.source}: ${newestLog.message}`);
    }
  }, [logs]);

  return (
    <footer id="system-status-bar" className="h-10 bg-[#07090f] border-t border-emerald-500/20 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-400 select-none">
      {/* Left Segment: System state */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 tracking-wider font-semibold">SOVEREIGN CORE</span>
        </div>
        <div className="h-3.5 w-px bg-zinc-800" />
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
          <span>SYS STATUS: NOMINAL</span>
        </div>
        <div className="h-3.5 w-px bg-zinc-800 hidden md:block" />
        {/* Ticker for latest system incident */}
        <div className="hidden md:flex items-center gap-2 max-w-md lg:max-w-xl truncate text-emerald-500/85">
          <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded uppercase">LIVE TICKER</span>
          <span className="truncate">{tickerLog || "Continuous sovereignty auditing engine online..."}</span>
        </div>
      </div>

      {/* Right Segment: Connection indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
          <Server className="w-3 h-3 text-zinc-500" />
          <span>REF-GATEWAY: 10.240.1.1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className={`w-3 h-3 ${isConnected ? "text-emerald-400" : "text-rose-400"}`} />
          <span>PING: 14ms</span>
        </div>
        <div className="h-3.5 w-px bg-zinc-800" />
        <div className="flex items-center gap-1.5 font-medium text-emerald-400/90 bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/10 rounded">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>TLS 1.3 SECURE STATE</span>
        </div>
        <div className="h-3.5 w-px bg-zinc-800" />
        <div className="text-zinc-300 font-bold tracking-widest">{timeStr || "13:56:19 UTC"}</div>
      </div>
    </footer>
  );
};

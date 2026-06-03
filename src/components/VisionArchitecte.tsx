import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Activity, ShieldAlert, FileText, CheckSquare, TrendingUp, AlertTriangle, 
  Cpu, Clock, Sparkles, ChevronRight, BarChart3, Layers, Server, 
  ShieldCheck, ArrowRight, Eye, Monitor, Settings, RefreshCw, Zap,
  Download, Filter, Play, Info, CheckCircle2, Search, Database, Sliders, Archive, EyeOff, Radio,
  Globe, MapPin, Map, Compass, Satellite, Award, Network, Plus, Trash2, LayoutGrid
} from "lucide-react";
import { Device, SystemLog } from "../types";
import { GlassCard } from "./GlassUI";
import { initialPredictiveFailures } from "../mockData";
import { SovereignThreeCube } from "./SovereignThreeCube";

interface VisionArchitecteProps {
  devices?: Device[];
  logs?: SystemLog[];
  isLightMode?: boolean;
}

export const VisionArchitecte: React.FC<VisionArchitecteProps> = ({ 
  devices = [], 
  logs = [],
  isLightMode: externalIsLightMode
}) => {
  // Tabs: Command Hub (hub), Fleet Matrix (matrix), Signal Horizon (horizon), Archive Vault (vault), Atlas Map (map), Core Settings (settings)
  const [currentTab, setCurrentTab] = useState<"hub" | "matrix" | "horizon" | "vault" | "map" | "settings">("hub");
  const [isLightMode, setIsLightMode] = useState(externalIsLightMode !== undefined ? externalIsLightMode : true);

  useEffect(() => {
    if (externalIsLightMode !== undefined) {
      setIsLightMode(externalIsLightMode);
    }
  }, [externalIsLightMode]);
  const [focusedFailureId, setFocusedFailureId] = useState<string>("all");
  
  // States
  const [vaultSearchQuery, setVaultSearchQuery] = useState("");
  const [selectedVaultCategory, setSelectedVaultCategory] = useState<"ALL" | "STRUCTURAL" | "SPATIAL" | "KINETIC" | "MATERIALS">("ALL");
  const [syncEta, setSyncEta] = useState({ minutes: 2, seconds: 45 });
  const [throughput, setThroughput] = useState(1.84);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFeedsCount, setScannedFeedsCount] = useState(0);
  const [hudNotification, setHudNotification] = useState<string | null>(null);
  const [selectedTrajectoryId, setSelectedTrajectoryId] = useState<string>("0x884");
  const [rotation, setRotation] = useState({ x: 15, y: 0 });
  const [isHoveredCore, setIsHoveredCore] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState(100);
  const [efficiencyRate, setEfficiencyRate] = useState(92);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Strategic View States
  const [marketCap, setMarketCap] = useState(4.28);
  const [marketCapProjection, setMarketCapProjection] = useState(12.4);
  const [riskTargetPercent, setRiskTargetPercent] = useState(75);
  const [selectedRiskTier, setSelectedRiskTier] = useState<"optimal" | "aggressive" | "conservative">("optimal");
  const [systemNodesCount, setSystemNodesCount] = useState(1240);
  const [riskIndexValue, setRiskIndexValue] = useState(0.04);
  const [algoAccuracyPercent, setAlgoAccuracyPercent] = useState(99.2);

  const [operationalLogs, setOperationalLogs] = useState([
    { id: "LOG-01", entity: "London Node VII", status: "ACTIVE", impact: "+0.2% Yield", metric: "42.22 / 91.01", timestamp: "14:22:01 UTC" },
    { id: "LOG-02", entity: "Singapore Core", status: "OPTIMIZING", impact: "Stable", metric: "12.04 / 88.31", timestamp: "14:18:55 UTC" },
    { id: "LOG-03", entity: "Tokyo Edge Cluster", status: "ACTIVE", impact: "+1.1% Yield", metric: "33.45 / 94.21", timestamp: "14:05:12 UTC" },
  ]);

  const [showNewDirectiveModal, setShowNewDirectiveModal] = useState(false);
  const [newDirectiveEntity, setNewDirectiveEntity] = useState("");
  const [newDirectiveStatus, setNewDirectiveStatus] = useState("ACTIVE");
  const [newDirectiveImpact, setNewDirectiveImpact] = useState("+0.5% Yield");
  const [newDirectiveMetric, setNewDirectiveMetric] = useState("50.00 / 50.00");

  const [activeAssetDetails, setActiveAssetDetails] = useState<string | null>(null);
  const [simulatedPing, setSimulatedPing] = useState<number[]>([]);
  const [isPingingNode, setIsPingingNode] = useState(false);

  // Global Atlas States
  const [atlasActiveZone, setAtlasActiveZone] = useState<"all" | "north_alpha" | "pacific_grid" | "europe_central" | "north_am_west" | "asia_pacific_south">("all");
  const [atlasNodesCount, setAtlasNodesCount] = useState(1204);
  const [atlasLatency, setAtlasLatency] = useState(0.082);
  const [atlasLoadFactor, setAtlasLoadFactor] = useState(42);
  const [isExportingSpatial, setIsExportingSpatial] = useState(false);
  const [atlasTimestamp, setAtlasTimestamp] = useState("15:15:00 UTC");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vaultInputRef = useRef<HTMLInputElement | null>(null);

  // HUD Toast notifier helper
  const showHudToast = (message: string) => {
    setHudNotification(message);
    setTimeout(() => setHudNotification(null), 4000);
  };

  // Clocks and simulated telemetry loops
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, "0");
      const mins = String(now.getUTCMinutes()).padStart(2, "0");
      const secs = String(now.getUTCSeconds()).padStart(2, "0");
      setAtlasTimestamp(`${hrs}:${mins}:${secs} UTC`);
    }, 1000);

    const telemetryInterval = setInterval(() => {
      setAtlasNodesCount(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2));
      setAtlasLatency(prev => {
        const nextVal = prev + (Math.random() > 0.5 ? 0.002 : -0.002);
        return Math.max(0.040, Math.min(0.120, parseFloat(nextVal.toFixed(3))));
      });
      setAtlasLoadFactor(prev => {
        const nextVal = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(38, Math.min(48, nextVal));
      });
    }, 4000);

    // Sync timer countdown
    const syncInterval = setInterval(() => {
      setSyncEta(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 5, seconds: 0 };
        }
      });
    }, 1000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(telemetryInterval);
      clearInterval(syncInterval);
    };
  }, []);

  // Spatial scanner sweep trigger
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false);
            setScannedFeedsCount(c => c + 1);
            showHudToast("✅ Diagnostic d'intégrité de la structure achevé avec succès.");
            return 0;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Particle background for architectural schematics overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number; direction: number }> = [];

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth || 1200;
        canvas.height = canvas.parentElement.clientHeight || 650;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isLightMode ? "rgba(15, 76, 129, 0.12)" : "rgba(34, 211, 238, 0.18)";
      particles.forEach(p => {
        p.y += p.speed * p.direction;
        if (p.y < 0 || p.y > canvas.height) {
          p.direction *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTab, isLightMode]);

  // Passive ambient layout rotation when idle
  useEffect(() => {
    if (isHoveredCore) return;
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: (prev.y + 0.5) % 360
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isHoveredCore]);

  const activeZoneDetails = useMemo(() => {
    switch (atlasActiveZone) {
      case "north_alpha":
        return { name: "Portique Atlantique (North Alpha)", region: "Atlantique Nord & Littoral", units: 312, compliance: 98, load: "Modéré" };
      case "pacific_grid":
        return { name: "Axe Transpacifique (Pacific Grid)", region: "Océan Pacifique Profond", units: 485, compliance: 95, load: "Élevé" };
      case "europe_central":
        return { name: "Noyau Europe (Europe Central)", region: "Union Continentale", units: 220, compliance: 99, load: "Stable" };
      case "north_am_west":
        return { name: "Hub Ouest-Américain", region: "Californie & Oregon", units: 104, compliance: 94, load: "Optimisé" };
      case "asia_pacific_south":
        return { name: "Dorsale Asie-Pacifique", region: "Singapour & Zone Indienne", units: 83, compliance: 97, load: "Nominal" };
      default:
        return { name: "Tous les Territoires", region: "Couverture Globale Multi-Réseau", units: 1204, compliance: 97, load: "Sûre" };
    }
  }, [atlasActiveZone]);

  const onlineCount = devices.filter(d => d.status === "online").length;
  const totalCount = devices.length || 1;
  const fleetComplianceAvg = Math.round(
    devices.reduce((sum, d) => sum + d.policyCompliance, 0) / totalCount
  );

  // Graphs and datasets helper
  const mainChartData = [
    { name: "Jan", perf: 22, opt: 15 },
    { name: "Fév", perf: 58, opt: 48 },
    { name: "Mar", perf: 85, opt: 68 },
    { name: "Avr", perf: 52, opt: 46 },
    { name: "Mai", perf: 98, opt: 80 },
    { name: "Jun", perf: 72, opt: 58 },
    { name: "Jul", perf: 110, opt: 90 },
    { name: "Aoû", perf: 138, opt: 115 }
  ];

  const secondaryChartData = [
    { name: "Jan", val: 20 },
    { name: "Mar", val: 56 },
    { name: "May", val: 32 },
    { name: "Jul", val: 86 },
    { name: "Sep", val: 45 },
    { name: "Nov", val: 98 }
  ];

  const miniSparkData = [
    { name: "1", v: 22 },
    { name: "2", v: 40 },
    { name: "3", v: 34 },
    { name: "4", v: 52 },
    { name: "5", v: 48 },
    { name: "6", v: 82 },
    { name: "7", v: 70 },
    { name: "8", v: 94.5 }
  ];

  const timeSteps = ["D -6", "D -5", "D -4", "D -3", "D -2", "D -1", "Jour J", "J +1 (Prévision)"];
  const predictiveTrendData = timeSteps.map((step, idx) => {
    const point: any = { name: step };
    initialPredictiveFailures.forEach(f => {
      const key = `${f.deviceName} (${f.component})`;
      const prob = f.probability;
      let value = 0;
      if (idx === 7) {
        value = Math.min(100, Math.round(prob + (100 - prob) * 0.35));
      } else {
        const fraction = (idx + 1) / 7;
        value = Math.round(prob * (0.12 + 0.88 * fraction * fraction));
      }
      point[key] = value;
    });
    return point;
  });

  const vaultItems = [
    {
      id: "AV_9032",
      coordinates: "COORD: Z-ALT 742",
      title: "Fondation de la Flèche Cristalline",
      category: "STRUCTURAL",
      description: "Structure porteuse / Béton fibré haute densité / Carbone",
      lastSync: "24.05.2026",
      integrity: 98.4,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDJcjojK_W4H4iA6QxoLzHG-HBYjHTnwbW4ScObqECurxhXcaQkkY9Q4TMQt32S-06IYzj8I0bBHCyRznb66ugkS2JpuUgDjQ0uTbm47jO118UtlEGOnyIdepi6NcbpqWRFvOQwnEpxiEk9Rp4R-gIOenmmmnd2qu4zKl6SlEPFyGqhntRI6pRe0DexvaGorIQJQvYTwSgKdYJ4_Wg575sakqkzVmqDeR8CQfj8M_YcSmX3jpEBlZ9CdQ2DzI6qRflO6Ftruvfb-mG"
    },
    {
      id: "AV_8841",
      coordinates: "COORD: Z-SPAT 122",
      title: "Passerelle Résiliente Translucide",
      category: "SPATIAL",
      description: "Aménagement / Verre intelligent trempé / Polissage optique",
      lastSync: "22.05.2026",
      integrity: 100.0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaq7a0bDnDh3zBBsIBQfu9qmcMQCFzMvVrBgkR8oVFjyAAgdKe0OGBbGUmYXDdvnaFy55ku_8bbBosFIXAMToufLk_ehWRAom_jBzO01MuWnZO9552NdKX58pOi_qaG4Nl4u4D7lKt6PX9TtDTHeAjCy1E4RanCfJusJQrWtotpJwewcn9FFyf3HmVmt8qtZBU1NboYq-HzmdQbo5peJArPS59_sWrgs3N8qqpMsqzGbOlCyptOtKeQRifWw7OutF172635rA-Zj6D"
    },
    {
      id: "AV_4420",
      coordinates: "COORD: Z-KIN 004",
      title: "Pylône d'Ancrage Obsidien",
      category: "KINETIC",
      description: "Gros œuvre / Structure cinétique / Base amortie sismique",
      lastSync: "19.05.2026",
      integrity: 64.2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGD3o4pztGAg51KKLYtZEJeLtNo1EgOZMXV7bn67Q2xq_68-2DYuf-jobd1NoNvMw0Dj-IQAQ2DohRbiuxEgH2NsC8fPwgKwyjOjx63xzIZWtON0GMTTK6YNedZv47bSLcnaf0hJHAb-XYEFkfEJIm42CrJ-VxY_-uEMcMpkhtTAJJEpQVhS-q-RVUrF_YlrOnftBawEmHUdFZB6zmDoJNYkBFVZa2F1YtrsCizMAt_dkNaG43tBIJs23VHm6EXkfT4in10uqlAEm0"
    },
    {
      id: "AV_1129",
      coordinates: "COORD: Z-MAT 541",
      title: "Module de Ventilation Acoustique",
      category: "MATERIALS",
      description: "Fluides / Acoustique passive / Membranes en graphène",
      lastSync: "15.05.2026",
      integrity: 99.8,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZQ2_9XcyE6DUrVYqIhmP1poIaawdw_wS5SEIoW6wa9BEgJrsEAJqnFuLdNMGt4rNBzCnL4zk82aKkjxra-AV6Cb7cm-JYzp7mM12_OSroiPMYv8-p_0PutZczx5GnJ0x5qYvZE6Zi8lH1cbl-A8epUOeC_RPc8SRboZAqgusN1c-xjdV6hjCLKTXYBnEcKVoMZaGOnY26J2dvHIdLZ8CTzeBWm1s7PqEIUIg7Ma5UG4v_OBgGotA9WYTnQ6tCBWHIpVLC6-YiXBEF"
    }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotation({
          x: 15 + y * 35,
          y: x * 75
        });
      }}
      className={`min-h-full p-6 md:p-8 font-sans transition-all duration-300 relative overflow-hidden rounded-[2rem] border ${
        isLightMode 
          ? "bg-[#FAF9F5] text-stone-900 border-stone-200/90 shadow-[0_15px_45px_rgba(0,0,0,0.06)]" 
          : "bg-[#0c0d10] text-[#f1f5f9] border-slate-800 shadow-[0_20px_55px_rgba(0,0,0,0.45)]"
      }`}
    >
      {/* Absolute Ambient grids for professional architect paper vibe */}
      <div className={`absolute inset-0 pointer-events-none opacity-60 z-0 ${
        isLightMode 
          ? "bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]" 
          : "bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:20px_20px]"
      }`} />

      {/* Atmospheric coordinate system fine blueprint lines */}
      <div className={`absolute left-10 inset-y-0 w-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200/80" : "bg-slate-800/30"
      }`} />
      <div className={`absolute inset-x-0 bottom-36 h-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200/80" : "bg-slate-800/30"
      }`} />

      {/* FLOATING TEXT NOTIFICATION */}
      {hudNotification && (
        <div className={`fixed bottom-12 right-12 z-50 animate-bounce max-w-sm border shadow-lg px-5 py-3.5 rounded-xl flex items-start gap-3 backdrop-blur-md ${
          isLightMode 
            ? "bg-white/95 border-stone-200 text-stone-900" 
            : "bg-[#111317]/95 border-cyan-500/30 text-white"
        }`}>
          <Zap className="w-4 h-4 mt-0.5 shrink-0 animate-pulse text-amber-500" />
          <div className="text-left">
            <span className="text-[8px] font-mono leading-none tracking-wider text-slate-500 block uppercase font-bold">
              PLANIFICATEUR NOTIFICATION
            </span>
            <p className="text-[11px] font-mono font-semibold mt-1 leading-relaxed">
              {hudNotification}
            </p>
          </div>
        </div>
      )}

      {/* SOVEREIGN COQUILLE: HEADER + NAVIGATION BAR */}
      <header className={`sticky top-0 w-full z-40 flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b rounded-2xl mb-8 relative overflow-hidden backdrop-blur-[20px] shadow-[inset_0_1px_0_0_rgba(0,219,233,0.1)] ${
        isLightMode 
          ? "bg-[#F4F2EE]/95 border-stone-200" 
          : "bg-[#0A0C10]/85 border-white/10"
      }`}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-cyan-400 cursor-pointer animate-pulse" onClick={() => showHudToast("Sovereign Network systems checking online status...")}>grid_view</span>
          <div>
            <h1 className="text-xs font-black tracking-widest text-[#00dbe9] glow-cyan uppercase font-sans">
              SOVEREIGN NEXUS <span className="text-[10px] text-slate-500 font-mono tracking-normal font-bold">// TACTICAL TOC</span>
            </h1>
            <p className="text-[8px] font-mono uppercase tracking-wider text-stone-500 mt-0.5">
              Secure Core Single Page Shell
            </p>
          </div>
        </div>
        
        {/* Navigation items conforming exactly as requested, dynamic JS switching */}
        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
          <nav className="flex flex-wrap gap-1 md:gap-2 items-center">
            {[
              { id: "hub", label: "Command Hub" },
              { id: "matrix", label: "Fleet Matrix" },
              { id: "horizon", label: "Signal Horizon" },
              { id: "vault", label: "Archive Vault" },
              { id: "map", label: "Atlas Map" },
              { id: "settings", label: "Core Settings" },
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id as any);
                    showHudToast(`Commutation dynamique vers : ${tab.label}`);
                  }}
                  className={`font-mono text-[9px] uppercase tracking-widest font-black px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30 font-black shadow-[0_0_15px_rgba(0,219,233,0.15)]" 
                      : isLightMode
                        ? "text-stone-500 hover:text-[#0f4c81] hover:bg-stone-150"
                        : "text-slate-400 hover:text-[#00dbe9] transition-colors"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLightMode(!isLightMode);
                showHudToast(`Affichage configuré : ${!isLightMode ? "Table (Alabastre)" : "Atelier (Obsidienne)"}`);
              }}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isLightMode 
                  ? "bg-stone-200 border-stone-300 text-stone-700 hover:bg-stone-300"
                  : "bg-slate-900 border-white/10 text-cyan-400 hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[14px] leading-none">
                {isLightMode ? "dark_mode" : "light_mode"}
              </span>
            </button>
            <span 
              onClick={() => showHudToast("Flux de capteurs sécurisés nominal.")} 
              className="material-symbols-outlined text-cyan-400 cursor-pointer hover:bg-white/10 p-2 rounded-full transition-colors font-bold text-sm"
            >
              sensors
            </span>
          </div>
        </div>
      </header>

      {/* VIEWPORT 01: CENTRAL HUB */}
      {currentTab === "hub" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          {/* USER CHOSEN HUB SPINNING CONCH CENTRAL NODES MAP */}
          <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden mb-8 border border-white/5 rounded-3xl bg-[#07090d]/30 shadow-[0_4px_30px_rgba(0,219,233,0.03)]">
            {/* Three.js Interactive neon technical 3D cube */}
            <SovereignThreeCube isLightMode={isLightMode} />
            
            <div 
              onClick={() => {
                setEncryptionLevel(prev => Math.min(100, prev + 2));
                showHudToast("⚡ Alignement de la trame renforcé par le pôle central (+2% isolation)");
              }}
              style={{
                transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: "preserve-3d"
              }}
              className={`relative glass-panel w-[320px] h-[320px] rounded-full flex flex-col items-center justify-center z-20 border-white/10 group cursor-pointer transition-all duration-300 hover:border-[#00dbe9]/50 hover:shadow-[0_0_25px_rgba(0,219,233,0.15)] ${
                isLightMode ? "bg-white/85 border-stone-200" : "bg-[#111318]/50"
              }`}
            >
              <div className={`${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"} mb-2 animate-bounce`}>
                <Compass className="w-16 h-16 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <h2 className={`font-headline-lg text-lg font-black tracking-widest uppercase transition-colors ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Sovereign Nexus
              </h2>
              <p className="text-[10px] font-mono text-[#00dbe9] glow-cyan uppercase tracking-widest mt-1">
                System Core: Primed
              </p>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-2">
                Click to enhance encryption
              </span>
            </div>
          </div>

          {/* Bento Grid Hub */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className={`col-span-1 md:col-span-8 glass-panel rounded-[1.5rem] p-6 hover:border-[#00dbe9]/30 transition-all ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/40 border-white/5"
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-headline-md font-extrabold uppercase tracking-widest text-[#0f4c81] dark:text-cyan-400 text-xs`}>Structural Integrity</h3>
                <span className="text-[9px] font-mono text-zinc-500 font-bold">EFFICIENCY RATIO: {efficiencyRate}%</span>
              </div>
              <div className="w-full h-48 bg-stone-100 dark:bg-stone-950/20 rounded-xl relative border border-white/5 overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx0T544-wVp-nHE6VnUx2zXv7UcjQF0Pmxoj75hEWIxVWymWRj-dQITpcbgqTBiLHEbfHIkezFOzCbP08AsdTKUftrUbqzoPLttYLF9vChNbEvXMm_WE0xSzl9k74_s6yuCKlfkKv_G4yxUtTm4m2T5JSxZ3s_hQHd__idHXMWgqg3gM1iL4yEzfuIRcUBY793W8w5dmrbcCm_bRhzMYsVdqAdbjtobhX7R4I36MOqa1tKgG37C9j86Qx84Xq-FYqslHgakbhFIIWd" 
                  className={`w-full h-full object-cover opacity-35 ${isLightMode ? "" : "invert"}`}
                  alt="Sovereign Integrity Schematic Blueprint"
                />
              </div>
            </div>
            
            <div className={`col-span-1 md:col-span-4 glass-panel rounded-[1.5rem] p-6 hover:border-cyan-400/30 transition-all flex flex-col justify-between ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/40 border-white/5"
            }`}>
              <div>
                <span className="text-[#00dbe9] font-mono text-[9px] font-extrabold tracking-widest uppercase">SECURED</span>
                <h4 className={`text-md font-black tracking-tight mt-1 uppercase ${isLightMode ? "text-stone-900" : "text-white"}`}>Quantum Encryption</h4>
                <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  Cryptographic matrix isolation layer active against high-dimensional packet drift events.
                </p>
              </div>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[9px] font-bold text-zinc-500 mb-1.5">
                  <span>ENCRYPTION DECK</span>
                  <span className="text-[#00dbe9]">{encryptionLevel}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00dbe9] transition-all duration-300" style={{ width: `${encryptionLevel}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Strategy Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-stone-200 dark:border-slate-850 pb-5">
            <div>
              <span className="text-[9px] font-mono font-bold text-cyan-500 tracking-widest mb-1.5 block uppercase">Executive Dashboard</span>
              <h2 className={`text-2xl font-black tracking-tight ${isLightMode ? "text-stone-900" : "text-primary"} uppercase`}>STRATEGIC INSIGHTS</h2>
              <p className="text-xs text-stone-500 max-w-xl font-sans mt-1">
                A high-altitude diagnostic dashboard for executive oversight, tracking structural yields across regional nodes, algorithm accuracies, and physical asset metrics.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end text-left md:text-right">
              <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-bold tracking-wider">GLOBAL HEADQUARTERS</span>
              </div>
              <div className="hidden sm:block text-stone-305 dark:text-slate-800 text-xs">/</div>
              <div className="font-mono text-[10px] text-amber-550 font-bold uppercase tracking-wider">
                Q4 FISCAL ANALYSIS
              </div>
            </div>
          </div>

          {/* Dynamic Simulation Actions Panel */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/90 border-slate-850"
          }`}>
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="text-[11px] font-mono text-stone-500">
                Liaison d'Atelier: <strong className="text-stone-700 dark:text-stone-300">ACTIF</strong> • Flux télémétrique régulier
              </div>
            </div>
            <button
              id="simulate-market-volatility"
              onClick={() => {
                setMarketCap(prev => Math.max(3.8, Math.min(4.9, prev + (Math.random() > 0.5 ? 0.05 : -0.05))));
                setMarketCapProjection(prev => Math.max(9.5, Math.min(15.2, prev + (Math.random() > 0.5 ? 0.3 : -0.3))));
                setSystemNodesCount(prev => prev + (Math.random() > 0.5 ? 3 : -3));
                setRiskIndexValue(prev => parseFloat(Math.max(0.01, Math.min(0.09, prev + (Math.random() > 0.5 ? 0.005 : -0.005))).toFixed(3)));
                setAlgoAccuracyPercent(prev => parseFloat(Math.max(98.1, Math.min(99.9, prev + (Math.random() > 0.5 ? 0.15 : -0.15))).toFixed(2)));
                showHudToast("⚡ Analyse de flexibilité simulée! Télémétrie ajustée en temps réel.");
              }}
              className={`px-3 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-2 cursor-pointer ${
                isLightMode 
                  ? "bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800" 
                  : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-cyan-300"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Simuler Volatilité de Marché
            </button>
          </div>

          {/* Bento Grid Performance */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main KPI Glass Card */}
            <div 
              id="strategic-bento-kpi"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.round(e.clientX - rect.left);
                const y = Math.round(e.clientY - rect.top);
                const tagEl = document.getElementById("coord-loc-tag");
                if (tagEl) {
                  tagEl.innerText = `X:${x} Y:${y}`;
                }
              }}
              className={`md:col-span-8 p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 ${
                isLightMode 
                  ? "bg-white border-stone-200 hover:border-stone-405 hover:shadow-md" 
                  : "bg-[#111318]/50 border-white/5 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              }`}
            >
              <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity">
                <span id="coord-loc-tag" className="font-label-sm font-mono text-[9px] text-[#0f4c81] dark:text-cyan-400 font-extrabold pb-0.5 border-b border-dashed border-cyan-500/30">
                  X:742 Y:102
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  <h3 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-900" : "text-white"}`}>Market Capitalization</h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 font-sans mt-0.5">Global growth projection & asset distribution</p>
                </div>
                <div className="sm:text-right">
                  <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight block ${isLightMode ? "text-stone-900" : "text-[#00dbe9]"}`}>
                    ${marketCap.toFixed(2)}B
                  </span>
                  <span className="text-[10px] font-mono font-black text-amber-550 uppercase tracking-widest block mt-0.5">
                    +{marketCapProjection.toFixed(1)}% PROJECTION
                  </span>
                </div>
              </div>

              {/* Simplified Visual Chart Area with Tooltips */}
              <div className="h-44 flex items-end justify-between gap-2.5">
                {[
                  { segment: "North Alpha Real Estate", height: "h-[40%]", val: "$1.7B", growth: "+14.2%" },
                  { segment: "Sovereign Deep Tech", height: "h-[65%]", val: "$2.7B", growth: "+18.5%" },
                  { segment: "Asset Token Pools", height: "h-[55%]", val: "$2.3B", growth: "+11.1%" },
                  { segment: "Orbital Supply Logistics", height: "h-[85%]", val: "$3.6B", growth: "+21.2%" },
                  { segment: "Aero Logistics Grid", height: "h-[45%]", val: "$1.9B", growth: "+9.4%" },
                  { segment: "EU Central Vault", height: "h-[70%]", val: "$2.9B", growth: "+16.8%" },
                  { segment: "Aeon Quantum Compute", height: "h-[95%]", val: "$4.28B", growth: "+24.5%" },
                ].map((bar, i) => (
                  <div 
                    key={i} 
                    className="w-full flex flex-col items-center group/bar relative"
                    onClick={() => {
                      showHudToast(`Analysé: ${bar.segment} à ${bar.val} (${bar.growth} YoY)`);
                    }}
                  >
                    {/* Tooltip on bar hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover/bar:block z-30 transition-all pointer-events-none">
                      <div className={`p-2.5 rounded-lg border text-[9px] font-mono w-44 leading-tight shadow-md text-left ${
                        isLightMode ? "bg-stone-955 text-white border-stone-800" : "bg-slate-950 border-slate-800 text-white"
                      }`}>
                        <div className="font-bold text-cyan-400 uppercase">{bar.segment}</div>
                        <div className="mt-1 flex justify-between">
                          <span className="text-slate-400">VALUATION:</span>
                          <strong>{bar.val}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">YOY:</span>
                          <span className="text-amber-400">{bar.growth}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Bar */}
                    <div 
                      className={`chart-bar w-full cursor-pointer rounded-t-lg transition-all duration-300 ${bar.height} ${
                        isLightMode 
                          ? "bg-stone-900 border-t-2 border-stone-700 hover:bg-[#0f4c81]" 
                          : "bg-cyan-500/20 border-t border-cyan-400/50 hover:bg-cyan-500/40"
                      }`}
                    />
                    <span className="text-[8px] font-mono text-stone-400 mt-1.5 uppercase tracking-wider">{`S-0${i+1}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Yield Card */}
            <div className={`md:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/50 border-white/5"
            }`}>
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isLightMode 
                      ? "bg-amber-100/50 border-amber-300 text-amber-700 font-bold" 
                      : "bg-amber-500/10 border-amber-400/30 text-[#ffe088]"
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[9px] text-stone-450 uppercase tracking-widest font-bold">ID: 0049-EX</span>
                </div>

                <h4 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-900" : "text-white"}`}>Portfolio Yield</h4>
                <p className="text-xs text-stone-550 dark:text-slate-350 font-sans mt-2 leading-relaxed">
                  Diversified risk assessment across emerging markets and tech holdings. Adjust target strategy profile below.
                </p>

                {/* Risk profile adjustments */}
                <div className="flex gap-1.5 mt-4">
                  {[
                    { key: "conservative", title: "Conserv.", target: 45, idx: 0.015 },
                    { key: "optimal", title: "Optimal", target: 75, idx: 0.04 },
                    { key: "aggressive", title: "Aggressive", target: 95, idx: 0.085 },
                  ].map(tier => (
                    <button
                      key={tier.key}
                      onClick={() => {
                        setSelectedRiskTier(tier.key as any);
                        setRiskTargetPercent(tier.target);
                        setRiskIndexValue(tier.idx);
                        showHudToast(`🎯 Profil réaligné: STRATÉGIE ${tier.title.toUpperCase()} (${tier.target}% ciblé)`);
                      }}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[8.5px] font-mono uppercase tracking-widest border transition-all ${
                        selectedRiskTier === tier.key
                          ? isLightMode 
                            ? "bg-stone-900 border-stone-800 text-white" 
                            : "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                          : isLightMode 
                            ? "bg-white border-stone-200 text-stone-600 hover:bg-stone-50" 
                            : "bg-slate-900/40 border-slate-800 hover:bg-slate-900 text-slate-400"
                      }`}
                    >
                      {tier.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-stone-150 dark:bg-white/5 h-2 rounded-full mb-3.5 relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-500" 
                    style={{ width: `${riskTargetPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                  <span className="text-stone-400 uppercase tracking-widest">MIN ACCEPTABLE</span>
                  <span className="text-amber-500 uppercase tracking-wider">{riskTargetPercent}% ACHIEVED</span>
                </div>
              </div>
            </div>

            {/* Strategic Summary Bento Cards: 3 column nodes */}
            <div 
              id="bento-summary-nodes"
              onClick={() => {
                setSystemNodesCount(prev => prev + 1);
                showHudToast("🛰️ Réseau principal pingé! Nouveaux noeuds synchronisés.");
              }}
              className={`md:col-span-4 p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 cursor-pointer group ${
                isLightMode ? "bg-white border-stone-200 hover:border-stone-400" : "bg-[#111318]/50 border-white/5 hover:border-cyan-400/20"
              }`}
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-shadow duration-300 group-hover:shadow-md ${
                isLightMode 
                  ? "bg-[#0f4c81]/15 border-[#0f4c81]/30 text-[#0f4c81]" 
                  : "bg-cyan-500/10 border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(0,219,233,0.15)]"
              }`}>
                <Network className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-mono text-stone-400 tracking-wider uppercase">SYSTEM NODES</p>
                <p className={`text-xl font-bold font-mono tracking-tight mt-0.5 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                  {systemNodesCount.toLocaleString()} <span className="text-[10px] text-emerald-500 font-black animate-pulse font-sans ml-1">● ACTIVE</span>
                </p>
              </div>
            </div>

            <div 
              onClick={() => {
                setRiskIndexValue(val => parseFloat(Math.min(0.2, val + 0.01).toFixed(3)));
                showHudToast("⚠️ Stress d'audit augmenté temporairement sur le quadrant principal.");
              }}
              className={`md:col-span-4 p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 cursor-pointer group ${
                isLightMode ? "bg-white border-stone-200 hover:border-stone-400" : "bg-[#111318]/50 border-white/5 hover:border-rose-400/20"
              }`}
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-shadow duration-300 group-hover:shadow-md ${
                isLightMode 
                  ? "bg-rose-100 border-rose-300 text-rose-700" 
                  : "bg-red-500/10 border-red-500/35 text-red-400"
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-mono text-stone-400 tracking-wider uppercase">RISK INDEX</p>
                <p className={`text-xl font-bold font-mono tracking-tight mt-0.5 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                  {riskIndexValue} <span className="text-[10px] text-emerald-500 font-extrabold font-sans ml-1">STABLE</span>
                </p>
              </div>
            </div>

            <div 
              onClick={() => {
                setAlgoAccuracyPercent(val => Math.min(99.9, val + 0.1));
                showHudToast("📈 Modèle neuronal optimisé! Redondance de calcul accrue.");
              }}
              className={`md:col-span-4 p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 cursor-pointer group ${
                isLightMode ? "bg-white border-stone-200 hover:border-stone-400" : "bg-[#111318]/50 border-white/5 hover:border-amber-400/20"
              }`}
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 transition-shadow duration-300 group-hover:shadow-md ${
                isLightMode 
                  ? "bg-amber-100 border-amber-300 text-amber-700" 
                  : "bg-amber-500/10 border-amber-550/35 text-[#ffe088]"
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-mono text-stone-400 tracking-wider uppercase">ALGO ACCURACY</p>
                <p className={`text-xl font-bold font-mono tracking-tight mt-0.5 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                  {algoAccuracyPercent}% <span className="text-[10px] text-amber-500 font-extrabold font-sans ml-1">OPTIMIZED</span>
                </p>
              </div>
            </div>

          </div>

          {/* Detailed Asset Architecture Section */}
          <div className="pt-8">
            <h3 className={`text-sm font-black uppercase tracking-widest mb-6 border-l-4 ${isLightMode ? "border-stone-900 text-stone-950" : "border-cyan-400 text-white"} pl-3.5`}>
              Executive Asset View
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Asset 1: Nexus Towers */}
              <div 
                id="asset-card-nexus"
                onClick={() => {
                  setActiveAssetDetails(activeAssetDetails === "nexus_towers" ? null : "nexus_towers");
                  showHudToast("🏨 Reconstitution stéréoscopique de Nexus Towers...");
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 relative ${
                  isLightMode 
                    ? "bg-white border-stone-200 hover:border-stone-400 hover:shadow-md" 
                    : "bg-[#111318]/90 border-slate-800 hover:border-cyan-400/40"
                }`}
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4BQ7kRC-GbSHDV9WbvPYFyEdi0vk3jXWbZE0K8UNQqePoElxXuHIIZGkZpKbDqB4-oUJYxJYGpYWCAuvJ_5f3xcTfWH69lT1boFbEaZh8a0XzMPrYSbLA7kD5D-tY7kuXG8ZWnt9m46fxt6cSBxDWM5spF7Pq7yat45XBz6TwLNwLCOwTshcIoDWgoE4MRErqQuKTw9IYsL6-p_qdVPPWEQtVk28CRVIPka3-t5RyRSYKRtiaxYMAe0ZQ4appLOdF_lwUe_vlkJHg"
                    alt="Nexus Towers skyscraper architecture structure"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#111318]/90 to-transparent`} />
                </div>
                <div className="p-5 text-left">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">CRYPTO-REAL ESTATE</span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-black tracking-wider">V-01</span>
                  </div>
                  <h4 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-900" : "text-white"}`}>Nexus Towers</h4>
                  
                  <div className="flex justify-between border-t border-stone-200/50 dark:border-white/5 pt-4 mt-4 text-xs font-mono">
                    <div className="text-left">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">VALUATION</p>
                      <p className={`text-xs font-black mt-1 ${isLightMode ? "text-stone-900" : "text-primary"}`}>$842.0M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">YOY GROWTH</p>
                      <p className="text-xs font-black text-secondary mt-1">+18.2%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset 2: Aeon Core Nodes */}
              <div 
                id="asset-card-aeon"
                onClick={() => {
                  setActiveAssetDetails(activeAssetDetails === "aeon_core" ? null : "aeon_core");
                  setIsPingingNode(true);
                  setSimulatedPing([]);
                  setTimeout(() => {
                    setSimulatedPing([14, 18, 12, 16, 11]);
                    setIsPingingNode(false);
                  }, 1200);
                  showHudToast("⚛️ Test d'intégrité de liaison Aeon Core...");
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 relative ${
                  isLightMode 
                    ? "bg-white border-stone-200 hover:border-stone-400 hover:shadow-md" 
                    : "bg-[#111318]/90 border-slate-800 hover:border-amber-400/40"
                }`}
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKF5SlnMxSZruExkc4cjSrfd_I4jw45IrTYZg3x4ltbcOu-Ruie2227k8SDObGt8gVWCg1stpiWd0RaQwf59lRZSjM-EHZOu21P7Ao39Lo0ATfAzE3GyLMLqHIpX9-rouASkvIcvLcCKvEPZEj3yTI-K3odVo4RxF5jJ9NfMUlXqV8NEW4Q3s3wwTulyze8DR5UQP8f6dx9VLOXjCnVZgFfHy14rP8XC73GQPU1EIAtueBCM06yYqpljjc5Airiz8WY9dkxOvBlaCz"
                    alt="Complex servers hardware arrays and modules"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#111318]/90 to-transparent`} />
                </div>
                <div className="p-5 text-left">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">QUANTUM COMPUTE</span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-black tracking-wider">Q-09</span>
                  </div>
                  <h4 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-900" : "text-white"}`}>Aeon Core Nodes</h4>
                  
                  <div className="flex justify-between border-t border-stone-200/50 dark:border-white/5 pt-4 mt-4 text-xs font-mono">
                    <div className="text-left">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">THROUGHPUT</p>
                      <p className={`text-xs font-black mt-1 ${isLightMode ? "text-stone-900" : "text-primary"}`}>12.4 PB/s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">EFFICIENCY</p>
                      <p className="text-xs font-black text-secondary mt-1">MAX</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset 3: Orbital Supply */}
              <div 
                id="asset-card-supply"
                onClick={() => {
                  setActiveAssetDetails(activeAssetDetails === "orbital_supply" ? null : "orbital_supply");
                  showHudToast("🛰️ Cartographie de la trame globale de transit...");
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 relative ${
                  isLightMode 
                    ? "bg-white border-stone-200 hover:border-stone-400 hover:shadow-md" 
                    : "bg-[#111318]/90 border-slate-800 hover:border-cyan-400/40"
                }`}
              >
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUnjjPC4Tuqw84yO71WYWYw4Y7_GneUtFRc0mbwo5yhurZn3FMSJ9VzsBCbxIX2rTMgIl3vhHPPSDakvX9vM4jRyGAOjexTwsealQ21wrlr5yAUETproU4wK8rZ_R5dTKonXts662zOhitblz7WkmWS_Cafu0DDbKdlimnkTkE9vzkHWBodcNnZrWhPeK0mEs8aVex8cOX5szw__XhYBZR6qMf-8em-MIL0P_qx7UK4rGMnd_C9moQ3V7rtvZN0kfAIdwCSQ0YokUJ"
                    alt="Satellite imagery visualization network digital data streams"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#111318]/90 to-transparent`} />
                </div>
                <div className="p-5 text-left">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-widest">LOGISTICS AI</span>
                    <span className="text-[10px] font-mono text-stone-400 uppercase font-black tracking-wider">G-12</span>
                  </div>
                  <h4 className={`text-base font-bold uppercase tracking-tight ${isLightMode ? "text-stone-900" : "text-white"}`}>Orbital Supply</h4>
                  
                  <div className="flex justify-between border-t border-stone-200/50 dark:border-white/5 pt-4 mt-4 text-xs font-mono">
                    <div className="text-left">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">TOTAL REACH</p>
                      <p className={`text-xs font-black mt-1 ${isLightMode ? "text-stone-900" : "text-primary"}`}>GLOBAL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-stone-400 uppercase font-bold tracking-widest">REVENUE</p>
                      <p className="text-xs font-black text-secondary mt-1">$1.2B</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Asset Telemetry Details Drawer (Triggered by clicking cards) */}
            {activeAssetDetails && (
              <div className={`p-5 rounded-2xl border mt-6 animate-fade-in text-left ${
                isLightMode ? "bg-stone-50 border-stone-200" : "bg-[#141720]/85 border-slate-800"
              }`}>
                {activeAssetDetails === "nexus_towers" && (
                  <div>
                    <h4 className="text-xs font-mono font-extrabold text-cyan-500 uppercase tracking-widest mb-2">[SPECIFICATIONS FILAIRES — NEXUS TOWERS]</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Ancrage structurel à 742m d'altitude relative. Les coefficients d'élasticité indiquent une résilience sismique de <strong>Tier 1</strong>.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 font-mono text-[10.5px]">
                      <div className="p-2 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block text-[9.5px]">Isolants:</span>
                        <span className={`font-extrabold ${isLightMode ? "text-stone-800" : "text-white"}`}>Carbone Fibré</span>
                      </div>
                      <div className="p-2 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block text-[9.5px]">Degré de déflexion:</span>
                        <span className="font-extrabold text-emerald-500">0.02% optimal</span>
                      </div>
                      <div className="p-2 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block text-[9.5px]">Fatigue structurelle:</span>
                        <span className={`font-extrabold ${isLightMode ? "text-stone-800" : "text-white"}`}>Négligeable</span>
                      </div>
                      <div className="p-2 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block text-[9.5px]">Certif. Acoustique:</span>
                        <span className="font-extrabold text-[#0f4c81] dark:text-cyan-455">ISO-9011</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeAssetDetails === "aeon_core" && (
                  <div>
                    <h4 className="text-xs font-mono font-extrabold text-amber-500 uppercase tracking-widest mb-2">[DÉBOURSEMENT SÉCURISÉ — AEON CORE]</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      Mesure de latence stochastique en cours vers les grappes quantiques (Singapore Edge & Tokyo Base Cluster).
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center font-mono">
                      <div className="text-[11px] min-w-[200px]">
                        Status de communication: {isPingingNode ? (
                          <span className="text-amber-500 animate-pulse font-bold">LANCEMENT DES FAISCEAUX DE LIENS...</span>
                        ) : (
                          <span className="text-emerald-500 font-bold">TRANSMISSION CRISTALLINE COMPLÈTE</span>
                        )}
                      </div>
                      {!isPingingNode && simulatedPing.length > 0 && (
                        <div className="flex gap-2">
                          {simulatedPing.map((ping, idx) => (
                            <div key={idx} className="p-2 bg-white dark:bg-[#111318]/80 border border-stone-200 dark:border-slate-800 rounded-lg text-center min-w-[64px]">
                              <span className="text-[8px] text-stone-400 block uppercase">NODE-0{idx+1}</span>
                              <strong className={`${isLightMode ? "text-stone-850" : "text-white"}`}>{ping}ms</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeAssetDetails === "orbital_supply" && (
                  <div>
                    <h4 className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-widest mb-2">[INTELLIGENCE DES FLUX CONTINUS — SUPPLY AI]</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-305">
                      Contrôle des corridors automatisés de drone. Les algorithmes mesurent en continu toute perturbation d'ancrage orographique.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 font-mono text-[10.5px]">
                      <div className="p-3 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block">Couverture terrestre global:</span>
                        <span className="font-extrabold text-stone-800 dark:text-white">98.4% nominal</span>
                      </div>
                      <div className="p-3 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block">Corridors prioritaires:</span>
                        <span className="font-extrabold text-[#0f4c81] dark:text-cyan-400">Drapeau d'Élite</span>
                      </div>
                      <div className="p-3 border rounded-xl bg-white dark:bg-[#111318]/50 border-stone-200 dark:border-slate-800">
                        <span className="text-stone-500 block">Risque de congestion:</span>
                        <span className="font-extrabold text-teal-600">INFÉRIEUR 0.02%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decision Table Operational Log */}
          <div className="mt-8">
            <div className={`p-5 rounded-t-2xl border-t border-x flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/90 border-slate-850"
            }`}>
              <div>
                <h3 className={`text-base font-black uppercase tracking-wider ${isLightMode ? "text-stone-900" : "text-white"}`}>Operational Log</h3>
                <p className="text-xs text-stone-500 mt-1">Sovereign decentralized node audit actions</p>
              </div>
              <div className="flex gap-2 font-mono shrink-0">
                <button 
                  onClick={() => {
                    showHudToast("📋 Rapport de sécurité stratégique exporté avec succès.");
                  }}
                  className={`px-3 py-1.5 border rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isLightMode 
                      ? "bg-white border-stone-200 hover:bg-stone-100 text-stone-705" 
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-805 text-slate-300"
                  }`}
                >
                  Export PDF
                </button>
                <button 
                  onClick={() => setShowNewDirectiveModal(true)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white shadow-md`}
                >
                  <Plus className="w-3 h-3" />
                  New Directive
                </button>
              </div>
            </div>

            {/* Injected Form to easily create new directives */}
            {showNewDirectiveModal && (
              <div className={`p-5 border-x border-b animate-fade-in text-left ${
                isLightMode ? "bg-stone-50 border-stone-200 text-stone-800" : "bg-slate-950/90 border-slate-850 text-slate-300"
              }`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-500 mb-4">[ FORMULAIRE DE DIRECTIVE DE NOEUD RURAL ]</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-stone-400 block uppercase mb-1">Nom du Noeuds / Identité</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-stone-850 dark:text-white border-stone-300 dark:border-slate-800"
                      placeholder="e.g. Frankfurt Core III"
                      value={newDirectiveEntity}
                      onChange={(e) => setNewDirectiveEntity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-stone-400 block uppercase mb-1">Status de Télémétrie</label>
                    <select 
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-stone-855 dark:text-white border-stone-300 dark:border-slate-800"
                      value={newDirectiveStatus}
                      onChange={(e) => setNewDirectiveStatus(e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OPTIMIZING">OPTIMIZING</option>
                      <option value="STANDBY">STANDBY</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-stone-400 block uppercase mb-1">Impact Télémétrique</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-stone-855 dark:text-white border-stone-300 dark:border-slate-800"
                      placeholder="e.g. +0.8% Yield"
                      value={newDirectiveImpact}
                      onChange={(e) => setNewDirectiveImpact(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-stone-400 block uppercase mb-1">Métriques (X / Y Coordinates)</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none bg-white dark:bg-slate-900 text-stone-855 dark:text-white border-stone-300 dark:border-slate-800"
                      placeholder="e.g. 19.82 / 92.01"
                      value={newDirectiveMetric}
                      onChange={(e) => setNewDirectiveMetric(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 mt-5 font-mono">
                  <button 
                    onClick={() => {
                      setShowNewDirectiveModal(false);
                      setNewDirectiveEntity("");
                    }}
                    className="px-3 py-1.5 border border-stone-200 dark:border-slate-800 rounded-xl text-[10px] uppercase font-bold hover:bg-stone-100 dark:text-white"
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={() => {
                      if (!newDirectiveEntity) {
                        showHudToast("⚠️ Saisissez une identité de nœud valide!");
                        return;
                      }
                      const seconds = String(new Date().getUTCSeconds()).padStart(2, "0");
                      const minutes = String(new Date().getUTCMinutes()).padStart(2, "0");
                      const hours = String(new Date().getUTCHours()).padStart(2, "0");
                      const timestamp = `${hours}:${minutes}:${seconds} UTC`;

                      const newLog = {
                        id: `LOG-0${operationalLogs.length + 1}`,
                        entity: newDirectiveEntity,
                        status: newDirectiveStatus,
                        impact: newDirectiveImpact,
                        metric: newDirectiveMetric,
                        timestamp: timestamp,
                      };
                      setOperationalLogs([...operationalLogs, newLog]);
                      showHudToast(`✅ Directive ajoutée: ${newDirectiveEntity}`);
                      setShowNewDirectiveModal(false);
                      setNewDirectiveEntity("");
                    }}
                    className="px-3 py-1.5 bg-[#0f4c81] text-white rounded-xl text-[10px] uppercase font-bold"
                  >
                    Confirmer la Directive
                  </button>
                </div>
              </div>
            )}

            {/* List Table Data */}
            <div className="overflow-x-auto border-x border-b rounded-b-2xl">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className={isLightMode ? "bg-stone-100 text-stone-800" : "bg-white/5 text-purple-100"}>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest">ENTITY</th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest">STATUS</th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest">IMPACT</th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest">METRIC</th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-right">TIMESTAMP</th>
                    <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-white/5">
                  {operationalLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-all group">
                      <td className={`px-5 py-4 text-xs font-bold ${isLightMode ? "text-stone-900" : "text-white"}`}>{log.entity}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[8.5px] font-bold uppercase font-sans tracking-wider border ${
                          log.status === "ACTIVE" 
                            ? "bg-emerald-100/30 text-emerald-600 border-emerald-500/20" 
                            : log.status === "OPTIMIZING" 
                              ? "bg-amber-100/30 text-amber-600 border-amber-500/20" 
                              : "bg-stone-200/50 text-stone-600 border-stone-250"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-xs font-bold ${log.impact.includes("+") ? "text-emerald-550" : "text-stone-400"}`}>{log.impact}</td>
                      <td className="px-5 py-4 text-[10.5px] text-stone-500">{log.metric}</td>
                      <td className="px-5 py-4 text-right text-[10.5px] text-stone-500">{log.timestamp}</td>
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => {
                            setOperationalLogs(operationalLogs.filter(item => item.id !== log.id));
                            showHudToast(`❌ Directive annulée: ${log.entity}`);
                          }}
                          className="p-1 px-2 border rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-550 transition-all font-sans text-[10px] cursor-pointer"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEWPORT 01: CARTOGRAPHIE SPATIALE (GLOBAL ATLAS) */}
      {currentTab === "map" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          {/* Header context card */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-stone-300 pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest leading-none">[RECONSTRUCTION DE SCÈNE — V2.8]</p>
              <h2 className={`text-xl font-bold tracking-tight uppercase italic ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Réseaux de Fluides Continentaux (Atlas System)
              </h2>
              <p className="text-stone-500 text-xs mt-1 max-w-2xl font-sans">
                Visualisation matricielle des liaisons sous-marines et des zones stratégiques de communication des nœuds. Sélectionnez un nœud pour isoler la zone.
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-right shrink-0">
              <div className="hidden md:block">
                <span className="text-[7.5px] font-mono text-stone-400 font-bold block uppercase tracking-wider">REPLICATE CLOCK</span>
                <span className={`text-xs font-mono font-bold leading-none ${isLightMode ? "text-[#0f4c81]" : "text-cyan-400"}`}>
                  {atlasTimestamp}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* World Map interactive workspace wrapper */}
            <div className={`lg:col-span-8 border rounded-2xl overflow-hidden relative min-h-[460px] flex flex-col justify-between ${
              isLightMode 
                ? "bg-stone-50 border-stone-200/80 shadow-inner" 
                : "bg-slate-950/60 border-slate-800"
            }`}>
              
              {/* Backing structural map graphic */}
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply select-none">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiqcfPRHpu5CGAuqueCCO-TRkYGxB9na44PJV_UJXn2yEOYTuzQAYVsK5P7AOv5aFy2baMPYq57VGWrOlmkE6lq1gyWaN4HDphogRLFrZI3DJphyZcMvYi-TiUjfvxOyBC8BTUhw2Pe8JMAV4wO7Gql8fKYuvrUrVkphALBJGppL6nz3LooPm_exyj9KS5G0Ue6Ebgx-uXtsm2Hg4z6KSKqXm8aWzw_iB6l1EoEckCpPydoosH8y24g7d5zUxUOSoBjLMUpKEinNMa" 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover filter brightness-95 opacity-30 ${isLightMode ? "grayscale" : "invert grayscale"}`}
                  alt="Mapping Ground"
                />
              </div>

              {/* Arcing connection vectors in SVG */}
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 500">
                {/* Lines */}
                <path d="M 180,240 Q 380,110 580,240 T 820,310" fill="none" stroke={isLightMode ? "#0f4c81" : "#00dbe9"} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 90,140 Q 290,290 490,140 T 780,140" fill="none" stroke={isLightMode ? "rgba(15, 76, 129, 0.45)" : "rgba(34, 211, 238, 0.45)"} strokeWidth="1.2" />
                
                {/* Node coordinates / clickable zones */}
                {[
                  { key: "north_alpha", cx: 200, cy: 250, label: "Nord Alpha", color: "#3b82f6" },
                  { key: "pacific_grid", cx: 850, cy: 320, label: "Spine Pacifique", color: "#f59e0b" },
                  { key: "europe_central", cx: 480, cy: 145, label: "Europe Cent.", color: "#10b981" },
                  { key: "north_am_west", cx: 210, cy: 175, label: "Californie Hub", color: "#ec4899" },
                  { key: "asia_pacific_south", cx: 730, cy: 280, label: "Dorsale Asie", color: "#8b5cf6" },
                ].map((node) => {
                  const isSelected = atlasActiveZone === node.key;
                  return (
                    <g key={node.key} className="cursor-pointer pointer-events-auto group" onClick={() => {
                      setAtlasActiveZone(node.key as any);
                      showHudToast(`🛰️ Faisceau orienté sur la zone : ${node.label}`);
                    }}>
                      <circle cx={node.cx} cy={node.cy} r={isSelected ? "7" : "4.5"} fill={node.color} />
                      <circle cx={node.cx} cy={node.cy} r={isSelected ? "18" : "10"} stroke={node.color} strokeWidth="1" strokeOpacity="0.5" fill="none" className="animate-pulse" />
                      {isSelected && (
                        <circle cx={node.cx} cy={node.cy} r="28" stroke={node.color} strokeWidth="0.8" strokeOpacity="0.3" fill="none" className="animate-ping" style={{ animationDuration: "3s" }} />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Status and Active node specs overlaid at top */}
              <div className="p-4 flex justify-between items-start z-10 w-full">
                <div className={`p-3 rounded-lg border text-[11px] max-w-[280px] font-mono leading-relaxed ${
                  isLightMode ? "bg-white/90 border-stone-200 shadow-sm" : "bg-slate-950/90 border-slate-800"
                }`}>
                  <span className="font-bold text-stone-400 block uppercase text-[8px] tracking-wide mb-1">PROPRIÉTÉ DE ZONE ACTUELLE</span>
                  <div className="font-bold text-[#0f4c81] dark:text-cyan-400">{activeZoneDetails.name}</div>
                  <div className="text-stone-500 mt-1">Secteur: {activeZoneDetails.region}</div>
                  <div className="flex justify-between mt-1 pt-1 border-t border-stone-100">
                    <span>Nœuds actifs: {activeZoneDetails.units}</span>
                    <span className="text-emerald-500">Flux: {activeZoneDetails.load}</span>
                  </div>
                </div>

                {/* Satellite overlay info */}
                <div className="text-right font-mono text-[8px] text-stone-400 space-y-0.5">
                  <div>SAT_TRACK: INSAT-9B</div>
                  <div>AZIMUTH: 182.4°E</div>
                  <div>ALT: 35,786 KM</div>
                </div>
              </div>

              {/* Interactive switch selection for zones */}
              <div className="p-4 z-10 w-full flex flex-wrap gap-1.5 justify-start bg-gradient-to-t from-stone-100/50 to-transparent">
                <button
                  onClick={() => setAtlasActiveZone("all")}
                  className={`px-3 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider border transition-all ${
                    atlasActiveZone === "all"
                      ? "bg-stone-900 border-stone-800 text-white"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Tout Afficher
                </button>
                {[
                  { key: "north_alpha", name: "Atlantique" },
                  { key: "pacific_grid", name: "Pacifique" },
                  { key: "europe_central", name: "Europe Central" },
                  { key: "north_am_west", name: "US West" },
                  { key: "asia_pacific_south", name: "Asie-Pacifique" },
                ].map(b => (
                  <button
                    key={b.key}
                    onClick={() => setAtlasActiveZone(b.key as any)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider border transition-all ${
                      atlasActiveZone === b.key
                        ? "bg-[#0f4c81] border-[#0f4c81] text-white"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Side specifications card */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-5 rounded-2xl border ${
                isLightMode ? "bg-white border-stone-200/90 shadow-sm" : "bg-[#111317]/60 border-slate-800"
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isLightMode ? "text-stone-900" : "text-white"}`}>
                  Spécification des Portées
                </h3>
                
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                    <span className="text-stone-400">Index Systémique</span>
                    <span className="font-bold">{atlasActiveZone === "all" ? "A-101 GLOBAL" : `REF-${atlasActiveZone.toUpperCase()}`}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                    <span className="text-stone-400">Nodes Répertoriés</span>
                    <span className="font-bold">{atlasNodesCount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                    <span className="text-stone-400">Latence Mesurée</span>
                    <span className="font-bold text-amber-500">{atlasLatency}s</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-stone-400">Facteur de Surcharge</span>
                    <span className="font-bold">{atlasLoadFactor}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-slate-800">
                  <span className="text-[8px] font-mono leading-none tracking-wider text-slate-400 block uppercase font-bold mb-2">EXPORTATION DE LA SCÈNE</span>
                  <button
                    onClick={() => {
                      setIsExportingSpatial(true);
                      setTimeout(() => {
                        setIsExportingSpatial(false);
                        showHudToast("📋 Fiches de relevés topologiques exportées au format PDF d'Atelier.");
                      }, 2000);
                    }}
                    disabled={isExportingSpatial}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center justify-center gap-2"
                  >
                    <Download className={`w-3.5 h-3.5 ${isExportingSpatial ? "animate-spin" : ""}`} />
                    {isExportingSpatial ? "Impression des plans..." : "Exporter le relevé spatial"}
                  </button>
                </div>
              </div>

              {/* General Legend Spec block */}
              <div className={`p-5 rounded-2xl border ${
                isLightMode ? "bg-white border-stone-200/90 shadow-sm" : "bg-[#111317]/60 border-slate-800"
              }`}>
                <h4 className="text-[8.5px] font-mono font-extrabold text-[#0f4c81] uppercase tracking-wide mb-2.5">Nomenclature et Légende</h4>
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-stone-500">[Nord Alpha] Liaisons transatlantiques haute sismicité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-stone-500">[Spine Pacifique] Trame de câblage fibreux lourd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-slate-500">[Europe] Jonctions continentales à blindage isolant</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEWPORT 02: BIBLIOTHÈQUE D'ARCHIVES (ARCHIVE VAULT) */}
      {currentTab === "vault" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-stone-300 pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest leading-none">[CATALOGUE OFFICIEL DES STRUCTURES]</p>
              <h2 className={`text-xl font-bold tracking-tight uppercase italic ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Bibliothèque d'Archives Techniques (Drawing Repository)
              </h2>
              <p className="text-[#a8a29e] text-xs mt-1 max-w-2xl font-sans">
                Fiches de nomenclatures, dessins techniques et dalles de matière. Utilisez la barre de recherche technique pour filtrer par section.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input 
                  ref={vaultInputRef}
                  type="text"
                  value={vaultSearchQuery}
                  onChange={(e) => setVaultSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 ${
                    isLightMode 
                      ? "bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:ring-stone-400" 
                      : "bg-[#111318] border-slate-800 text-white placeholder:text-slate-500 focus:ring-slate-700"
                  }`}
                  placeholder="Rechercher référence ou mot-clé..."
                />
              </div>
            </div>
          </div>

          {/* Filters switches */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "TOUT" },
              { key: "STRUCTURAL", label: "STRUCTURAL" },
              { key: "SPATIAL", label: "AMÉNAGEMENT" },
              { key: "KINETIC", label: "FONDATIONS" },
              { key: "MATERIALS", label: "CONDUITS & FLUIDES" },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedVaultCategory(cat.key as any);
                  showHudToast(`Filtre d'archive : ${cat.label}`);
                }}
                className={`px-4 py-2 rounded-lg text-[9.5px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedVaultCategory === cat.key
                    ? "bg-[#0f4c81] border-[#0f4c81] text-white"
                    : isLightMode 
                      ? "bg-white border-stone-200 hover:bg-stone-50 text-stone-600"
                      : "bg-[#161920] border-slate-800 hover:bg-slate-900 text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Slabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultItems.filter(item => {
              const matchesSearch = item.title.toLowerCase().includes(vaultSearchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(vaultSearchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(vaultSearchQuery.toLowerCase());
              const matchesCategory = selectedVaultCategory === "ALL" || item.category === selectedVaultCategory;
              return matchesSearch && matchesCategory;
            }).map(item => (
              <div
                key={item.id}
                className={`p-4 border rounded-2xl flex gap-4 transition-all duration-300 group ${
                  isLightMode 
                    ? "bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm" 
                    : "bg-[#111317]/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Structural image */}
                <div className="w-24 h-24 overflow-hidden rounded-xl bg-stone-100 border border-stone-200 shrink-0">
                  <img 
                    src={item.image} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body Specs info */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${
                        isLightMode ? "bg-[#0f4c81]/10 text-[#0f4c81]" : "bg-cyan-500/20 text-cyan-400"
                      }`}>{item.id}</span>
                      <span className="text-[8.5px] font-mono text-stone-400">{item.coordinates}</span>
                    </div>
                    <h3 className={`text-sm font-bold uppercase tracking-tight leading-none ${isLightMode ? "text-stone-900" : "text-white"}`}>{item.title}</h3>
                    <p className="text-stone-500 text-[10.5px] mt-1 font-mono leading-tight">{item.description}</p>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-100 dark:border-slate-800/60">
                    <span className="text-[9px] font-mono text-stone-400">SYNC: {item.lastSync}</span>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => showHudToast(`Téléchargement de la planche technique ${item.id}`)}
                        className={`p-1.5 border rounded-lg transition-all ${
                          isLightMode ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100" : "bg-slate-900 border-slate-800 text-white"
                        }`}
                        title="Impression Plan"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => showHudToast(`Aperçu 3D stéréoscopique activé : ${item.title}`)}
                        className={`p-1.5 border rounded-lg transition-all ${
                          isLightMode ? "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100" : "bg-slate-900 border-slate-800 text-white"
                        }`}
                        title="Visualiser"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Capacity Spec and Synchronization block */}
          <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] ${
            isLightMode ? "bg-stone-50 border-stone-200 text-stone-700" : "bg-slate-950 border-slate-800 text-slate-300"
          }`}>
            <div>
              <span className="text-stone-400 block text-[8px] uppercase font-bold tracking-wider">INDEX D'ARCHIVAGE</span>
              <span className="font-extrabold text-stone-900 dark:text-white">VOL. DE SYNTHÈSE IV</span>
              <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-stone-900" style={{ width: "70%" }} />
              </div>
            </div>

            <div>
              <span className="text-stone-400 block text-[8px] uppercase font-bold tracking-wider">FORMAT STANDARD COMPATIBLE</span>
              <span className="font-extrabold text-[#0f4c81] dark:text-cyan-400">DWG / PLT D'ARCHITECTE</span>
              <p className="text-[8.5px] text-stone-500 leading-tight mt-1">Relevés compatibles normes ISO-9001.</p>
            </div>

            <div>
              <span className="text-stone-400 block text-[8px] uppercase font-bold tracking-wider">COMPTE-A-REBOURS DES CHARGES</span>
              <span className="font-extrabold">
                {syncEta.minutes}m {syncEta.seconds < 10 ? `0${syncEta.seconds}` : syncEta.seconds}s
              </span>
              <p className="text-[8.5px] text-stone-500 leading-tight mt-1">Mise à jour topologique automatique.</p>
            </div>
          </div>

        </div>
      )}

      {/* VIEWPORT 03: COURBES DE FLUX (SIGNAL FLOW HORIZON) */}
      {currentTab === "horizon" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          {/* Panoramic design drawing paper section with absolute custom paths */}
          <div className={`p-6 border rounded-2xl relative min-h-[350px] overflow-hidden flex flex-col justify-between ${
            isLightMode 
              ? "bg-[#FAF7F0] border-stone-200/95" 
              : "bg-slate-950/90 border-slate-800"
          }`}>
            <div className="absolute inset-0 z-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnmVKaKWG3DZyW3AIdGW4NDKCSOD6t5Z-g_FMrp3AZLAxgNL7doQv_fMEwDNsQzlQ78uWziBB9f7wo6CeOaopQv1UzqlTV8SnvnD8rA8HxS4CxG3n5CUKwThJgKNHduUNbl1MiBxWSeARl0rVgp7Mq80e7B-DWR08Ev56t8qEgqgSFaq3RVeEfUTBeaIWYJvTktcgCaXkb1sYddjTshVo4Bl1ytqiFbKF8YDeobth6hyi9KcYoSU1hFZcg3YRQS058n3ATy4fPHmO7" 
                className={`w-full h-full object-cover filter brightness-95 opacity-20 ${isLightMode ? "grayscale" : "invert grayscale"}`}
                alt="Continuous grid line drawing representational sheet" 
              />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 400">
                <path d="M-50,200 Q250,50 500,200 T1050,200" fill="none" stroke={isLightMode ? "#0f4c81" : "#00dbe9"} strokeOpacity="0.3" strokeWidth="1.2" />
                <path d="M-50,280 Q350,150 600,280 T1050,280" fill="none" stroke={isLightMode ? "rgba(15, 76, 129, 0.45)" : "rgba(34, 211, 238, 0.45)"} strokeWidth="1" strokeDasharray="5 5" />
              </svg>
            </div>

            {/* Sweep Scanline */}
            {isScanning && (
              <div 
                className={`absolute left-0 right-0 h-[1.5px] z-20 pointer-events-none ${
                  isLightMode ? "bg-[#0f4c81] shadow-[0_0_8px_rgba(15,76,129,0.5)]" : "bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                }`}
                style={{ top: `${scanProgress}%`, transition: "top 120ms linear" }}
              />
            )}

            <div className="relative z-10 max-w-xl space-y-2">
              <span className={`inline-block font-mono text-[8px] font-bold px-2 py-0.5 rounded border ${
                isLightMode ? "bg-white/80 border-stone-200 text-stone-700" : "bg-slate-900 border-slate-800 text-slate-300"
              }`}>relevé de trame continuel</span>
              <h2 className={`text-xl font-bold tracking-tight uppercase italic leading-none ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Gabarit Spatiale des Courbes de Liquides
              </h2>
              <p className="text-stone-500 text-xs font-sans leading-relaxed">
                Ce diagramme modélise les flux continus de fluides et de liaisons de secours terrestres. Le balayage séquentiel permet de mesurer si une rupture de flexion affecte l'infrastructure.
              </p>
            </div>

            <div className="relative z-10 flex gap-3 pt-6 items-center">
              <button
                onClick={() => {
                  setIsScanning(true);
                  setScanProgress(0);
                  showHudToast("🔬 Lancement du balayage d'intégrité de la structure...");
                }}
                disabled={isScanning}
                className="px-4 py-2 border rounded-xl font-mono text-[9px] uppercase tracking-widest font-black transition-all flex items-center gap-2 bg-stone-900 border-stone-800 text-stone-100 hover:bg-stone-800 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                {isScanning ? `BALAYAGE ${scanProgress}%` : "Lancer le scan d'intégrité"}
              </button>
              
              <span className="text-[9px] font-mono text-stone-400">SCAN COMPILÉS : {scannedFeedsCount}</span>
            </div>
          </div>

          {/* Recharts chart details */}
          <div className={`p-5 border rounded-2xl ${
            isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLightMode ? "text-stone-900" : "text-white"}`}>
              Évolution Temporelle des Charges et Amortissements (Flux Spatial)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isLightMode ? "#0f4c81" : "#00dbe9"} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={isLightMode ? "#0f4c81" : "#00dbe9"} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e2e8f0" : "#1e293b"} />
                  <XAxis dataKey="name" stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isLightMode ? "#ffffff" : "#0f172a", 
                    borderColor: isLightMode ? "#cbd5e1" : "rgba(34, 211, 238, 0.2)", 
                    borderRadius: "12px",
                    color: isLightMode ? "#0f172a" : "#ffffff", 
                    fontSize: 10,
                    fontFamily: "monospace" 
                  }} />
                  <Area 
                    type="monotone" 
                    dataKey="perf" 
                    stroke={isLightMode ? "#0f4c81" : "#00dbe9"} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#areaGrad)" 
                    name="Performance (T_Perf)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="opt" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    fill="none" 
                    name="Optimisation Relevé (T_Opt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* VIEWPORT 02: MAQUETTE FILAIRE 3D (REDUNDANT STANDALONE - NOW IN INTEGRATED COMMAND HUB) */}
      {false && currentTab === "nexus" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 3D Wireframe Canvas */}
            <div className={`lg:col-span-4 border rounded-2xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden shrink-0 ${
              isLightMode 
                ? "bg-stone-50 border-stone-200" 
                : "bg-slate-950/60 border-slate-800"
            }`}>
              <div className="text-left w-full">
                <span className="text-[8.5px] font-mono text-stone-400 block uppercase">[MAQUETTE NUMÉRIQUE CONCH]</span>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? "text-stone-900" : "text-white"}`}>
                  Noyau Souverain Axis
                </h3>
              </div>

              {/* 3D Wireframe structural element */}
              <div 
                style={{
                  transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transformStyle: "preserve-3d"
                }}
                className="w-40 h-40 flex items-center justify-center my-6 relative transition-transform duration-150 cursor-grab"
                onMouseEnter={() => setIsHoveredCore(true)}
                onMouseLeave={() => setIsHoveredCore(false)}
                onClick={() => {
                  setEncryptionLevel(prev => Math.min(100, prev + 2));
                  showHudToast("⚡ Alignement de la trame renforcé par le pôle central (+2% isolation)");
                }}
              >
                <div className={isLightMode ? "text-[#0f4c81] opacity-75" : "text-cyan-400"}>
                  <Compass className="w-24 h-24 animate-spin" style={{ animationDuration: "10s" }} />
                </div>
                <div className="absolute w-28 h-28 border border-dashed border-stone-400/40 rounded-full" style={{ transform: "rotateX(75deg)" }} />
                <div className="absolute w-28 h-28 border border-dashed border-stone-400/40 rounded-full" style={{ transform: "rotateY(75deg)" }} />
              </div>

              <div className="text-center w-full">
                <h4 className="text-[11px] font-mono uppercase font-black text-slate-500">MÉMOIRES DE COMPRESSION</h4>
                <div className="flex gap-1.5 justify-center mt-2">
                  <span className="w-8 h-1 bg-stone-300 dark:bg-slate-800 rounded-full overflow-hidden">
                    <span className="h-full bg-stone-900 dark:bg-cyan-400 block" style={{ width: "90%" }} />
                  </span>
                  <span className="w-8 h-1 bg-stone-300 dark:bg-slate-800 rounded-full overflow-hidden">
                    <span className="h-full bg-stone-900 dark:bg-cyan-400 block" style={{ width: "65%" }} />
                  </span>
                  <span className="w-8 h-1 bg-stone-300 dark:bg-slate-800 rounded-full overflow-hidden">
                    <span className="h-full bg-stone-900 dark:bg-cyan-400 block" style={{ width: "40%" }} />
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Bento info and clusters list */}
            <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
              
              <div className={`p-5 rounded-2xl border ${
                isLightMode ? "bg-white border-stone-200/90 shadow-sm" : "bg-[#111317]/60 border-slate-800"
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[8px] font-mono text-stone-400 block">[VÉRIFICATEUR INTÉGRITÉ]</span>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isLightMode ? "text-stone-900" : "text-white"}`}>
                      Niveau Structurel Spatial
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setEfficiencyRate(99);
                      showHudToast("🔄 Étalonnage forcé de la trame géométrique en cours...");
                    }}
                    className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                  >
                    Recalibrer
                  </button>
                </div>

                <div className="relative w-full h-40 bg-stone-100 rounded-xl overflow-hidden border border-stone-200/50 flex items-center justify-center">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx0T544-wVp-nHE6VnUx2zXv7UcjQF0Pmxoj75hEWIxVWymWRj-dQITpcbgqTBiLHEbfHIkezFOzCbP08AsdTKUftrUbqzoPLttYLF9vChNbEvXMm_WE0xSzl9k74_s6yuCKlfkKv_G4yxUtTm4m2T5JSxZ3s_hQHd__idHXMWgqg3gM1iL4yEzfuIRcUBY793W8w5dmrbcCm_bRhzMYsVdqAdbjtobhX7R4I36MOqa1tKgG37C9j86Qx84Xq-FYqslHgakbhFIIWd"
                    className={`w-full h-full object-cover opacity-15 scale-102 ${isLightMode ? "" : "invert"}`}
                    alt="Core Diagram blueprint specs representation"
                  />
                  <div className="absolute top-4 left-4 flex gap-6 text-left">
                    <div>
                      <span className="text-xl font-mono font-black text-stone-950 dark:text-white leading-none">{totalCount * 12 + 120}</span>
                      <span className="text-[8px] text-stone-400 block uppercase font-bold tracking-widest leading-none mt-1">Brides Spatiales</span>
                    </div>
                    <div>
                      <span className="text-xl font-mono font-black text-teal-600 dark:text-teal-400 leading-none">{efficiencyRate}%</span>
                      <span className="text-[8px] text-stone-400 block uppercase font-bold tracking-widest leading-none mt-1">Intégrité Trame</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active list table */}
              <div className={`p-4 rounded-xl border ${
                isLightMode ? "bg-stone-50 border-stone-200 text-stone-700" : "bg-slate-950/60 border-slate-800 text-slate-300"
              }`}>
                <h4 className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider mb-2">Structure des Portiques Porteurs</h4>
                
                <div className="divide-y divide-stone-200 dark:divide-slate-800">
                  <div className="py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-stone-400" />
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 dark:text-white">Vertex Pylône Alpha-01</span>
                        <p className="text-[8.5px] text-stone-400">Réf: Secteur 7 • Fondation d'ancrage principal</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 font-bold uppercase">STABLE ONLINE</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-stone-400" />
                      <div>
                        <span className="text-[11px] font-bold text-stone-800 dark:text-white">Liaison Spine IV Corridor</span>
                        <p className="text-[8.5px] text-stone-400">Réf: Section 12 • Amortisseurs sismiques</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 font-bold uppercase">STABLE ONLINE</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEWPORT 03: FLEET HEALTH MATRIX & RESOURCE METRICS */}
      {currentTab === "matrix" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          {/* USER CHOSEN FLEET HEALTH MATRIX CARDS GRID */}
          <div className="mb-6">
            <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isLightMode ? "text-stone-900" : "text-white"}`}>
              Fleet Health Status Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className={`p-5 rounded-2xl border-l-4 border-cyan-400 glass-panel shadow-sm transition-all hover:translate-y-[-2px] ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/50 border-white/5"
              }`}>
                <div className="flex justify-between mb-4 items-center">
                  <span className="font-mono font-black text-[11px]">SOVEREIGN-A1</span>
                  <span className="text-cyan-400 font-mono text-[9px] font-bold glow-cyan">HEALTHY</span>
                </div>
                <div className="h-1 bg-cyan-400/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-cyan-400" style={{ width: "95%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">FLOW LEVEL: 4.8L/s (98%)</p>
              </div>

              <div className={`p-5 rounded-2xl border-l-4 border-rose-500 glass-panel shadow-sm transition-all hover:translate-y-[-2px] ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/50 border-white/5"
              }`}>
                <div className="flex justify-between mb-4 items-center">
                  <span className="font-mono font-black text-[11px]">SOVEREIGN-D4</span>
                  <span className="text-rose-500 font-mono text-[9px] font-bold">CRITICAL</span>
                </div>
                <div className="h-1 bg-rose-500/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-rose-500 animate-pulse" style={{ width: "34%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">VIBRATION LIMIT: OVER LIMIT (112Hz)</p>
              </div>

              <div className={`p-5 rounded-2xl border-l-4 border-amber-500 glass-panel shadow-sm transition-all hover:translate-y-[-2px] ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/50 border-white/5"
              }`}>
                <div className="flex justify-between mb-4 items-center">
                  <span className="font-mono font-black text-[11px]">SOVEREIGN-E2</span>
                  <span className="text-amber-500 font-mono text-[9px] font-bold">WARNING</span>
                </div>
                <div className="h-1 bg-amber-500/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-amber-500" style={{ width: "72%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">TEMPERATURE: HIGH (48°C)</p>
              </div>

              <div className={`p-5 rounded-2xl border-l-4 border-emerald-500 glass-panel shadow-sm transition-all hover:translate-y-[-2px] ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#111318]/50 border-white/5"
              }`}>
                <div className="flex justify-between mb-4 items-center">
                  <span className="font-mono font-black text-[11px]">SYSTEM CORE XI</span>
                  <span className="text-emerald-500 font-mono text-[9px] font-bold">NOMINAL</span>
                </div>
                <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500" style={{ width: "100%" }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">ALL MODULES VERIFIED GREEN</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-stone-300 pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest leading-none">[COMPLIANCE & RESSOURCES FLUIDES]</p>
              <h2 className={`text-xl font-bold tracking-tight uppercase italic ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Spécifications des Fluides & Émissions Carbone (Metrics Matrix)
              </h2>
              <p className="text-stone-500 text-xs mt-1 max-w-2xl font-sans">
                Contrôle par quadrant des budgets alloués et de la conformité environnementale de la structure. Relevés certifiés ISO-14001.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[140px] ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
            }`}>
              <div>
                <span className="text-[8px] font-mono text-stone-400 block uppercase">[INDICE COMPLIANCE MOYEN]</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">{fleetComplianceAvg}%</span>
              </div>
              <div className="h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniSparkData}>
                    <Area type="monotone" dataKey="v" stroke="#0f4c81" fill={isLightMode ? "rgba(15, 76, 129, 0.08)" : "rgba(34, 211, 238, 0.1)"} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[140px] ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
            }`}>
              <div>
                <span className="text-[8px] font-mono text-stone-400 block uppercase">[CONDUITS ACTIFS MESURÉS]</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-stone-900 dark:text-white">{devices.length || 72}</span>
                <span className="text-[8.5px] font-mono text-emerald-500 block leading-tight mt-1">▲ {onlineCount} Liaisons opérationnelles</span>
              </div>
              <div className="h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniSparkData}>
                    <Area type="monotone" dataKey="v" stroke="#10b981" fill="rgba(16, 185, 129, 0.08)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[140px] ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
            }`}>
              <div>
                <span className="text-[8px] font-mono text-stone-400 block uppercase">[BUDGET SPATIAL DE CONSTRUCTION]</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-[#0f4c81] dark:text-cyan-400">$2.4M</span>
                <span className="text-[8.5px] font-mono text-stone-400 block leading-tight mt-1">Relevé d'architecture</span>
              </div>
              <div className="text-[9px] font-mono text-emerald-600 bg-emerald-100/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded inline-block w-fit mt-1 self-start font-bold uppercase">
                Optimisé (-5%)
              </div>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[140px] ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
            }`}>
              <div>
                <span className="text-[8px] font-mono text-stone-400 block uppercase">[EMPREINTE SPATIALE CARBONE]</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-[#0f4c81] dark:text-cyan-400">8,500 T</span>
                <span className="text-[8.5px] font-sans text-stone-500 block leading-tight mt-1">Conformité labels ÉCO</span>
              </div>
              <span className="text-[8px] font-mono text-teal-600 font-bold">RELEVÉ DE CONDUITS OK</span>
            </div>

          </div>

          {/* Sinks Cost Graph mapping */}
          <div className={`p-5 border rounded-2xl ${
            isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLightMode ? "text-stone-900" : "text-white"}`}>
              Historique Comparatif de Flux Financiers et d'Émissions C02
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={secondaryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e2e8f0" : "#1e293b"} />
                  <XAxis dataKey="name" stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isLightMode ? "#ffffff" : "#0f172a", 
                    borderColor: isLightMode ? "#cbd5e1" : "rgba(34, 211, 238, 0.2)",
                    fontSize: 10,
                    fontFamily: "monospace" 
                  }} />
                  <Area type="monotone" dataKey="val" stroke="#a855f7" fill="rgba(168, 85, 247, 0.08)" name="Coefficient Trame (K_Tram)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* VIEWPORT 04: CORE SETTINGS & RESILIENCE DEGRADATION */}
      {currentTab === "settings" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-stone-300 pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-stone-400 uppercase tracking-widest leading-none">[PRÉDICTIONS DE FATIQUE COMMUNE - ML SENSORS]</p>
              <h2 className={`text-xl font-bold tracking-tight uppercase italic ${isLightMode ? "text-stone-900" : "text-white"}`}>
                Surveillance Thermique & Dégradation Matérielle (Thermal Fatigue Room)
              </h2>
              <p className="text-stone-500 text-xs mt-1 max-w-2xl font-sans">
                Cette courbe modélise la fatigue sismique et le coefficient thermique d'usure des fondations. Sélectionnez une sonde d'ancrage ci-dessous.
              </p>
            </div>

            <div className="flex flex-wrap gap-1 bg-stone-100 dark:bg-slate-900 p-1 rounded-xl border border-stone-200 dark:border-slate-800">
              <button
                onClick={() => setFocusedFailureId("all")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                  focusedFailureId === "all"
                    ? "bg-stone-900 text-white font-bold"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Tout Comparer
              </button>
              {initialPredictiveFailures.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFocusedFailureId(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                    focusedFailureId === f.id
                      ? "bg-[#0f4c81] text-white font-bold"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {f.component}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-5 border rounded-2xl ${
            isLightMode ? "bg-white border-stone-200" : "bg-[#111317] border-slate-800"
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isLightMode ? "text-stone-900" : "text-white"}`}>
              Dégradation Thermique Prédite & Fatigue des Dalles de Charge (%)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictiveTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e2e8f0" : "#1e293b"} />
                  <XAxis dataKey="name" stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  <YAxis stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={{ 
                    backgroundColor: isLightMode ? "#ffffff" : "#0f172a", 
                    borderColor: isLightMode ? "#cbd5e1" : "rgba(34, 211, 238, 0.2)",
                    fontSize: 10,
                    fontFamily: "monospace" 
                  }} />
                  <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                  {initialPredictiveFailures.map((f, idx) => {
                    const key = `${f.deviceName} (${f.component})`;
                    const showLine = focusedFailureId === "all" || focusedFailureId === f.id;
                    if (!showLine) return null;
                    const colors = ["#ff5c00", "#0f4c81", "#8b5cf6", "#ec4899"];
                    return (
                      <Line 
                        key={f.id}
                        type="monotone" 
                        dataKey={key} 
                        stroke={colors[idx % colors.length]} 
                        strokeWidth={focusedFailureId !== "all" ? 3 : 1.8}
                        dot={{ r: 3 }}
                        name={f.component}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Slabs Risk matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialPredictiveFailures.map(f => (
              <div 
                key={f.id} 
                className={`p-5 rounded-2xl border ${
                  isLightMode ? "bg-white border-stone-200 shadow-sm" : "bg-[#111317]/80 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <div>
                      <h4 className={`text-xs font-bold leading-none uppercase ${isLightMode ? "text-stone-900" : "text-white"}`}>{f.deviceName}</h4>
                      <span className="text-[8.5px] font-mono text-stone-400 block mt-0.5">Secteur: {f.component}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-600 px-2.5 py-1 rounded border border-amber-200">
                    Surchage {f.probability}%
                  </span>
                </div>

                <p className="text-stone-500 text-[11px] leading-relaxed">
                  L'ancrage éprouve des forces de cisaillement et des températures accrues. Surchage estimée critique sous {f.timeToFailure} sans intervention d'isolant.
                </p>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <span className="text-[8px] font-mono text-stone-400">PLAN : SURVEILLANCE PAR QUART</span>
                  <span 
                    onClick={() => showHudToast(`Sécurisation topologique lancée sur l'ancrage : ${f.component}`)}
                    className={`text-[9px] font-mono font-black uppercase cursor-pointer flex items-center gap-1 hover:underline ${
                      isLightMode ? "text-[#0f4c81]" : "text-cyan-400"
                    }`}
                  >
                    Déployer un isolant de charge <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* FOOTER METRICS SYSTEM LABELS */}
      <div className="hidden lg:block absolute bottom-4 right-8 z-10 font-mono text-[8px] text-stone-400 uppercase select-none">
        <span>[DESSIN RÉF: AT-HORN-2026] [RÉSERVED DESIGN FOR ATELIER OFFICINE]</span>
      </div>

    </div>
  );
};

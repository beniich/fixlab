import React, { useState, useEffect, useRef } from "react";
import { SovereignThreeCube } from "./SovereignThreeCube";
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Activity, ShieldAlert, FileText, CheckSquare, TrendingUp, AlertTriangle, 
  Cpu, Clock, Sparkles, ChevronRight, BarChart3, Layers, Server, 
  ShieldCheck, ArrowRight, Eye, Monitor, Settings, RefreshCw, Zap,
  Download, Filter, Play, Info, CheckCircle2, Search, Database, Sliders, Archive, EyeOff, Radio,
  Globe, MapPin, Map, Compass, Satellite, Award, Network, Plus, Trash2, LayoutGrid, Terminal as TerminalIcon, FileClock, UserCheck, KeyRound, Shield, Laptop, Mail, Fingerprint, Lock
} from "lucide-react";

// Default Profile for immediate access if registration is bypassed
interface UserBadge {
  id: string;
  name: string;
  email: string;
  keyCode: string;
  clearance: string;
  avatarColor: string;
  regDate: string;
}

const DEFAULT_BADGE: UserBadge = {
  id: "ARC-849-V2",
  name: "Elara Vance",
  email: "e.vance@vision-architecte.com",
  keyCode: "OMEGA-SYS-99",
  clearance: "CLEARANCE OMEGA",
  avatarColor: "from-cyan-500 to-emerald-500",
  regDate: "2026-06-03 09:12:00"
};

interface VisionProps {
  devices?: any[];
  logs?: any[];
  isLightMode?: boolean;
}

export function VisionArchitecte({ devices = [], logs = [], isLightMode: parentIsLightMode }: VisionProps) {
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return parentIsLightMode !== undefined ? parentIsLightMode : false;
  });
  const [currentTab, setCurrentTab] = useState<string>("atrium"); // Atrium is the central hub landing page
  const [hudNotification, setHudNotification] = useState<string | null>(null);

  useEffect(() => {
    if (parentIsLightMode !== undefined) {
      setIsLightMode(parentIsLightMode);
    }
  }, [parentIsLightMode]);

  // Synchronize state with backend on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const jRes = await fetch("/api/vision-architecte/journals");
        if (jRes.ok) {
          const jData = await jRes.json();
          setObservatoryJournals(jData);
          localStorage.setItem("vision_architecte_journals", JSON.stringify(jData));
        }
      } catch (err) {
        console.warn("Could not load journals from backend", err);
      }

      try {
        const tRes = await fetch("/api/vision-architecte/transmissions");
        if (tRes.ok) {
          const tData = await tRes.json();
          setRecentTransmissions(tData);
          localStorage.setItem("vision_architecte_transmissions", JSON.stringify(tData));
        }
      } catch (err) {
        console.warn("Could not load transmissions from backend", err);
      }

      try {
        const bRes = await fetch("/api/vision-architecte/badge");
        if (bRes.ok) {
          const bData = await bRes.json();
          setActiveBadge(bData);
          localStorage.setItem("vision_architecte_badge", JSON.stringify(bData));
        }
      } catch (err) {
        console.warn("Could not load badge from backend", err);
      }
    };

    fetchBackendData();
  }, []);
  
  // Custom Registration / Security state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Default logged in for smooth immediate access
  const [activeBadge, setActiveBadge] = useState<UserBadge>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_badge");
      return saved ? JSON.parse(saved) : DEFAULT_BADGE;
    } catch {
      return DEFAULT_BADGE;
    }
  });

  // Login form state
  const [loginId, setLoginId] = useState<string>("");
  const [loginKey, setLoginKey] = useState<string>("");

  // Registration builder state
  const [regName, setRegName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [regClearance, setRegClearance] = useState<string>("OXYGENE");
  const [regKey, setRegKey] = useState<string>("");

  // Satellite transmission (Terminal) state
  const [terminalText, setTerminalText] = useState<string>("");
  const [contactVector, setContactVector] = useState<string>("Satellite Node-B");
  const [transmissionProgress, setTransmissionProgress] = useState<number>(-1);
  const [recentTransmissions, setRecentTransmissions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_transmissions");
      return saved ? JSON.parse(saved) : [
        { id: "TX-4402", timestamp: "08:14:00", vector: "Secure Satellite", data: "Nexus primary foundations alignment complete.", status: "DELIVERED" },
        { id: "TX-4401", timestamp: "07:30:11", vector: "Quantum Wire", data: "Solar deflection arrays telemetry normal.", status: "DELIVERED" }
      ];
    } catch {
      return [];
    }
  });

  // Structural Typologies (Atrium) state
  const [selectedTypology, setSelectedTypology] = useState<string>("alpha");

  // Portfolio Spatial state
  const [selectedSpecNode, setSelectedSpecNode] = useState<string>("isolators");
  const [structuralFundWeight, setStructuralFundWeight] = useState<number>(60); // 60% on structural, rest on acoustic
  const [recentSlightStress, setRecentSlightStress] = useState<number>(34);

  // Laboratoire: AI neuron intensity text generator
  const [aiPromptInput, setAiPromptInput] = useState<string>("");
  const [aiResponseText, setAiResponseText] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [quantumToken, setQuantumToken] = useState<string>("QKD-SIG-928A");
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [biometricThreshold, setBiometricThreshold] = useState<number>(85);

  // Observatoire journal entries state
  const [newJournalTitle, setNewJournalTitle] = useState<string>("");
  const [newJournalContent, setNewJournalContent] = useState<string>("");
  const [journalCategory, setJournalCategory] = useState<string>("Matériaux");
  const [observatoryJournals, setObservatoryJournals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("vision_architecte_journals");
      return saved ? JSON.parse(saved) : [
        {
          id: "J-04",
          title: "La Synthèse de Verre Réfractif",
          category: "Optique",
          author: "Elara Vance",
          timestamp: "2026-06-03 10:45",
          content: "L'Atrium intègre désormais les nouvelles dalles de silice carbonée à taux élevé de réfraction lumineus. Les tests d'atténuation aux ultra-violets révèlent un filtrage passif à 99.4%, tout en maintenant une diffusion diffuse du spectre visible à 82%."
        },
        {
          id: "J-03",
          title: "Dynamique des Fluides en Façades Doubles",
          category: "Structure",
          author: "Marcus Aurelius",
          timestamp: "2026-06-02 14:12",
          content: "L'analyse des contraintes dynamiques sur l'enveloppe du Terminal Alpha indique une dispersion optimale des turbulences. Notre modèle de déviation par lames paraboliques réduit la friction de surface de près de 18.5%."
        },
        {
          id: "J-02",
          title: "Béton Translucide Autonettoyant",
          category: "Matériaux",
          author: "Diana Prince",
          timestamp: "2026-06-01 09:30",
          content: "Des dalles prototypes de béton cellulaire renforcé aux micro-fibres transmettant la lumière ont été soumises à un ancrage sismique d'essai. La structure micro-cristalline prévient la fissuration capillaire."
        }
      ];
    } catch {
      return [];
    }
  });

  // Dynamic notification handler
  const showHudToast = (message: string) => {
    setHudNotification(message);
    setTimeout(() => {
      setHudNotification((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Generate a random crystal cryptosignature key for registration
  const handleGenerateRegCryptKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "VA-KEY-";
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRegKey(key);
    showHudToast("Cryptosignature pour registre d'identité générée.");
  };

  const handleRegisterBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      showHudToast("Veuillez saisir au moins un nom et une liaison sécurisée.");
      return;
    }

    const uid = `ARC-${Math.floor(100 + Math.random() * 900)}-V${Math.floor(1 + Math.random() * 9)}`;
    const finalKey = regKey || `VA-KEY-LUCK33`;
    const clearanceText = `CLEARANCE ${regClearance.toUpperCase()}`;
    const colors = [
      "from-cyan-500 to-emerald-500",
      "from-violet-500 to-magenta-500",
      "from-rose-500 to-amber-500",
      "from-blue-600 to-sky-400"
    ];
    const newB: UserBadge = {
      id: uid,
      name: regName,
      email: regEmail,
      keyCode: finalKey,
      clearance: clearanceText,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      regDate: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    setActiveBadge(newB);
    localStorage.setItem("vision_architecte_badge", JSON.stringify(newB));
    setIsLoggedIn(true);

    // Sync with backend database
    fetch("/api/vision-architecte/badge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newB)
    }).catch(err => console.warn("Backend unsynced", err));

    showHudToast(`Identité enregistrogène créée : Bienvenue, opérateur ${newB.name}!`);
  };

  const handleLoginBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginKey.trim()) {
      showHudToast("Saisie d'identifiant et mot de clé requis.");
      return;
    }

    // Accept anything that matches the current active badge key/ID, or fallback to standard for ease
    if (
      (loginId === activeBadge.id && loginKey === activeBadge.keyCode) ||
      loginKey.toUpperCase().includes("OMEGA") ||
      loginKey.toUpperCase().includes("SYS")
    ) {
      setIsLoggedIn(true);
      showHudToast(`Accès en mode de liaison sécurisé accordé : ${activeBadge.name}`);
    } else {
      // Direct failsafe logging
      showHudToast("Divergence d'authentification : Identité introuvable sur la trame.");
    }
  };

  // satellite uplink animation timeline
  const handleInitiateTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalText.trim()) {
      showHudToast("Veuillez saisir un bloc de transmission avant de lancer l'uplink.");
      return;
    }

    setTransmissionProgress(0);
    showHudToast("Liaison satellite établie. Synchronisation du vecteur...");

    const interval = setInterval(() => {
      setTransmissionProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          
          // Complete the telemetry
          const txId = `TX-${Math.floor(4400 + Math.random() * 1000)}`;
          const newTx = {
            id: txId,
            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            vector: contactVector,
            data: terminalText,
            status: "DELIVERED"
          };

          const updatedList = [newTx, ...recentTransmissions].slice(0, 50);
          setRecentTransmissions(updatedList);
          localStorage.setItem("vision_architecte_transmissions", JSON.stringify(updatedList));

          // Sync with backend database
          fetch("/api/vision-architecte/transmissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTx)
          }).catch(err => console.warn("Backend unsynced", err));
          
          setTerminalText("");
          showHudToast(`Uplink Réussi! Code Transaction : ${txId}`);
          return -1;
        }
        return p + 4;
      });
    }, 100);
  };

  // generative brain request lab
  const handleAIGeneration = async () => {
    if (!aiPromptInput.trim()) {
      showHudToast("Veuillez saisir le guide formel structural pour lancer l'analyse.");
      return;
    }

    setIsAiLoading(true);
    setAiResponseText("");
    showHudToast("Liaison du Pôle d'Analyse Neuronale vers l'API Gemini...");

    try {
      const response = await fetch("/api/gemini/generate-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPromptInput })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponseText(data.result);
        showHudToast("Structure neuronale synthétisée par Gemini 3.5-Flash.");
      } else {
        throw new Error("Local fallback required");
      }
    } catch {
      // Smart Fallback prompt template matching high architecture aesthetics
      setTimeout(() => {
        const structuralThemes = [
          `[SCHÉMATIQUE NEURONALE SYNTHÉTISÉE]
Structure : Flèche Verticale Éco-Dynamique
Matériau Suggéré : Béton autoregénérant infusé au graphène
Taux d'Efficacité Solaire Prédit : 94.2%
Calcul de Charge Trame : Conforme aux normes sismiques de classe V.
Notes d'Ingénierie : Intégration de micro-stries d'évacuation de fluide pour l'énergie thermique passive.`,
          `[MATRICE DE LIQUIDE DE STRUCTURE]
Structure : Dôme Autoportant Triangulaire (Liaison Multi-points)
Matériau Suggéré : Polymère de silice translucide à mémoire thermique
Efficacité de Réfraction Lumineuse : 88.5%
Analyse du Vent : Résistance aérodynamique passive estimée à 55N/mm².`
        ];
        setAiResponseText(structuralThemes[Math.floor(Math.random() * structuralThemes.length)]);
        showHudToast("Calcul de rechange local appliqué.");
      }, 1500);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quantum Cryptographic keys rotation
  const handleQuantumKeyRegen = () => {
    setIsGeneratingKey(true);
    showHudToast("Calcul des orbites de superposition quantique...");
    
    setTimeout(() => {
      const chars = "XYZ0123456789ABCDEF";
      let key = "QKD-SIG-";
      for (let i = 0; i < 4; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setQuantumToken(key);
      setIsGeneratingKey(false);
      showHudToast("Nouveau cryptogramme de signature forgé avec succès.");
    }, 1800);
  };

  // Journal log submission
  const handleAddJournalNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalTitle.trim() || !newJournalContent.trim()) {
      showHudToast("Veuillez compléter le titre et le corps de l'observation.");
      return;
    }

    const newJ = {
      id: `J-${Math.floor(10 + Math.random() * 90)}`,
      title: newJournalTitle,
      category: journalCategory,
      author: activeBadge.name,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      content: newJournalContent
    };

    const updated = [newJ, ...observatoryJournals];
    setObservatoryJournals(updated);
    localStorage.setItem("vision_architecte_journals", JSON.stringify(updated));

    // Sync with backend database
    fetch("/api/vision-architecte/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJ)
    }).catch(err => console.warn("Backend unsynced", err));

    setNewJournalTitle("");
    setNewJournalContent("");
    showHudToast("Saisie de relevé d'observation enregistrée sur la trame.");
  };

  // Budget calculations
  const calculateStructuralStress = () => {
    // Sliders: structuralFundWeight represents fund allocation % for strength. Rest goes to dampeners.
    // Optimal is nicely balanced around 60%. Excess in either direction increases estimated node stress slightly
    const deviation = Math.abs(structuralFundWeight - 55);
    const calculatedStress = 12 + Math.round(deviation * 0.82);
    return Math.min(88, calculatedStress);
  };

  // Mock Trend Chart Data
  const spatialTrendData = [
    { name: "Phase I", "Terminal Alpha": 98, "Observatoire 01": 90, "Laboratoire": 82 },
    { name: "Phase II", "Terminal Alpha": 94, "Observatoire 01": 92, "Laboratoire": 86 },
    { name: "Phase III", "Terminal Alpha": 95, "Observatoire 01": 97, "Laboratoire": 89 },
    { name: "Phase IV", "Terminal Alpha": 96, "Observatoire 01": 98, "Laboratoire": 94 }
  ];

  return (
    <div 
      id="vision-architecte-container"
      className={`min-h-[100vh] p-4 md:p-8 font-sans transition-all duration-500 relative overflow-hidden rounded-[2.5rem] border ${
        isLightMode 
          ? "bg-[#FAF9F5] text-[#1E1E1E] border-stone-200/95 shadow-[0_20px_50px_rgba(0,0,0,0.05)]" 
          : "bg-[#08090b] text-[#F3F4F6] border-neutral-900 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      }`}
    >
      {/* Absolute Ambient structural grids blueprint paper */}
      <div className={`absolute inset-0 pointer-events-none opacity-[0.35] z-0 ${
        isLightMode 
          ? "bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:24px_24px]" 
          : "bg-[radial-gradient(rgba(0,219,233,0.06)_1px,transparent_1px)] [background-size:24px_24px]"
      }`} />

      {/* Atmospheric coordinate fine layout lines */}
      <div className={`absolute left-12 inset-y-0 w-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200" : "bg-neutral-900/40"
      }`} />
      <div className={`absolute inset-x-0 bottom-16 h-[1px] pointer-events-none z-0 ${
        isLightMode ? "bg-stone-200" : "bg-neutral-900/40"
      }`} />

      {/* FLOATING HUD TOAST NOTIFICATION */}
      {hudNotification && (
        <div 
          id="hud-notification-banner"
          className={`fixed bottom-8 right-8 z-50 animate-fade-in max-w-sm border shadow-[0_10px_35px_rgba(0,0,0,0.15)] px-5 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-xl ${
            isLightMode 
              ? "bg-white/95 border-stone-200 text-stone-800" 
              : "bg-[#111317]/90 border-[#00dbe9]/30 text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
          <p className="text-xs font-mono font-medium tracking-wide">
            {hudNotification}
          </p>
        </div>
      )}

      {/* CORE HEADER: VISION ARCHITECTE CONTROL DESK */}
      <header className={`sticky top-0 w-full z-40 flex flex-col xl:flex-row justify-between items-center px-6 py-5 border-b rounded-3xl mb-8 backdrop-blur-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${
        isLightMode 
          ? "bg-[#F5F3ED]/90 border-stone-200" 
          : "bg-[#0b0c0f]/85 border-neutral-900"
      }`}>
        <div className="flex items-center gap-4">
          <div 
            onClick={() => showHudToast("Séquence de calibration d'identité nominale.")}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400/25 to-blue-500/25 border border-[#00dbe9]/30 flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform duration-300"
          >
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-[0.22em] text-[#00dbe9] uppercase font-sans flex items-center gap-1.5">
              VISION ARCHITECTE <span className="text-[10px] text-zinc-500 font-mono tracking-normal font-normal">// LA PROTOCOLE SÉCURISÉ</span>
            </h1>
            <p className="text-[8.5px] font-mono uppercase tracking-wider text-stone-500 mt-0.5">
              Console d'Orchestration d'Analyse du Cadran Spatial
            </p>
          </div>
        </div>

        {/* SECURE DYNAMIC WORKSPACE TABS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 xl:mt-0">
          <nav className="flex flex-wrap gap-1.5 items-center">
            {[
              { id: "atrium", label: "Home Page (Atrium)" },
              { id: "portfolio", label: "About (Relevé Spatial)" },
              { id: "laboratoire", label: "Laboratoire (IA)" },
              { id: "observatoire", label: "Observatoire (Journals)" },
              { id: "client", label: "Espace Client" },
              { id: "terminal", label: "Terminal / Uplink" },
              { id: "security", label: "Sécurité (Portail d'Accès)" }
            ].map((tab) => {
              const isActive = currentTab === tab.id;
              // Guard for tabs if user is logged out (require credential login screen)
              const needsAccess = !isLoggedIn && tab.id !== "security";
              
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    if (needsAccess) {
                      setCurrentTab("security");
                      showHudToast("Veuillez d'abord générer votre badge d'agent dans le Portail d'Accès.");
                    } else {
                      setCurrentTab(tab.id);
                      showHudToast(`Commutation dynamique vers : ${tab.label}`);
                    }
                  }}
                  className={`font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-2 rounded-xl transition-all duration-300 relative cursor-pointer ${
                    isActive 
                      ? "bg-[#00dbe9]/10 text-[#00dbe9] border border-[#00dbe9]/30 font-extrabold shadow-[0_0_15px_rgba(0,219,233,0.12)]" 
                      : isLightMode
                        ? "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 border border-transparent"
                        : "text-zinc-400 hover:text-cyan-400 hover:bg-neutral-900/50 border border-transparent"
                  }`}
                >
                  {tab.label}
                  {needsAccess && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 border-l border-neutral-900 pl-3 md:pl-4">
            <button
              onClick={() => {
                setIsLightMode(!isLightMode);
                showHudToast(`Affichage configuré : ${!isLightMode ? "Table d'Alabastre (Lumineuse)" : "Atelier d'Obsidienne (Sombre)"}`);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLightMode 
                  ? "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200"
                  : "bg-neutral-950 border-neutral-900 text-cyan-400 hover:bg-neutral-900"
              }`}
              title="Commuter le thème lumineux/sombre"
            >
              {isLightMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            
            {isLoggedIn && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/20 to-neutral-900/20 px-3 py-1.5 rounded-xl border border-neutral-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-[#00dbe9] font-bold tracking-wider uppercase">Liaison Synchronisée</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================== VIEWPORT 01: L'ATRIUM ==================== */}
      {currentTab === "atrium" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 3D wireframe conch conch-container */}
            <div className="lg:col-span-8 relative w-full h-[480px] flex items-center justify-center overflow-hidden border border-neutral-900/40 rounded-3xl bg-[#06070a]/40 shadow-[inset_0_1px_35px_rgba(0,0,0,0.5)]">
              {/* Spinning technical wireframe container */}
              <SovereignThreeCube isLightMode={isLightMode} />
              
              {/* Floating tech readouts overlay */}
              <div className="absolute top-6 left-6 pointer-events-none font-mono space-y-1">
                <div className="flex items-center gap-2 text-[9px] text-cyan-400 bg-cyan-900/25 px-2.5 py-1 rounded-md border border-cyan-500/10">
                  <Activity className="w-3 h-3 animate-spin" /> MODEL: WIREFRAME_SHELL_CONCH_A1
                </div>
                <div className="text-[8.5px] text-neutral-500 uppercase mt-2">
                  X_ROT: {(Math.random() * 360).toFixed(1)}° | Y_ROT: PENDING_LERP
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 pointer-events-none flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="bg-neutral-950/80 p-4 rounded-2xl border border-neutral-800/80 backdrop-blur-md max-w-sm">
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    RELEVÉ STRUCTUREL 3D
                  </span>
                  <p className="text-[11px] font-mono font-medium text-white leading-relaxed mt-1">
                    La conche polygonale centrale modélise la répartition des charges d'énergie acoustique et sismique dans les portails structurels.
                  </p>
                </div>
                <div className="bg-neutral-950/70 py-2 px-4 rounded-xl border border-neutral-800 pointer-events-auto h-fit self-end text-right font-mono text-[8.5px] text-neutral-400">
                  <span>CLIQUEZ & GLISSEZ POUR TOURNER</span>
                </div>
              </div>
            </div>

            {/* Right: Selecteur de Typologies */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className={`p-6 rounded-3xl border ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0e1015]/60 border-neutral-900"
              }`}>
                <div className="flex items-center gap-2 text-rose-500 mb-3 font-mono text-[10px] uppercase font-bold">
                  <Laptop className="w-4 h-4" /> TRACEUR DE FORMES BRUTES
                </div>
                <h2 className="text-xl font-black text-white dark:text-[#f8fafc] leading-none uppercase tracking-tight">
                  SÉLECTEUR DE TYPOLOGIES
                </h2>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  Découvrez les trois axes formels du plan directeur. Sélectionnez un archétype pour charger ses relevés d'intégration.
                </p>

                <div className="space-y-3 mt-6">
                  {[
                    { id: "alpha", title: "Terminal Alpha", badge: "Commercial", desc: "Verre réfractif & poutres de soutien en acier haute densité." },
                    { id: "obs-01", title: "Observatoire 01", badge: "Résidentiel", desc: "Dômes géodésiques & membranes de captation photovoltaïque passive." },
                    { id: "lab-core", title: "Le Laboratoire", badge: "Recherche", desc: "Ancrage symbiotique & dalles isolantes de silice autoregénérante." }
                  ].map((typ) => {
                    const isTypActive = selectedTypology === typ.id;
                    return (
                      <div
                        key={typ.id}
                        id={`typ-card-${typ.id}`}
                        onClick={() => {
                          setSelectedTypology(typ.id);
                          showHudToast(`Typologie chargée : ${typ.title}`);
                        }}
                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                          isTypActive
                            ? "bg-[#00dbe9]/5 border-[#00dbe9]/40 translate-x-1 shadow-[0_4px_20px_rgba(0,219,233,0.04)]"
                            : isLightMode 
                              ? "bg-stone-50 border-stone-150 hover:bg-stone-100" 
                              : "bg-[#111319]/40 border-neutral-900 hover:bg-[#111319]/80"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-mono text-xs font-black ${isTypActive ? "text-[#00dbe9]" : "text-slate-400"}`}>
                            {typ.title}
                          </span>
                          <span className="font-mono text-[8px] uppercase tracking-wider bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-bold">
                            {typ.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          {typ.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Typology specifics telemetry card */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
                isLightMode ? "bg-[#FAF9F5] border-stone-200" : "bg-neutral-950 border-neutral-900"
              }`}>
                <span className="font-mono text-[8.5px] text-slate-500 block uppercase tracking-wider">[ RELEVÉ D'EFFICACITÉ GLOBALE ]</span>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-[#111318]/40 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[8px] font-mono text-stone-400 uppercase">Sol Solaire</span>
                    <p className="text-xl font-black text-cyan-400 font-mono tracking-tight mt-1">
                      {selectedTypology === "alpha" ? "88%" : selectedTypology === "obs-01" ? "99.2%" : "91.8%"}
                    </p>
                  </div>
                  <div className="bg-[#111318]/40 p-3.5 rounded-xl border border-neutral-900">
                    <span className="text-[8px] font-mono text-stone-400 uppercase">Indice Carbone</span>
                    <p className="text-xl font-black text-emerald-400 font-mono tracking-tight mt-1">
                      {selectedTypology === "alpha" ? "-18%" : selectedTypology === "obs-01" ? "-34%" : "-48%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick specs section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-3xl border ${
              isLightMode ? "bg-[#EDEBE5] border-stone-200" : "bg-[#101216]/70 border-neutral-900/60"
            }`}>
              <h4 className="text-[9px] font-mono text-[#00dbe9] tracking-wider uppercase font-black">// SPEC_01 // MATÉRIAU CELLULAIRE</h4>
              <p className="text-xs font-semibold text-white dark:text-[#f1f5f9] mt-2">Dalles Translucides de Silice</p>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                La structure capte les rayons incidents et les convertit en chaleur radiante passive pour les cellules de travail inférieures.
              </p>
            </div>
            <div className={`p-5 rounded-3xl border ${
              isLightMode ? "bg-[#EDEBE5] border-stone-200" : "bg-[#101216]/70 border-neutral-900/60"
            }`}>
              <h4 className="text-[9px] font-mono text-[#00dbe9] tracking-wider uppercase font-black">// SPEC_02 // CONDUITS DE FLUIDES</h4>
              <p className="text-xs font-semibold text-white dark:text-[#f1f5f9] mt-2">Vitesse de Flux Mesurée 4.8L/s</p>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                Des tubes de refroidissement par vide d'air atténuent l'effet d'îlot de chaleur sur l'ensemble de la toiture vitrée du complexe.
              </p>
            </div>
            <div className={`p-5 rounded-3xl border ${
              isLightMode ? "bg-[#EDEBE5] border-stone-200" : "bg-[#101216]/70 border-neutral-900/60"
            }`}>
              <h4 className="text-[9px] font-mono text-[#00dbe9] tracking-wider uppercase font-black">// SPEC_03 // CALCUL SISMIQUE</h4>
              <p className="text-xs font-semibold text-white dark:text-[#f1f5f9] mt-2">Absorbeurs K-Tram en Action</p>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                Le coefficient d'oscillation sismique est mitigé au point central d'ancrage de la coquille conchoïdale.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 02: RELEVÉ SPATIAL (PORTFOLIO DESCRIPTION) ==================== */}
      {currentTab === "portfolio" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-[#00dbe9] pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest leading-none">[ PORTFOLIO D'INTEGRATION ]</p>
              <h2 className="text-xl font-bold tracking-tight uppercase text-white dark:text-[#f8fafc] mt-1.5 flex items-center gap-2">
                Le Projet : Nexus Tower (Réf: NX-77)
              </h2>
              <p className="text-stone-500 text-xs mt-1 max-w-2xl leading-relaxed">
                Superstructure orbitale terrestre simulée. Visualisez l'état d'avancement des phases, testez la contrainte mécanique sismique, et alignez le budget sur l'indice de conformité écologique.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[9.5px] bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-900">
              <span className="text-neutral-500 text-right font-medium">CONFORMITÉ DU PROTOCOLE :</span>
              <span className="text-[#00dbe9] font-black">98.4% NOMINAL</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left spec sidebar */}
            <div className="space-y-6 lg:col-span-1">
              <div className={`p-6 rounded-3xl border ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0f1115]/50 border-neutral-900"
              }`}>
                <h3 className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> PARAMÈTRES D'ANCRAGE
                </h3>

                {/* SLIDER FOR BUDGET WEIGHT */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                      <span>RÉPARTITION STRUCTURELLE (FUNDS)</span>
                      <span className="font-bold text-[#00dbe9]">{structuralFundWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={structuralFundWeight}
                      onChange={(e) => {
                        setStructuralFundWeight(Number(e.target.value));
                        if(Number(e.target.value) > 75) {
                          showHudToast("Alerte: Surcharge budgétaire structurelle. L'indice d'insonorisation acoustique dérive.");
                        }
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase mt-1">
                      <span>Dampers Acoustiques (Passifs)</span>
                      <span>Renforcement Sismique (Actif)</span>
                    </div>
                  </div>

                  {/* READ ONLY STRUCTURAL FATIGUE / DEVIATION PREDICTION */}
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 text-left mt-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono text-stone-400">INDICE DE FATIGUE ESTIMÉ</span>
                      <span className={`text-xs font-mono font-bold ${calculateStructuralStress() > 40 ? "text-rose-500" : "text-emerald-400"}`}>
                        {calculateStructuralStress()}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          calculateStructuralStress() > 40 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                        }`} 
                        style={{ width: `${calculateStructuralStress()}%` }}
                      />
                    </div>
                    <p className="text-[9.5px] text-zinc-500 mt-2 font-mono">
                      {calculateStructuralStress() > 40 
                        ? "Surcharge d'asymétrie active. Risque d'instabilité aux vents." 
                        : "Équilibre d'intégration isotropique nominal."
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-900 mt-6 space-y-3">
                  <button 
                    onClick={() => {
                      setStructuralFundWeight(55);
                      showHudToast("Configuration réinitialisée aux ratios optimaux.");
                    }}
                    className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-cyan-950/20 text-[#00dbe9] border border-[#00dbe9]/30 rounded-xl py-3 cursor-pointer hover:bg-cyan-950/40 transition-colors"
                  >
                    CALIBRER OPTIMAL (55%)
                  </button>
                </div>
              </div>

              {/* Specification Nodes list */}
              <div className={`p-6 rounded-3xl border ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0f1115]/50 border-neutral-900"
              }`}>
                <h3 className="font-mono text-[10px] text-rose-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> QUADRANTS DE LA TOUR
                </h3>
                
                <div className="space-y-2">
                  {[
                    { id: "isolators", name: "Isolateurs Cinétiques", metric: "34.5 kN Max", desc: "Atténuent les oscillations thermiques différentielles." },
                    { id: "foundations", name: "Pieux de Fondation", metric: "Classe VIII H", desc: "Ancrage cryptocristallin à injection de silicate." },
                    { id: "glazing", name: "Membranes de Vitrage", metric: "Réfraction 94.8", desc: "Captation solaire active à haut coefficient d'albédo." }
                  ].map((node) => {
                    const isNodeActive = selectedSpecNode === node.id;
                    return (
                      <div
                        key={node.id}
                        id={`quadrant-card-${node.id}`}
                        onClick={() => {
                          setSelectedSpecNode(node.id);
                          showHudToast(`Quadrant focus : ${node.name}`);
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isNodeActive 
                            ? "bg-[#00dbe9]/5 border-cyan-400" 
                            : "bg-neutral-950/20 border-neutral-900 hover:bg-neutral-950/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-white dark:text-[#f1f5f9]">{node.name}</span>
                          <span className="font-mono text-[9px] text-[#00dbe9] font-black">{node.metric}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{node.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right detailed chart portfolio */}
            <div className="space-y-6 lg:col-span-2 flex flex-col justify-between">
              <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0e0f14]/80 border-neutral-900"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white dark:text-[#f1f5f9]">
                    <BarChart3 className="w-4 h-4 text-[#00dbe9]" /> CONFORMITÉ MOYENNE PAR PHASE DE CHANTIER
                  </h3>
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spatialTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e2e8f0" : "#1b1e25"} />
                        <XAxis dataKey="name" stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                        <YAxis stroke="#64748b" tickStyle={{ fontSize: 9, fontFamily: "monospace" }} domain={[50, 100]} />
                        <Tooltip contentStyle={{ 
                          backgroundColor: isLightMode ? "#ffffff" : "#0d0e12", 
                          borderColor: "rgba(0, 219, 233, 0.2)",
                          fontSize: 10,
                          fontFamily: "monospace" 
                        }} />
                        <Legend wrapperStyle={{ fontSize: 8.5, fontFamily: "monospace" }} />
                        <Area type="monotone" dataKey="Terminal Alpha" stroke="#00dbe9" fill="rgba(0, 219, 233, 0.04)" />
                        <Area type="monotone" dataKey="Observatoire 01" stroke="#ec4899" fill="rgba(236, 72, 153, 0.02)" />
                        <Area type="monotone" dataKey="Laboratoire" stroke="#10b981" fill="rgba(16, 185, 129, 0.02)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-900/60 pt-6 mt-6">
                  <div className="p-4 rounded-xl border border-neutral-900/60 bg-neutral-950/20 text-left">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">[ BUDGET INTÉGRAL ]</span>
                    <span className="text-xl font-bold font-mono tracking-tight text-white dark:text-[#f1f5f9] mt-1 block">$12.4M</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-900/60 bg-neutral-950/20 text-left">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">[ COMPRESSIVITÉ BÉTON ]</span>
                    <span className="text-xl font-bold font-mono tracking-tight text-[#00dbe9] mt-1 block">94.5 MPa</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-900/60 bg-neutral-950/20 text-left">
                    <span className="text-[8px] font-mono text-zinc-500 block uppercase">[ COEFFICIENT ALBEDO ]</span>
                    <span className="text-xl font-bold font-mono tracking-tight text-emerald-400 mt-1 block">0.72 SR</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 03: LE LABORATOIRE ==================== */}
      {currentTab === "laboratoire" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* COLUMN 1: INTENSITE NEURONALE (AI ASSISTANT GENERATION) */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#0b0d11]/70 border-neutral-900"
            }`}>
              <div>
                <span className="text-[8.5px] font-mono text-cyan-400 font-extrabold uppercase tracking-wider block mb-2">[ ANALYSE DES MATÉRIAUX PAR IA ]</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#00dbe9]" /> INTENSITÉ NEURONALE
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  Consultez notre moteur d'intelligence générative Gemini pour synthétiser un rapport structural ou de suggestions de matériaux sur mesure.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="text-left">
                    <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Guide formel de structure / Style architectural</label>
                    <textarea
                      placeholder="Ex: dôme brutaliste en béton translucide à isolation thermique passive..."
                      rows={3}
                      value={aiPromptInput}
                      onChange={(e) => setAiPromptInput(e.target.value)}
                      className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-[#00dbe9]/50"
                    />
                  </div>

                  <button
                    onClick={handleAIGeneration}
                    disabled={isAiLoading}
                    className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-cyan-400 text-black py-3 rounded-xl hover:bg-cyan-300 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> SYNTHÉTISE...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> GÉNÉRER LE CONCEPT D'ARCHI
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generative schematic AI output panel */}
              {aiResponseText && (
                <div className="mt-6 bg-[#08090b] border border-neutral-900 rounded-2xl p-4 text-left">
                  <div className="flex justify-between items-center border-b border-rose-950/20 pb-2 mb-2">
                    <span className="text-[8px] font-mono text-[#00dbe9] uppercase">SCHÉMATIQUE GÉNÉRATIVE GEMINI</span>
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10.5px] font-mono leading-relaxed text-slate-300 whitespace-pre-line">
                    {aiResponseText}
                  </p>
                </div>
              )}
            </div>

            {/* COLUMN 2: CHIFFREMENT QUANTIQUE */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#0b0d11]/70 border-neutral-900"
            }`}>
              <div>
                <span className="text-[8.5px] font-mono text-purple-400 font-extrabold uppercase tracking-wider block mb-2">[ SÉCURISATEUR DE CANAL ]</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-400" /> CHIFFREMENT QUANTIQUE
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  Générez des jetons de cryptosignature cryptocristalline sur la trame pour blinder l'échange des relevés spatiaux.
                </p>

                <div className="mt-8 space-y-6">
                  {/* Visual superposed orbits token */}
                  <div className="relative h-28 w-full bg-[#08090b] rounded-2xl border border-neutral-900 flex flex-col justify-center items-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <span className="text-[9px] font-mono text-purple-400 block tracking-widest uppercase">SUPERPOSITION QKD ACTIVE</span>
                    <span className="text-base font-mono font-black text-white tracking-widest mt-2 block animate-pulse">
                      {quantumToken}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-normal">
                    La liaison cryptographique utilise les inégalités d'orbitographie atomique pour invalider toute tentative d'interception passive sur la liaison satellite.
                  </p>
                </div>
              </div>

              <button
                onClick={handleQuantumKeyRegen}
                disabled={isGeneratingKey}
                className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-purple-900/30 text-purple-300 border border-purple-500/30 py-3 rounded-xl hover:bg-purple-900/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isGeneratingKey ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> ALIGNEMENT ORBITAL...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-3.5 h-3.5" /> FORGER SIGNATURE QUANTIQUE
                  </>
                )}
              </button>
            </div>

            {/* COLUMN 3: BIOMETRIC SIMULATION CONTROL */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
              isLightMode ? "bg-white border-stone-200" : "bg-[#0b0d11]/70 border-neutral-900"
            }`}>
              <div>
                <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider block mb-2">[ INTÉGRATION BIO-CELLULAIRE ]</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> VECTEUR BIOMÉTRIQUE
                </h3>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  Surveillez les indices cellulaires d'intégration physique des ancrages sur le dôme résidentiel.
                </p>

                <div className="mt-8 space-y-6">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                      <span>SEUIL DE SÉCURITÉ CONDUIT</span>
                      <span className="font-bold text-emerald-400">{biometricThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={biometricThreshold}
                      onChange={(e) => {
                        setBiometricThreshold(Number(e.target.value));
                        if(Number(e.target.value) < 70) {
                          showHudToast("Alerte: Indice de liaison biométrique critique sous les dômes.");
                        }
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-stone-400">SONDE O2 RESIDENTIEL 01</span>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold">NOMINAL (94%)</span>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-stone-400">SONDE CO2 LABORATOIRE BIOLOGIQUE</span>
                      <span className="text-[10px] font-mono text-[#00dbe9] font-bold">NOMINAL (100%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111317]/60 p-4 rounded-xl border border-neutral-900 mt-6 text-center">
                <span className="text-[8px] font-mono text-[#00dbe9] block uppercase font-bold">SYSTÈMES SEC NOMINAUX</span>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Les enveloppes de survie s'ajustent d'elles-mêmes aux gradients d'ancrage extérieur.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 04: L'OBSERVATOIRE (JOURNAL REFLECTIONS) ==================== */}
      {currentTab === "observatoire" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-2 border-amber-500 pl-4 py-1">
            <div>
              <p className="font-mono text-[9px] text-amber-500 uppercase tracking-widest leading-none">[ JOURNAL DES RÉFLEXIONS SPATIALES ]</p>
              <h2 className="text-xl font-bold tracking-tight uppercase text-white dark:text-[#f8fafc] mt-1.5">
                L'Observatoire de l'Architecte
              </h2>
              <p className="text-stone-500 text-xs mt-1 max-w-2xl leading-relaxed">
                Relevés quotidiens, dynamiques de fluide et observations formelles consignés par l'équipe d'ingénierie. Saisissez votre propre relevé d'observation ci-dessous.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: List of Journals */}
            <div className="lg:col-span-8 space-y-4">
              {observatoryJournals.map((log) => (
                <div 
                  key={log.id} 
                  id={`journal-row-${log.id}`}
                  className={`p-6 rounded-3xl border relative transition-all ${
                    isLightMode ? "bg-white border-stone-200" : "bg-[#0c0d11]/80 border-neutral-900/80"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-rose-950/20 pb-3 mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <h4 className="font-black text-xs text-white dark:text-[#f8fafc] uppercase tracking-wide">
                        {log.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-wider bg-neutral-950 text-neutral-400 px-2.5 py-1 rounded-md border border-neutral-900">
                        {log.category}
                      </span>
                      <span className="font-mono text-[8.5px] text-zinc-500">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-400 text-xs leading-relaxed font-sans whitespace-pre-line">
                    {log.content}
                  </p>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-900/60 text-[9px] font-mono text-zinc-500">
                    <span>ARCHITECTE EN CHEF DE POSTE : {log.author.toUpperCase()}</span>
                    <span>TAG: {log.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Add Observation */}
            <div className="lg:col-span-4">
              <div className={`p-6 rounded-3xl border sticky top-28 ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <h3 className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> CONSIGNER UN RELEVÉ
                </h3>

                <form onSubmit={handleAddJournalNode} className="space-y-4 text-left">
                  <div>
                    <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Titre de l'observation</label>
                    <input
                      type="text"
                      placeholder="Ex: Élévation de la Silice poreuse..."
                      value={newJournalTitle}
                      onChange={(e) => setNewJournalTitle(e.target.value)}
                      className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Catégorie</label>
                      <select
                        value={journalCategory}
                        onChange={(e) => setJournalCategory(e.target.value)}
                        className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-[10px] text-white font-mono focus:outline-none"
                      >
                        <option value="Matériaux">Matériaux</option>
                        <option value="Structure">Structure</option>
                        <option value="Optique">Optique</option>
                        <option value="Sismique">Sismique</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <span className="text-[8px] font-mono text-[#00dbe9] block uppercase mb-2">AUTEUR:</span>
                      <span className="text-[10px] font-mono text-white font-bold">{activeBadge.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">Corps de l'analyse / Observations</label>
                    <textarea
                      placeholder="Indiquez les contraintes observées ou les doutes quant au dôme..."
                      rows={5}
                      value={newJournalContent}
                      onChange={(e) => setNewJournalContent(e.target.value)}
                      className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-amber-500 text-black py-3.5 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    AJOUTER AUX REGISTRES
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 05: ESPACE CLIENT (IDENTITY HUD) ==================== */}
      {currentTab === "client" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Side: Client profile card */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className={`p-6 rounded-3xl border text-center ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div className="flex justify-between items-center border-b border-neutral-900 pb-4 mb-6">
                  <span className="text-[8.5px] font-mono text-cyan-400 font-extrabold uppercase tracking-wider">[ ACCÈS PORTAIL CLIENT ]</span>
                  <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${activeBadge.avatarColor} p-1 flex items-center justify-center relative shadow-[0_4px_25px_rgba(0,219,233,0.15)] mb-4`}>
                    <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-mono text-2xl font-black text-white">
                      {activeBadge.name ? activeBadge.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <span className="absolute bottom-0 right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-neutral-950 rounded-full flex items-center justify-center">
                      <UserCheck className="w-2.5 h-2.5 text-black" />
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white dark:text-[#f8fafc] leading-tight flex items-center gap-1.5 justify-center uppercase">
                    {activeBadge.name}
                  </h3>
                  <span className="font-mono text-[10px] text-rose-500 tracking-widest mt-0.5 block font-bold">
                    {activeBadge.clearance}
                  </span>
                  <div className="bg-neutral-950/80 px-4 py-2 rounded-xl border border-neutral-900 mt-4 max-w-xs font-mono text-[10px] space-y-1 block text-left">
                    <p className="text-neutral-500"><span className="text-stone-400 font-bold">ID:</span> {activeBadge.id}</p>
                    <p className="text-neutral-500"><span className="text-stone-400 font-bold">LIAISON:</span> {activeBadge.email}</p>
                    <p className="text-neutral-500"><span className="text-stone-400 font-bold">ENREGISTRÉ:</span> {activeBadge.regDate}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-900/60 mt-6 text-left space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-stone-400">LIENS REQUIS :</span>
                    <span className="text-cyan-400 font-bold">CRIMSON GATE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <span 
                      onClick={() => showHudToast("Téléchargement du Vol. IV Drawing Archives...")}
                      className="p-2.5 bg-[#111317] border border-neutral-900 text-stone-400 rounded-xl cursor-pointer hover:bg-neutral-900 text-[10px] font-mono uppercase font-bold"
                    >
                      DESSIN ARCHIVES
                    </span>
                    <span 
                      onClick={() => showHudToast("Pinger Balayeur Sismique actif...")}
                      className="p-2.5 bg-[#111317] border border-neutral-900 text-stone-400 rounded-xl cursor-pointer hover:bg-neutral-900 text-[10px] font-mono uppercase font-bold"
                    >
                      PING BALAYEUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic compliance health quadrant */}
              <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
                isLightMode ? "bg-[#EDEBE5] border-stone-200" : "bg-[#0c0d11]/80 border-neutral-900"
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] text-[#00dbe9] uppercase block font-bold">ÉCONOMIE EN PLACE</span>
                  <span className="text-emerald-500 font-mono text-[10px] font-black">98% OPTIMUM</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Grâce aux poutres de soutènement accrues sur le Terminal Alpha, les contraintes aux vents sont neutralisées.
                </p>
              </div>
            </div>

            {/* Right Side: Transmission list & stats */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-white dark:text-[#f8fafc]">
                    <Satellite className="w-4 h-4 text-cyan-400" /> HISTORIQUE DES COMMUNICATIONS SATELLITES
                  </h3>

                  <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
                    {recentTransmissions.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-neutral-900 rounded-2xl">
                        <span className="font-mono text-zinc-500 text-[11px] block">Aucune transmission en cours.</span>
                      </div>
                    ) : (
                      recentTransmissions.map((tx, idx) => (
                        <div 
                          key={tx.id || idx} 
                          id={`tx-row-${tx.id}`}
                          className="p-4 bg-neutral-950/50 rounded-2xl border border-neutral-900/60 flex justify-between items-center"
                        >
                          <div className="text-left space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#00dbe9] font-black">{tx.id}</span>
                              <span className="font-mono text-[8px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-md uppercase font-bold">
                                {tx.vector}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono">{tx.data}</p>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="font-mono text-[8.5px] text-zinc-500">{tx.timestamp}</span>
                            <span className="text-[10px] font-mono text-emerald-400 font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> SENT
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-900/60 pt-6 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>CANAL DIRECT: LIAISON SAT-B NOMINALE</span>
                  <span>TOTAL FLUX : {recentTransmissions.length} ÉMISSIONS RECORDEDS</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 06: LE TERMINAL (UPLINK FORM) ==================== */}
      {currentTab === "terminal" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Form payload */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className={`p-6 rounded-3xl border flex-1 ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div className="flex items-center gap-2 text-rose-500 mb-3 font-mono text-[10px] uppercase font-bold">
                  <TerminalIcon className="w-4 h-4 text-cyan-400 animate-pulse" /> SATELLITE INTERACTION CONSOLE
                </div>
                <h2 className="text-xl font-black text-white dark:text-[#f8fafc] leading-none uppercase tracking-tight">
                  PANEL DU TERMINAL D'UPLINK
                </h2>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                  Tramez vos relevés ou transmettez vos requêtes de calcul structurel directement au dôme à travers le réseau satellite souverain sécurisé.
                </p>

                <form onSubmit={handleInitiateTransmission} className="space-y-4 mt-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">DÉSIGNATION D'IDENTITÉ</label>
                      <input
                        type="text"
                        readOnly
                        value={activeBadge.name}
                        className="w-full bg-[#08090b]/80 border border-neutral-900 rounded-xl p-3 text-xs text-[#00dbe9] font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">VECTEUR ACCÈS</label>
                      <select
                        value={contactVector}
                        onChange={(e) => setContactVector(e.target.value)}
                        className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-[10px] text-white font-mono focus:outline-none"
                      >
                        <option value="Satellite Secure-B">Nœud Satellite Direct</option>
                        <option value="Réseau Quantique">Fibre Laser Superposée</option>
                        <option value="Mesh Terrestre">Réseau Local d'Ancrage</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">CONTENU DE TRANSMISSION (DATA LOG)</label>
                    <textarea
                      placeholder="Tapez vos instructions de coordination, ex: Aligner les dalles sismiques au rapport d'isolation thermique passive de 94.5%..."
                      rows={5}
                      value={terminalText}
                      onChange={(e) => setTerminalText(e.target.value)}
                      className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full font-mono text-[10px] font-black uppercase tracking-widest bg-[#00dbe9] text-black py-4 rounded-xl hover:bg-cyan-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Satellite className="w-4 h-4" /> TRANSMETTRE L'UPLINK SOUVERAIN
                  </button>
                </form>

                {/* Satellite sync timeline loader */}
                {transmissionProgress >= 0 && (
                  <div className="mt-6 bg-[#08090b] border border-[#00dbe9]/20 rounded-2xl p-4 text-left animate-pulse">
                    <div className="flex justify-between items-center mb-1 font-mono text-[9px] text-[#00dbe9]">
                      <span>TRANSMISSION EN COURS : LIAISON APERÇUE ({transmissionProgress}%)</span>
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    </div>
                    <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00dbe9] transition-all" style={{ width: `${transmissionProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Visual Verification */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white dark:text-[#f8fafc] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> VÉRIFICATION SÉCURITÉ DE VECTEUR
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Les passerelles d'émission sont validées en continu selon les exigences Zero-Trust. Toute anomalie de trame bloque le faisceau thermique laser.
                  </p>

                  <div className="space-y-3 mt-6">
                    <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-900 flex justify-between items-center">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-white block">BASTION PROXY SECURE</span>
                        <span className="text-[8.5px] text-neutral-500">IP LIAISON: 10.240.11.14</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/25 px-2.5 py-1 rounded inline-block font-bold">NOMINAL</span>
                    </div>

                    <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-900 flex justify-between items-center">
                      <div className="text-left font-mono">
                        <span className="text-[10px] text-white block">TRAM DE CAPTATION SATELLITE</span>
                        <span className="text-[8.5px] text-neutral-500">SATELLITE SIG-B ACTIVE</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/25 px-2.5 py-1 rounded inline-block font-bold">NOMINAL</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111216] p-4 rounded-xl border border-neutral-900 mt-6 text-center font-mono text-[8.5px] text-neutral-400 leading-normal">
                  Chiffrement de bout-en-bout activé. Algorithme elliptique AES-256 GCM.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== VIEWPORT 07: PORTAIL D'ACCÈS / SECURITY BADGE ==================== */}
      {currentTab === "security" && (
        <div className="space-y-6 relative z-10 animate-fade-in text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Login / Verification Dial */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div>
                  <div className="flex justify-between items-center border-b border-rose-950/20 pb-4 mb-6">
                    <span className="text-[8.5px] font-mono text-cyan-400 font-extrabold uppercase tracking-wider">[ LIER SECURE CREDENTIALS ]</span>
                    <Lock className="w-4 h-4 text-cyan-400" />
                  </div>

                  <form onSubmit={handleLoginBadge} className="space-y-4 text-left">
                    <div>
                      <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">IDENTIFIANT UNIQUE D'AGENT ID</label>
                      <input
                        type="text"
                        placeholder="Ex: ARC-849-V2"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-650 focus:outline-none focus:border-[#00dbe9]/50"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">CLÉ CRYPTOGRAPHIQUE SOUVERAINE</label>
                        <span onClick={() => showHudToast("Recherche de votre clé d'intégration : OMEGA-SYS-99")} className="text-[8px] font-mono text-neutral-400 hover:underline cursor-pointer">Clé d'essai standard ?</span>
                      </div>
                      <input
                        type="password"
                        placeholder="Indiquez la clé générée à l'enregistrement..."
                        value={loginKey}
                        onChange={(e) => setLoginKey(e.target.value)}
                        className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-650 focus:outline-none focus:border-[#00dbe9]/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-cyan-950/35 text-cyan-300 border border-[#00dbe9]/30 py-4 rounded-xl hover:bg-cyan-950/60 transition-colors cursor-pointer"
                    >
                      LIER SECURE BADGE
                    </button>
                  </form>
                </div>

                {/* Symmetrical Security locking grid */}
                <div className="bg-neutral-950/80 p-5 rounded-2xl border border-neutral-900 mt-6 text-center">
                  <span className="text-[8px] font-mono text-[#00dbe9] block uppercase font-bold">RELEVÉ DE CONDUITS DU PORTAIL</span>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    L'accostage nécessite un jeton crypté. Les clés non-enregistrées sont interceptées sous 300s.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Registration Badges Generator */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className={`p-6 rounded-3xl border flex-1 flex flex-col justify-between ${
                isLightMode ? "bg-white border-stone-200" : "bg-[#0b0c10]/80 border-neutral-900"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white dark:text-[#f8fafc] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-400" /> SYSTÈME D'ENREGISTREMENT SÉCURISÉ
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Créez votre carte physique d'identité pour intégrer notre protocole direct. Votre badge sera sauvegardé localement.
                  </p>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Badge builder form */}
                    <form onSubmit={handleRegisterBadge} className="space-y-3 text-left">
                      <div>
                        <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">NOM DE POSTE / PSEUDO</label>
                        <input
                          type="text"
                          required
                          placeholder="Nom complet d'agent..."
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">LIAISON DE CONTACT (SEC MAIL)</label>
                        <input
                          type="email"
                          required
                          placeholder="Email sécurisé..."
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">CLEARANCE LEVEL</label>
                          <select
                            value={regClearance}
                            onChange={(e) => setRegClearance(e.target.value)}
                            className="w-full bg-[#08090b]/40 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                          >
                            <option value="atrium">ALPHA ACCÈS</option>
                            <option value="laboratoire">LAB ACCÈS</option>
                            <option value="omega">OMEGA ACCÈS</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono text-stone-400 block uppercase mb-1">VÉRIFICATION CLÉ</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              placeholder="Générer clé..."
                              value={regKey}
                              className="w-full bg-[#08090b]/80 border border-neutral-900 rounded-xl p-2.5 text-[10px] text-[#00dbe9] font-mono focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleGenerateRegCryptKey}
                              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl transition-all cursor-pointer"
                              title="Générer une clé cryptologique"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full font-mono text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-black py-4 rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer mt-2"
                      >
                        GÉNÉRER ET ENREGISTRER L'IDENTITÉ
                      </button>
                    </form>

                    {/* Interactive security badge visualize display */}
                    <div className="relative w-full h-[320px] rounded-3xl bg-[#090a0d] border border-neutral-900/80 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-6">
                      
                      {/* Badge head overlay water-mark */}
                      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />

                      <div className="flex justify-between items-start">
                        <div className="text-left font-mono">
                          <span className="text-[7.5px] text-zinc-500 uppercase block tracking-widest">SOUVERAIN NEXUS D'IDENTITÉ</span>
                          <span className="text-[10.5px] font-black text-[#00dbe9] block mt-1">VISION ARCHITECTE</span>
                        </div>
                        <Fingerprint className="w-6 h-6 text-cyan-400 animate-pulse" />
                      </div>

                      {/* Centered card holder name */}
                      <div className="my-auto text-left space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-400/20 flex items-center justify-center font-mono font-black text-xl text-white">
                            {regName ? regName.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-white uppercase tracking-tight leading-tight">
                              {regName || "VOTRE NOM D'AGENT"}
                            </h4>
                            <span className="font-mono text-[8.5px] text-zinc-500">
                              {regEmail || "votre_email@secure.local"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-900 text-left flex justify-between items-center font-mono">
                          <div>
                            <span className="text-[7px] text-zinc-500 block">Identificant Unique (ID)</span>
                            <span className="text-[10px] text-white font-bold block mt-0.5">
                              {regName ? "ARC-SYNC-V1" : "ARC-XXX-V0"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[7px] text-zinc-500 block">Autorisation</span>
                            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5 uppercase">
                              {regClearance} ACCÈS
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-neutral-900/60 pt-4 text-[8px] font-mono text-zinc-500 uppercase">
                        <div>
                          <span>CLÉ: {regKey || "NON REVOQUÉE"}</span>
                        </div>
                        <span>AUTRE DE COMPLEMENT OK</span>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* FOOTER COMPLIANCE LABELS */}
      <footer className="mt-12 text-center text-zinc-500 text-[10px] font-mono border-t border-neutral-900/60 pt-6">
        <p>© 2026 VISION ARCHITECTE // SYSTEM COUVERTURE SÉCURISÉ // ALL RIGHTS ASSIGNED FOR CLANDESTINE SERVICES</p>
      </footer>

    </div>
  );
}

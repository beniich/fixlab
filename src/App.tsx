/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  FolderHeart, Network, ShieldCheck, Terminal as TermIcon, BrainCircuit, 
  Workflow, Layers, Server, Activity, AlertOctagon, RefreshCw, 
  Settings2, Bot, Menu, X, Hammer, Globe, Mail, Landmark
} from "lucide-react";

import { Device, SystemLog, SecurityPolicy, GroupFolder, SoftwarePackage, PredictiveFailure, DNSRecord, DNSQueryLog, SovereignSettings } from "./types";
import { 
  initialDevices, initialLogs, initialPolicies, initialGroups, 
  initialSoftware, initialPredictiveFailures 
} from "./mockData";

// Firebase/Firestore Cloud imports
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDocs, writeBatch, getDoc
} from "firebase/firestore";
import { db, auth, OperationType, handleFirestoreError, testConnection } from "./utils/firebaseDb";

// Components
import { SystemStatusBar } from "./components/SystemStatusBar";
import { RightFocusPanel } from "./components/RightFocusPanel";
import { DashboardView } from "./components/DashboardView";
import { DevicesView } from "./components/DevicesView";
import { PoliciesView } from "./components/PoliciesView";
import { GroupsView } from "./components/GroupsView";
import { ConsoleView } from "./components/ConsoleView";
import { SoftwareView } from "./components/SoftwareView";
import { PredictiveView } from "./components/PredictiveView";
import { AutomationView } from "./components/AutomationView";
import { DNSView } from "./components/DNSView";
import { CommandCenterPage } from "./components/CommandCenterPage";
import { SettingsPage } from "./components/SettingsPage";
import { SovereignGmail } from "./components/SovereignGmail";

// Dynamic Variant Layouts Custom Components
import { IncidentTimeline } from "./components/IncidentTimeline";
import { RemoteTerminal } from "./components/RemoteTerminal";
import { HealthMatrix } from "./components/HealthMatrix";
import { GlobalHorizonMap } from "./components/GlobalHorizonMap";
import { QuantumNode } from "./components/QuantumNode";
import { ExecutiveInsights } from "./components/ExecutiveInsights";
import { SecurityPerimeter } from "./components/SecurityPerimeter";
import { DataVisualizationFlow } from "./components/DataVisualizationFlow";
import { PlatformHypervisor } from "./components/PlatformHypervisor";

// Private custom hook that monitors system logs and notifies when a critical incident is registered
function useSecurityAlertListener(
  logs: SystemLog[],
  onTriggerDraft: (draft: { to: string; subject: string; body: string }) => void
) {
  const [processedAlertIds, setProcessedAlertIds] = useState<Set<string>>(() => {
    // Collect pre-existing logs on mount to ensure we only trigger on newly registered/streamed events
    return new Set(logs.filter(log => log.level === "critical").map(log => log.id));
  });

  useEffect(() => {
    const criticalLogs = logs.filter(log => log.level === "critical");
    if (criticalLogs.length === 0) return;

    // Filter out previously handled incident reports
    const unprocessed = criticalLogs.filter(log => !processedAlertIds.has(log.id));
    if (unprocessed.length === 0) return;

    // Grab the newest unhandled critical alarm
    const newestLog = unprocessed[0];

    const trackingSubject = `[CRITICAL SECURITY ALERT] ${newestLog.source}: Core Vulnerability Spotted`;
    const draftMessage = `SECURE COMMUNICATIONS NETWAY
=====================================
TIMESTAMP RE-LINK: ${newestLog.timestamp}
DETECTION DECK: ${newestLog.source}
SEVERITY MATRIX: CRITICAL

INCIDENT TELEMETRY PAYLOAD:
"${newestLog.message}"

This alert has been cryptographically registered and requires urgent security quarantine procedures or operator intervention.

Best regards,
Sovereign Network Command Center`;

    onTriggerDraft({
      to: "adambeniich7@gmail.com",
      subject: trackingSubject,
      body: draftMessage
    });

    setProcessedAlertIds(prev => {
      const next = new Set(prev);
      next.add(newestLog.id);
      return next;
    });
  }, [logs, processedAlertIds, onTriggerDraft]);
}

export default function App() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [policies, setPolicies] = useState<SecurityPolicy[]>(initialPolicies);
  const [groups, setGroups] = useState<GroupFolder[]>(initialGroups);
  const [software, setSoftware] = useState<SoftwarePackage[]>(initialSoftware);
  const [failures, setFailures] = useState<PredictiveFailure[]>(initialPredictiveFailures);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [dnsQueryLogs, setDnsQueryLogs] = useState<DNSQueryLog[]>([]);
  const [sovereignSettings, setSovereignSettings] = useState<SovereignSettings>({
    coreIdentity: 45,
    cognitiveLoad: 60,
    hapticResonance: 30,
    energyProfile: 75,
    dataSynthesis: "Low-Latency"
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<"super-admin" | "strategist" | "tactician" | "auditor">("super-admin");
  const [currentPlan, setCurrentPlan] = useState<"tactical" | "sovereign" | "imperial">("sovereign");

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Buffer state to transport custom pre-populated draft templates dynamically to SovereignGmail views
  const [gmailInitialCompose, setGmailInitialCompose] = useState<{
    to: string;
    subject: string;
    body: string;
  } | null>(null);

  // Listen to security logs and auto-compose drafts when critical alerts arise
  useSecurityAlertListener(logs, (draft) => {
    setGmailInitialCompose(draft);
    setActiveTab("gmail");
  });

  // Resolve current active selected device from live telemetry array to prevent state drift
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null;

  // 1. Connection-first Diagnostics boot check
  useEffect(() => {
    testConnection().then(active => {
      if (active) {
        console.info("⚡ Sovereign Nexus authenticated secure link validated successfully.");
      } else {
        console.warn("⚠️ Sovereign database link running in localized/airgapped fallback segment.");
      }
    });
  }, []);

  // 2. Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        console.info(`🔑 Secure operator session verified for email: ${fbUser.email}`);
        
        const userDocRef = doc(db, "users", fbUser.uid);
        try {
          // Check if devices exist under the user
          const testSnap = await getDocs(collection(db, `users/${fbUser.uid}/devices`));
          
          if (testSnap.empty) {
            console.info("🚀 First-time onboarding detected. Syncing secure, isolated mock datasets...");
            const batch = writeBatch(db);
            
            // Register standard user parameters
            batch.set(userDocRef, {
              uid: fbUser.uid,
              email: fbUser.email,
              role: "super-admin",
              plan: "sovereign",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });

            // Sync original device nodes
            initialDevices.forEach(d => {
              const dRef = doc(db, `users/${fbUser.uid}/devices`, d.id);
              batch.set(dRef, { ...d, ownerId: fbUser.uid });
            });

            // Sync original security policies
            initialPolicies.forEach(p => {
              const pRef = doc(db, `users/${fbUser.uid}/securityPolicies`, p.id);
              batch.set(pRef, { ...p, ownerId: fbUser.uid });
            });

            // Sync original log matrices
            initialLogs.forEach(l => {
              const lRef = doc(db, `users/${fbUser.uid}/systemLogs`, l.id);
              batch.set(lRef, { ...l, ownerId: fbUser.uid });
            });

            // Sync original groups
            initialGroups.forEach(g => {
              const gRef = doc(db, `users/${fbUser.uid}/groupFolders`, g.id);
              batch.set(gRef, { ...g, ownerId: fbUser.uid });
            });

            await batch.commit();
            console.info("🎉 Database initialized under strict zero-trust subcollections.");
          } else {
            // Already initialized, load state
            const uDoc = await getDoc(userDocRef);
            if (uDoc.exists()) {
              const uData = uDoc.data();
              if (uData?.role) setCurrentRole(uData.role as any);
              if (uData?.plan) setCurrentPlan(uData.plan as any);
            }
          }
        } catch (err) {
          console.error("Failed to sync client onboarding data:", err);
        }
      } else {
        console.info("ℹ️ Localized session initialized. Real-time stream fallbacks triggered.");
      }
    });

    return () => unsubAuth();
  }, []);

  // 3. Listen to Firestore real-time collections if user is logged in
  useEffect(() => {
    if (!currentUser) return;

    const uId = currentUser.uid;

    // Sub to User Profile for instant RBAC/Plan reflects
    const unsubProfile = onSnapshot(doc(db, "users", uId), (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d?.role) setCurrentRole(d.role as any);
        if (d?.plan) setCurrentPlan(d.plan as any);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${uId}`);
    });

    // Sub to Devices
    const unsubDevices = onSnapshot(collection(db, `users/${uId}/devices`), (snapshot) => {
      const items: Device[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Device);
      });
      if (items.length > 0) {
        setDevices(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/devices`);
    });

    // Sub to Policies
    const unsubPolicies = onSnapshot(collection(db, `users/${uId}/securityPolicies`), (snapshot) => {
      const items: SecurityPolicy[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as SecurityPolicy);
      });
      if (items.length > 0) {
        setPolicies(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/securityPolicies`);
    });

    // Sub to Logs
    const unsubLogs = onSnapshot(collection(db, `users/${uId}/systemLogs`), (snapshot) => {
      const items: SystemLog[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as SystemLog);
      });
      if (items.length > 0) {
        setLogs(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/systemLogs`);
    });

    // Sub to Groups
    const unsubGroups = onSnapshot(collection(db, `users/${uId}/groupFolders`), (snapshot) => {
      const items: GroupFolder[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as GroupFolder);
      });
      if (items.length > 0) {
        setGroups(items);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${uId}/groupFolders`);
    });

    return () => {
      unsubProfile();
      unsubDevices();
      unsubPolicies();
      unsubLogs();
      unsubGroups();
    };
  }, [currentUser]);

  // 4. Real-Time SSE Stream Fallback (Gated when currentUser is offline/anonymous)
  useEffect(() => {
    if (currentUser) return; // Ignore SSE streaming updates if logged in to Firestore

    const sse = new EventSource("/api/events");

    sse.addEventListener("sync_all", (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.devices) setDevices(payload.devices);
        if (payload.policies) setPolicies(payload.policies);
        if (payload.logs) setLogs(payload.logs);
        if (payload.software) setSoftware(payload.software);
        if (payload.failures) setFailures(payload.failures);
        if (payload.dnsRecords) setDnsRecords(payload.dnsRecords);
        if (payload.dnsQueryLogs) setDnsQueryLogs(payload.dnsQueryLogs);
        if (payload.sovereignSettings) setSovereignSettings(payload.sovereignSettings);
      } catch (err) {
        console.error("SSE initial sync failed:", err);
      }
    });

    sse.addEventListener("devices_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDevices(updated);
      } catch (err) {
        console.error("SSE devices update failed:", err);
      }
    });

    sse.addEventListener("policies_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setPolicies(updated);
      } catch (err) {
        console.error("SSE policies update failed:", err);
      }
    });

    sse.addEventListener("logs_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setLogs(updated);
      } catch (err) {
        console.error("SSE logs update failed:", err);
      }
    });

    sse.addEventListener("software_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setSoftware(updated);
      } catch (err) {
        console.error("SSE software update failed:", err);
      }
    });

    sse.addEventListener("failures_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setFailures(updated);
      } catch (err) {
        console.error("SSE predictions update failed:", err);
      }
    });

    sse.addEventListener("dns_records_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDnsRecords(updated);
      } catch (err) {
        console.error("SSE dns records update failed:", err);
      }
    });

    sse.addEventListener("dns_logs_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setDnsQueryLogs(updated);
      } catch (err) {
        console.error("SSE dns logs update failed:", err);
      }
    });

    sse.addEventListener("settings_update", (e: MessageEvent) => {
      try {
        const updated = JSON.parse(e.data);
        setSovereignSettings(updated);
      } catch (err) {
        console.error("SSE settings update failed:", err);
      }
    });

    sse.onerror = (err) => {
      console.warn("Real-time stream interrupted. Re-negotiating SSL link socket...", err);
    };

    return () => {
      sse.close();
    };
  }, [currentUser]);

  // Sync group scores with underlying device compliance averages
  useEffect(() => {
    setGroups(prev => prev.map(grp => {
      const gDevices = devices.filter(d => d.group === grp.name);
      if (gDevices.length === 0) return grp;
      
      const avgCompliance = Math.round(
        gDevices.reduce((sum, d) => sum + d.policyCompliance, 0) / gDevices.length
      );
      const warns = gDevices.filter(d => d.status === "warning").length;

      return {
        ...grp,
        healthScore: avgCompliance,
        activeThreats: warns
      };
    }));
  }, [devices]);

  // Handle manual additions or injections Locally or in Firestore
  const handleAddLog = (newLog: SystemLog) => {
    if (currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/systemLogs`, newLog.id);
      setDoc(docRef, { ...newLog, ownerId: currentUser.uid }).catch(err => 
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/systemLogs/${newLog.id}`)
      );
    } else {
      setLogs(prev => [newLog, ...prev]);
    }
  };

  // State update handles for subscription role & plan
  const handleUpdateRole = async (newRole: "super-admin" | "strategist" | "tactician" | "auditor") => {
    setCurrentRole(newRole);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(docRef, { role: newRole, updatedAt: new Date().toISOString() });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  const handleUpdatePlan = async (newPlan: "tactical" | "sovereign" | "imperial") => {
    setCurrentPlan(newPlan);
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(docRef, { plan: newPlan, updatedAt: new Date().toISOString() });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  // Dispatch live actions directly to server-side endpoints
  const handleActionTriggered = async (
    actionName: string, 
    deviceId: string, 
    level: "info" | "warning" | "critical" | "success"
  ) => {
    let apiAction = "";
    if (actionName.includes("Manual Hard Reboot Requested") || actionName === "reboot") {
      apiAction = "reboot";
    } else if (actionName.includes("Cyber-Security Isolation Triggered") || actionName === "isolate") {
      apiAction = "isolate";
    } else if (actionName.includes("Cryptographic Policy Force Enforced") || actionName === "clear-alarms") {
      apiAction = "clear-alarms";
    }

    if (currentUser) {
      // Modify device and log in Firestore
      const dev = devices.find(d => d.id === deviceId);
      if (dev) {
        const devRef = doc(db, `users/${currentUser.uid}/devices`, deviceId);
        let newStatus = dev.status;
        let newCpu = dev.cpu;
        let newRam = dev.ram;

        if (apiAction === "reboot") {
          newStatus = "online";
          newCpu = 10;
          newRam = 20;
        } else if (apiAction === "isolate") {
          newStatus = "warning";
        }

        try {
          await updateDoc(devRef, { status: newStatus, cpu: newCpu, ram: newRam, lastActive: "Just now" });
          
          // Add custom log
          const newLog: SystemLog = {
            id: `LOG-REAC-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
            source: "Console Interactive",
            level: level || "info",
            message: `Instruction '${apiAction || actionName}' executed on device ${dev.name} via platform gateway.`
          };
          handleAddLog(newLog);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/devices/${deviceId}`);
        }
      }
    } else {
      // Falling back to Local/SSE API server integrations:
      if (apiAction) {
        try {
          await fetch("/api/devices/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId, action: apiAction })
          });
        } catch (err) {
          console.error("Failed to invoke device command API:", err);
        }
      } else if (actionName.includes("Diagnostic Port Stream Synced")) {
        const newLog: SystemLog = {
          id: `LOG-TETH-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
          source: "Console Interactive",
          level: "info",
          message: `Tether secure socket tunnel synced successfully for host device ID: ${deviceId}`
        };
        setLogs(prev => [newLog, ...prev]);
      }
    }
  };

  const handleClearAlert = (logId: string) => {
    if (currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/systemLogs`, logId);
      deleteDoc(docRef).catch(err =>
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/systemLogs/${logId}`)
      );
    } else {
      setLogs(prev => prev.filter(l => l.id !== logId));
    }
  };

  const handleModifyDeviceStatus = async (deviceId: string, status: "online" | "warning" | "offline") => {
    if (currentUser) {
      const devRef = doc(db, `users/${currentUser.uid}/devices`, deviceId);
      try {
        await updateDoc(devRef, { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/devices/${deviceId}`);
      }
    } else {
      const apiAction = status === "online" ? "reboot" : status === "warning" ? "isolate" : "";
      if (apiAction) {
        try {
          await fetch("/api/devices/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId, action: apiAction })
          });
        } catch (err) {
          console.error("Failed to update status via command API:", err);
        }
      }
    }
  };

  // Toggle Security Policy on Server or in Firestore
  const handleTogglePolicy = async (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy && currentUser) {
      const docRef = doc(db, `users/${currentUser.uid}/securityPolicies`, policyId);
      try {
        await updateDoc(docRef, { enabled: !policy.enabled, lastEnforced: "Just now" });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/securityPolicies/${policyId}`);
      }
    } else {
      try {
        await fetch("/api/policies/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ policyId })
        });
      } catch (err) {
        console.error("Failed to toggle policy via API:", err);
      }
    }
  };

  // Mass Rollout Sovereign Desired State
  const handleDeployPoliciesAll = async () => {
    if (currentUser) {
      try {
        for (const p of policies) {
          const docRef = doc(db, `users/${currentUser.uid}/securityPolicies`, p.id);
          await updateDoc(docRef, { enabled: true, lastEnforced: "Just now" });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/securityPolicies`);
      }
    } else {
      try {
        await fetch("/api/policies/deploy", { method: "POST" });
      } catch (err) {
        console.error("Failed to post global policy rollout via API:", err);
      }
    }
  };

  // Flash Kernel Software Update
  const handleTriggerSoftwareUpdate = async (pkgId: string) => {
    try {
      await fetch("/api/software/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pkgId })
      });
    } catch (err) {
      console.error("Failed to trigger packages flash via API:", err);
    }
  };

  // Mitigate ML Degradation Alerts
  const handleTriggerPredictionMitigation = async (failureId: string) => {
    try {
      await fetch("/api/failures/mitigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ failureId })
      });
    } catch (err) {
      console.error("Failed to trigger ML failure mitigation via API:", err);
    }
  };

  // Sovereign DNS API wrappers
  const handleAddDNSRecord = async (domain: string, type: DNSRecord["type"], value: string, ttl: number) => {
    try {
      await fetch("/api/dns/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, type, value, ttl })
      });
    } catch (err) {
      console.error("Failed to add DNS record:", err);
    }
  };

  const handleToggleDNSRecord = async (recordId: string) => {
    try {
      await fetch("/api/dns/records/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
    } catch (err) {
      console.error("Failed to toggle DNS record:", err);
    }
  };

  const handlePurgeDNSRecord = async (recordId: string) => {
    try {
      await fetch("/api/dns/records/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId })
      });
    } catch (err) {
      console.error("Failed to purge DNS record:", err);
    }
  };

  const handleTriggerDiagnosticsDNSQuery = async (domain: string, deviceId: string) => {
    try {
      await fetch("/api/dns/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, deviceId })
      });
    } catch (err) {
      console.error("Failed to dispatch manual diagnostics lookup query:", err);
    }
  };

  const handleApplySovereignSettings = async (newSecSettings: SovereignSettings) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSecSettings)
      });
    } catch (err) {
      console.error("Failed to post settings update to API:", err);
    }
  };

  // Navigations Lists with 10 visual-themed preset variant layouts
  const navigationTabs = [
    { id: "dashboard", label: "01 • COMMAND CENTER", icon: Server },
    { id: "health-matrix", label: "02 • HEALTH MATRIX", icon: Activity },
    { id: "data-flow", label: "03 • DATA FLOW", icon: Workflow },
    { id: "quantum-node", label: "04 • QUANTUM NODE", icon: BrainCircuit },
    { id: "insights", label: "05 • EXEC INSIGHTS", icon: Layers },
    { id: "perimeter", label: "06 • SEC PERIMETER", icon: ShieldCheck },
    { id: "terminal", label: "07 • SECURE TERMINAL", icon: TermIcon },
    { id: "timeline", label: "08 • INCIDENT TIMELINE", icon: AlertOctagon },
    { id: "global-map", label: "09 • GLOBAL MAP", icon: Globe },
    { id: "settings", label: "10 • SYSTEM ESSENCE", icon: Settings2 },
    { id: "gmail", label: "11 • SOVEREIGN MAIL", icon: Mail },
    { id: "platform-gate", label: "12 • PLATFORM OPERATOR", icon: Landmark },
  ];

  return (
    <div id="sovereign-root" className="min-h-screen bg-[#0c0523] text-purple-100 flex flex-col justify-between selection:bg-[#22d3ee] selection:text-indigo-950">
      
      {/* Outer ambient radiant background glows */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.06),transparent_50%)] pointer-events-none z-0" />

      {/* Container segment: Sidebar navbar + Content screen */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-transparent relative z-10">
        
        {/* Left Sidebar Menu Drawer (Medical Velvet Space Yacht Aesthetic) */}
        <aside id="sidebar-navigation" className="w-full md:w-68 bg-[#150a36]/90 border-b md:border-b-0 md:border-r border-purple-500/10 py-5 flex flex-col justify-between shrink-0 select-none backdrop-blur-md">
          <div>
            {/* Title / Launcher Logo */}
            <div className="px-5 pb-5 border-b border-purple-950/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-900/40 border border-[#22d3ee]/30 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-[13px] font-black tracking-widest text-white uppercase italic">SANTÉ CORE</h1>
                  <span className="text-[8.5px] text-[#7c6bb5] block font-mono font-bold tracking-wider uppercase">CLINICAL OPERATING OS</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-1.5 hover:bg-purple-950 md:hidden text-purple-300 hover:text-white rounded-lg border border-purple-800/10 transition-all"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

            {/* Nav List */}
            <nav className={`px-3 pt-4 space-y-1.5 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
              {navigationTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all relative cursor-pointer ${
                      isActive 
                        ? "bg-[#24175e] text-cyan-400 border border-cyan-400/25 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-extrabold" 
                        : "text-[#7c6bb5] hover:bg-purple-950/40 hover:text-white border border-transparent"
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]" : "text-[#7c6bb5]"}`} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <div className="absolute right-3.5 top-4.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats system cards on lower Sidebar boundary */}
          <div className="px-4 pt-4 border-t border-purple-950/50 hidden md:block space-y-3.5">
            <div className="bg-[#1a0e41]/60 p-4 rounded-2xl border border-purple-500/10 text-[10px] font-mono leading-relaxed space-y-1.5">
              <span className="text-[#7c6bb5] font-bold block uppercase tracking-wider">HOSPITAL INTEGRATION</span>
              <div className="flex justify-between text-purple-200">
                <span>Enforcement Deck:</span>
                <span className="text-cyan-400 font-extrabold">Active (HR-V2)</span>
              </div>
              <div className="flex justify-between text-purple-200">
                <span>Secure Tunneling:</span>
                <span className="text-teal-400 font-extrabold">Encrypted Port</span>
              </div>
            </div>
            <div className="text-center font-mono text-[8px] text-purple-500 font-bold tracking-widest uppercase">
              UNIVERSITE DE RABAT V2
            </div>
          </div>
        </aside>

        {/* Main Content Workspace viewport */}
        <main id="main-telemetry-canvas" className="flex-1 flex overflow-hidden bg-transparent">
          <div className="flex-1 overflow-y-auto p-5 md:p-8 pb-12">
            
            {/* Header Telemetry Ticker of active tab */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-purple-950/40 gap-3">
              <div>
                <span className="text-[#7c6bb5] font-mono text-[9px] font-bold tracking-widest uppercase block mb-1">SOVEREIGN HEALTH & SECURITY INTERACTION</span>
                <h2 className="text-lg font-black text-white tracking-widest uppercase italic leading-none">
                  {navigationTabs.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px]">
                <div className="flex items-center gap-2 bg-[#1a0e41]/80 border border-purple-500/10 px-3.5 py-2 rounded-xl text-purple-300">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MONITORING:</span>
                  <strong className="text-cyan-400 uppercase font-black tracking-widest">NOMINAL</strong>
                </div>

                <div className="flex items-center gap-1.5 bg-cyan-950/45 border border-cyan-500/25 px-3.5 py-2 rounded-xl text-cyan-400">
                  <span>TIER:</span>
                  <strong className="text-white uppercase font-black tracking-wider">{currentPlan}</strong>
                </div>

                <div className="flex items-center gap-1.5 bg-[#120732] border border-purple-500/20 px-3.5 py-2 rounded-xl text-[#ff5c00]">
                  <span>ROLE:</span>
                  <strong className="text-white uppercase font-black tracking-wider">{currentRole}</strong>
                </div>
              </div>
            </div>

            {/* Tab Swappers */}
            {activeTab === "dashboard" && (
              <CommandCenterPage 
                devices={devices} 
                logs={logs} 
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)} 
                onClearAlert={handleClearAlert}
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
              />
            )}

            {activeTab === "health-matrix" && (
              <HealthMatrix 
                devices={devices}
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)}
                onModifyDeviceStatus={handleModifyDeviceStatus}
              />
            )}

            {activeTab === "data-flow" && (
              <DataVisualizationFlow />
            )}

            {activeTab === "quantum-node" && (
              <QuantumNode />
            )}

            {activeTab === "insights" && (
              <ExecutiveInsights />
            )}

            {activeTab === "perimeter" && (
              <SecurityPerimeter />
            )}

            {activeTab === "terminal" && (
              <RemoteTerminal 
                devices={devices}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === "timeline" && (
              <IncidentTimeline 
                logs={logs}
                devices={devices}
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)}
              />
            )}

            {activeTab === "global-map" && (
              <GlobalHorizonMap devices={devices} />
            )}

            {activeTab === "settings" && (
              <SettingsPage 
                initialSettings={sovereignSettings} 
                onApplySettings={handleApplySovereignSettings} 
              />
            )}

            {activeTab === "gmail" && (
              <SovereignGmail 
                initialCompose={gmailInitialCompose}
                onClearInitialCompose={() => setGmailInitialCompose(null)}
              />
            )}

            {activeTab === "platform-gate" && (
              <PlatformHypervisor 
                currentRole={currentRole}
                onChangeRole={handleUpdateRole}
                currentPlan={currentPlan}
                onChangePlan={handleUpdatePlan}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === "devices" && (
              <DevicesView 
                devices={devices} 
                selectedDevice={selectedDevice} 
                onSelectDevice={(dev) => setSelectedDeviceId(dev ? dev.id : null)} 
              />
            )}

            {activeTab === "policies" && (
              <PoliciesView 
                policies={policies} 
                onTogglePolicy={handleTogglePolicy} 
                onDeployPolicies={handleDeployPoliciesAll} 
              />
            )}

            {activeTab === "software" && (
              <SoftwareView 
                softwarePackages={software} 
                onTriggerUpdate={handleTriggerSoftwareUpdate} 
              />
            )}

            {activeTab === "dns" && (
              <DNSView 
                devices={devices}
                dnsRecords={dnsRecords}
                dnsQueryLogs={dnsQueryLogs}
                onAddRecord={handleAddDNSRecord}
                onToggleRecord={handleToggleDNSRecord}
                onDeleteRecord={handlePurgeDNSRecord}
                onTriggerTestQuery={handleTriggerDiagnosticsDNSQuery}
              />
            )}

          </div>

          {/* Right Deep Dive focuses Sidebar (slides in smoothly when device clicked) */}
          {selectedDevice && (
            <RightFocusPanel 
              device={selectedDevice} 
              onClose={() => setSelectedDeviceId(null)} 
              onActionTriggered={handleActionTriggered} 
            />
          )}

        </main>
      </div>

      {/* System Telemetry Lower Deck status bar */}
      <SystemStatusBar logs={logs} isConnected={true} />
    </div>
  );
}

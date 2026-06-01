import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Interfaces mirroring the client-side types
interface Device {
  id: string;
  name: string;
  ip: string;
  os: "Linux" | "Windows" | "macOS" | "SovereignOS";
  status: "online" | "warning" | "offline";
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  uptime: string;
  lastActive: string;
  group: string;
  location: string;
  policyCompliance: number;
  serialNumber: string;
  kernelVersion: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  source: string;
  level: "info" | "warning" | "critical" | "success";
  message: string;
  deviceId?: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  category: "Access" | "Network" | "Storage" | "Authentication";
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  lastEnforced: string;
}

interface SoftwarePackage {
  id: string;
  name: string;
  version: string;
  latestVersion: string;
  status: "up_to_date" | "update_available" | "vulnerable" | "unsupported";
  installedOn: number;
  severity?: "low" | "medium" | "high" | "critical";
  cveId?: string;
}

interface PredictiveFailure {
  id: string;
  deviceId: string;
  deviceName: string;
  component: "Cooling Fan" | "Solid State Drive" | "Primary RAM Node" | "CPU Thermal Junction" | "Battery Cell Pack";
  currentTemp: number;
  probability: number;
  timeToFailure: string;
  urgency: "low" | "medium" | "high" | "critical";
  riskDescription: string;
}

interface DNSRecord {
  id: string;
  domain: string;
  type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
  value: string;
  ttl: number;
  status: "active" | "inactive" | "intercepted";
  systemManaged?: boolean;
}

interface DNSQueryLog {
  id: string;
  timestamp: string;
  domain: string;
  clientIp: string;
  clientName: string;
  type: string;
  status: "resolved" | "blocked" | "forwarded";
  resolvedValue: string;
}

interface SovereignSettings {
  coreIdentity: number;
  cognitiveLoad: number;
  hapticResonance: number;
  energyProfile: number;
  dataSynthesis: string;
}

// Global In-Memory Database State
let sovereignSettings: SovereignSettings = {
  coreIdentity: 45,
  cognitiveLoad: 60,
  hapticResonance: 30,
  energyProfile: 75,
  dataSynthesis: "Low-Latency"
};

let dnsRecords: DNSRecord[] = [
  { id: "DNS-001", domain: "gateway.sovereign.local", type: "A", value: "10.240.11.14", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-002", domain: "centrifuge.sovereign.local", type: "A", value: "10.240.12.89", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-003", domain: "scada.sovereign.local", type: "A", value: "10.240.14.22", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-004", domain: "valve.sovereign.local", type: "A", value: "10.240.15.112", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-005", domain: "crystal.sovereign.local", type: "A", value: "10.240.15.201", ttl: 3600, status: "active", systemManaged: true },
  { id: "DNS-006", domain: "database.hq.private", type: "CNAME", value: "gateway.sovereign.local", ttl: 1800, status: "active" },
  { id: "DNS-007", domain: "mail.hq.private", type: "MX", value: "10 mail-relay.sovereign.local", ttl: 1800, status: "active" },
  { id: "DNS-008", domain: "clandestine-tracker.net", type: "A", value: "0.0.0.0", ttl: 300, status: "intercepted" },
  { id: "DNS-009", domain: "reverse-shell.telemetry-node.ru", type: "A", value: "0.0.0.0", ttl: 300, status: "intercepted" }
];

let dnsQueryLogs: DNSQueryLog[] = [
  { id: "DQL-001", timestamp: "14:05:22", domain: "gateway.sovereign.local", clientIp: "10.240.12.89", clientName: "CENTRIFUGE-MATRIX-42", type: "A", status: "resolved", resolvedValue: "10.240.11.14" },
  { id: "DQL-002", timestamp: "14:04:15", domain: "reverse-shell.telemetry-node.ru", clientIp: "10.240.15.201", clientName: "CRYSTAL-ANALYZER-SEC", type: "A", status: "blocked", resolvedValue: "0.0.0.0 (Sovereign Sinkhole)" },
  { id: "DQL-003", timestamp: "14:02:50", domain: "time.nist.gov", clientIp: "10.240.11.14", clientName: "SOV-CORE-GATEWAY-1A", type: "A", status: "forwarded", resolvedValue: "192.168.1.1 (Encrypted Upstream Proxy)" },
  { id: "DQL-004", timestamp: "13:58:11", domain: "scada.sovereign.local", clientIp: "10.240.15.112", clientName: "VALVE-CONTROLLER-01", type: "A", status: "resolved", resolvedValue: "10.240.14.22" }
];

let devices: Device[] = [
  {
    id: "DEV-041",
    name: "SOV-CORE-GATEWAY-1A",
    ip: "10.240.11.14",
    os: "SovereignOS",
    status: "online",
    cpu: 34,
    ram: 58,
    storage: 42,
    bandwidth: 12.8,
    uptime: "214d 18h",
    lastActive: "Just now",
    group: "Core Infrastructure",
    location: "Silo Node Alpha",
    policyCompliance: 100,
    serialNumber: "SN-998A-324-X",
    kernelVersion: "SovOS Core v4.11.9-rt"
  },
  {
    id: "DEV-042",
    name: "CENTRIFUGE-MATRIX-42",
    ip: "10.240.12.89",
    os: "Linux",
    status: "online",
    cpu: 78,
    ram: 84,
    storage: 67,
    bandwidth: 4.2,
    uptime: "45d 06h",
    lastActive: "Just now",
    group: "Production",
    location: "Refinery-B Wing 3",
    policyCompliance: 85,
    serialNumber: "SN-1025-CFG-M",
    kernelVersion: "Linux 5.15.0-88-generic"
  },
  {
    id: "DEV-043",
    name: "SCADA-GATEWAY-DIST-9",
    ip: "10.240.14.22",
    os: "SovereignOS",
    status: "warning",
    cpu: 91,
    ram: 92,
    storage: 89,
    bandwidth: 24.1,
    uptime: "12d 23h",
    lastActive: "2 min ago",
    group: "Core Infrastructure",
    location: "Silo Node Beta",
    policyCompliance: 60,
    serialNumber: "SN-5582-SCD-G",
    kernelVersion: "SovOS Core v4.11.9-rt"
  },
  {
    id: "DEV-044",
    name: "VALVE-CONTROLLER-01",
    ip: "10.240.15.112",
    os: "Linux",
    status: "online",
    cpu: 18,
    ram: 31,
    storage: 22,
    bandwidth: 0.1,
    uptime: "144d 12h",
    lastActive: "1 min ago",
    group: "Edge Relays",
    location: "Substation Delta",
    policyCompliance: 100,
    serialNumber: "SN-2210-VLV-C",
    kernelVersion: "Linux 4.19.120-rt-custom"
  },
  {
    id: "DEV-045",
    name: "CRYSTAL-ANALYZER-SEC",
    ip: "10.240.15.201",
    os: "Windows",
    status: "warning",
    cpu: 64,
    ram: 79,
    storage: 94,
    bandwidth: 2.3,
    uptime: "3d 11h",
    lastActive: "Just now",
    group: "Production",
    location: "Cleanroom Lab-4",
    policyCompliance: 40,
    serialNumber: "SN-8822-CRY-A",
    kernelVersion: "Windows IoT Enterprise LTSC"
  },
  {
    id: "DEV-046",
    name: "THERMAL-SINK-CONTROLLER",
    ip: "10.240.11.8",
    os: "Linux",
    status: "offline",
    cpu: 0,
    ram: 0,
    storage: 50,
    bandwidth: 0,
    uptime: "0d 0h",
    lastActive: "24 min ago",
    group: "Core Infrastructure",
    location: "Substructure Level -3",
    policyCompliance: 90,
    serialNumber: "SN-4431-THM-S",
    kernelVersion: "Linux 5.4.0-112-generic"
  },
  {
    id: "DEV-047",
    name: "HIND-ROTATION-MONITOR",
    ip: "10.240.18.52",
    os: "macOS",
    status: "online",
    cpu: 45,
    ram: 62,
    storage: 48,
    bandwidth: 1.5,
    uptime: "8d 04h",
    lastActive: "4 min ago",
    group: "Testing Operations",
    location: "Testing Flight Deck",
    policyCompliance: 95,
    serialNumber: "SN-0092-HND-R",
    kernelVersion: "Darwin 21.6.0"
  },
  {
    id: "DEV-048",
    name: "O2-REGENERATION-VALVE",
    ip: "10.240.18.99",
    os: "SovereignOS",
    status: "online",
    cpu: 28,
    ram: 45,
    storage: 30,
    bandwidth: 0.5,
    uptime: "230d 21h",
    lastActive: "Just now",
    group: "Edge Relays",
    location: "Silo Node Alpha",
    policyCompliance: 100,
    serialNumber: "SN-7733-O2R-V",
    kernelVersion: "SovOS Core v4.11.9-rt"
  }
];

let policies: SecurityPolicy[] = [
  {
    id: "POL-001",
    name: "Exclusion of Non-Authorized USB Media",
    category: "Storage",
    description: "Blocks external flash drives and non-whitelisted mass storage devices directly at host kernel registry level.",
    enabled: true,
    severity: "critical",
    lastEnforced: "Just now"
  },
  {
    id: "POL-002",
    name: "Interactive Session Timeout Limit",
    category: "Access",
    description: "Enforces a strict 300-second maximum idle counter before initiating user session lock and token invalidation.",
    enabled: true,
    severity: "medium",
    lastEnforced: "12 min ago"
  },
  {
    id: "POL-003",
    name: "Enhanced Entropy Password Matrix",
    category: "Authentication",
    description: "Requires multi-factor elements, minimum 16 alphanumeric symbols, and rotating dictionary exclusion check.",
    enabled: true,
    severity: "high",
    lastEnforced: "1 hour ago"
  },
  {
    id: "POL-004",
    name: "Restricted Port-Bound Whitelist Protection",
    category: "Network",
    description: "Strict outbound firewall table. Restricts high-performance relay nodes strictly to designated remote gateway proxies.",
    enabled: false,
    severity: "critical",
    lastEnforced: "Never"
  },
  {
    id: "POL-005",
    name: "Rotational Kernel Audit Log Integrity",
    category: "Access",
    description: "Stream core kernel event records continuously into our cryptographically signed, immutable ledger storage structure.",
    enabled: true,
    severity: "high",
    lastEnforced: "Just now"
  }
];

let logs: SystemLog[] = [
  {
    id: "LOG-1001",
    timestamp: "13:54:12",
    source: "SOV-CORE-GATEWAY-1A",
    level: "info",
    message: "Cryptographic handshakes validated for all secure local relays.",
    deviceId: "DEV-041"
  },
  {
    id: "LOG-1002",
    timestamp: "13:52:05",
    source: "SCADA-GATEWAY-DIST-9",
    level: "warning",
    message: "CPU Temp spiking above 85°C. System cooling fan underperforming.",
    deviceId: "DEV-043"
  },
  {
    id: "LOG-1003",
    timestamp: "13:51:33",
    source: "CRYSTAL-ANALYZER-SEC",
    level: "critical",
    message: "Policy Violation: Unauthorized mass USB flash drive connected to USB-3 Port.",
    deviceId: "DEV-045"
  },
  {
    id: "LOG-1004",
    timestamp: "13:48:10",
    source: "Security Policy Engine",
    level: "success",
    message: "USB auto-isolation policy enforced on CRYSTAL-ANALYZER-SEC.",
    deviceId: "DEV-045"
  },
  {
    id: "LOG-1005",
    timestamp: "13:45:00",
    source: "THERMAL-SINK-CONTROLLER",
    level: "warning",
    message: "Telemetry stream failure. Setting host status to UNREACHABLE.",
    deviceId: "DEV-046"
  }
];

let software: SoftwarePackage[] = [
  {
    id: "SW-01",
    name: "Kernel Security Patch",
    version: "v4.11.9-rt",
    latestVersion: "v4.11.9-rt",
    status: "up_to_date",
    installedOn: 3
  },
  {
    id: "SW-02",
    name: "OpenSSL Cryptography Engine",
    version: "1.1.1t",
    latestVersion: "3.1.0 (Critical Upgrade Needed)",
    status: "vulnerable",
    installedOn: 5,
    severity: "critical",
    cveId: "CVE-2023-0286"
  },
  {
    id: "SW-03",
    name: "OS Security Log Forwarder",
    version: "v2.12.0",
    latestVersion: "v2.14.2",
    status: "update_available",
    installedOn: 6
  },
  {
    id: "SW-04",
    name: "Docker Engine Containerized Wrapper",
    version: "20.10.12",
    latestVersion: "24.0.5",
    status: "unsupported",
    installedOn: 2,
    severity: "high"
  },
  {
    id: "SW-05",
    name: "Local Firewall Packet Analyzer",
    version: "v3.1.2",
    latestVersion: "v3.1.2",
    status: "up_to_date",
    installedOn: 8
  }
];

let failures: PredictiveFailure[] = [
  {
    id: "PF-01",
    deviceId: "DEV-043",
    deviceName: "SCADA-GATEWAY-DIST-9",
    component: "Cooling Fan",
    currentTemp: 87,
    probability: 88,
    timeToFailure: "14.5 hours",
    urgency: "critical",
    riskDescription: "Bearing resistance spike detected. Continuous RPM friction indicates structural degradation. Thermal overload imminent."
  },
  {
    id: "PF-02",
    deviceId: "DEV-042",
    deviceName: "CENTRIFUGE-MATRIX-42",
    component: "Solid State Drive",
    currentTemp: 44,
    probability: 62,
    timeToFailure: "4.2 days",
    urgency: "medium",
    riskDescription: "S.M.A.R.T wearout index dropped past threshold on primary boot block write cycles. Impending bad block cluster propagation."
  },
  {
    id: "PF-03",
    deviceId: "DEV-045",
    deviceName: "CRYSTAL-ANALYZER-SEC",
    component: "Battery Cell Pack",
    currentTemp: 39,
    probability: 45,
    timeToFailure: "18.2 days",
    urgency: "low",
    riskDescription: "Voltage discharge rate mismatch within standard UPS backup cells. Potential sub-module disruption during direct line cuts."
  }
];

// Active SSE client sockets connection pool
let sseClients: any[] = [];

// Helper to broadcast changes to all SSE clients
function broadcast(eventType: string, data: any) {
  sseClients.forEach(client => {
    client.res.write(`event: ${eventType}\n`);
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Get standard 24h digital format timestamp
function getTimestamp() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

// System logging generator
function appendLog(message: string, level: "info" | "warning" | "critical" | "success", source = "Sovereign Orchestrator", deviceId?: string) {
  const newLog: SystemLog = {
    id: `LOG-SRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: getTimestamp(),
    source,
    level,
    message,
    deviceId
  };
  logs = [newLog, ...logs].slice(0, 100); // Limit logs store to last 100
  broadcast("logs_update", logs);
  return newLog;
}

// Start Server Setup
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. SSE Real-Time Stream route
  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const clientId = Date.now();
    sseClients.push({ id: clientId, res });

    // Stream initial database snapshot
    res.write(`event: sync_all\n`);
    res.write(`data: ${JSON.stringify({ devices, policies, logs, software, failures, dnsRecords, dnsQueryLogs, sovereignSettings })}\n\n`);

    req.on("close", () => {
      sseClients = sseClients.filter(c => c.id !== clientId);
    });
  });

  // 2. Fetch full static datasets
  app.get("/api/devices", (req, res) => res.json(devices));
  app.get("/api/policies", (req, res) => res.json(policies));
  app.get("/api/logs", (req, res) => res.json(logs));
  app.get("/api/software", (req, res) => res.json(software));
  app.get("/api/failures", (req, res) => res.json(failures));
  app.get("/api/dns/records", (req, res) => res.json(dnsRecords));
  app.get("/api/dns/logs", (req, res) => res.json(dnsQueryLogs));
  app.get("/api/settings", (req, res) => res.json(sovereignSettings));

  // Settings Apply POST endpoint
  app.post("/api/settings", (req, res) => {
    const updated = req.body;
    sovereignSettings = {
      coreIdentity: Number(updated.coreIdentity ?? sovereignSettings.coreIdentity),
      cognitiveLoad: Number(updated.cognitiveLoad ?? sovereignSettings.cognitiveLoad),
      hapticResonance: Number(updated.hapticResonance ?? sovereignSettings.hapticResonance),
      energyProfile: Number(updated.energyProfile ?? sovereignSettings.energyProfile),
      dataSynthesis: String(updated.dataSynthesis ?? sovereignSettings.dataSynthesis)
    };
    appendLog(`Sovereign essence parameters recalibrated: Identity=${sovereignSettings.coreIdentity}%, Cognitive=${sovereignSettings.cognitiveLoad}%, Resonance=${sovereignSettings.hapticResonance}Hz, Energy=${sovereignSettings.energyProfile}%, Sync=${sovereignSettings.dataSynthesis}`, "success", "Central Recalibration Daemon");
    broadcast("settings_update", sovereignSettings);
    res.json({ success: true, sovereignSettings });
  });

  // 3. Post Command Override action (Reboot, Isolate, Direct triggers)
  app.post("/api/devices/command", (req, res) => {
    const { deviceId, action, params } = req.body;
    const dev = devices.find(d => d.id === deviceId);

    if (!dev) {
      return res.status(404).json({ error: "Device registry not found." });
    }

    if (action === "reboot" || action === "Reboot Host") {
      dev.status = "online";
      dev.cpu = 15;
      dev.ram = 25;
      dev.lastActive = "Just now";
      dev.uptime = "0d 00h";
      appendLog(`Emergency power cycle dispatched to ${dev.name}. Bios registers re-negotiating.`, "success", `Terminal Daemon [${dev.name}]`, dev.id);
    } else if (action === "isolate" || action === "Isolate Network") {
      dev.status = "warning";
      dev.lastActive = "Just now";
      appendLog(`Hardware network isolation protocol triggered. Ports blocked on ${dev.name}.`, "critical", "Sovereign Airgap Daemon", dev.id);
    } else if (action === "clear-alarms" || action === "Clear Alerts") {
      // Find logs of this device and demote them
      logs = logs.filter(l => l.deviceId !== dev.id || l.level !== "critical");
      if (dev.status === "warning") {
        dev.status = "online";
      }
      appendLog(`Reset alert relays on host telemetry matrix for ${dev.name}.`, "info", "Orchestrator Health Engine", dev.id);
    }

    broadcast("devices_update", devices);
    broadcast("logs_update", logs);
    res.json({ success: true, device: dev });
  });

  // 4. Modify policy status (Desired State Configuration logic)
  app.post("/api/policies/toggle", (req, res) => {
    const { policyId } = req.body;
    const policy = policies.find(p => p.id === policyId);

    if (!policy) {
      return res.status(404).json({ error: "Configuration policy not resolved." });
    }

    policy.enabled = !policy.enabled;
    policy.lastEnforced = "Just now";

    appendLog(
      `Sovereign compliance target changed: '${policy.name}' set to ${policy.enabled ? "ACTIVE" : "BYPASSED"}.`,
      policy.enabled ? "success" : "warning",
      "Policy Orchestration Daemon"
    );

    // Apply Desired State configuration adjustments automatically on compliance metric ratings!
    const activeWeight = policies.filter(p => p.enabled).length;
    const globalComplianceRating = Math.round((activeWeight / policies.length) * 100);

    devices = devices.map(d => {
      if (d.status === "offline") return d;
      const calculatedRating = Math.min(100, Math.max(30, globalComplianceRating + (d.id.charCodeAt(5) % 15)));
      return { ...d, policyCompliance: calculatedRating };
    });

    broadcast("policies_update", policies);
    broadcast("devices_update", devices);
    res.json({ success: true, policies, devices });
  });

  // 5. Mass Enforce policies
  app.post("/api/policies/deploy", (req, res) => {
    policies = policies.map(p => ({ ...p, enabled: true, lastEnforced: "Just now" }));
    
    devices = devices.map(d => {
      if (d.status === "offline") return d;
      return { ...d, policyCompliance: 100 };
    });

    appendLog("Global MDM policy rollout completed. 100% target compliance reached over airgapped relays.", "success", "Central Enforcement Manager");

    broadcast("policies_update", policies);
    broadcast("devices_update", devices);
    res.json({ success: true, policies, devices });
  });

  // 6. Flash Software Upgrade
  app.post("/api/software/update", (req, res) => {
    const { pkgId } = req.body;
    const pkg = software.find(s => s.id === pkgId);

    if (!pkg) {
      return res.status(404).json({ error: "Package identifier not found." });
    }

    pkg.version = pkg.latestVersion.split(" ")[0];
    pkg.status = "up_to_date";

    appendLog(`Flashed kernel safe asset binaries: ${pkg.name} upgraded successfully.`, "success", "Sovereign Package Registry");

    broadcast("software_update", software);
    res.json({ success: true, software });
  });

  // 7. MITIGATE ML Failures
  app.post("/api/failures/mitigate", (req, res) => {
    const { failureId } = req.body;
    const fail = failures.find(f => f.id === failureId);

    if (!fail) {
      return res.status(404).json({ error: "Failure prediction tracker not found." });
    }

    const linkedDevice = devices.find(d => d.id === fail.deviceId);
    if (linkedDevice) {
      linkedDevice.status = "online";
      linkedDevice.cpu = Math.max(10, linkedDevice.cpu - 25);
      linkedDevice.ram = Math.max(20, linkedDevice.ram - 15);
    }

    appendLog(`Pre-emptive mitigation logic injected for component '${fail.component}' on ${fail.deviceName}. Heat loads stabilized.`, "success", "ML Auto-Healer Daemon", fail.deviceId);

    failures = failures.filter(f => f.id !== failureId);

    broadcast("failures_update", failures);
    broadcast("devices_update", devices);
    res.json({ success: true, failures, devices });
  });

  // --- SOVEREIGN LOCAL DNS ENDPOINTS ---
  app.post("/api/dns/records", (req, res) => {
    const { domain, type, value, ttl } = req.body;
    if (!domain || !type || !value) {
      return res.status(400).json({ error: "Missing required parameters (domain, type, value)" });
    }
    const newRecord: DNSRecord = {
      id: `DNS-${Date.now()}`,
      domain: domain.trim(),
      type: type,
      value: value.trim(),
      ttl: Number(ttl) || 3600,
      status: "active",
      systemManaged: false
    };
    dnsRecords.push(newRecord);
    appendLog(`Created local authoritative zone mapping: [${type}] ${domain} -> ${value}`, "success", "DNS Server Daemon");
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, record: newRecord, dnsRecords });
  });

  app.post("/api/dns/records/toggle", (req, res) => {
    const { recordId } = req.body;
    const record = dnsRecords.find(r => r.id === recordId);
    if (!record) {
      return res.status(404).json({ error: "DNS Record mapping not found." });
    }
    if (record.status === "active") {
      record.status = "intercepted";
      record.value = "0.0.0.0"; // Sinkhole redirect
      appendLog(`Enforced sinkhole intercept routing on domain: ${record.domain}`, "warning", "DNS Protection Daemon");
    } else {
      record.status = "active";
      if (record.value === "0.0.0.0") {
        record.value = "10.240.11.14"; // Default gateway recovery
      }
      appendLog(`Released sinkhole intercept on domain: ${record.domain}`, "success", "DNS Protection Daemon");
    }
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, record, dnsRecords });
  });

  app.post("/api/dns/records/delete", (req, res) => {
    const { recordId } = req.body;
    const rec = dnsRecords.find(r => r.id === recordId);
    if (!rec) {
      return res.status(404).json({ error: "Record not found." });
    }
    dnsRecords = dnsRecords.filter(r => r.id !== recordId);
    appendLog(`Purged authoritative mapping zone: ${rec.domain} [${rec.type}]`, "warning", "DNS Server Daemon");
    broadcast("dns_records_update", dnsRecords);
    res.json({ success: true, dnsRecords });
  });

  app.post("/api/dns/query", (req, res) => {
    const { domain, deviceId } = req.body;
    const dev = devices.find(d => d.id === deviceId) || devices[0];
    const rec = dnsRecords.find(r => r.domain.toLowerCase() === (domain || "").toLowerCase().trim());
    
    let queryStatus: "resolved" | "blocked" | "forwarded" = "forwarded";
    let queryVal = "8.8.8.8 (External Default Loopback)";
    let recordType = "A";

    if (rec) {
      recordType = rec.type;
      if (rec.status === "intercepted") {
        queryStatus = "blocked";
        queryVal = "0.0.0.0 (Sovereign Sinkhole)";
      } else if (rec.status === "active") {
        queryStatus = "resolved";
        queryVal = rec.value;
      } else {
        queryStatus = "blocked";
        queryVal = "0.0.0.0 (Admin Lockout)";
      }
    } else {
      queryVal = "192.168.1.1 (Upstream Secure DNS)";
    }

    const newQueryLog: DNSQueryLog = {
      id: `DQL-${Date.now()}`,
      timestamp: getTimestamp(),
      domain: (domain || "unknown-lookup.hq").trim(),
      clientIp: dev ? dev.ip : "10.240.11.14",
      clientName: dev ? dev.name : "SOV-CORE-GATEWAY-1A",
      type: recordType,
      status: queryStatus,
      resolvedValue: queryVal
    };

    dnsQueryLogs = [newQueryLog, ...dnsQueryLogs].slice(0, 100);
    broadcast("dns_logs_update", dnsQueryLogs);
    res.json({ success: true, queryLog: newQueryLog });
  });

  // 8. Console Interactive Shell query terminal route
  app.post("/api/shell/exec", (req, res) => {
    const { commandInput } = req.body;
    const cmdTrimmed = (commandInput || "").trim();

    if (!cmdTrimmed) {
      return res.json({ text: "", type: "output" });
    }

    const args = cmdTrimmed.toLowerCase().split(" ");
    const primaryCommand = args[0];
    const targetArg = args[1];

    let outputType: "output" | "error" | "success" | "warning" = "output";
    let outputText = "";

    switch (primaryCommand) {
      case "help":
        outputText = `Operational Cmdlets:
  help                Display instructions list.
  devices             Show host terminals and telemetry heartbeats.
  policies            List strict security policy modules.
  scan                Run kernel vulnerability checks (CVE audit).
  predict             ML predictive wear and temperature failure analysis.
  ping <ip>           Ping host node dynamically.
  reboot <device-id>  Cycle power relay on selected machine.
  isolate <device-id> Instantly cut all network link routes.
  clear               Wipe output interface.`;
        break;

      case "devices":
        outputText = "ACTIVE HOST REGISTRY (LIVE FROM SERVER-SIDE STATE):\n" + devices.map(d =>
          `  [${d.id}] ${d.name.padEnd(26)} | IP: ${d.ip.padEnd(14)} | ${d.status.toUpperCase().padEnd(8)} | CPU: ${d.cpu}% | Compliance: ${d.policyCompliance}%`
        ).join("\n");
        break;

      case "policies":
        outputText = "SOVEREIGN CONFIGURATION POLICIES:\n" + policies.map(p =>
          `  [${p.id}] ${p.name.padEnd(38)} | Cat: ${p.category.padEnd(14)} | Active: ${p.enabled ? "YES" : "NO"}`
        ).join("\n");
        break;

      case "scan":
        outputType = "warning";
        outputText = `Initiating global vulnerability scanner...
[VULN AUDIT] Compiled with ${software.filter(s => s.status !== "up_to_date").length} vulnerable libraries flagged on hosts.
  - SW-02: OpenSSL Cryptography Engine 1.1.1t (VULNERABLE) -> CVE-2023-0286
  - SW-04: Docker Engine Containerized Wrapper 20.10.12 (UNSUPPORTED)
Execution trace completed. Core system integrity at ${Math.round(devices.reduce((acc, d) => acc + d.policyCompliance, 0) / devices.length)}% score.`;
        break;

      case "predict":
        outputType = "warning";
        if (failures.length === 0) {
          outputText = "No pre-failure thermal indexes or hardware degradations recognized by the ML model.";
          outputType = "success";
        } else {
          outputText = "ML COMPONENT AGING AND FAILURE PREDICTION PROFILE:\n" + failures.map(f =>
            `  - ${f.deviceName} (${f.deviceId}): ${f.component} warning. Heat: ${f.currentTemp}°C. Failure Probability: ${f.probability}%. RUL: ${f.timeToFailure}.`
          ).join("\n");
        }
        break;

      case "ping":
        if (!targetArg) {
          outputText = "Error: Target host IP argument required. Usage: ping <ip_address>";
          outputType = "error";
        } else {
          const deviceMatch = devices.find(d => d.ip === targetArg);
          if (deviceMatch) {
            outputText = `Pinging host [${deviceMatch.name}] at ${targetArg}...
64 bytes from ${targetArg}: icmp_seq=1 ttl=64 time=14.2 ms
64 bytes from ${targetArg}: icmp_seq=2 ttl=64 time=14.8 ms
64 bytes from ${targetArg}: icmp_seq=3 ttl=64 time=13.9 ms
--- Latency profile: Nominal. Heartbeat active. ---`;
            outputType = "success";
          } else {
            outputText = `Pinging ${targetArg}...
Request timeout for icmp_seq 1 (No direct airgap router link).
Request timeout for icmp_seq 2 (Unreachable target IP boundary).
--- Network trace complete: Host UNREACHABLE. ---`;
            outputType = "error";
          }
        }
        break;

      case "reboot":
        if (!targetArg) {
          outputText = "Error: System device-id code required. Usage: reboot <DEV-XXX>";
          outputType = "error";
        } else {
          const uID = targetArg.toUpperCase();
          const dev = devices.find(d => d.id === uID);
          if (dev) {
            dev.status = "online";
            dev.cpu = 10;
            dev.ram = 20;
            appendLog(`Reboot instruction invoked on device ${dev.name} by remote terminal command.`, "success", "Console Interactive", dev.id);
            broadcast("devices_update", devices);
            outputType = "success";
            outputText = `[REBOOT CMD APPROVED] Sequence dispatched to power relay ${dev.name} (${dev.id}). Device rebooting.`;
          } else {
            outputText = `Error: Cannot resolve device code '${uID}' in active registration tables.`;
            outputType = "error";
          }
        }
        break;

      case "isolate":
        if (!targetArg) {
          outputText = "Error: System device-id code required. Usage: isolate <DEV-XXX>";
          outputType = "error";
        } else {
          const uID = targetArg.toUpperCase();
          const dev = devices.find(d => d.id === uID);
          if (dev) {
            dev.status = "warning";
            appendLog(`Emergency isolation directive triggered for device ${dev.name} via terminal operator.`, "critical", "Console Interactive", dev.id);
            broadcast("devices_update", devices);
            outputType = "warning";
            outputText = `[ISOLATION PROTOCOL ENGAGED] Network adapters blocked for ${dev.name} (${dev.id}). Host is airgapped.`;
          } else {
            outputText = `Error: System device registry code '${uID}' not found.`;
            outputType = "error";
          }
        }
        break;

      default:
        outputText = `Error: Unknown shell instruction sequence '${primaryCommand}'. Type 'help' to review supported operational sets.`;
        outputType = "error";
    }

    appendLog(`Operator shell command processed: '${cmdTrimmed}'`, "info", "Console Terminal Engine");
    res.json({ text: outputText, type: outputType });
  });

  // 9. Continuous Server Telemetry Tick Simulation (True Multi-User Server Telemetry Engine)
  setInterval(() => {
    let changed = false;

    devices = devices.map(dev => {
      if (dev.status === "offline") return dev;

      // Slowly mutate performance statistics over time (sine fluctuations + random noise)
      const baseCpuFlux = Math.ceil(Math.sin(Date.now() / 15000) * 12);
      const valCpuNoise = Math.floor(Math.random() * 5) - 2;
      let targetCpu = dev.cpu + baseCpuFlux + valCpuNoise;
      targetCpu = Math.max(10, Math.min(98, targetCpu));

      const valRamNoise = Math.floor(Math.random() * 3) - 1;
      let targetRam = dev.ram + valRamNoise;
      targetRam = Math.max(15, Math.min(95, targetRam));

      const targetBand = Math.max(0.1, Number((dev.bandwidth + (Math.sin(Date.now() / 8000) * 0.8)).toFixed(1)));

      if (targetCpu !== dev.cpu || targetRam !== dev.ram || targetBand !== dev.bandwidth) {
        changed = true;
        return {
          ...dev,
          cpu: targetCpu,
          ram: targetRam,
          bandwidth: targetBand,
          lastActive: "Just now"
        };
      }
      return dev;
    });

    if (changed) {
      broadcast("devices_update", devices);
    }
  }, 4000);

  // 10. Continuous DNS Logs Query Telemetry Simulator
  setInterval(() => {
    const activeDevices = devices.filter(d => d.status !== "offline");
    if (activeDevices.length === 0) return;
    const randomDevice = activeDevices[Math.floor(Math.random() * activeDevices.length)];

    const testDomains = [
      "gateway.sovereign.local",
      "centrifuge.sovereign.local",
      "scada.sovereign.local",
      "valve.sovereign.local",
      "clandestine-tracker.net",
      "reverse-shell.telemetry-node.ru",
      "firmware.update-server.org",
      "time.cloudflare.com",
      "telemetry.hq.private",
      "internal-wiki.hq.private"
    ];

    const targetDomain = testDomains[Math.floor(Math.random() * testDomains.length)];
    const rec = dnsRecords.find(r => r.domain === targetDomain);

    let statusVal: "resolved" | "blocked" | "forwarded" = "forwarded";
    let resolvedVal = "8.8.4.4 (Upstream Secure Resolver)";
    let reqType = "A";

    if (rec) {
      reqType = rec.type;
      if (rec.status === "intercepted") {
        statusVal = "blocked";
        resolvedVal = "0.0.0.0 (Sovereign Sinkhole)";
      } else if (rec.status === "active") {
        statusVal = "resolved";
        resolvedVal = rec.value;
      }
    } else {
      if (targetDomain.endsWith(".private") || targetDomain.endsWith(".local")) {
        statusVal = "blocked";
        resolvedVal = "NXDOMAIN (Non-Authorized Private Zone)";
      } else {
        statusVal = "forwarded";
        resolvedVal = "1.1.1.1 (Upstream Cloudflare DNS)";
      }
    }

    const newSimLog: DNSQueryLog = {
      id: `DQL-SIM-${Date.now()}`,
      timestamp: getTimestamp(),
      domain: targetDomain,
      clientIp: randomDevice.ip,
      clientName: randomDevice.name,
      type: reqType,
      status: statusVal,
      resolvedValue: resolvedVal
    };

    dnsQueryLogs = [newSimLog, ...dnsQueryLogs].slice(0, 100);
    broadcast("dns_logs_update", dnsQueryLogs);
  }, 5000);

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🛡️ Sovereign Device Nexus Manager running full-stack at http://localhost:${PORT}`);
  });
}

startServer();

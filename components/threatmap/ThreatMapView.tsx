"use client";

import { useState, useEffect, useMemo } from "react";
import { useMapStore } from "@/lib/store";
import { THREAT_LEVEL_CONFIG, timeAgo } from "@/lib/constants";
import { mockThreats } from "@/lib/mock-data";
import { SevBadge, Tag } from "@/components/ui";
import type { ThreatEvent } from "@/types";
import {
  Globe, Wifi, Search, X, MapPin, AlertTriangle,
  Shield, Eye, Layers, ChevronDown, ExternalLink,
  Clock, Crosshair, Server,
} from "lucide-react";
import clsx from "clsx";

// ─── Threat Detail Panel ───
function ThreatDetailPanel({
  threat,
  onClose,
}: {
  threat: ThreatEvent;
  onClose: () => void;
}) {
  const levelConfig = THREAT_LEVEL_CONFIG[threat.level as keyof typeof THREAT_LEVEL_CONFIG] || THREAT_LEVEL_CONFIG.monitoring;

  return (
    <div className="absolute top-4 right-4 w-80 bg-xc-card border border-xc-border-bright rounded-xl shadow-2xl z-[1000] animate-slide-in-right overflow-hidden">
      <div className="px-4 py-3 border-b border-xc-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={14} style={{ color: levelConfig.color }} />
          <span className="font-semibold text-sm">{threat.city}, {threat.country}</span>
        </div>
        <button onClick={onClose} className="text-xc-text-muted hover:text-xc-text p-1">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border"
            style={{ color: levelConfig.color, background: levelConfig.bg, borderColor: `${levelConfig.color}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelConfig.color }} />
            {levelConfig.label}
          </span>
          <Tag color="#22d3ee">{threat.type.replace(/_/g, " ")}</Tag>
          {threat.active && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-xc-danger">
              <span className="w-1.5 h-1.5 rounded-full bg-xc-danger animate-pulse_dot" />
              ACTIVE
            </span>
          )}
        </div>

        <p className="text-xs text-xc-text-secondary leading-relaxed">
          {threat.description}
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-xc-text-muted">
            <Clock size={11} />
            <span>{timeAgo(threat.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 text-xc-text-muted">
            <Shield size={11} />
            <span>Source: <span className="text-xc-text-secondary">{threat.source}</span></span>
          </div>
          {threat.attackVector && (
            <div className="flex items-center gap-2 text-xc-text-muted">
              <Crosshair size={11} />
              <span>Vector: <span className="text-xc-text-secondary">{threat.attackVector}</span></span>
            </div>
          )}
          {threat.affectedSectors.length > 0 && (
            <div className="flex items-center gap-2 text-xc-text-muted">
              <Server size={11} />
              <span>Sectors: <span className="text-xc-text-secondary">{threat.affectedSectors.join(", ")}</span></span>
            </div>
          )}
        </div>

        {/* MITRE ATT&CK TTPs */}
        {threat.ttps.length > 0 && (
          <div>
            <div className="text-[10px] font-mono text-xc-text-muted mb-1.5">MITRE ATT&CK</div>
            <div className="flex gap-1 flex-wrap">
              {threat.ttps.map((ttp) => (
                <span key={ttp} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-xc-purple-muted text-xc-purple border border-xc-purple/20">
                  {ttp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* IOCs */}
        {threat.iocs.length > 0 && (
          <div>
            <div className="text-[10px] font-mono text-xc-text-muted mb-1.5">Indicators of Compromise</div>
            <div className="bg-xc-elevated rounded-lg p-2.5 space-y-1">
              {threat.iocs.map((ioc) => (
                <div key={ioc} className="text-[11px] font-mono text-xc-danger break-all">{ioc}</div>
              ))}
            </div>
          </div>
        )}

        {threat.relatedCveIds.length > 0 && (
          <div className="flex gap-1.5">
            {threat.relatedCveIds.map((cve) => (
              <Tag key={cve} color="#22d3ee">{cve}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Layer Sidebar (like reference image) ───
function LayerSidebar() {
  const { layers, toggleLayer } = useMapStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery
    ? layers.filter((l) => l.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : layers;

  return (
    <div className="absolute top-4 left-4 w-52 bg-xc-card/95 backdrop-blur-md border border-xc-border rounded-xl z-[1000] overflow-hidden shadow-xl">
      <div className="px-3 py-2.5 border-b border-xc-border">
        <div className="flex items-center gap-2 bg-xc-elevated rounded-lg px-2.5 py-1.5">
          <Search size={12} className="text-xc-text-muted shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search layers..."
            className="bg-transparent text-xs text-xc-text placeholder:text-xc-text-muted outline-none w-full font-mono"
          />
        </div>
      </div>
      <div className="py-1 max-h-80 overflow-y-auto">
        {filtered.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={clsx(
              "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors",
              layer.enabled ? "bg-xc-elevated/50" : "hover:bg-xc-elevated/30"
            )}
          >
            <div
              className={clsx(
                "w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-all",
                layer.enabled
                  ? "border-transparent"
                  : "border-xc-border"
              )}
              style={layer.enabled ? { background: `${layer.color}25`, borderColor: layer.color } : {}}
            >
              {layer.enabled && <span style={{ color: layer.color }}>✓</span>}
            </div>
            <span className="text-[10px] font-mono font-medium" style={{ color: layer.enabled ? layer.color : undefined }}>
              {layer.icon}
            </span>
            <span
              className={clsx(
                "text-[11px] font-mono font-medium",
                layer.enabled ? "text-xc-text" : "text-xc-text-muted"
              )}
            >
              {layer.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SVG World Map (no external dependency needed) ───
function WorldMapSVG({
  threats,
  onThreatClick,
  selectedId,
}: {
  threats: ThreatEvent[];
  onThreatClick: (t: ThreatEvent) => void;
  selectedId: string | null;
}) {
  const toSVG = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * 960;
    const y = ((90 - lat) / 180) * 480;
    return [x, y];
  };

  // Connection lines between related threats
  const connections = [
    [0, 8], [1, 2], [4, 12], [5, 3], [6, 10], [7, 11],
  ];

  return (
    <svg viewBox="0 0 960 480" className="w-full h-full" style={{ minHeight: 400 }}>
      <defs>
        <radialGradient id="glow-critical" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff2d55" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-high" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9f0a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff9f0a" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="960" height="480" fill="#060610" />

      {/* Grid lines */}
      {Array.from({ length: 19 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 26.7} x2="960" y2={i * 26.7} stroke="#141428" strokeWidth="0.3" strokeDasharray="2,6" />
      ))}
      {Array.from({ length: 25 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="480" stroke="#141428" strokeWidth="0.3" strokeDasharray="2,6" />
      ))}

      {/* Simplified landmass outlines */}
      {/* North America */}
      <path d="M80,80 L180,60 L260,80 L280,110 L260,160 L230,200 L180,220 L160,230 L120,200 L80,160 L60,120 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* South America */}
      <path d="M200,260 L240,250 L280,270 L290,310 L270,370 L240,400 L210,380 L190,340 L180,290 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* Europe */}
      <path d="M420,70 L500,50 L540,70 L560,100 L540,130 L500,140 L460,130 L430,110 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* Africa */}
      <path d="M440,160 L510,150 L540,170 L560,220 L550,300 L510,340 L470,330 L440,280 L430,220 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* Asia */}
      <path d="M560,50 L700,40 L800,60 L830,100 L810,150 L750,170 L680,180 L600,160 L560,120 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* Middle East */}
      <path d="M540,130 L600,120 L620,150 L600,180 L560,175 L540,155 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />
      {/* Australia */}
      <path d="M750,300 L820,290 L850,310 L840,350 L800,360 L760,345 Z" fill="none" stroke="#1e1e38" strokeWidth="1" opacity="0.8" />

      {/* Connection lines */}
      {connections.map(([a, b], i) => {
        if (a >= threats.length || b >= threats.length) return null;
        const [x1, y1] = toSVG(threats[a].latitude, threats[a].longitude);
        const [x2, y2] = toSVG(threats[b].latitude, threats[b].longitude);
        return (
          <line
            key={`conn-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#00e87b" strokeWidth="0.4" opacity="0.15"
            strokeDasharray="4,4"
          >
            <animate attributeName="stroke-dashoffset" values="0;-8" dur="3s" repeatCount="indefinite" />
          </line>
        );
      })}

      {/* Threat markers */}
      {threats.map((threat) => {
        const [x, y] = toSVG(threat.latitude, threat.longitude);
        const config = THREAT_LEVEL_CONFIG[threat.level as keyof typeof THREAT_LEVEL_CONFIG] || THREAT_LEVEL_CONFIG.monitoring;
        const isSelected = selectedId === threat.id;

        return (
          <g
            key={threat.id}
            onClick={() => onThreatClick(threat)}
            className="cursor-pointer"
          >
            {/* Pulse ring */}
            <circle cx={x} cy={y} r="14" fill={config.color} opacity="0.08">
              <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.12;0.02;0.12" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Glow */}
            <circle cx={x} cy={y} r="8" fill={config.color} opacity="0.15" filter="url(#blur)" />

            {/* Main dot */}
            <circle cx={x} cy={y} r={isSelected ? 6 : 4} fill={config.color} opacity="0.9">
              <animate attributeName="r" values={isSelected ? "5;7;5" : "3.5;5;3.5"} dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Center */}
            <circle cx={x} cy={y} r="1.5" fill="#fff" opacity="0.9" />

            {/* Label */}
            {isSelected && (
              <text x={x} y={y - 12} textAnchor="middle" fill={config.color} fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                {threat.city}
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(20, 440)">
        <text fill="#505072" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="600">LEGEND</text>
        {Object.entries(THREAT_LEVEL_CONFIG).map(([key, val], i) => (
          <g key={key} transform={`translate(${60 + i * 120}, 0)`}>
            <circle cx="0" cy="-2" r="4" fill={val.color} />
            <text x="8" y="1" fill="#8585a5" fontSize="7" fontFamily="JetBrains Mono, monospace">{val.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ─── Main Threat Map Component ───
export function ThreatMapView({ fullPage = false }: { fullPage?: boolean }) {
  const threats = useMemo(() => mockThreats(), []);
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [liveCount, setLiveCount] = useState(1247);
  const { layers } = useMapStore();

  useEffect(() => {
    const i = setInterval(() => setLiveCount((c) => c + Math.floor(Math.random() * 3) + 1), 3000);
    return () => clearInterval(i);
  }, []);

  // Filter threats based on active layers
  const filteredThreats = useMemo(() => {
    const activeTypes = new Set<string>();
    layers.forEach((l) => {
      if (l.enabled) {
        if (l.id === "active_threats") activeTypes.add("ransomware").add("wiper").add("malware");
        if (l.id === "intel_hotspots") activeTypes.add("apt").add("espionage").add("zero_day");
        if (l.id === "conflict_zones") activeTypes.add("wiper").add("defacement");
        if (l.id === "ransomware") activeTypes.add("ransomware");
        if (l.id === "apt_campaigns") activeTypes.add("apt");
        if (l.id === "data_breaches") activeTypes.add("data_breach");
        if (l.id === "supply_chain") activeTypes.add("supply_chain");
        if (l.id === "critical_infra") activeTypes.add("ddos").add("banking_trojan").add("cryptojacking").add("phishing").add("scam").add("insider_threat");
      }
    });
    if (activeTypes.size === 0) return threats;
    return threats.filter((t) => activeTypes.has(t.type));
  }, [threats, layers]);

  return (
    <div className={clsx("bg-xc-card border border-xc-border rounded-xl overflow-hidden", fullPage && "h-[calc(100vh-8rem)]")}>
      {/* Header bar (like reference image) */}
      <div className="px-4 py-2.5 border-b border-xc-border flex items-center justify-between bg-xc-surface/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-xc-accent" />
            <span className="text-sm font-display font-semibold">GLOBAL SITUATION</span>
          </div>
          <span className="text-[10px] font-mono text-xc-text-muted">
            {new Date().toUTCString().slice(0, 25)} UTC
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi size={12} className="text-xc-accent" />
            <span className="text-[11px] font-mono text-xc-accent">LIVE</span>
          </div>
          <span className="text-[11px] font-mono text-xc-text-muted">
            ● {liveCount.toLocaleString()} threats tracked
          </span>
        </div>
      </div>

      {/* Map area */}
      <div className="relative" style={{ minHeight: fullPage ? "calc(100% - 45px)" : 460 }}>
        <LayerSidebar />
        <WorldMapSVG
          threats={filteredThreats}
          onThreatClick={setSelectedThreat}
          selectedId={selectedThreat?.id || null}
        />
        {selectedThreat && (
          <ThreatDetailPanel threat={selectedThreat} onClose={() => setSelectedThreat(null)} />
        )}
      </div>
    </div>
  );
}

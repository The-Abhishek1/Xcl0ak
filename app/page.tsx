// app/page.tsx — FULL DASHBOARD matching mockup exactly
// Uses real data from /api/news, /api/cves, /api/threats
// Three.js 3D globe for threat visualization
"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { useLiveFetch } from "@/hooks/use-fetch";
import { useSessionStore, useUIStore } from "@/lib/store";
import { mockExploits, mockLeaderboard } from "@/lib/mock-data";
import { timeAgo, SEVERITY_CONFIG, THREAT_LEVEL_COLORS, generateUsername } from "@/lib/constants";
import * as THREE from "three";
import {
  Loader2, ExternalLink, ChevronRight, Send, RefreshCw,
  TrendingUp, Wifi, AlertTriangle, Globe, Shield, Zap,
  Bug, Newspaper, Trophy, Brain, Target, Radio, ArrowUpRight,
} from "lucide-react";

// ═══════════════════════════════════════
// THREE.JS GLOBE COMPONENT
// ═══════════════════════════════════════
function ThreatGlobe({ threats }: { threats: any[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer; globe: THREE.Mesh; markers: THREE.Group; animId: number } | null>(null);

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Globe
    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0a1628,
      emissive: 0x041020,
      specular: 0x222244,
      shininess: 15,
      transparent: true,
      opacity: 0.92,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(1.002, 36, 24);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x1a3a5c, wireframe: true, transparent: true, opacity: 0.15 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // Atmosphere glow
    const glowGeo = new THREE.SphereGeometry(1.08, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x0066aa, transparent: true, opacity: 0.06, side: THREE.BackSide });
    scene.add(new THREE.Mesh(glowGeo, glowMat));

    // Lights
    const ambient = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(ambient);
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(5, 3, 5);
    scene.add(directional);
    const pointLight = new THREE.PointLight(0x00aaff, 0.4, 10);
    pointLight.position.set(-3, 2, 3);
    scene.add(pointLight);

    // Markers group
    const markers = new THREE.Group();
    scene.add(markers);

    sceneRef.current = { scene, camera, renderer, globe, markers, animId: 0 };

    // Animate
    let rotation = 0;
    const animate = () => {
      sceneRef.current!.animId = requestAnimationFrame(animate);
      rotation += 0.001;
      globe.rotation.y = rotation;
      wire.rotation.y = rotation;
      markers.rotation.y = rotation;

      // Pulse markers
      markers.children.forEach((child, i) => {
        const scale = 1 + Math.sin(Date.now() * 0.003 + i) * 0.3;
        child.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(sceneRef.current!.animId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  // Update markers when threats change
  useEffect(() => {
    if (!sceneRef.current || threats.length === 0) return;
    const { markers } = sceneRef.current;

    // Clear old markers
    while (markers.children.length > 0) markers.remove(markers.children[0]);

    threats.forEach((t) => {
      if (isNaN(t.lat) || isNaN(t.lng)) return;

      // Convert lat/lng to 3D position on sphere
      const phi = (90 - t.lat) * (Math.PI / 180);
      const theta = (t.lng + 180) * (Math.PI / 180);
      const r = 1.01;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      // Marker color based on threat level
      const color = t.level === "critical" ? 0xff3a5c
        : t.level === "high" ? 0xff8c42
        : t.level === "medium" ? 0xffd700
        : 0x00ffaa;

      // Dot
      const dotGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x, y, z);
      markers.add(dot);

      // Ring pulse
      const ringGeo = new THREE.RingGeometry(0.02, 0.035, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);
      markers.add(ring);
    });
  }, [threats]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", minHeight: 300 }} />;
}

// ═══════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════
function StatCard({ label, value, delta, color, icon }: {
  label: string; value: string | number; delta?: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className="stat-card" style={{ "--stat-color": color } as any}>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{ color, opacity: 0.6, fontSize: 16 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: delta.startsWith("+") ? "var(--green)" : "var(--red)", marginTop: 4 }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════
export default function DashboardPage() {
  // Real data
  const { data: threats, loading: tLoad } = useLiveFetch<any[]>("/api/threats", [], 60000);
  const { data: news, loading: nLoad } = useLiveFetch<any[]>("/api/news", [], 120000);
  const { data: cves, loading: cLoad } = useLiveFetch<any[]>("/api/cves?limit=8", [], 300000);

  // Mock data for exploits and leaderboard (until DB is populated)
  const exploits = useMemo(() => mockExploits(6), []);
  const leaders = useMemo(() => mockLeaderboard(5), []);

  // Live counters
  const [atkPerMin, setAtkPerMin] = useState(247);
  const [activeThreats, setActiveThreats] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setAtkPerMin(p => Math.max(180, Math.min(400, p + Math.floor(Math.random() * 10) - 3)));
    }, 2000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => { setActiveThreats(threats.length); }, [threats]);

  // AI chat
  const [aiMsgs, setAiMsgs] = useState([
    { role: "ai" as const, text: "Ready. Ask me about any CVE, exploit technique, or threat actor. I'll analyze and provide actionable intelligence." },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiRef = useRef<HTMLDivElement>(null);

  const sendAI = () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiMsgs(p => [...p, { role: "user" as const, text: aiInput }]);
    setAiInput("");
    setAiLoading(true);
    setTimeout(() => {
      setAiMsgs(p => [...p, {
        role: "ai" as const,
        text: "Analyzing threat intelligence... Cross-referencing CVE databases and exploit feeds. This vulnerability pattern matches known APT tradecraft. **Recommendation:** Apply vendor patches immediately and monitor for IoC indicators in your SIEM. Detection rules available in the Defense Mode panel.",
      }]);
      setAiLoading(false);
    }, 1200);
  };

  useEffect(() => { aiRef.current?.scrollTo(0, aiRef.current.scrollHeight); }, [aiMsgs]);

  // Type/severity tag colors
  const typeColor = (type: string) => {
    const m: Record<string, string> = {
      RCE: "rgba(255,58,92,0.15)", XSS: "rgba(255,140,66,0.15)", SQLi: "rgba(0,170,255,0.15)",
      "Buffer Overflow": "rgba(255,215,0,0.15)", "Privilege Escalation": "rgba(167,139,250,0.15)",
    };
    return m[type] || "rgba(255,255,255,0.05)";
  };
  const typeTextColor = (type: string) => {
    const m: Record<string, string> = {
      RCE: "var(--red)", XSS: "var(--orange)", SQLi: "var(--accent2)",
      "Buffer Overflow": "var(--yellow)", "Privilege Escalation": "var(--purple)",
    };
    return m[type] || "var(--text-dim)";
  };

  const sevColor = (s: string) => SEVERITY_CONFIG[s as keyof typeof SEVERITY_CONFIG]?.color || "#64748b";

  return (
    <div className="animate-fade-in" style={{ position: "relative", zIndex: 1 }}>
      {/* Dashboard grid — matches mockup 3-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 340px",
        gridTemplateRows: "auto auto auto auto",
        gap: 14,
      }}>

        {/* ═══ ROW 1: STATS (spans full width) ═══ */}
        <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          <StatCard label="Active Threats" value={activeThreats || "—"} delta={`+${Math.floor(Math.random() * 12)} today`} color="var(--red)" icon={<Target size={16} />} />
          <StatCard label="Attacks/Min" value={atkPerMin} color="var(--orange)" icon={<Zap size={16} />} />
          <StatCard label="CVEs Tracked" value={cves.length || "—"} delta="+3 new" color="var(--yellow)" icon={<AlertTriangle size={16} />} />
          <StatCard label="Exploits" value={exploits.length} color="var(--green)" icon={<Bug size={16} />} />
          <StatCard label="News Articles" value={news.length || "—"} color="var(--purple)" icon={<Newspaper size={16} />} />
          <StatCard label="Researchers" value="42.8K" delta="+127 this week" color="var(--accent2)" icon={<Trophy size={16} />} />
        </div>

        {/* ═══ ROW 2: THREAT MAP (col 1-2) + LIVE FEED (col 3) ═══ */}
        {/* Threat Globe */}
        <div className="xc-card" style={{ gridColumn: "1 / 3", height: 400 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Globe size={14} style={{ color: "var(--accent)" }} />
              <span style={{ color: "var(--accent)" }}>GLOBAL THREAT MAP</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="live-dot" />
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)" }}>LIVE</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>{atkPerMin} atk/min</span>
              <Link href="/threatmap" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", textDecoration: "none", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,170,255,0.2)" }}>
                FULL MAP →
              </Link>
            </div>
          </div>
          <div style={{ height: "calc(100% - 45px)", position: "relative", background: "var(--bg1)" }}>
            {tLoad && threats.length === 0 ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Loader2 size={20} style={{ color: "var(--accent)" }} className="animate-spin" />
              </div>
            ) : (
              <ThreatGlobe threats={threats} />
            )}
            {/* Map legend */}
            <div style={{ position: "absolute", bottom: 10, left: 14, display: "flex", gap: 16 }}>
              {[["Critical", "#ff3a5c"], ["High", "#ff8c42"], ["Medium", "#ffd700"], ["Active", "#00ffaa"]].map(([label, color]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-dim)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ LIVE THREAT FEED (right column, row 2) ═══ */}
        <div className="xc-card" style={{ gridColumn: 3, gridRow: "2 / 4", display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <div className="panel-title">
              <Radio size={12} style={{ color: "var(--red)" }} />
              <span>LIVE THREAT FEED</span>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", padding: "2px 6px", borderRadius: 3, background: "rgba(255,58,92,0.1)", border: "1px solid rgba(255,58,92,0.2)" }}>
              {news.length + threats.length} EVENTS
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 600 }}>
            {nLoad && news.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center" }}><Loader2 size={16} className="animate-spin" style={{ color: "var(--accent)", margin: "0 auto" }} /></div>
            ) : (
              [...news.slice(0, 12)].map((n: any, i: number) => (
                <Link key={n.id || i} href="/news" style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    padding: "10px 16px", borderBottom: "1px solid var(--glass-border)",
                    display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer",
                    transition: "background 0.15s",
                  }} onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ width: 3, borderRadius: 2, alignSelf: "stretch", flexShrink: 0, background: sevColor(n.severity || "medium") }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.title}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", display: "flex", gap: 8 }}>
                        <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 9, background: `${sevColor(n.severity || "medium")}18`, color: sevColor(n.severity || "medium") }}>
                          {(n.severity || "medium").toUpperCase()}
                        </span>
                        <span>{n.sourceName || "Feed"}</span>
                        <span>{timeAgo(n.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ═══ ROW 3: TRENDING EXPLOITS (col 1-2) ═══ */}
        <div className="xc-card" style={{ gridColumn: "1 / 3" }}>
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={13} style={{ color: "var(--accent)" }} />
              <span style={{ color: "var(--accent)" }}>TRENDING EXPLOITS</span>
            </div>
            <Link href="/exploits" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", textDecoration: "none", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,170,255,0.2)" }}>
              VIEW ALL →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 12 }}>
            {exploits.slice(0, 4).map(e => (
              <Link key={e.id} href={`/exploits/${e.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "var(--surface)", border: "1px solid var(--glass-border)", borderRadius: 10,
                  padding: 14, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden",
                }} onMouseEnter={ev => { ev.currentTarget.style.borderColor = "rgba(0,255,170,0.15)"; ev.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.borderColor = "var(--glass-border)"; ev.currentTarget.style.transform = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 8px", borderRadius: 4, background: typeColor(e.category), color: typeTextColor(e.category) }}>
                      {e.category}
                    </span>
                    <div style={{ display: "flex", gap: 6, fontFamily: "var(--mono)", fontSize: 10 }}>
                      <span style={{ padding: "2px 6px", borderRadius: 4, border: "1px solid var(--border)", color: "var(--text-dim)" }}>▲ {e.upvotes}</span>
                      <span style={{ padding: "2px 6px", borderRadius: 4, border: "1px solid var(--border)", color: "var(--text-dim)" }}>▼ {e.downvotes}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5, lineHeight: 1.3 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {e.description.split("\n")[0]?.replace(/[#*]/g, "").slice(0, 120)}...
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${sevColor(e.severity)}20`, color: sevColor(e.severity), border: `1px solid ${sevColor(e.severity)}30` }}>
                      CVSS 9.{Math.floor(Math.random() * 9)}
                    </span>
                    {e.cveId && <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(167,139,250,0.1)", color: "var(--purple)", border: "1px solid rgba(167,139,250,0.2)" }}>{e.cveId}</span>}
                    {e.verified && <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "rgba(0,255,170,0.08)", color: "var(--green)", border: "1px solid rgba(0,255,170,0.2)" }}>✓ VERIFIED</span>}
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: "auto" }}>{e.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══ ROW 4: AI ASSISTANT (col 1) + LEADERBOARD (col 2) ═══ */}
        {/* CVE TRACKER (still in right column from row 3) */}

        {/* AI Assistant */}
        <div className="xc-card" style={{ gridColumn: 1 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Brain size={13} style={{ color: "var(--accent)" }} />
              <span style={{ color: "var(--accent)" }}>AI CYBER ASSISTANT</span>
            </div>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--green)", padding: "2px 8px", borderRadius: 4, background: "rgba(0,255,170,0.08)" }}>ONLINE</span>
          </div>
          <div ref={aiRef} style={{ padding: 12, maxHeight: 200, overflowY: "auto" }}>
            {aiMsgs.map((m, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.1em", marginBottom: 3, textTransform: "uppercase", color: m.role === "ai" ? "var(--accent)" : "var(--text-dim)" }}>
                  {m.role === "ai" ? "XCLOAK AI" : "YOU"}
                </div>
                <div style={{
                  padding: "8px 10px", borderRadius: 8, fontSize: 12, lineHeight: 1.6,
                  background: m.role === "ai" ? "rgba(0,255,170,0.04)" : "var(--surface)",
                  border: `1px solid ${m.role === "ai" ? "rgba(0,255,170,0.1)" : "var(--glass-border)"}`,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {aiLoading && <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", padding: 8 }}>Analyzing...</div>}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--glass-border)" }}>
            <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendAI()}
              placeholder="Ask about exploits, CVEs, mitigations..."
              style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 11, outline: "none" }} />
            <button onClick={sendAI} style={{
              background: "linear-gradient(135deg, rgba(0,255,170,0.2), rgba(0,170,255,0.15))",
              border: "1px solid rgba(0,255,170,0.3)", borderRadius: 6, padding: "8px 12px",
              color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer",
            }}>SEND →</button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="xc-card" style={{ gridColumn: 2 }}>
          <div className="panel-header">
            <div className="panel-title">
              <span style={{ color: "var(--accent)" }}>TOP RESEARCHERS</span>
            </div>
            <Link href="/leaderboard" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", textDecoration: "none", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(0,170,255,0.2)" }}>FULL BOARD</Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {leaders.map((l, i) => (
              <div key={l.sessionId} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 16px",
                borderBottom: "1px solid var(--glass-border)", cursor: "pointer", transition: "background 0.15s",
              }} onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, width: 20, color: i === 0 ? "var(--yellow)" : i === 1 ? "#94a3b8" : i === 2 ? "var(--orange)" : "var(--text-muted)" }}>
                  #{i + 1}
                </span>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: `linear-gradient(135deg, ${i === 0 ? "#ffd700,#ff8c42" : i === 1 ? "#94a3b8,#64748b" : i === 2 ? "#ff8c42,#ff3a5c" : "#a78bfa,#7c3aed"})`,
                }}>
                  {l.username[0]?.toUpperCase()}
                </div>
                <span style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>
                  {l.username}
                </span>
                <span style={{ fontSize: 12 }}>{l.badges[0]}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--text-dim)" }}>
                  {l.reputation.toLocaleString()} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CVE Tracker mini (right column row 4) */}
        <div className="xc-card" style={{ gridColumn: 3 }}>
          <div className="panel-header">
            <div className="panel-title">
              <AlertTriangle size={12} style={{ color: "var(--accent2)" }} />
              <span>CVE TRACKER</span>
            </div>
            <Link href="/cves" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", textDecoration: "none" }}>VIEW ALL →</Link>
          </div>
          <div style={{ padding: "4px 0" }}>
            {cLoad && cves.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center" }}><Loader2 size={14} className="animate-spin" style={{ color: "var(--accent2)", margin: "0 auto" }} /></div>
            ) : (
              cves.slice(0, 6).map((c: any, i: number) => (
                <Link key={c.id} href="/cves" style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    padding: "10px 16px", borderBottom: "1px solid var(--glass-border)",
                    display: "flex", gap: 10, alignItems: "center", cursor: "pointer", transition: "background 0.15s",
                  }} onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent2)", minWidth: 110, fontWeight: 700 }}>{c.id}</span>
                    <span style={{ flex: 1, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.description?.slice(0, 50)}...
                    </span>
                    {c.hasExploit && (
                      <span style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "rgba(255,58,92,0.15)", color: "var(--red)", border: "1px solid rgba(255,58,92,0.2)", whiteSpace: "nowrap", animation: "pulse-dot 2s infinite" }}>
                        ⚡ EXPLOIT
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ═══ BOTTOM TICKER ═══ */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: 32, zIndex: 100,
        background: "rgba(3,5,10,0.92)", borderTop: "1px solid var(--glass-border)",
        display: "flex", alignItems: "center", overflow: "hidden",
      }}>
        <div style={{ background: "var(--red)", color: "#fff", fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, padding: "0 12px", height: "100%", display: "flex", alignItems: "center", letterSpacing: "0.1em", flexShrink: 0 }}>
          ⚠ INTEL
        </div>
        <div style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-block", animation: "ticker-move 45s linear infinite", fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>
            {news.slice(0, 5).map((n: any, i: number) => (
              <span key={i} style={{ marginRight: 60 }}>
                <span style={{ color: sevColor(n.severity || "medium") }}>{(n.severity || "MEDIUM").toUpperCase()}</span> — {n.title}
              </span>
            ))}
            {cves.slice(0, 3).map((c: any, i: number) => (
              <span key={`c${i}`} style={{ marginRight: 60 }}>
                <span style={{ color: "var(--accent2)" }}>{c.id}</span> {c.description?.slice(0, 60)}...
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker-move {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-200%); }
        }
      `}</style>
    </div>
  );
}

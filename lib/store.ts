import { create } from "zustand";

interface SessionStore {
  sessionId: string | null;
  username: string | null;
  role: "USER" | "ADMIN";
  reputation: number;
  setSession: (d: { id: string; username: string; role: "USER" | "ADMIN"; reputation: number }) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null, username: null, role: "USER", reputation: 0,
  setSession: (d) => set({ sessionId: d.id, username: d.username, role: d.role, reputation: d.reputation }),
}));

interface UIStore {
  sidebarOpen: boolean;
  uploadOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
  setUploadOpen: (o: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true, uploadOpen: false,
  setSidebarOpen: (o) => set({ sidebarOpen: o }),
  setUploadOpen: (o) => set({ uploadOpen: o }),
}));

interface MapLayer {
  id: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface MapStore {
  selectedThreatId: string | null;
  setSelectedThreatId: (id: string | null) => void;

  layers: MapLayer[];
  toggleLayer: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedThreatId: null,
  setSelectedThreatId: (id) => set({ selectedThreatId: id }),

  layers: [
    { id: "ransomware", label: "Ransomware", icon: "💀", color: "#ef4444", enabled: true },
    { id: "apt", label: "APT", icon: "🕵️", color: "#f97316", enabled: true },
    { id: "phishing", label: "Phishing", icon: "🎣", color: "#eab308", enabled: true },
    { id: "ddos", label: "DDoS", icon: "🌊", color: "#3b82f6", enabled: true },
    { id: "malware", label: "Malware", icon: "🦠", color: "#22c55e", enabled: true },
    { id: "zero_day", label: "Zero Day", icon: "⚡", color: "#a855f7", enabled: true },
  ],

  toggleLayer: (id) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    })),
}));
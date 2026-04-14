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

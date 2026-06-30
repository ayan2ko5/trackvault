import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ---- Sidebar State ----
      isSidebarOpen: true, // open by default on desktop

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),

      // ---- Theme State ----
      theme: "light", // default theme

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

     setTheme: (theme: "light" | "dark") => set({ theme }),
    }),
    {
      name: "trackvault-ui", 
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useUIStore;
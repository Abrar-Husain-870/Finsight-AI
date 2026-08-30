import { create } from 'zustand';

interface UiState {
  presentationMode: boolean;
  setPresentationMode: (val: boolean) => void;
  isAboutModalOpen: boolean;
  setAboutModalOpen: (val: boolean) => void;
  celebrationTrigger: number;
  triggerCelebration: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  presentationMode: false,
  setPresentationMode: (val) => set({ presentationMode: val }),
  isAboutModalOpen: false,
  setAboutModalOpen: (val) => set({ isAboutModalOpen: val }),
  celebrationTrigger: 0,
  triggerCelebration: () => set((state) => ({ celebrationTrigger: state.celebrationTrigger + 1 })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (val) => set({ mobileMenuOpen: val }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

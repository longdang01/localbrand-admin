import { create } from "zustand";

interface SidebarState {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;

    locale: string;
    setLocale: (locale: string) => void;
}


export const useSidebar = create<SidebarState>()((set) => ({
    collapsed: false,
    setCollapsed: (collapsed) => set({ collapsed }),

    locale: localStorage?.getItem("locale") || "vi",
    setLocale: (locale) => set({ locale })
}));
import { create } from "zustand";

interface ConfirmState {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    show: (title: string, message: string, onConfirm: () => void) => void;
    hide: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
    visible: false,
    title: "",
    message: "",
    onConfirm: null,

    show: (title, message, onConfirm) => {
        set({ visible: true, title, message, onConfirm });
    },

    hide: () => set({ visible: false, title: "", message: "", onConfirm: null }),
}));

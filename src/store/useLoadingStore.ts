"use client";
import { create } from "zustand";

// type LoadingState = {
// 	isLoading: boolean;
// 	setLoading: (isLoading?: boolean) => void;
// };

// const useLoadingStore = create<LoadingState>((set) => ({
// 	isLoading: false,
// 	setLoading: (isLoading) => set({ isLoading })
// }));

// export { useLoadingStore, type LoadingState };

interface GlobalLoadingStore {
	count: number;
	isLoadingVisible: boolean;
	start: () => void;
	stop: () => void;
	setLoadingVisible: (value?: boolean) => void;
}

export const useGlobalSWRLoading = create<GlobalLoadingStore>((set) => ({
	count: 0,
	isLoadingVisible: false,
	start: () => set((s) => ({ count: s.count + 1 })),
	stop: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
	setLoadingVisible: (value) => set({ isLoadingVisible: value ?? true })
}));

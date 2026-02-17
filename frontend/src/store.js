import { create } from "zustand";

const usePlayerStore = create((set) => ({
  //state
  currentTrack: null,
  isPlaying: false,
  activeTab: "playlist",
  searchQuery: "",

  //action
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default usePlayerStore;
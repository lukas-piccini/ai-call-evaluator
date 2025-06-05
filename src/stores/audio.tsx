import { create } from "zustand"

interface AudioState {
  currentAudio?: string;
  setCurrentAudio: (audio?: string) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentAudio: undefined,
  setCurrentAudio: (audio?: string) => set(() => ({ currentAudio: audio }))
}))

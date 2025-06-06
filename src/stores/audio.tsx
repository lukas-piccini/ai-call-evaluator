import { create } from "zustand"

interface CurrentPlayingAudio {
  call_id: string;
  audio_url: string;
}

interface AudioState {
  currentAudio?: CurrentPlayingAudio;
  setCurrentAudio: (audio?: CurrentPlayingAudio) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentAudio: undefined,
  setCurrentAudio: (audio?: CurrentPlayingAudio) => set(() => ({ currentAudio: audio }))
}))

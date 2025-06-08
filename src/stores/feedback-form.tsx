
import { create } from "zustand"

interface FeedbackFormState {
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
}

export const useFeedbackForm = create<FeedbackFormState>((set) => ({
  dirty: false,
  setDirty: (dirty: boolean) => set(() => ({ dirty: dirty }))
}))

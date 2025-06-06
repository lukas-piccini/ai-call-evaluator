import { useAudioStore } from "@/stores/audio"
import { Button } from "./button"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export function AudioPlayer() {
  const { currentAudio, setCurrentAudio } = useAudioStore(state => state)

  const onCloseAudioPlayer = () => {
    setCurrentAudio(undefined)
  }

  return (
    <AnimatePresence>
      {currentAudio && (
        <motion.div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 border-1" key="audio-player" transition={{ y: { bounce: 0 } }} exit={{ y: 300 }} initial={{ y: 300 }} animate={{ y: 0 }}>
          <div className="flex flex-row md:items-center md:gap-4 md:flex-1">
            <div className="hidden md:flex">
              <span className="font-bold">Call:</span><span>{currentAudio.call_id}</span>
            </div>
            <audio className="md:flex-1 md:px-9" controls autoPlay src={currentAudio.audio_url} />
          </div>
          <Button variant="ghost" size="icon" onClick={onCloseAudioPlayer}>
            <X />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

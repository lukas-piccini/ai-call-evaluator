import { useAudioStore } from "@/stores/audio";
import { Button } from "@/components/ui/button";
import { Play, MessageSquare } from "lucide-react"

interface ActionsProps {
  audioUrl: string;
  callId: string;
}

export function Actions({ callId, audioUrl }: ActionsProps) {
  const setAudio = useAudioStore((state) => state.setCurrentAudio)

  return (
    <div className="flex gap-2">
      <Button variant={"ghost"} onClick={() => { setAudio(audioUrl) }}><Play /></Button>
      <Button variant={"ghost"} onClick={() => console.log(callId)}><MessageSquare /></Button>
    </div>
  )
}

import { useAudioStore } from "@/stores/audio";
import { Button } from "@/components/ui/button";
import { Play, MessageSquare } from "lucide-react"
import { Link } from "@tanstack/react-router";

interface ActionsProps {
  audioUrl: string;
  callId: string;
}

export function Actions({ callId, audioUrl }: ActionsProps) {
  const { setCurrentAudio, currentAudio } = useAudioStore((state) => state)

  return (
    <div className="flex gap-2">
      <Button variant={"ghost"} onClick={() => { setCurrentAudio({ audio_url: audioUrl, call_id: callId }) }}><Play {...currentAudio?.call_id === callId ? { color: "green", strokeWidth: 3 } : {}} /></Button>
      <Button variant={"ghost"} asChild>
        <Link to="/" search={{ call_id: callId }}>
          <MessageSquare />
        </Link>
      </Button>
    </div>
  )
}

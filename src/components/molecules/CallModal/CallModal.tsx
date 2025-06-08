
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Retell } from "retell-sdk"
import { msToDuration } from "@/lib/formatters"
import { Play } from "lucide-react"
import { useAudioStore } from "@/stores/audio"
import Skeleton from "react-loading-skeleton"
import { Conversation } from "@/components/ui/conversation"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getFeedbackStatus, getIdsFromTranscript } from "@/lib/utils"
import type { Feedback } from "@/types/conversation"
import { getCall } from "@/services/call"


export function CallModal() {
  const navigate = useNavigate()
  const { currentAudio, setCurrentAudio } = useAudioStore(state => state)
  const callId = useSearch({ from: '/', select: (search) => search.call_id })
  const { data, isError, isLoading } = useQuery({ queryKey: ['call', callId], queryFn: () => getCall(callId), enabled: !!callId })
  const isPlayingAudio = currentAudio?.call_id === callId
  const ids = getIdsFromTranscript(data?.transcript_object as Retell.Call.WebCallResponse.TranscriptObject[])

  const onCloseModal = useCallback((isOpen: boolean) => {
    if (!isOpen)
      navigate({ to: '/' })
  }, [navigate])

  const onPlayAudio = useCallback(() => {
    if (isLoading) return;
    setCurrentAudio({ call_id: data?.call_id || '', audio_url: data?.recording_url || '' })
  }, [data?.call_id, data?.recording_url, setCurrentAudio, isLoading])


  return (
    <Dialog open={!!callId} onOpenChange={onCloseModal}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90dvh] overflow-y-auto" onInteractOutside={event => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Call details</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-4 px-1 md:px-4">
          <div>
            <p className="font-bold text-md">Basic information</p>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm italic text-gray-500 dark:text-white">Sentiment:</span>
                <Badge asChild={isLoading}>{isLoading ? <Skeleton width={50} height={15} /> : data?.call_analysis?.user_sentiment}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm italic text-gray-500 dark:text-white">Status:</span>
                <Badge asChild={isLoading}>{isLoading ? <Skeleton width={50} height={15} /> : getFeedbackStatus(ids, data?.metadata as Feedback[] | undefined)}</Badge>
              </div>
            </div>
          </div>

          <section className="flex flex-col gap-2 sm:flex-row sm:justify-between bg-slate-100 dark:bg-zinc-900 p-4 rounded-lg">
            <div className="flex flex-col text-sm gap-1">
              <div className="flex gap-1">
                <span className="font-bold">Call: </span>
                <span>{callId}</span>
              </div>
              <div className="flex gap-1">
                <span className="font-bold">Agent: </span>
                {isLoading ? <Skeleton height={15} width={100} /> : <span>{data?.agent_id}</span>}
              </div>
              <div className="flex gap-1">
                <span className="font-bold">Duration: </span>
                {isLoading ? <Skeleton height={15} width={100} /> : <span>{msToDuration(data?.duration_ms)}</span>}
              </div>
            </div>
            <div className="flex">
              <Button variant="default" onClick={onPlayAudio} disabled={isLoading} size="sm">
                <Play {...isPlayingAudio ? { color: "green", strokeWidth: 3 } : {}} />
                <span className={`${isPlayingAudio && "text-green-800"}`}>Play Audio</span>
              </Button>
            </div>
          </section>

          <Separator />

          <div className="flex flex-col">
            <p className="font-bold text-md">Conversation</p>
            <p className="text-sm text-gray-600 dark:text-white italic">You can click on a message and give feedback to it.</p>
          </div>

          <section className="bg-slate-100 dark:bg-zinc-900 p-4 rounded-lg h-full overflow-auto">
            <Conversation startDate={data?.start_timestamp || 0} isLoading={isLoading} content={data} />
          </section>
        </div>
      </DialogContent >
    </Dialog >
  )
}


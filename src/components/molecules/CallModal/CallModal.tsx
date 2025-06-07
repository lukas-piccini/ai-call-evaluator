
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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

async function getCall(callId: string): Promise<Retell.Call.CallResponse> {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}?call_id=${callId}`)
      const calls: Retell.Call.CallResponse[] = await response.json()

      if (calls.length >= 1)
        resolve(calls[0])
    }, 2000)
  })
}

export function CallModal() {
  const navigate = useNavigate()
  const { currentAudio, setCurrentAudio } = useAudioStore(state => state)
  const callId = useSearch({ from: '/', select: (search) => search.call_id })
  const { data, isError, isLoading } = useQuery({ queryKey: ['call', callId], queryFn: () => getCall(callId), enabled: !!callId })
  const isPlayingAudio = currentAudio?.call_id === callId

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
      <DialogContent className="sm:max-w-[1000px] sm:max-h-[90dvh] overflow-y-auto" onInteractOutside={event => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Call details</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="flex flex-col gap-4">
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

          <section className="bg-slate-100 dark:bg-zinc-900 p-4 rounded-lg h-full overflow-auto">
            <Conversation startDate={data?.start_timestamp || 0} isLoading={isLoading} content={data?.transcript_object || []} />
          </section>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent >
    </Dialog >
  )
}


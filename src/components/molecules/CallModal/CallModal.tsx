
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

  const onCloseModal = useCallback((isOpen: boolean) => {
    if (!isOpen)
      navigate({ to: '/' })
  }, [navigate])

  const onPlayAudio = useCallback(() => {
    setCurrentAudio({ call_id: data?.call_id || '', audio_url: data?.recording_url || '' })
  }, [data?.call_id, data?.recording_url, setCurrentAudio])

  return (
    <Dialog open={!!callId} onOpenChange={onCloseModal}>
      <DialogContent className="sm:max-w-[860px]">
        <DialogHeader>
          <DialogTitle>Call details</DialogTitle>
        </DialogHeader>
        <div className="gap-4">
          <div className="flex justify-between bg-slate-100 p-4">
            <div className="flex flex-col text-xs gap-1">
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
            <div className="flex justify-end">
              <Button variant="outline" onClick={onPlayAudio}>
                <Play />
                Play Audio
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}


import { createFileRoute } from '@tanstack/react-router'
import { CallTable } from '@/components/molecules/CallTable/CallTable'
import { useQuery } from '@tanstack/react-query';

import { Retell } from "retell-sdk"
import { useAudioStore } from '@/stores/audio';
import { AudioPlayer } from '@/components/ui/audio-player';

import { fallback, zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"
import { CallModal } from '@/components/molecules/CallModal/CallModal';

const homeSearchSchema = z.object({
  call_id: fallback(z.string(), '').default(''),
  selected_message: fallback(z.string(), '').default('')
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodValidator(homeSearchSchema),
})

async function getCalls(): Promise<Retell.Call.CallResponse[]> {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}`)
      const calls: Retell.Call.CallResponse[] = await response.json()
      resolve(calls)
    }, 2000)
  })
}

function HomeComponent() {
  const { data, isError, isLoading } = useQuery({ queryKey: ['calls'], queryFn: getCalls })
  const audioUrl = useAudioStore(state => state.currentAudio)

  console.log(data, isError)
  console.log(audioUrl)

  return (
    <div className="p-2">
      <CallTable isLoading={isLoading} data={data || []} />
      <CallModal />
      <AudioPlayer />
    </div>
  )
}

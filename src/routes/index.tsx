import { createFileRoute } from '@tanstack/react-router'
import { CallTable } from '@/components/molecules/CallTable/CallTable'
import { useQuery } from '@tanstack/react-query';

import { Retell } from "retell-sdk"
import { useAudioStore } from '@/stores/audio';

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

async function load(): Promise<Retell.Call.CallResponse[]> {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}`)
      const calls: Retell.Call.CallResponse[] = await response.json()
      resolve(calls)
    }, 2000)
  })
}

function HomeComponent() {
  const { data, isError, isLoading } = useQuery({ queryKey: ['calls'], queryFn: load })
  const audioUrl = useAudioStore(state => state.currentAudio)

  console.log(data, isError)
  console.log(audioUrl)

  return (
    <div className="p-2">
      <CallTable isLoading={isLoading} data={data || []} />
    </div>
  )
}

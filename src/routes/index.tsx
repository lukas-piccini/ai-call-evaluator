import { createFileRoute } from '@tanstack/react-router'
import { CallTable } from '@/components/molecules/CallTable/CallTable'
import { useQuery } from '@tanstack/react-query';

import { AudioPlayer } from '@/components/ui/audio-player';

import { fallback, zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"
import { CallModal } from '@/components/molecules/CallModal/CallModal';
import { getCalls } from '@/services/call';
import { CallChart } from '@/components/molecules/CallChart/CallChart';

const homeSearchSchema = z.object({
  call_id: fallback(z.string(), '').default(''),
  selected_message: fallback(z.string(), '').default('')
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodValidator(homeSearchSchema),
})


function HomeComponent() {
  const { data, isError, isLoading } = useQuery({ queryKey: ['calls'], queryFn: getCalls, refetchInterval: 1000 * 60 })

  console.log(data, isError)

  return (
    <div className="flex flex-col py-8 px-4 md:px-10 gap-8">
      <div className="flex flex-col gap-10">
        <CallChart isLoading={isLoading} data={data || []} />
        <CallTable isLoading={isLoading} data={data || []} />
      </div>
      <CallModal />
      <AudioPlayer />
    </div>
  )
}

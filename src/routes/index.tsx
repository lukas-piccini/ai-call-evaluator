import { createFileRoute } from '@tanstack/react-router'
import { CallTable } from '@/components/molecules/CallTable/CallTable'
import { useQuery } from '@tanstack/react-query';

import { AudioPlayer } from '@/components/ui/audio-player';

import { fallback, zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"
import { CallModal } from '@/components/molecules/CallModal/CallModal';
import { getCalls } from '@/services/call';

const homeSearchSchema = z.object({
  call_id: fallback(z.string(), '').default(''),
  selected_message: fallback(z.string(), '').default('')
})

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: zodValidator(homeSearchSchema),
})


function HomeComponent() {
  const { data, isError, isLoading } = useQuery({ queryKey: ['calls'], queryFn: getCalls })

  console.log(data, isError)

  return (
    <div className="p-2">
      <CallTable isLoading={isLoading} data={data || []} />
      <CallModal />
      <AudioPlayer />
    </div>
  )
}

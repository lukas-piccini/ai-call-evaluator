import { Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from '@/components/theme-provider'
import 'react-loading-skeleton/dist/skeleton.css'
import { Header } from '@/components/ui/header'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: RootComponent,
})

const queryClient = new QueryClient()

function RootComponent() {
  return (
    <ThemeProvider defaultTheme='dark'>
      <QueryClientProvider client={queryClient}>
        <div className='font-mono'>
          <Header />
          <div className='mx-auto max-w-[1024px]'>
            <Outlet />
          </div>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

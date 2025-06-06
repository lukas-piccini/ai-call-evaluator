import { ThemeSelector } from "@/components/ui/theme-selector"

export function Header() {
  return (
    <div className="flex justify-between p-4 border-b-1">
      <h1 className="font-bold text-xl md:text-3xl">AI Call Evaluator</h1>
      <ThemeSelector />
    </div>
  )
}

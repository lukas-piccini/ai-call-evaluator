import { ThemeSelector } from "@/components/ui/theme-selector"

export function Header() {
  return (
    <div className="flex justify-center border-b-1">
      <div className="flex flex-1 justify-between py-4 px-4 md:px-10">
        <h1 className="font-bold text-xl md:text-3xl">AI Call Evaluator</h1>
        <ThemeSelector />
      </div>
    </div>
  )
}

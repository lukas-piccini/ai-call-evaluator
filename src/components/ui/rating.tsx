import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import React from "react"

const elements = Array(5).fill(0)

export function Rating({ value, id, className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex" id={id}>
      {elements.map((_, index) => (
        <React.Fragment key={index}>
          <input className="hidden" id={index.toString()} type="radio" name="rating" value={index + 1} {...props} />
          <label htmlFor={index.toString()} role="button" aria-roledescription="Rating button" tabIndex={0} onKeyDown={(event) => event.stopPropagation()}>
            <Star aria-invalid={props["aria-invalid"]} size={18} strokeWidth={0} className={cn(`${value && +value >= index + 1 ? "fill-yellow-400" : "fill-gray-300"} aria-invalid:stroke-red-500 hover:cursor-pointer`, className)} />
          </label>
        </React.Fragment>
      ))}
    </div>
  )
}

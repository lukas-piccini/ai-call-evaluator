import { Badge } from "@/components/ui/badge"
import { FeedbackTags } from "@/types/conversation"

const ALL_TAGS = [
  FeedbackTags.CRITICAL_ISSUE,
  FeedbackTags.FOLLOWUP_NEEDED,
  FeedbackTags.INACCURATE_SENTIMENT,
]

type FeedbackTagProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function FeedbackTag({ value = [], onChange, ...props }: FeedbackTagProps) {
  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter(t => t !== tag))
    } else {
      onChange([...value, tag])
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {ALL_TAGS.map(tag => {
        const selected = value.includes(tag)
        return (
          <Badge
            key={tag}
            role="checkbox"
            variant={selected ? "default" : "outline"}
            aria-checked={selected}
            onClick={() => toggleTag(tag)}
            className="cursor-pointer select-none"
            {...props}
          >
            {tag}
          </Badge>
        )
      })}
    </div >
  )
}

import { Badge } from "@/components/ui/badge";

const SENTIMENT_VARIANT = {
  "Positive": "default",
  "Neutral": "outline",
  "Negative": "destructive",
  "Unknown": "outline"
} as const

export function SentimentBadge({ sentiment }: { sentiment: 'Negative' | 'Positive' | 'Neutral' | 'Unknown' }) {
  return (
    <Badge variant={SENTIMENT_VARIANT[sentiment]}>{sentiment}</Badge>
  )
}

import { Badge } from "@/components/ui/badge";
import { FeedbackStatus } from "@/types/conversation";

const FEEDBACK_VARIANT = {
  [FeedbackStatus.COMPLETED]: "default",
  [FeedbackStatus.PENDING]: "outline",
  [FeedbackStatus.NOT_STARTED]: "secondary",
} as const

export function FeedbackBadge({ feedback }: { feedback: FeedbackStatus }) {
  return (
    <Badge variant={FEEDBACK_VARIANT[feedback]}>{feedback}</Badge>
  )
}

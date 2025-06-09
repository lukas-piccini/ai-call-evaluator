import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Retell } from "retell-sdk"
import { FeedbackStatus, type Feedback } from "@/types/conversation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getIdsFromTranscript(transcript: Retell.Call.WebCallResponse.TranscriptObject[]) {
  if (!transcript) return []
  const ids = transcript.map(msg => {
    if (!msg.words[0] || !msg.words[0].start) return -1
    return msg.words[0].start
  })

  return ids
}

export function getFeedbackForCurrentMessage(metadata: Record<string, Feedback> | undefined, selectedMessage: string) {
  if (!metadata) return

  const result = Object.entries(metadata).find(([key]) => key === selectedMessage)

  if (!result) return

  return result?.[1]
}

export function getFeedbackStatus(ids: number[], metadata: Record<string, Feedback[]> | undefined): FeedbackStatus {
  const metadataLength = Object.keys(metadata || {}).length

  if (metadata && (metadataLength > 0 && metadataLength < ids.length)) return FeedbackStatus.PENDING
  if ((!metadata && ids.length > 0) || ids.length > 0 && metadataLength === 0) return FeedbackStatus.NOT_STARTED
  if (!metadata || (metadataLength === 0 && ids.length === 0)) return FeedbackStatus.COMPLETED

  if (metadata && metadataLength > 0 && ids && ids.length > 0 && Object.keys(metadata).every((key) => ids.includes(+key)))
    return FeedbackStatus.COMPLETED

  return FeedbackStatus.PENDING
}

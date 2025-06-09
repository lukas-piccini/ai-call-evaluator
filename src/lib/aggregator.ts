import type { CallResponse } from "@/types/call";
import { msToDuration, msToSeconds } from "./formatters"

interface SentimentAnalytics {
  avgCallDuration: string;
  avgLatency: string;
  sentimentScore: string;
}

interface BaseChartData {
  positive: number;
  neutral: number;
  negative: number;
}

const USER_SENTIMENT_SCORE = {
  "Neutral": 6,
  "Positive": 10,
  "Negative": 1,
  "Unknown": 3,
} as const;

export function getLast24HoursCalls(data: CallResponse[]) {
  const now = new Date().getTime()

  return data.filter(call => {
    if (!call.start_timestamp) return false

    const callStartDate = new Date(call.start_timestamp).getTime()

    return Math.floor((now - callStartDate) / (1000 * 60 * 60)) < 48
  })
}

function getAvgCallDuration(data: CallResponse[]) {
  const summMs = data.reduce((acc, call) => {
    return acc + (call?.duration_ms || 0)
  }, 0)

  return msToDuration(summMs / data.length)
}

function getAvgLatency(data: CallResponse[]) {
  const summMs = data.reduce((acc, call) => {
    return acc + (call?.latency?.e2e?.max || 0)
  }, 0)

  return msToSeconds(summMs / data.length)
}

function getSentimentScore(data: CallResponse[]) {
  const summ = data.reduce((acc, call) => {
    return acc + (USER_SENTIMENT_SCORE[call?.call_analysis?.user_sentiment || 'Unknown'])
  }, 0)

  return (summ / data.length).toFixed(1).toString()
}

export function getSentimentAnalytics(data: CallResponse[]): SentimentAnalytics {
  if (!data || data.length === 0)
    return {
      avgCallDuration: '00:00',
      avgLatency: '0.0',
      sentimentScore: "0"
    }

  return {
    avgCallDuration: getAvgCallDuration(data),
    avgLatency: getAvgLatency(data),
    sentimentScore: getSentimentScore(data)
  }
}

export function getChartData(data: CallResponse[]) {
  const base = new Map<number, BaseChartData>()
  const currentHour = new Date().getHours()

  for (let i = 0; i < 24; i++) {
    base.set((currentHour + i) % 24, { negative: 0, neutral: 0, positive: 0 })
  }

  data.forEach(call => {
    if (!call.start_timestamp) return
    const callHour = new Date(call.start_timestamp).getHours()

    const prev = base.get(callHour)

    if (!prev) return

    if (call.call_analysis?.user_sentiment === 'Positive') {
      base.set(callHour, { ...prev, positive: prev.positive + 1 })
    } else if (call.call_analysis?.user_sentiment === 'Neutral') {
      base.set(callHour, { ...prev, neutral: prev.neutral + 1 })
    } else if (call.call_analysis?.user_sentiment === 'Negative') {
      base.set(callHour, { ...prev, negative: prev.negative + 1 })
    }
  })

  return Array.from(base, ([key, value]) => ({ hour: key, ...value }))
}

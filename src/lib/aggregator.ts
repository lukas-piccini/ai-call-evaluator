import type { CallResponse } from "retell-sdk/resources/call.mjs"
import { msToDuration, msToSeconds } from "./formatters"

interface SentimentAnalytics {
  avgCallDuration: string;
  avgLatency: string;
  sentimentScore: string;
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

  return (summ / data.length).toString()
}

export function getSentimentAnalytics(data: CallResponse[]): SentimentAnalytics {
  return {
    avgCallDuration: getAvgCallDuration(data),
    avgLatency: getAvgLatency(data),
    sentimentScore: getSentimentScore(data)
  }
}

export function getChartData(data: CallResponse[]) {
  const currentHour = new Date().getHours()
  const base = Array(24).fill(0).map((_, index) => ({ hour: (currentHour + index) % 24, negative: 0, neutral: 1, positive: 12 }));

  console.log(currentHour)
  return base
}

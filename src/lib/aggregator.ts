import type { CallResponse } from "@/types/call";
import { msToDuration, msToSeconds } from "./formatters"

export interface Outlier {
  min: string;
  max: string;
}

interface Analytics {
  avg: string;
  diff: string;
  outliers?: Outlier;
}

interface SentimentAnalytics {
  callDuration: Analytics;
  latency: Analytics;
  sentimentScore: Analytics;
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
  const now = new Date().getTime();

  return data.filter(call => {
    if (!call.start_timestamp) return false;

    const callStartDate = new Date(call.start_timestamp).getTime();

    return Math.floor((now - callStartDate) / (1000 * 60 * 60)) < 24;
  })
}

export function getPrevDayCalls(data: CallResponse[]) {
  const now = new Date().getTime();

  return data.filter(call => {
    if (!call.start_timestamp) return false;

    const callStartDate = new Date(call.start_timestamp).getTime();

    return Math.floor((now - callStartDate) / (1000 * 60 * 60)) >= 24 && Math.floor((now - callStartDate) / (1000 * 60 * 60)) < 48;
  })
}

function getAvgCallDuration(data: CallResponse[]) {
  const summMs = data.reduce((acc, call) => {
    return acc + (call?.duration_ms || 0);
  }, 0)

  return summMs / data.length;
}

function getCallDurationOutliers(data: CallResponse[]) {
  return data.reduce((acc, call) => {
    if (!call.duration_ms) return acc;

    if (call.duration_ms > acc.max) {
      acc.max = call.duration_ms;
    }

    if (call.duration_ms < acc.min) {
      acc.min = call.duration_ms;
    }

    return acc;
  }, { max: 0, min: 999999 })
}

function getAvgLatency(data: CallResponse[]) {
  const summMs = data.reduce((acc, call) => {
    return acc + (call?.latency?.e2e?.max || 0);
  }, 0)

  return summMs / data.length;
}

function getLatencyOutliers(data: CallResponse[]) {
  return data.reduce((acc, call) => {
    if (!call.latency?.e2e?.max) return acc;

    if (call.latency.e2e.max > acc.max) {
      acc.max = call.latency.e2e.max;
    }

    if (call.latency.e2e.max < acc.min) {
      acc.min = call.latency.e2e.max;
    }

    return acc;
  }, { min: 9999999, max: 0 })
}

function getSentimentScore(data: CallResponse[]) {
  const summ = data.reduce((acc, call) => {
    return acc + (USER_SENTIMENT_SCORE[call?.call_analysis?.user_sentiment || 'Unknown']);
  }, 0)

  return summ / data.length;
}

export function getSentimentAnalytics(todayData: CallResponse[], prevDayData: CallResponse[]): SentimentAnalytics {
  if (!todayData || todayData.length === 0)
    return {
      callDuration: {
        avg: "00:00",
        diff: "0",
        outliers: { min: '', max: '' },
      },
      latency: {
        avg: "0.0",
        diff: "0",
        outliers: { min: '', max: '' },
      },
      sentimentScore: {
        avg: "0",
        diff: "0",
        outliers: { min: '', max: '' },
      }
    };

  const callDiff = getAvgCallDuration(todayData) - getAvgCallDuration(prevDayData);
  const callOutlier = getCallDurationOutliers(todayData);

  const latencyDiff = getAvgLatency(todayData) - getAvgLatency(prevDayData);
  const latencyOutlier = getLatencyOutliers(todayData)

  return {
    callDuration: {
      avg: msToDuration(getAvgCallDuration(todayData)),
      diff: `${callDiff < 0 ? "-" : "+"}${msToDuration(Math.abs(callDiff))}`,
      outliers: {
        min: `Shortest call: ${msToDuration(callOutlier.min)} min`,
        max: `Longest call: ${msToDuration(callOutlier.max)} min`,
      },
    },
    latency: {
      avg: msToSeconds(getAvgLatency(todayData)),
      diff: `${latencyDiff < 0 ? "-" : "+"}${msToSeconds(Math.abs(latencyDiff))}`,
      outliers: {
        min: `Smallest lattency: ${msToSeconds(latencyOutlier.min)}s`,
        max: `Biggest latency: ${msToSeconds(latencyOutlier.max)}s`,
      },
    },
    sentimentScore: {
      avg: getSentimentScore(todayData).toFixed(1).toString(),
      diff: (getSentimentScore(todayData) - getSentimentScore(prevDayData)).toFixed(1).toString(),
    }
  }
}

export function getChartData(data: CallResponse[]) {
  const base = new Map<number, BaseChartData>();
  const currentHour = new Date().getHours();

  for (let i = 0; i < 24; i++) {
    base.set((currentHour + i) % 24, { negative: 0, neutral: 0, positive: 0 });
  }

  data.forEach(call => {
    if (!call.start_timestamp) return;
    const callHour = new Date(call.start_timestamp).getHours();

    const prev = base.get(callHour);

    if (!prev) return;

    if (call.call_analysis?.user_sentiment === 'Positive') {
      base.set(callHour, { ...prev, positive: prev.positive + 1 });
    } else if (call.call_analysis?.user_sentiment === 'Neutral') {
      base.set(callHour, { ...prev, neutral: prev.neutral + 1 });
    } else if (call.call_analysis?.user_sentiment === 'Negative') {
      base.set(callHour, { ...prev, negative: prev.negative + 1 });
    }
  })

  return Array.from(base, ([key, value]) => ({ hour: key, ...value }));
}

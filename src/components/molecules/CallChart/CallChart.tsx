import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { CallResponse } from "@/types/call"
import { getChartData, getLast24HoursCalls, getPrevDayCalls, getSentimentAnalytics } from "@/lib/aggregator"
import { CallSentimentCard } from "../CallSentimentCard/CallSentimentCard"
import { ChartSpline, Clock, Timer } from "lucide-react"
import { useMemo } from "react"

const chartConfig = {
  title: {
    label: "Calls",
  },
  positive: {
    label: "Positive",
    color: "var(--chart-2)",
  },
  neutral: {
    label: "Neutral",
    color: "var(--chart-3)",
  },
  negative: {
    label: "Negative",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface CallChartProps {
  data: CallResponse[];
  isLoading: boolean;
}

export function CallChart({ data, isLoading }: CallChartProps) {
  const last24hCalls = useMemo(() => getLast24HoursCalls(data), [data])
  const prevDayCalls = useMemo(() => getPrevDayCalls(data), [data])
  const analytics = useMemo(() => getSentimentAnalytics(last24hCalls, prevDayCalls), [last24hCalls, prevDayCalls])
  const chartData = useMemo(() => getChartData(last24hCalls), [last24hCalls])

  return (
    <section className="flex flex-col flex-1 gap-2">
      <div>
        <p className="text-2xl font-bold">Sentiment Trends</p>
        <p className="text-sm italic">Hourly sentiment analysis across calls from the last 24 hours.</p>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <CallSentimentCard
              isLoading={isLoading}
              title="Avg Call Duration"
              icon={<Clock size={16} />}
              value={`${analytics.callDuration.avg} min`}
              difference={`${analytics.callDuration.diff} min`}
              outlier={analytics.callDuration.outliers}
            />
            <CallSentimentCard
              isLoading={isLoading}
              title="Agent Latency"
              icon={<Timer size={16} />}
              value={`${analytics.latency.avg}s`}
              difference={`${analytics.latency.diff}s`}
              outlier={analytics.latency.outliers}
            />

            <CallSentimentCard
              isLoading={isLoading}
              title="Sentiment Score"
              icon={<ChartSpline size={16} />}
              value={`${analytics.sentimentScore.avg}/10`}
              difference={analytics.sentimentScore.diff}
            />
          </div>

          <ChartContainer className="mt-8" config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value.toString().padStart(2, "0")}:00`}
              />
              <YAxis
                tickLine={true}
                tickMargin={8}
              />
              <ChartTooltip cursor={true} content={<ChartTooltipContent labelKey="title" />} />
              <Line
                dataKey="positive"
                type="linear"
                stroke="var(--color-positive)"
                strokeWidth={2}
              />
              <Line
                dataKey="neutral"
                type="linear"
                stroke="var(--color-neutral)"
                strokeWidth={2}
              />
              <Line
                dataKey="negative"
                type="linear"
                stroke="var(--color-negative)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  )
}

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { CallResponse } from "retell-sdk/resources/call.mjs"
import { getChartData, getLast24HoursCalls, getSentimentAnalytics } from "@/lib/aggregator"
import { CallSentimentCard } from "../CallSentimentCard/CallSentimentCard"
import { ChartSpline, Clock, Timer } from "lucide-react"

const chartConfig = {
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
  const last24hCalls = getLast24HoursCalls(data)
  const analytics = getSentimentAnalytics(last24hCalls)
  const chartData = getChartData(last24hCalls)

  console.log("last", last24hCalls)

  return (
    <section className="flex flex-col flex-1 gap-2">
      <div>
        <p className="text-2xl font-bold">Sentiment Trends</p>
        <p className="text-sm italic">Hourly sentiment analysis across all calls</p>
      </div>
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <CallSentimentCard
              isLoading={isLoading}
              title="Avg Call Duration"
              icon={<Clock size={16} />}
              value={`${analytics.avgCallDuration} min`}
              difference="+20"
            />
            <CallSentimentCard
              isLoading={isLoading}
              title="Agent Latency"
              icon={<Timer size={16} />}
              value={`${analytics.avgLatency}s`}
              difference="+20"
            />

            <CallSentimentCard
              isLoading={isLoading}
              title="Sentiment Score"
              icon={<ChartSpline size={16} />}
              value={`${analytics.sentimentScore}/10`}
              difference="+20"
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
              />
              <YAxis
                tickLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="positive"
                type="monotone"
                stroke="var(--color-positive)"
                strokeWidth={2}
              />
              <Line
                dataKey="neutral"
                type="monotone"
                stroke="var(--color-neutral)"
                strokeWidth={2}
              />
              <Line
                dataKey="negative"
                type="monotone"
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

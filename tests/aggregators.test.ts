import { describe, it, expect } from "vitest";
import { getChartData, getPrevDayCalls, getLast24HoursCalls } from "../src/lib/aggregator"

describe("aggregators", () => {
  it("getLast24HoursCalls should return the calls from the last 24 hours", () => {
    const now = new Date()
    const mock = [{
      start_timestamp: new Date().setHours(now.getHours() - 10)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 20)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 1)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 48)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 32)
    }]

    expect(getLast24HoursCalls(mock).length).toBe(3)
  })

  it("getPrevDayCalls should return the calls from the last 24 hours", () => {
    const now = new Date()
    const mock = [{
      start_timestamp: new Date().setHours(now.getHours() - 10)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 20)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 1)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 47)
    }, {
      start_timestamp: new Date().setHours(now.getHours() - 32)
    }]

    expect(getPrevDayCalls(mock).length).toBe(2)
  })

  it("getChartData should return correct chart data", () => {
    const now = new Date()
    const prevHour = new Date().setHours(now.getHours() - 1)
    const prev2Hour = new Date().setHours(now.getHours() - 2)

    const mock = [{
      start_timestamp: prevHour,
      call_analysis: {
        user_sentiment: "Positive"
      }
    }, {
      start_timestamp: prevHour,
      call_analysis: {
        user_sentiment: "Positive"
      }
    }, {
      start_timestamp: prevHour,
      call_analysis: {
        user_sentiment: "Positive"
      }
    }, {
      start_timestamp: prev2Hour,
      call_analysis: {
        user_sentiment: "Negative"
      }
    }, {
      start_timestamp: prev2Hour,
      call_analysis: {
        user_sentiment: "Neutral"
      }
    }]

    expect(getChartData(mock)).toStrictEqual([...Array(22).fill(0).map((_, index) => ({
      hour: (now.getHours() + index) % 24, positive: 0, negative: 0, neutral: 0
    })), {
      hour: new Date(prev2Hour).getHours(), positive: 0, neutral: 1, negative: 1
    }, {
      hour: new Date(prevHour).getHours(), positive: 3, negative: 0, neutral: 0
    }])
  })
})

import { describe, expect, it } from "vitest"

import { msToSeconds, msToDuration, unixToTimestamp, getMessageDateTime } from "../src/lib/formatters"

describe("formatters", () => {
  it("msToSeconds should return 00.0 when undefined or zero/negative provided", () => {
    expect(msToSeconds(undefined)).toBe("00.0");
    expect(msToSeconds(0)).toBe("00.0");
    expect(msToSeconds(-100)).toBe("00.0");
  })

  it("msToSeconds should return corrected formatted seconds when milliseconds provided", () => {
    expect(msToSeconds(1520)).toBe("1.5")
    expect(msToSeconds(35000)).toBe("35.0")
    expect(msToSeconds(993825)).toBe("993.8")
  })

  it("msToDuration should return 00:00 when undefined or zero/negative provided", () => {
    expect(msToDuration(undefined)).toBe("00:00")
    expect(msToDuration(0)).toBe("00:00")
    expect(msToDuration(-100)).toBe("00:00")
  })

  it("msToDuration should return corrected formatted duration when milliseconds provided", () => {
    expect(msToDuration(60000)).toBe("01:00")
    expect(msToDuration(6000)).toBe("00:06")
    expect(msToDuration(60000 * 21 + 12000)).toBe("21:12")
  })

  it("unixToTimestamp should return corrected formatted duration when milliseconds provided", () => {
    expect(unixToTimestamp(1749651410963)).toBe("11/06/2025, 15:16")
    expect(unixToTimestamp(1749647061548)).toBe("11/06/2025, 14:04")
    expect(unixToTimestamp(1749643541458)).toBe("11/06/2025, 13:05")
  })

  it("getMessageDateTime should return corrected formatted duration when milliseconds and message time provided", () => {
    expect(getMessageDateTime(1749651410963, 0.797 * 1000)).toBe("15:16:51")
    expect(getMessageDateTime(1749651410963, 11.264 * 1000)).toBe("15:17:02")
    expect(getMessageDateTime(1749647061548, 204.87 * 1000)).toBe("14:07:46")
  })
})

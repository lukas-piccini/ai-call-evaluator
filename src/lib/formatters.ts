function unixToTimestamp(unix: number): string {
  const date = new Date(unix);
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })

  return formatter.format(date)
}

function unixToHour(unix: number): string {
  const date = new Date(unix);
  const formatter = new Intl.DateTimeFormat("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  return formatter.format(date)
}

function msToDuration(ms?: number): string {
  if (typeof ms === 'undefined' || ms <= 0) return "00:00"

  const minutes = Math.floor((ms / 1000) / 60)
  const seconds = Math.floor((ms / 1000) % 60)

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

function msToSeconds(ms?: number): string {
  if (typeof ms === 'undefined' || ms <= 0) return "00.0"

  const seconds = (ms / 1000)

  return seconds.toFixed(1).toString()
}

function getMessageDateTime(conversationStart: number, messageTime: number) {
  return unixToHour(Math.floor(conversationStart + messageTime))
}

export { unixToTimestamp, msToDuration, getMessageDateTime, msToSeconds }

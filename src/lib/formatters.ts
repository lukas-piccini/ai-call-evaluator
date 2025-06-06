function unixToTimestamp(unix: string): string {
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

function msToDuration(ms?: number): string {
  if (typeof ms === 'undefined' || ms <= 0) return "00:00"

  const minutes = Math.floor((ms / 1000) / 60)
  const seconds = Math.floor((ms / 1000) % 60)

  return `${minutes}:${seconds}`
}

export { unixToTimestamp, msToDuration }

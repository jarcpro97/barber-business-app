const pad = (n: number) => String(n).padStart(2, '0')

export function toLocalDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function toLocalTimeStr(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// Parses a YYYY-MM-DD string as local midnight (avoids UTC midnight mis-parse)
export function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

// Server-side: get Colombia (America/Bogota) YYYY-MM-DD for a given UTC moment
export function toColombiaDateStr(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// Returns a Date representing Colombia midnight for a given YYYY-MM-DD string
export function colombiaMidnight(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00-05:00`)
}

export type RosterStatus = 'Working' | 'Day Off'

export type ApprovedRequest = {
  startDate: Date
  endDate: Date
}

function toMidnight(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export function daysBetween(a: Date, b: Date) {
  const da = toMidnight(a)
  const db = toMidnight(b)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.floor((+da - +db) / msPerDay)
}

export function baseRosterStatus(targetDate: Date, anchorDate: Date): RosterStatus {
  const diff = daysBetween(targetDate, anchorDate)
  const mod = ((diff % 35) + 35) % 35
  if (mod >= 0 && mod <= 27) return 'Working'
  return 'Day Off'
}

export function isDateInRange(target: Date, start: Date, end: Date) {
  const t = toMidnight(target).getTime()
  const s = toMidnight(start).getTime()
  const e = toMidnight(end).getTime()
  return t >= s && t <= e
}

export function rosterStatusWithOverride(
  targetDate: Date,
  anchorDate: Date,
  approvedRequests: ApprovedRequest[] = []
): RosterStatus {
  const base = baseRosterStatus(targetDate, anchorDate)

  // Rule A: if any approved request covers the target date and base is Working, flip to Day Off
  for (const req of approvedRequests) {
    if (isDateInRange(targetDate, req.startDate, req.endDate) && base === 'Working') {
      return 'Day Off'
    }
  }

  // Rule B: payback — if base is Day Off and any request is in the same 35-day block, flip to Working day-for-day
  if (base === 'Day Off') {
    const targetDiff = daysBetween(targetDate, anchorDate)
    const targetBlock = Math.floor(targetDiff / 35)
    const targetMod = ((targetDiff % 35) + 35) % 35

    // Count unique approved days off in the working block (0-27) of this cycle
    const uniqueApprovedWorkingDays = new Set<string>()
    for (const req of approvedRequests) {
      const start = toMidnight(req.startDate)
      const end = toMidnight(req.endDate)
      for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const diff = daysBetween(d, anchorDate)
        const block = Math.floor(diff / 35)
        const mod = ((diff % 35) + 35) % 35
        if (block === targetBlock && mod >= 0 && mod <= 27) {
          uniqueApprovedWorkingDays.add(d.toISOString().slice(0, 10))
        }
      }
    }

    const W = uniqueApprovedWorkingDays.size
    if (targetMod - 28 < W) {
      return 'Working'
    }
  }

  return base
}

export default rosterStatusWithOverride


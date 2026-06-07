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
  approvedRequest?: ApprovedRequest
): RosterStatus {
  const base = baseRosterStatus(targetDate, anchorDate)
  if (!approvedRequest) return base

  const inRange = isDateInRange(targetDate, approvedRequest.startDate, approvedRequest.endDate)

  if (inRange && base === 'Working') return 'Day Off' // Rule A

  // Rule B: payback only applies within the same 35-day block where the approvedRequest occurred.
  // Determine the 35-day block containing the approvedRequest.startDate relative to the anchor
  const reqBlockStartIndex = Math.floor((((daysBetween(approvedRequest.startDate, anchorDate) % 35) + 35) % 35) / 35)
  // Simpler approach: compute day index for approvedRequest.startDate and targetDate, and only apply payback
  const reqIndex = ((daysBetween(approvedRequest.startDate, anchorDate) % 35) + 35) % 35
  const targetIndex = ((daysBetween(targetDate, anchorDate) % 35) + 35) % 35

  if (!inRange && base === 'Day Off') {
    // If the targetIndex falls within the same 35-day repeating cycle block as the request (i.e., same cycle instance), flip to Working
    // We'll consider the block as matching when the integer division of daysBetween by 35 is equal for both dates.
    const reqBlock = Math.floor(daysBetween(approvedRequest.startDate, anchorDate) / 35)
    const targetBlock = Math.floor(daysBetween(targetDate, anchorDate) / 35)
    if (reqBlock === targetBlock) return 'Working'
  }

  return base
}

export default rosterStatusWithOverride

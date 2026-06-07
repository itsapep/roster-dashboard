import { rosterStatusWithOverride, RosterStatus } from './roster-util'

export type Employee = {
  id: string
  name: string
  anchorDate: Date
}

export type GridCell = {
  date: Date
  status: RosterStatus
  swapped: boolean
}

export function buildRosterGrid(
  employees: Employee[],
  viewDate: Date,
  approvedRequests: Record<string, { startDate: Date; endDate: Date }[]>
): Record<string, GridCell[]> {
  const year = viewDate.getUTCFullYear()
  const month = viewDate.getUTCMonth()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const result: Record<string, GridCell[]> = {}

  for (const emp of employees) {
    const cells: GridCell[] = []
    const empRequests = approvedRequests[emp.id] || []

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(Date.UTC(year, month, d))
      const status = rosterStatusWithOverride(date, emp.anchorDate, empRequests)

      // swapped flag: true when overridden relative to base
      const base = (() => rosterStatusWithOverride(date, emp.anchorDate, []))()
      const swapped = base !== status

      cells.push({ date, status, swapped })
    }

    result[emp.id] = cells
  }

  return result
}

export default buildRosterGrid

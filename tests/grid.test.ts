import { describe, it, expect } from 'vitest'
import buildRosterGrid from '../src/utils/grid'

function d(s: string) { return new Date(s) }

describe('buildRosterGrid', () => {
  it('creates rows for employees and marks swapped cells', () => {
    const employees = [ { id: 'e1', name: 'A', anchorDate: d('2026-01-01') } ]
    const view = d('2026-01-01')
    const approved = {
      e1: [ { startDate: d('2026-01-05'), endDate: d('2026-01-06') } ]
    }

    const grid = buildRosterGrid(employees, view, approved)
    expect(Object.keys(grid)).toContain('e1')
    const row = grid['e1']
    // Jan 5 should be Day Off due to approved request
    const cellJan5 = row.find(c => c.date.getUTCDate() === 5)
    expect(cellJan5).toBeTruthy()
    expect(cellJan5?.status).toBe('Day Off')
    expect(cellJan5?.swapped).toBe(true)
  })
})

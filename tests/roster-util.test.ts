import { describe, it, expect } from 'vitest'
import { baseRosterStatus, rosterStatusWithOverride } from '../src/utils/roster-util'

function d(s: string) { return new Date(s) }

describe('Roster util', () => {
  it('base cycle working and day off', () => {
    const anchor = d('2026-01-01')
    expect(baseRosterStatus(d('2026-01-01'), anchor)).toBe('Working')
    expect(baseRosterStatus(d('2026-01-29'), anchor)).toBe('Day Off')
    expect(baseRosterStatus(d('2026-02-04'), anchor)).toBe('Day Off')
    expect(baseRosterStatus(d('2026-02-05'), anchor)).toBe('Working')
  })

  it('override inside approved request turns working -> day off', () => {
    const anchor = d('2026-01-01')
    const approved = { startDate: d('2026-01-05'), endDate: d('2026-01-06') }
    expect(rosterStatusWithOverride(d('2026-01-05'), anchor, [approved])).toBe('Day Off')
  })

  it('payback flips day off to working within same cycle block', () => {
    const anchor = d('2026-01-01')
    const approved = { startDate: d('2026-01-05'), endDate: d('2026-01-06') }
    expect(rosterStatusWithOverride(d('2026-01-29'), anchor, [approved])).toBe('Working')
  })

  it('handles multiple approved requests - first one triggers override', () => {
    const anchor = d('2026-01-01')
    const req1 = { startDate: d('2026-01-05'), endDate: d('2026-01-06') }
    const req2 = { startDate: d('2026-02-01'), endDate: d('2026-02-02') }
    expect(rosterStatusWithOverride(d('2026-01-05'), anchor, [req1, req2])).toBe('Day Off')
  })

  it('payback still works with multiple requests when target is day off', () => {
    const anchor = d('2026-01-01')
    const req1 = { startDate: d('2026-01-05'), endDate: d('2026-01-06') }
    const req2 = { startDate: d('2026-01-29'), endDate: d('2026-01-30') }
    // Jan 29 is in block 0, so day 28 (mod 35) which is Day Off -> payback should apply
    expect(rosterStatusWithOverride(d('2026-01-29'), anchor, [req1, req2])).toBe('Working')
  })
})

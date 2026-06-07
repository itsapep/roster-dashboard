import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RosterGrid from '../src/components/RosterGrid'

describe('RosterGrid component', () => {
  it('renders employee names and day cells, marks OFF and swapped', () => {
    const employees = [
      { id: '1', name: 'Alice', anchorDate: new Date('2026-01-01') },
      { id: '2', name: 'Bob', anchorDate: new Date('2026-01-01') },
    ]

    const approvedRequests: Record<string, { startDate: Date; endDate: Date }[]> = {
      '1': [{ startDate: new Date('2026-01-05'), endDate: new Date('2026-01-05') }],
    }

    render(<RosterGrid employeesList={employees as any} currentViewDate={new Date('2026-01-01')} approvedRequests={approvedRequests} />)

    // Employee names present
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    // Header day 5 exists
    expect(screen.getByText('5')).toBeInTheDocument()

    // There should be an OFF cell in Alice's row (shows 'OFF' text)
    const offCells = screen.getAllByText('OFF')
    expect(offCells.length).toBeGreaterThan(0)
  })
})

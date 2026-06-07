import React from 'react'
import styles from './RosterGrid.module.css'
import buildRosterGrid, { Employee } from '../utils/grid'

type ApprovedReq = { startDate: Date; endDate: Date }

type Props = {
  employeesList: Employee[]
  currentViewDate: Date
  approvedRequests?: Record<string, ApprovedReq[]>
}

export function RosterGrid({ employeesList, currentViewDate, approvedRequests = {} }: Props) {
  const grid = buildRosterGrid(employeesList, currentViewDate, approvedRequests)
  const year = currentViewDate.getUTCFullYear()
  const month = currentViewDate.getUTCMonth()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  return (
    <div className={styles.gridWrapper}>
      <table className={styles.gridTable}>
        <thead>
          <tr>
            <th className={`${styles.gridTh} ${styles.nameCol}`}>Employee</th>
            {Array.from({ length: daysInMonth }).map((_, i) => (
              <th key={i} className={`${styles.gridTh} ${styles.headerDay}`}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employeesList.map(emp => {
            const row = grid[emp.id] || []
            return (
              <tr key={emp.id}>
                <td className={`${styles.gridTd} ${styles.nameCol}`}>{emp.name}</td>
                {row.map((cell, idx) => {
                  const cls = `${styles.gridTd} ${cell.status === 'Day Off' ? styles.dayOff : styles.working} ${cell.swapped ? styles.swapped : ''}`
                  return (
                    <td key={idx} className={cls} title={`${cell.status}${cell.swapped ? ' (swapped)' : ''}`}>
                      {cell.status === 'Day Off' ? 'OFF' : ''}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RosterGrid

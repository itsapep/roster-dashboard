'use client'

import React, { useState, useEffect, useCallback } from 'react'

type Employee = {
  id: number
  name: string
  department: string
  role: string | null
}

type MovementRequest = {
  id: number
  employee_id: number
  movement_type: string | null
  start_date: string | null
  end_date: string | null
  status: string | null
}

export default function Page() {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [currentViewDate, setCurrentViewDate] = useState(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })

  const [employees, setEmployees] = useState<Employee[]>([])
  const [requests, setRequests] = useState<MovementRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.data || []))
      .catch(console.error)
  }, [])

  const departments = Array.from(new Set(employees.map(e => e.department))).sort()
  const movementTypes = ['Change Swing', 'Request Leave', 'Temporary Swap']

  const filteredEmployeeIds = selectedDepartment
    ? employees.filter(e => e.department === selectedDepartment).map(e => e.id)
    : []

  const fetchRequests = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('status', 'Pending')
    if (filteredEmployeeIds.length === 1) {
      params.set('employee_id', String(filteredEmployeeIds[0]))
    }
    const url = `/api/movement-request?${params.toString()}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        let result: MovementRequest[] = data.data || []
        if (filteredEmployeeIds.length > 1) {
          result = result.filter(r => filteredEmployeeIds.includes(r.employee_id))
        }
        if (selectedType) {
          result = result.filter(r => r.movement_type === selectedType)
        }
        setRequests(result)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filteredEmployeeIds, selectedType])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 24 }}>Roster Dashboard</h1>

      <section style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Department</label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Movement Type</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">All Types</option>
            {movementTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>View Date</label>
          <input
            type="date"
            value={currentViewDate}
            onChange={e => setCurrentViewDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, minHeight: '60vh' }}>
        <section style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Pending Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p style={{ color: '#888' }}>No pending requests</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {requests.map(r => (
                <li key={r.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <div><strong>Employee #{r.employee_id}</strong></div>
                  <div style={{ fontSize: 14, color: '#666' }}>{r.movement_type}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{r.start_date} &rarr; {r.end_date}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Roster Grid</h2>
          <div style={{
            border: '2px dashed #ccc',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            color: '#aaa',
            fontSize: 16,
          }}>
            Roster grid placeholder
          </div>
        </section>
      </div>
    </main>
  )
}

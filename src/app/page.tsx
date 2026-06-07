 'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import RosterGrid from '../components/RosterGrid'
import RequestModal from '../components/RequestModal'

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
  const [activeRequest, setActiveRequest] = useState<any | null>(null)
  const [rosterAnchors, setRosterAnchors] = useState<Record<number, string>>({})
  const [approvedRequestsMap, setApprovedRequestsMap] = useState<Record<string, { startDate: Date; endDate: Date }[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.data || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetch('/api/roster-anchor')
      .then(res => res.json())
      .then(data => {
        const map: Record<number, string> = {}
        ;(data.data || []).forEach((r: any) => {
          if (r.employee_id && r.anchor_date) map[Number(r.employee_id)] = r.anchor_date
        })
        setRosterAnchors(map)
      })
      .catch(console.error)
  }, [])

  const departments = Array.from(new Set(employees.map(e => e.department))).sort()
  const movementTypes = ['Change Swing', 'Request Leave', 'Temporary Swap']

  const filteredEmployeeIds = useMemo(() => {
    return selectedDepartment
      ? employees.filter(e => e.department === selectedDepartment).map(e => e.id)
      : []
  }, [selectedDepartment, employees])

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

  const fetchApprovedRequests = useCallback(() => {
    fetch('/api/movement-request?status=Approved')
      .then(res => res.json())
      .then(data => {
        const rows: any[] = data.data || []
        const map: Record<string, { startDate: Date; endDate: Date }[]> = {}
        rows.forEach(r => {
          if (!r.employee_id || !r.start_date || !r.end_date) return
          const key = String(r.employee_id)
          if (!map[key]) map[key] = []
          map[key].push({ startDate: new Date(r.start_date), endDate: new Date(r.end_date) })
        })
        setApprovedRequestsMap(map)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    fetchApprovedRequests()
  }, [fetchApprovedRequests])

  const employeesFiltered = selectedDepartment ? employees.filter(e => e.department === selectedDepartment) : employees

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
                  <button onClick={async () => {
                    try {
                      const res = await fetch(`/api/movement-request/${r.id}`)
                      if (!res.ok) throw new Error('fetch failed')
                      const data = await res.json()
                      setActiveRequest(data.data)
                    } catch (err) {
                      console.error(err)
                    }
                  }} style={{ all: 'unset', cursor: 'pointer' }}>
                    <div><strong>Employee #{r.employee_id}</strong></div>
                    <div style={{ fontSize: 14, color: '#666' }}>{r.movement_type}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{r.start_date} &rarr; {r.end_date}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 18 }}>Roster Grid</h2>
          <div>
            <RosterGrid
              employeesList={employeesFiltered.map(e => ({ id: String(e.id), name: e.name, anchorDate: new Date(rosterAnchors[e.id] || '2026-01-01') }))}
              currentViewDate={new Date(currentViewDate)}
              approvedRequests={Object.fromEntries(Object.entries(approvedRequestsMap).filter(([k]) => employeesFiltered.some(emp => String(emp.id) === k)))}
            />
          </div>
        </section>
      </div>
      <RequestModal
        request={activeRequest}
        onClose={() => setActiveRequest(null)}
        onSuccess={() => { fetchRequests(); fetchApprovedRequests() }}
      />
    </main>
  )
}

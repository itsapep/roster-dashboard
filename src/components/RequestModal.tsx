import React, { useState } from 'react'

type StatusHistoryItem = { id: number; status: string; comment: string | null; changed_by: string }

type Props = {
  request: any | null
  onClose: () => void
  onSuccess: () => void
}

export default function RequestModal({ request, onClose, onSuccess }: Props) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  if (!request) return null

  const disabled = comment.trim().length === 0

  async function submit(action: 'Approved' | 'Rejected') {
    setError('')
    try {
      const res = await fetch('/api/movement-request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request.id, status: action, current_comment: comment, comment }),
      })
      if (!res.ok) throw new Error('request failed')
      onSuccess()
      setComment('')
      onClose()
    } catch (err) {
      setError('Failed to update request. Please try again.')
    }
  }

  const history: StatusHistoryItem[] = request.status_history || []

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 720, background: '#fff', borderRadius: 8, padding: 16 }}>
        <header style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{`Employee #${request.employee_id}`}</h3>
          <div style={{ fontSize: 13, color: '#555' }}>{request.movement_type} — {request.start_date} → {request.end_date}</div>
        </header>

        <section style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Admin Comment</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} />
        </section>

        {error ? <div style={{ color: '#c32', marginBottom: 8 }}>{error}</div> : null}

        <section style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button disabled={disabled} onClick={() => submit('Approved')} style={{ flex: 1, padding: '8px 12px', background: '#0b8457', color: '#fff', border: 'none', borderRadius: 4 }}>Approve</button>
          <button disabled={disabled} onClick={() => submit('Rejected')} style={{ flex: 1, padding: '8px 12px', background: '#c32', color: '#fff', border: 'none', borderRadius: 4 }}>Reject</button>
          <button onClick={onClose} style={{ padding: '8px 12px' }}>Close</button>
        </section>

        <section>
          <h4 style={{ margin: '8px 0' }}>Audit Trail</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history.map(h => (
              <li key={h.id} style={{ padding: '8px 0', borderTop: '1px solid #eee' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{h.status} by {h.changed_by}</div>
                {h.comment ? <div style={{ fontSize: 13, color: '#444' }}>{h.comment}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

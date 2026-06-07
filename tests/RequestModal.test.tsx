import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RequestModal from '../src/components/RequestModal'

// mock fetch globally
const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
  ;(global as any).vi?.resetAllMocks?.()
})

test('RequestModal submits approve and calls onSuccess/onClose', async () => {
  const req = { id: 10, employee_id: 1, movement_type: 'Request Leave', start_date: '2026-06-10', end_date: '2026-06-12', status: 'Pending', status_history: [] }

  const onClose = (global as any).vi.fn()
  const onSuccess = (global as any).vi.fn()

  global.fetch = (global as any).vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ data: {} }) })

  render(<RequestModal request={req} onClose={onClose} onSuccess={onSuccess} />)

  // ensure modal header present
  expect(screen.getByText(/Employee #1/i)).toBeInTheDocument()

  // enter comment
  const textarea = screen.getByRole('textbox')
  fireEvent.change(textarea, { target: { value: 'Looks good' } })

  // click approve
  const approve = screen.getByText(/Approve/i)
  fireEvent.click(approve)

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})

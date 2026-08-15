'use client'
import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
export function DraftButton({
  type,
  topic,
}: {
  type: 'faq' | 'knowledge' | 'synonym'
  topic: string
}) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  async function create() {
    setBusy(true)
    setStatus('Creating…')
    try {
      const response = await fetch('/api/admin/content-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic }),
      })
      const data = (await response.json()) as {
        draftId?: string
        error?: string
      }
      setStatus(
        data.draftId
          ? 'Draft created — review it in Studio'
          : data.error || 'Draft could not be created. Try again.',
      )
    } catch {
      setStatus(
        'Draft could not be created. Check the connection and try again.',
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <button onClick={create} disabled={busy}>
        <FilePlus2 aria-hidden="true" />
        {busy ? 'Creating…' : `Create ${type} draft`}
      </button>
      {status && (
        <small role="status" aria-live="polite">
          {status}
        </small>
      )}
    </div>
  )
}

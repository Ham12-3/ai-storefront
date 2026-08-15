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
  async function create() {
    setStatus('Creating…')
    const response = await fetch('/api/admin/content-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, topic }),
    })
    const data = (await response.json()) as { draftId?: string; error?: string }
    setStatus(
      data.draftId
        ? 'Draft created — review in Studio'
        : data.error || 'Could not create draft',
    )
  }
  return (
    <div>
      <button onClick={create}>
        <FilePlus2 /> Create {type} draft
      </button>
      {status && <small role="status">{status}</small>}
    </div>
  )
}

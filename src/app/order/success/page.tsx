import { CheckCircle2 } from 'lucide-react'
export default function OrderSuccessPage() {
  return (
    <main className="status-page">
      <span>
        <CheckCircle2 />
      </span>
      <p className="eyebrow">Payment received</p>
      <h1>
        Your order is
        <br />
        being prepared.
      </h1>
      <p>
        We confirm payment only after a verified Stripe webhook. A receipt and
        delivery details will follow by email.
      </p>
    </main>
  )
}

import Link from 'next/link'
import { CheckCircle2, Settings } from 'lucide-react'
export default function DemoCheckoutPage() {
  return (
    <main className="status-page">
      <span>
        <CheckCircle2 />
      </span>
      <p className="eyebrow">Checkout integration ready</p>
      <h1>
        Demo mode stops
        <br />
        before payment.
      </h1>
      <p>
        The server validated current product prices and stock. Add Stripe
        credentials to open a real Checkout Session; this page never pretends
        that payment succeeded.
      </p>
      <div>
        <Link className="primary-cta" href="/basket">
          Return to basket
        </Link>
        <Link className="text-cta" href="/studio">
          <Settings /> Open Studio setup
        </Link>
      </div>
    </main>
  )
}

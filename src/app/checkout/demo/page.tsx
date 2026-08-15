import Link from 'next/link'
export default function DemoCheckoutPage() {
  return (
    <main className="status-page">
      <p className="eyebrow">Checkout integration ready</p>
      <h1>Demo mode stops before payment</h1>
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
          Open Studio setup
        </Link>
      </div>
    </main>
  )
}

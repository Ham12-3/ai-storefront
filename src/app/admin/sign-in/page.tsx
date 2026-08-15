import { signIn } from '@/auth'
export default function SignInPage() {
  return (
    <main className="admin-signin">
      <p className="eyebrow">Restricted area</p>
      <h1>Store intelligence.</h1>
      <p>
        Sign in with an allow-listed Google account to view commerce and
        customer-insight reports.
      </p>
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/admin/analytics' })
        }}
      >
        <button className="primary-cta" type="submit">
          Continue with Google
        </button>
      </form>
    </main>
  )
}

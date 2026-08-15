import { env, emailList } from '@/lib/env'

export type AnalyticsRole = 'ADMIN' | 'ANALYST' | 'EDITOR'
export type AnalyticsUser = {
  email: string
  name: string
  role: AnalyticsRole
  demo: boolean
}

export function roleForEmail(email: string): AnalyticsRole | null {
  const normalised = email.toLowerCase()
  if (emailList(env.ADMIN_EMAILS).includes(normalised)) return 'ADMIN'
  if (emailList(env.ANALYST_EMAILS).includes(normalised)) return 'ANALYST'
  if (emailList(env.EDITOR_EMAILS).includes(normalised)) return 'EDITOR'
  return null
}

export function hasPermission(
  role: AnalyticsRole,
  action:
    | 'view'
    | 'export'
    | 'view_conversation'
    | 'correct_sentiment'
    | 'create_draft',
) {
  const permissions: Record<AnalyticsRole, string[]> = {
    ADMIN: [
      'view',
      'export',
      'view_conversation',
      'correct_sentiment',
      'create_draft',
    ],
    ANALYST: ['view', 'export', 'view_conversation'],
    EDITOR: ['view', 'create_draft'],
  }
  return permissions[role].includes(action)
}

export async function requireAnalyticsUser(
  action: Parameters<typeof hasPermission>[1] = 'view',
): Promise<AnalyticsUser> {
  // Local preview remains safe because it serves fictional aggregates only.
  // A deployed production host must always configure Auth.js.
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const localPreview =
    !env.AUTH_GOOGLE_ID &&
    (configuredSiteUrl.includes('localhost') ||
      configuredSiteUrl.includes('127.0.0.1'))
  if (localPreview)
    return {
      email: 'preview@local.invalid',
      name: 'Analytics preview',
      role: 'ADMIN',
      demo: true,
    }
  const { auth } = await import('@/auth')
  const session = await auth()
  const email = session?.user?.email
  const role = email ? roleForEmail(email) : null
  if (!email || !role || !hasPermission(role, action))
    throw new Error('FORBIDDEN')
  return { email, name: session.user?.name || email, role, demo: false }
}

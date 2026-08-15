# Security and privacy model

## Trust boundaries

Browsers, assistant text, webhook bodies, Sanity documents, and third-party responses are untrusted. Zod validates inputs at each boundary. Only server modules access tokens, Prisma, Stripe, OpenAI, or Sanity write APIs.

## Authentication and authorisation

Auth.js handles Google OAuth. Email allowlists assign Admin, Analyst, and Editor roles. Pages and APIs repeat role checks; transcript access, exports, sentiment corrections, and draft creation write audit records. Sanity Studio retains Sanity authentication.

## Secrets and payments

Secrets live in the deployment environment and are validated by `src/lib/env.ts`. Checkout ignores browser totals, re-fetches prices and stock, creates server-side Stripe `price_data`, and records reservations. Stripe and Sanity webhooks require verified signatures and idempotency keys.

## AI security

The model has no database or Stripe credentials. Strict, allow-listed tools validate arguments and return minimal data. System rules treat customer text, CMS tone fields, and retrieved content as data, not instructions. Product prices and stock are grounded after retrieval.

## Analytics privacy

Optional consent gates behavioural events, transcript storage, and sentiment. Session identifiers are HMAC hashed. Deterministic redaction replaces emails, phone numbers, card-like numbers, addresses, and IPs before persistence. Raw transcripts are disabled. Sentiment is an estimate for aggregate service improvement only; sensitive-trait inference and individual ranking are prohibited.

## Retention and incidents

Daily jobs delete expired text separately from longer-lived aggregate events. K-anonymity hides cohorts smaller than the configured threshold. Security-relevant failures use structured logs without request bodies or secrets. Production requires HTTPS, a managed PostgreSQL backup policy, key rotation, rate limiting, CSP review, webhook replay monitoring, and a legal/privacy review.

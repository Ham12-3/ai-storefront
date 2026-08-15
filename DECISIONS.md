# Architecture decisions

## 001 — Production adapters with demo fallbacks

The app runs without credentials using a fixed fictional catalogue and aggregated demo metrics. Configured deployments use Sanity, PostgreSQL, OpenAI, Stripe, and Auth.js adapters. Demo mode is visibly labelled and never simulates a completed payment.

## 002 — Source-of-truth split

Sanity owns content and price authoring. PostgreSQL owns mutable operational state and immutable analytics events. Checkout resolves both sources again in one server-side pricing workflow.

## 003 — Semantic provider boundary

`SemanticSearchProvider` exposes discovery IDs only. The Sanity Dataset Embeddings implementation returns identifiers; the catalogue service always performs a fresh non-CDN read and joins stock. Keyword search is the automatic fallback.

## 004 — Privacy-first analytics

Essential cart/order events are separate from optional behavioural analytics. Session IDs are HMAC hashed. Raw transcripts are off; redacted storage is opt-in. Low-confidence sentiment becomes `uncertain`; k-anonymity suppresses small groups.

## 005 — Visual direction

Form & Function is a contemporary workspace/lifestyle shop. Ink, mineral blue, mist, paper white, and signal orange evoke technical drawings and durable objects. The horizontal “workbench” product strip is the signature element; the rest of the UI stays calm and exact.

## 006 — Authentication roles

Auth.js with Google OAuth is the production entry point. Email allowlists map to `ADMIN`, `ANALYST`, and `EDITOR`; server guards enforce permissions. A development-only preview is available when OAuth is not configured and never activates in production.

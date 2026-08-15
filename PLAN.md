# Implementation plan

1. Establish architecture, project rules, environment validation, and local infrastructure.
2. Model Sanity content and PostgreSQL operational/analytics data.
3. Build the responsive storefront, catalogue search, product, basket, and checkout flows.
4. Add hybrid retrieval and a grounded, tool-controlled shopping assistant.
5. Add privacy-aware event collection, sentiment processing, retention, and reporting.
6. Protect and build analytics, export, auditing, and human-reviewed content suggestions.
7. Seed fictional data, test service boundaries, and validate the production build.

Each external service has an explicit adapter and a safe local demo fallback. Production mode never trusts client prices, basket totals, assistant output, or unverified webhooks.

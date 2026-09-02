# Architecture & Decision Log (Verified Stack Coding)

This document records the architectural decisions, security controls, and stack-specific considerations applied to the codebase according to the **Verified Stack Coding** specification.

---

### Decision 1: Singleton Web Audio Engine (`app/lib/sound.ts`)
- **Choice**: Implemented a lazy-resumed singleton `SoundEngine` with programmatic Web Audio oscillator/gain synthesis.
- **Alternative**: Instantiating `new AudioContext()` or `new Audio()` ad-hoc per sound effect.
- **Why**: Web Audio API specification and browser implementations (Chrome/Firefox/Safari) enforce a strict limit of 6 to 32 concurrent `AudioContext` instances. Creating contexts per event (e.g. Pinball bumper collisions, MSN messaging) triggers rapid memory leaks and silences all future audio.
- **Breaking Assumption**: If Web Audio API security policies change regarding initial autoplay gesture requirements, ensure user-click resume listeners continue to wake the shared context.

---

### Decision 2: Environment-Only Database Credentials with Graceful Fallback (`app/lib/db.ts`)
- **Choice**: Require `process.env.DATABASE_URL` exclusively, coupled with `.gitignore` protection of `.env*` files and graceful local mock fallback across all API routes.
- **Alternative**: Leaving plaintext database credentials in the code or hardcoded fallbacks in `db.ts` / `scripts`.
- **Why**: Plaintext credentials committed to version control violate security baselines. When running locally without Neon credentials or offline, the app seamlessly provides responsive fallback data rather than crashing serverless routes.
- **Breaking Assumption**: If migrating from Neon serverless to a standard pooled connection (e.g. pg / Prisma), update the driver instantiation in `app/lib/db.ts`.

---

### Decision 3: Next.js 15 Canonical Configuration & ESLint 9 FlatCompat
- **Choice**: Retained `next.config.ts` as the single canonical configuration file (removing duplicate `next.config.mjs`) and configured `eslint.config.mjs` using `@eslint/eslintrc` FlatCompat.
- **Alternative**: Co-existing `.mjs` and `.ts` configs with unconfigured ESLint scripts.
- **Why**: Next.js 15 natively supports TypeScript configuration. Dual configuration files cause build ambiguity. ESLint 9 requires FlatCompat to load legacy `next/core-web-vitals` rules smoothly.
- **Breaking Assumption**: When `eslint-config-next` ships native ESLint 9 flat config exports in a future major release, FlatCompat wrapper can be simplified.

---

### Decision 4: Cryptographically Secure UUIDs & Payload Bounds in API Handlers
- **Choice**: Standard `crypto.randomUUID()` for document & message IDs; strict length bounds (100–5000 chars) and regex validation on contact & MSN routes.
- **Alternative**: `Math.random().toString(36)` timestamp pseudo-IDs and unbounded payload acceptance.
- **Why**: Node.js `crypto.randomUUID()` guarantees RFC 4122 collision-free IDs across distributed serverless invocations. Input bounds protect database storage and memory from oversized payloads.

---
name: verified-stack-coding
description: Use this skill for ANY interaction with an existing codebase, not just requests to write new code. This includes vague or diagnostic complaints like "my app is slow", "can you check my code", "something's wrong with my app", "review this repo", "why is this crashing", "can you look at my project", as well as direct requests to write/add/modify code (features, endpoints, auth, DB queries, dependencies). Trigger this automatically and immediately at the start of the task — don't wait for the user to ask for "best practice", "secure", or "performance" analysis explicitly; a vague complaint is the trigger, not a reason to ask clarifying questions first. The skill detects the actual tech stack and versions in use, searches for current best-practice, security, and performance guidance specific to that exact stack (not just pattern-matched from training data, which goes stale and misses stack-specific footguns and regressions), and produces findings or code grounded in that research instead of guesswork. Skip only for throwaway scripts, pure math/logic questions with no codebase involved, or code explicitly marked as a prototype/experiment.
---

# Verified Stack Coding

## Why this exists

Left alone, a coding model does three things that cause real damage:
1. It writes or evaluates code by pattern-matching against training data — which may be outdated, deprecated, or insecure/slow for the *specific* library version actually in use.
2. Given a vague complaint ("my app is slow"), it guesses at likely causes instead of actually inspecting the code and checking what's known about that stack's real-world failure modes.
3. It never records *why* it concluded something, so the next debugging session starts from zero.

This skill closes all three: always inspect the real project first, always verify against current external sources before diagnosing or writing, and always leave a trail.

## Two entry points — figure out which one applies first

**A. Diagnostic / vague request** — "my app is slow", "check my code", "something's broken", "review my repo", "why does X happen", "is my code okay". Go to **Workflow A: Analyze** below. Do NOT ask the user to narrow the request first (e.g. "which part is slow?") — start by actually looking at the code; you can often answer or narrow it yourself faster than they can.

**B. Direct build/change request** — "add a login endpoint", "write a function to upload files", "fix this bug", "implement X". Go to **Workflow B: Build** below.

If unclear which applies, default to Workflow A first (it includes inspecting the code), which naturally leads into Workflow B if the fix requires writing code.

## Workflow A: Analyze (for vague/diagnostic requests)

### A1. Actually look at the codebase before theorizing

Don't answer from general knowledge about "common causes of slow apps." Inspect what's really there:
- List the project structure, identify the language(s)/framework(s), and read the manifest/lock files (see step 1 below for detection details).
- For performance complaints: look for the actual hot paths — DB queries in loops, missing indexes/caching, unbounded payloads, synchronous calls that should be async, bundle size / unoptimized assets, render-blocking patterns — depending on what kind of app it is.
- For "check my code" / "review this": scan for the risk categories in `references/risk-checklist.md`, and note anything that deviates from the stack's current conventions.
- For crashes/bugs: read the actual error path, stack trace, or relevant code, not just the symptom described.
- Use available tools (bash/grep/read files, or the user's pasted code/logs) — don't ask the user to paste things you can already inspect yourself.

### A2. Verify suspicions against current sources before reporting them

Once you have 1-4 candidate causes from A1, don't report them as fact yet. For each one, quickly search to confirm:
- Is this a known issue/regression/footgun for this exact library version? (check changelogs, GitHub issues, official docs)
- Is there a current recommended fix, and has it changed recently (e.g. a new API replacing the old slow one)?
- If it's a security concern found incidentally, check for a known CVE.

This step is what separates a real diagnosis from a plausible-sounding guess — skip it and you're just pattern-matching, which is the exact failure mode this skill exists to avoid.

### A3. Report findings

State what you found, ranked by confidence/impact, each with: what's wrong, why (with the source briefly noted), and the fix. If a fix requires writing/changing code, continue into Workflow B for that part rather than just describing it in prose.

## Workflow B: Build (for direct code-writing requests)

Follow these steps in order. Don't skip the research step because the task "seems simple" — that's exactly when stale defaults slip in.

### 1. Detect the real stack

Don't assume — inspect the project:
- Read manifest/lock files relevant to the language: `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`/`build.gradle`, `composer.json`.
- Note **exact or pinned versions**, not just framework names — best practice for Express 4 differs from Express 5; Django 4 differs from Django 5; React with the old Context API differs from React 19.
- Check for existing config that signals conventions already in place: linters, `tsconfig.json`, ORM config, existing auth middleware, existing error-handling patterns.
- If no manifest exists yet (greenfield project), the "stack" is whatever the user just told you — treat their most recent framework/library choice as authoritative for the search step.

### 2. Identify what's actually risky or non-obvious about this task

Before searching, name the 1–4 things in this specific task that are easy to get wrong. Use `references/risk-checklist.md` to jog this — it's organized by task type (auth, file handling, DB queries, API endpoints, deployment/config, dependency changes). Most tasks only trip 1–2 categories; don't force all of them.

If nothing on the checklist applies and the task is genuinely low-risk (e.g. a pure utility function with no I/O, no user input, no secrets), you can skip straight to step 4 — say so briefly rather than running the workflow ceremonially.

### 3. Search before writing — don't pattern-match from memory

For each risk identified in step 2, run targeted searches instead of relying on recalled patterns. Recalled patterns are exactly how stale/insecure defaults get shipped.

Search for, in this priority order:
1. **The current recommended approach** for this exact library + version + task (e.g. "FastAPI 0.115 dependency injection auth pattern", not "how to do auth in Python").
2. **Known CVEs / advisories** for the specific package + version being used or added (check the package's GitHub security advisories, npm/PyPI advisory pages, or a general CVE search).
3. **The official docs' current guidance** — official docs move faster than blog posts and are less likely to show a deprecated pattern.
4. If a new dependency is being introduced, check it isn't abandoned (last release date, open critical issues) before using it.

Keep searches specific and scoped — 2 to 5 searches per task is typical, more only if the task spans multiple risk categories from step 2. This is not a research report; it's quick verification before writing.

### 4. Write the code

Apply what you found. When the search surfaced a clear current best practice, follow it over any conflicting instinct from training data. When sources disagree, prefer: official docs > maintainer statements > recent (last 6–12 months) high-quality posts > older general knowledge.

Match the project's existing conventions (naming, error handling, folder structure) discovered in step 1 — a secure pattern that's inconsistent with the rest of the codebase creates its own maintenance risk.

### 5. Leave a decision trail

For any choice that wasn't obvious — a library picked over an alternative, a security control added, a pattern that deviates from what a naive prompt-to-code pass would produce — add a short inline comment or a `DECISIONS.md` entry (template in `references/decision-log-template.md`) covering:
- What was chosen and what the alternative was
- Why (tie back to what step 3 found — cite the source briefly, e.g. "per FastAPI docs, OAuth2PasswordBearer")
- What would break if this assumption changes (e.g. "if this dependency major-version-bumps, revisit — breaking auth changes in v2")

This is what makes future debugging fast: instead of re-deriving intent from scratch, the next session (human or AI) can query *why* something exists instead of just *what* it does. Keep entries to 1–3 sentences each — this is a trail, not documentation.

### 6. Quick self-check before handing off

Before presenting the code, verify:
- [ ] Did I use the actual detected version, not a generic/latest-assumed version?
- [ ] Did I check for known vulnerabilities in any new/updated dependency?
- [ ] Does this match existing project conventions rather than introducing a new pattern?
- [ ] Is there a decision trail for anything non-obvious?
- [ ] Would a security-conscious reviewer flag anything here (hardcoded secrets, missing input validation, missing auth checks, overly broad permissions)?

If any box fails, fix it or flag it explicitly to the user rather than shipping it silently.

## What NOT to do

- Don't ask clarifying questions before inspecting the code when the request is vague — look first, ask only if still genuinely stuck after A1/A2.
- Don't turn this into a research essay before every function — scale effort to actual risk (step 2 exists to gate this).
- Don't cite sources with heavy quoting — paraphrase findings, same as any other research task.
- Don't silently downgrade a security-relevant recommendation because it's more work to implement — flag the tradeoff to the user instead of deciding alone.
- Don't skip stack detection even when the request sounds generic ("add a login page", "my app is slow") — the right answer depends entirely on what's already there.
- Don't report a diagnosis (Workflow A) without having done A2's verification step — a confident-sounding unverified guess is exactly the failure mode this skill prevents.
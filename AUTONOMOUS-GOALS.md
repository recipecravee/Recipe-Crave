# Autonomous /goal Conditions — RecipeCrave

> Setup guide so RecipeCrave finishes itself across long autonomous Claude Code runs.
> Source pattern: SF #119 "/goal operator pack" (Anthropic /goal, Claude Code ≥ 2.1.139).

## Prerequisites (one-time, ~3 min)

1. **Upgrade Claude Code CLI**
   ```powershell
   npm install -g @anthropic-ai/claude-code@latest
   claude --version    # expect 2.1.139 or higher
   ```
   (Already done in this machine — 2.1.143.)

2. **Push the 12 unpushed commits** before starting any /goal run, so the agent always works on a clean tree.
   ```powershell
   cd "F:/MY OWN APP RECEIP CRAVE/recipecrave"
   git push origin main
   ```
   If push 403s: open https://github.com/settings/tokens → ensure the `repo` scope is granted, then re-push. The fastest fix is `gh auth login` and re-auth as `recipecravee`.

3. **Open a fresh terminal in the repo root** and start a new Claude Code session:
   ```powershell
   cd "F:/MY OWN APP RECEIP CRAVE/recipecrave"
   claude
   ```

## How to run a /goal

In the new session, paste any block from below verbatim (it starts with `/goal …`). Claude prints `goal active HH:MM:SS` in the indicator. Walk away. The goal clears automatically when the condition verifies, or stops at the turn cap.

To abort early: `/goal clear`.

---

## Goal 1 — Wire ApprovedVariations onto /quick combo pages

Closes a known TODO. Verifiable, bounded, low risk.

```
/goal The component src/components/recipe/ApprovedVariations.tsx renders inside src/app/quick/[combo]/page.tsx for every matched recipe, npx tsc --noEmit exits 0, and no file outside src/app/quick/[combo]/page.tsx is modified except for one optional import line. Every 10 turns, restate the goal in your own words, list what's done, list what's blocking, and confirm you're still on the original problem. If you've drifted, stop and ask before continuing. Stop after 20 turns.
```

**Why it works:** "renders inside" is provable by Claude reading the modified file back and grepping for the import + JSX usage. `tsc --noEmit` is a transcript-verifiable check.

---

## Goal 2 — Add Twitter cards on the per-slug cuisine + diet + collection detail pages

Index pages already have OG+twitter. Detail pages don't.

```
/goal Every dynamic page under src/app/cuisine/[slug]/page.tsx, src/app/diet/[slug]/page.tsx, src/app/collections/[slug]/page.tsx exports generateMetadata that sets both openGraph.images and twitter.images (card: summary_large_image) to a /api/og branded URL with the page's title and description. npx tsc --noEmit exits 0. No other files are modified. Every 10 turns, restate the goal, list what's done, list what's blocking, and confirm you're still on track. Stop after 25 turns.
```

**Why it works:** "exports generateMetadata that sets both" is provable by reading each file. `tsc --noEmit` proves no type regressions. Scope is locked to 3 file paths.

---

## Goal 3 — Recipe intro depth backfill (50 recipes)

The auto-generated intros are short. Backfill hand-written 80-160 word intros for the 50 highest-traffic recipes.

```
/goal At least 50 recipes in src/content/recipecrave-recipes.ts have a description field with 400-1200 characters (hand-written, not boilerplate), every recipe still has all required fields, npx tsc --noEmit exits 0, and the total recipe count in the file is unchanged. Every 10 turns, restate the goal, list what's done so far (with the slugs of recipes you've upgraded), list what's blocking, and confirm you're still on the original problem. Skip recipes whose existing description is already 400+ characters. Stop after 40 turns.
```

**Why it works:** "≥ 50 with description 400-1200 chars" is grep-and-count provable from Claude's output. Recipe-count check prevents accidental deletion. Skipping already-long descriptions stops drift.

---

## Goal 4 — Admin dashboard a11y + Lighthouse pass

Make sure the admin dashboard is keyboard-navigable and clean against axe rules.

```
/goal Every interactive element on src/app/admin/dashboard/page.tsx and src/app/admin/dashboard/PushTestButton.tsx has either an explicit aria-label or visible text, all buttons have type="button", and npx tsc --noEmit exits 0. Confirm by reading each modified file back and listing the interactive elements with their accessible name. Don't modify the visual layout. Don't change any other file. Every 10 turns, restate the goal and confirm you're on track. Stop after 15 turns.
```

---

## Goal 5 — Image bank duplicate audit

The image bank had 17 duplicate Unsplash IDs in an earlier pass. Sweep again.

```
/goal No Unsplash image ID in src/content/image-bank.ts appears more than once across distinct recipe slugs in src/content/recipecrave-recipes.ts. Provide a count of duplicates found, the slug pairs they appeared in, and the replacement IDs you picked. npx tsc --noEmit exits 0. No other file modified. Every 10 turns, restate the goal and list what's done. Stop after 25 turns.
```

---

## The drift checkpoint paragraph (paste into ANY new goal)

> Every 10 turns, restate the original goal in your own words, list what's been completed, list what's blocking, and confirm you're still solving the original problem. If you've drifted, stop and ask before continuing.

## The 4 condition mistakes to avoid

| Mistake | Fix |
|---|---|
| Vague success ("cleaner code") | Rewrite to "`tsc --noEmit` exits 0 and no file exceeds 400 lines" |
| Missing constraints | Add "and no file outside `src/X` is modified" |
| No turn / time bound | Add "stop after N turns" |
| Unverifiable from transcript ("better UX") | Pick something measurable in Claude's own output |

## Recommended order

1. **Goal 1** first — fastest, validates the /goal mechanic on this repo.
2. **Goal 2** second — same shape, slightly broader.
3. **Goal 5** third — content audit, no logic risk.
4. **Goal 4** fourth — a11y polish.
5. **Goal 3** last (longest, ~40 turns × ~$1 = ~$40 expected).

Run them sequentially, not in parallel. Only one /goal can be active per Claude Code session at a time.

## After every /goal finishes

```powershell
git status            # confirm what changed
git diff              # eyeball the diff
git add -A && git commit -m "<scope>: <what>"
git push
```

If a goal drifted or got stuck:
```
/goal clear
```
Then tighten the constraint paragraph and re-issue.

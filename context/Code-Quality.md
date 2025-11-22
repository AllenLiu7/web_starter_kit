# Code Quality Guide

## Overview

This starter kit includes automated code quality tools to ensure consistent formatting, catch errors early, and maintain high code standards.

---

## Tools

- **Prettier**: Automatic code formatting
- **ESLint**: JavaScript/TypeScript linting
- **Husky**: Git hooks automation
- **lint-staged**: Run linters on staged files only

---

## Quick Start

### Format All Files

```bash
npm run format              # Format all files
npm run format:check        # Check formatting without changing files
```

### Lint Code

```bash
npm run lint                # Check for linting errors
npm run lint:fix            # Auto-fix linting errors
```

### Manual Pre-commit Check

```bash
npx lint-staged             # Run what pre-commit hook runs
```

---

## Prettier Configuration

### Settings (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Key Features

- **No semicolons** (`semi: false`)
- **Single quotes** for strings
- **2-space indentation**
- **100-character line width**
- **Tailwind CSS class sorting** via `prettier-plugin-tailwindcss`

### Ignored Files (`.prettierignore`)

Prettier skips:

- `node_modules/`
- `.next/`, `dist/`, `build/`
- `coverage/`
- `public/`
- Environment files (`.env*`)

---

## ESLint Configuration

### Rules Overview

The project uses industry-standard ESLint rules **optimized to catch AI-generated code errors**. Rules are organized into categories, with critical bug-prevention rules set to `error` level:

#### 1. **TypeScript Best Practices**

| Rule                                               | Level | Why                                                          |
| -------------------------------------------------- | ----- | ------------------------------------------------------------ |
| `@typescript-eslint/no-unused-vars`                | warn  | Catches unused variables (allows `_` prefix for intentional) |
| `@typescript-eslint/no-explicit-any`               | warn  | Encourages proper typing over `any`                          |
| `@typescript-eslint/no-non-null-assertion`         | warn  | Warns about `!` operator (potential null errors)             |
| `@typescript-eslint/no-unnecessary-type-assertion` | warn  | Removes redundant type assertions                            |
| `@typescript-eslint/prefer-nullish-coalescing`     | warn  | Use `??` instead of `\|\|` for null checks                   |
| `@typescript-eslint/prefer-optional-chain`         | warn  | Use `?.` instead of manual null checks                       |

**Example:**

```typescript
// ❌ Warns
const user: any = getUser()
const id = user!.id
const name = user.name || 'Guest' // Should use ?? for null/undefined
const email = user && user.profile && user.profile.email

// ✅ Better
const user: User = getUser()
const id = user?.id
const name = user.name ?? 'Guest'
const email = user?.profile?.email
```

#### 2. **Async/Promise Safety** ⚠️ Critical for AI Code

AI often forgets `await` or misuses promises. These rules prevent runtime errors:

| Rule                                        | Level     | Why                                                   |
| ------------------------------------------- | --------- | ----------------------------------------------------- |
| `@typescript-eslint/no-floating-promises`   | **error** | AI forgets `await` - causes silent failures           |
| `@typescript-eslint/no-misused-promises`    | **error** | Async functions in wrong places (conditions, forEach) |
| `@typescript-eslint/await-thenable`         | **error** | Prevents `await` on non-promises                      |
| `@typescript-eslint/return-await`           | **error** | Must await promises in try-catch blocks               |
| `@typescript-eslint/require-await`          | warn      | Flags unnecessary `async` keywords                    |
| `@typescript-eslint/promise-function-async` | warn      | Functions returning promises should be `async`        |

**Example:**

```typescript
// ❌ ERROR - Floating promise (forgot await)
async function saveUser() {
  saveToDatabase(user) // ← No await! Silent failure
  sendEmail(user.email) // ← Executes before save completes
}

// ❌ ERROR - Async in forEach (doesn't wait)
users.forEach(async user => {
  await saveUser(user) // forEach doesn't await!
})

// ❌ ERROR - Promise in condition
if (asyncCheck()) {
  // Should await this
  doSomething()
}

// ❌ ERROR - Return promise in try-catch (error escapes!)
try {
  return fetchData() // Promise rejection not caught
} catch (err) {
  handleError(err) // Never called for fetchData errors
}

// ✅ Fixed
async function saveUser() {
  await saveToDatabase(user)
  await sendEmail(user.email)
}

// ✅ Use for...of instead of forEach
for (const user of users) {
  await saveUser(user)
}

// ✅ Await in condition
if (await asyncCheck()) {
  doSomething()
}

// ✅ Await promise in try-catch
try {
  return await fetchData() // Now catches errors
} catch (err) {
  handleError(err) // Called for fetchData errors
}
```

#### 3. **React & Hooks**

| Rule                          | Level     | Why                                              |
| ----------------------------- | --------- | ------------------------------------------------ |
| `react-hooks/rules-of-hooks`  | **error** | Ensures hooks are called correctly               |
| `react-hooks/exhaustive-deps` | warn      | Catches missing deps (industry standard level)   |
| `react/jsx-key`               | **error** | AI forgets keys in lists - causes rendering bugs |
| `react/no-array-index-key`    | warn      | Using array index as key causes issues           |
| `react/self-closing-comp`     | warn      | Empty components should self-close               |

**Example:**

```typescript
// ❌ WARN - missing dependency (causes stale closure)
useEffect(() => {
  fetchData(userId) // userId not in deps!
}, [])

// ❌ ERROR - missing key in list
{users.map(user => <UserCard user={user} />)}

// ❌ Warn - using index as key
{users.map((user, i) => <UserCard key={i} user={user} />)}

// ✅ Fixed
useEffect(() => {
  fetchData(userId)
}, [userId])

{users.map(user => <UserCard key={user.id} user={user} />)}
```

#### 4. **Import Organization**

| Rule                   | Level | Why                                 |
| ---------------------- | ----- | ----------------------------------- |
| `import/order`         | warn  | Enforces consistent import ordering |
| `import/no-duplicates` | warn  | Prevents duplicate imports          |

**Import order enforced:**

1. Node built-ins (`fs`, `path`)
2. External packages (`react`, `next`)
3. Internal aliases (`@/components`)
4. Parent imports (`../utils`)
5. Sibling imports (`./Button`)
6. Type imports

**Example:**

```typescript
// ✅ Correct order
import { useState } from 'react'
import { NextPage } from 'next'

import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

import { UserProfile } from './UserProfile'
```

#### 5. **Code Quality**

| Rule              | Level     | Why                                                          |
| ----------------- | --------- | ------------------------------------------------------------ |
| `no-console`      | warn      | Prevents `console.log` in production (allows `warn`/`error`) |
| `prefer-const`    | warn      | Encourages immutability                                      |
| `no-var`          | **error** | Prevents outdated `var` keyword                              |
| `prefer-template` | warn      | Encourages template literals over string concatenation       |

**Example:**

```typescript
// ❌ Warns
let name = 'John' // Should be const
var age = 30 // Error - use let/const
const msg = 'Hello ' + name // Use template

// ✅ Better
const name = 'John'
const age = 30
const msg = `Hello ${name}`
```

#### 6. **Logic Error Prevention** ⚠️ Critical for AI Code

AI can generate code that TypeScript accepts but contains logic errors:

| Rule                        | Level     | Why                                   |
| --------------------------- | --------- | ------------------------------------- |
| `no-compare-neg-zero`       | **error** | Comparing to -0 is always wrong       |
| `no-cond-assign`            | **error** | Assignment in condition (likely typo) |
| `no-duplicate-case`         | **error** | Duplicate switch cases                |
| `no-fallthrough`            | **error** | Missing break in switch               |
| `no-self-compare`           | **error** | `x === x` is always true (likely bug) |
| `no-unreachable`            | **error** | Code after return/throw               |
| `array-callback-return`     | **error** | Array methods need return values      |
| `no-async-promise-executor` | **error** | Async in Promise constructor          |
| `require-atomic-updates`    | **error** | Race conditions in async code         |

**Example:**

```typescript
// ❌ ERROR - Assignment in condition (typo?)
if ((user = getUser())) {
  // Should be ===
  console.log(user)
}

// ❌ ERROR - Missing break (fall-through)
switch (status) {
  case 'pending':
    setPending()
  // Missing break! Falls through to 'active'
  case 'active':
    setActive()
}

// ❌ ERROR - Array callback missing return
const ids = users.map(user => {
  user.id // Missing return!
})

// ❌ ERROR - Async Promise executor
new Promise(async resolve => {
  const data = await fetchData() // Don't use async here
  resolve(data)
})

// ✅ Fixed
if (user === getUser()) {
  console.log(user)
}

switch (status) {
  case 'pending':
    setPending()
    break
  case 'active':
    setActive()
    break
}

const ids = users.map(user => user.id)

// Use async/await instead
async function getData() {
  const data = await fetchData()
  return data
}
```

#### 7. **Accessibility (a11y)**

| Rule                                    | Level | Why                                      |
| --------------------------------------- | ----- | ---------------------------------------- |
| `jsx-a11y/alt-text`                     | warn  | Images must have alt text                |
| `jsx-a11y/anchor-is-valid`              | warn  | Links must have valid href               |
| `jsx-a11y/click-events-have-key-events` | warn  | Clickable elements need keyboard support |

**Example:**

```tsx
// ❌ Warns - no alt text
<img src="/logo.png" />

// ✅ Fixed
<img src="/logo.png" alt="Company logo" />
```

#### 8. **Next.js Specific**

| Rule                                | Level     | Why                                     |
| ----------------------------------- | --------- | --------------------------------------- |
| `@next/next/no-img-element`         | warn      | Use `next/image` instead of `<img>`     |
| `@next/next/no-html-link-for-pages` | **error** | Use `next/link` for internal navigation |

**Example:**

```tsx
// ❌ Warns
<img src="/photo.jpg" />
<a href="/about">About</a>

// ✅ Better
import Image from 'next/image'
import Link from 'next/link'

<Image src="/photo.jpg" alt="Photo" width={200} height={200} />
<Link href="/about">About</Link>
```

### Configuration File

**Location:** `eslint.config.mjs`

Uses Next.js 15 flat config format with **AI-focused bug prevention**:

- `eslint-config-next` - Next.js recommended rules
- `@typescript-eslint` - TypeScript-specific rules + async/promise safety
- `eslint-plugin-react-hooks` - React Hooks rules (exhaustive-deps = error)
- `eslint-plugin-import` - Import/export validation
- `eslint-plugin-jsx-a11y` - Accessibility checks
- `eslint-config-prettier` - Disables conflicting formatting rules
- `eslint-plugin-prettier` - Runs Prettier as ESLint rule

**Key Configuration Choices:**

- **Async/Promise rules set to `error`** - AI frequently forgets `await` and misuses promises
- **`return-await` in try-catch = `error`** - Prevents uncaught promise rejections
- **React exhaustive-deps set to `warn`** - Industry standard (catches bugs without false positive blocks)
- **Logic error rules set to `error`** - Catch bugs TypeScript misses
- **Most style rules set to `warn`** - Fix automatically, don't block commits

### Customizing Rules

To modify rules, edit `eslint.config.mjs`:

```javascript
rules: {
  // Turn off a rule
  'no-console': 'off',

  // Change severity
  '@typescript-eslint/no-explicit-any': 'error', // was 'warn'

  // Add options
  'max-len': ['warn', { code: 120 }],
}
```

---

## Git Hooks (Husky)

### Pre-commit Hook

Automatically runs on **every commit** via `.husky/pre-commit`:

```bash
npx lint-staged
```

### What Happens on Commit

1. **Staged files are detected** (only files you're committing)
2. **Linters run on staged files**:
   - `*.{ts,tsx,js,jsx}` → ESLint --fix + Prettier
   - `*.{json,md,css}` → Prettier only
3. **If errors found**:
   - ❌ Commit is blocked
   - You must fix errors and re-stage files
4. **If no errors**:
   - ✅ Files are auto-formatted
   - ✅ Commit proceeds

---

## lint-staged Configuration

Configured in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### Why lint-staged?

- **Fast**: Only checks changed files (not entire codebase)
- **Automatic**: Runs on pre-commit hook
- **Auto-fix**: Attempts to fix issues before blocking commit

---

## How to Use

### During Development

**Option 1: Let Git Hooks Handle It**

- Just commit normally: `git commit -m "message"`
- Hook runs automatically
- Files are formatted and linted

**Option 2: Manual Formatting**

```bash
npm run format              # Format entire project
npm run lint:fix            # Fix linting errors
```

**Option 3: IDE Integration**

**VS Code**

1. Install "Prettier - Code formatter" extension
2. Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Other IDEs**

- WebStorm: Built-in Prettier support (Enable in Settings → Languages & Frameworks → JavaScript → Prettier)
- Vim/Neovim: Use `vim-prettier` plugin
- Sublime Text: Use `JsPrettier` package

---

## Handling Pre-commit Hook Failures

### Scenario 1: Linting Errors

```bash
$ git commit -m "Add new feature"
✖ eslint --fix:
  /src/app/page.tsx
    5:10  error  'useState' is defined but never used  @typescript-eslint/no-unused-vars
```

**Fix**:

1. Remove unused import
2. Re-stage: `git add src/app/page.tsx`
3. Commit again: `git commit -m "Add new feature"`

### Scenario 2: Formatting Changes

```bash
$ git commit -m "Add new feature"
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] Add new feature
 1 file changed, 10 insertions(+), 8 deletions(-)
```

**No action needed** - Prettier auto-formatted your files and included them in the commit.

### Scenario 3: Bypass Hook (Emergency Only)

```bash
git commit -m "WIP: emergency fix" --no-verify
```

⚠️ **Use sparingly** - Only for emergencies. Create a follow-up commit to fix quality issues.

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:all
```

---

## Best Practices

### 1. Commit Often

Small, frequent commits are easier to review and fix if quality issues arise.

### 2. Review Auto-fixes

Prettier and ESLint make changes automatically. Review the diff before finalizing your commit.

### 3. Don't Commit Broken Code

If the pre-commit hook fails repeatedly:

- Fix the underlying issue
- Don't use `--no-verify` as a workaround

### 4. Keep Configuration Consistent

Don't modify `.prettierrc` or `lint-staged` config without team agreement.

### 5. Update IDE Settings

Configure your IDE to match project settings for the best development experience.

---

## Troubleshooting

### Hook Not Running

**Problem**: Pre-commit hook doesn't run when committing.

**Solution**:

```bash
npx husky install           # Reinstall hooks
chmod +x .husky/pre-commit  # Make hook executable (macOS/Linux)
```

### Prettier Conflicts with ESLint

**Problem**: ESLint and Prettier disagree on formatting.

**Solution**: This shouldn't happen with `eslint-config-prettier` installed. If it does:

```bash
npm install -D eslint-config-prettier  # Reinstall
```

Ensure `eslint.config.mjs` extends `prettier` config.

### Slow Pre-commit Hook

**Problem**: Hook takes too long on large commits.

**Solution**: lint-staged only runs on staged files, so this is rare. If it happens:

- Commit smaller changesets
- Check for performance issues in ESLint rules

### Can't Commit Due to Test Failures

**Problem**: Hook runs tests and blocks commit.

**Note**: This configuration only runs linters, not tests. If you customized `.husky/pre-commit` to run tests, consider moving tests to a separate `pre-push` hook instead.

---

## File Structure

```
web_starter_kit/
├── .husky/
│   └── pre-commit          # Git hook script
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Files to skip formatting
├── eslint.config.mjs       # ESLint configuration
└── package.json
    ├── scripts
    │   ├── format          # Format all files
    │   ├── format:check    # Check formatting
    │   ├── lint            # Run linter
    │   └── lint:fix        # Auto-fix linting
    └── lint-staged         # Pre-commit configuration
```

---

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/lint-staged/lint-staged)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

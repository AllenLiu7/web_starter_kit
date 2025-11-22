# Bugs Log

## Bug 1: Missing QueryProvider in Root Layout

**Error**: `No QueryClient set, use QueryClientProvider to set one`

**Location**: [src/app/page.tsx:23](../src/app/page.tsx#L23) - `useQueryClient()` hook call

**Root Cause**: TanStack Query hooks require `QueryClientProvider` to be in the component tree, but [src/app/layout.tsx](../src/app/layout.tsx) was not wrapping children with the provider.

**Fix**: Added `QueryProvider` wrapper to root layout:

```typescript
import { QueryProvider } from "@/components/providers/query-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

**Lesson**: Always ensure React Query provider is added to root layout before using query hooks in any page or component.

---

## Bug 2: Hydration Mismatch from Server/Client Environment Check

**Error**: `Hydration failed because the server rendered HTML didn't match the client`

**Location**: [src/app/page.tsx:26-28](../src/app/page.tsx#L26-L28) - Supabase environment variable checks

**Root Cause**: Using `typeof window !== 'undefined'` check caused different rendering on server vs client:

- Server: Rendered "Not Connected" (window is undefined)
- Client: Rendered "Connected" (window exists, env vars present)
- React detected the mismatch and threw hydration error

**Original Code**:

```typescript
const supabaseUrlPresent = typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyPresent =
  typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Fix**: Removed `typeof window` check since `NEXT_PUBLIC_*` variables are available on both server and client:

```typescript
const supabaseUrlPresent = !!process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyPresent = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Lesson**:

- `NEXT_PUBLIC_*` environment variables are available on both server and client - no need for window checks
- Avoid `typeof window !== 'undefined'` in component code that affects rendering output
- Use `'use client'` directive and useEffect if you truly need client-only logic that differs from server

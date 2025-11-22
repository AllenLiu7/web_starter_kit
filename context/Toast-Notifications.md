# Toast Notifications Guide

## Overview

This starter kit uses **Sonner** for toast notifications - a beautiful, accessible toast component that integrates seamlessly with shadcn/ui.

---

## Files

- **[src/components/ui/sonner.tsx](../src/components/ui/sonner.tsx)** - Sonner toast component
- **[src/app/layout.tsx](../src/app/layout.tsx)** - Toaster added to root layout

---

## Usage Examples

### Basic Toasts

```typescript
import { toast } from 'sonner'

// Success notification
toast.success('Profile updated successfully!')

// Error notification
toast.error('Failed to save changes')

// Info notification
toast.info('New features available')

// Warning notification
toast.warning('Your session will expire soon')

// Default toast
toast('Event created')
```

### Promise Toast (Async Operations)

Perfect for API calls and async operations:

```typescript
import { toast } from 'sonner'

// Automatically shows loading, success, or error based on promise state
toast.promise(fetch('/api/data'), {
  loading: 'Loading data...',
  success: 'Data loaded!',
  error: 'Failed to load data',
})

// With async/await
const saveProfile = async () => {
  toast.promise(updateProfile(data), {
    loading: 'Saving profile...',
    success: 'Profile saved!',
    error: 'Failed to save profile',
  })
}
```

### Toast with Action Button

```typescript
toast('Event created', {
  action: {
    label: 'Undo',
    onClick: () => {
      console.log('Undo clicked')
      // Handle undo logic
    },
  },
})
```

### Custom Duration

```typescript
// Show for 5 seconds (default is 4 seconds)
toast.success('Saved!', { duration: 5000 })

// Show indefinitely (until user dismisses)
toast.error('Critical error', { duration: Infinity })
```

### Dismissible Toasts

```typescript
// Manually dismiss after showing
const toastId = toast('Processing...')

// Later...
toast.dismiss(toastId)

// Dismiss all toasts
toast.dismiss()
```

### Custom Description

```typescript
toast.success('Payment received', {
  description: 'Your payment of $100 has been processed successfully.',
})
```

---

## Common Use Cases

### Form Submission

```typescript
'use client'

import { toast } from 'sonner'

export function ContactForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast.promise(
      submitForm(formData),
      {
        loading: 'Sending message...',
        success: 'Message sent! We will get back to you soon.',
        error: 'Failed to send message. Please try again.',
      }
    )
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### API Error Handling

```typescript
import { toast } from 'sonner'

async function fetchUserData() {
  try {
    const response = await fetch('/api/user')
    if (!response.ok) throw new Error('Failed to fetch')

    const data = await response.json()
    toast.success('Data loaded successfully')
    return data
  } catch (error) {
    toast.error('Failed to load user data', {
      description: error.message,
    })
  }
}
```

### Delete Confirmation

```typescript
import { toast } from 'sonner'

function deleteItem(id: string) {
  toast('Are you sure?', {
    action: {
      label: 'Delete',
      onClick: () => {
        toast.promise(deleteItemAPI(id), {
          loading: 'Deleting...',
          success: 'Item deleted successfully',
          error: 'Failed to delete item',
        })
      },
    },
    cancel: {
      label: 'Cancel',
      onClick: () => console.log('Cancelled'),
    },
  })
}
```

### Copy to Clipboard

```typescript
import { toast } from 'sonner'

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Copied to clipboard!', {
    duration: 2000,
  })
}
```

---

## Configuration

### Change Position

Edit [src/components/ui/sonner.tsx](../src/components/ui/sonner.tsx):

```typescript
<Toaster
  position="top-right"  // Options: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
/>
```

### Theme

Sonner automatically adapts to your Tailwind theme. For dark mode:

```typescript
<Toaster theme="dark" />
// or
<Toaster theme="light" />
// or
<Toaster theme="system" /> // follows system preference
```

### Expand Toasts

```typescript
<Toaster expand={true} /> // Toasts expand on hover
```

### Rich Colors

```typescript
<Toaster richColors={true} /> // Enhanced colors for success/error/warning
```

### Custom Styling

```typescript
toast.success('Saved!', {
  className: 'custom-toast-class',
  style: {
    background: 'green',
    color: 'white',
  },
})
```

---

## Best Practices

1. **Use appropriate toast types** - Match the toast type to the message importance
2. **Keep messages short** - Aim for 1-2 lines of text
3. **Use promises for async operations** - Provides better UX with loading states
4. **Don't overuse toasts** - Too many toasts can be annoying
5. **Provide actionable feedback** - Include action buttons when relevant
6. **Set appropriate durations** - Longer for errors, shorter for success

---

## Testing

Visit the homepage status page to see all toast types in action:

- Success Toast
- Error Toast
- Info Toast
- Warning Toast
- Promise Toast

---

## Resources

- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner)
- [GitHub Repository](https://github.com/emilkowalski/sonner)

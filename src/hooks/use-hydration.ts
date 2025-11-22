'use client'

import { useEffect, useState } from 'react'

import { useUserStore } from '@/store/user-store'

export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    void useUserStore.persist.rehydrate()

    // Use queueMicrotask to avoid setState in effect warning
    queueMicrotask(() => {
      setHydrated(true)
    })
  }, [])

  return hydrated
}

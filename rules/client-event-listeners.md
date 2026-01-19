---
title: Deduplicate Global Event Listeners
impact: LOW-MEDIUM
impactDescription: single listener for N components
tags: client, event-listeners, subscription, composables
---

## Deduplicate Global Event Listeners

Share global event listeners across component instances to avoid registering the same listener multiple times.

**Incorrect (N instances = N listeners):**

```vue
<script setup>
// composables/useKeyboardShortcut.ts
export function useKeyboardShortcut(key: string, callback: () => void) {
  onMounted(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)

    onUnmounted(() => {
      window.removeEventListener('keydown', handler)
    })
  })
}

// When using this composable multiple times, each instance registers a new listener
</script>
```

**Correct (N instances = 1 listener):**

```typescript
// composables/useKeyboardShortcut.ts
// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()
let listenerRegistered = false

function ensureGlobalListener() {
  if (listenerRegistered) return

  const handler = (e: KeyboardEvent) => {
    if (e.metaKey && keyCallbacks.has(e.key)) {
      keyCallbacks.get(e.key)!.forEach(cb => cb())
    }
  }

  window.addEventListener('keydown', handler)
  listenerRegistered = true
}

export function useKeyboardShortcut(key: string, callback: () => void) {
  ensureGlobalListener()

  onMounted(() => {
    // Register this callback in the Map
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)
  })

  onUnmounted(() => {
    // Remove callback when component unmounts
    const set = keyCallbacks.get(key)
    if (set) {
      set.delete(callback)
      if (set.size === 0) {
        keyCallbacks.delete(key)
      }
    }
  })
}
```

**Usage:**

```vue
<script setup>
// Multiple shortcuts share the same listener
useKeyboardShortcut('p', () => console.log('Profile'))
useKeyboardShortcut('k', () => console.log('Search'))
useKeyboardShortcut('s', () => console.log('Settings'))
</script>
```

**Online status tracking example:**

```typescript
// composables/useOnlineStatus.ts
const callbacks = new Set<(online: boolean) => void>()
let listenerRegistered = false

function ensureListeners() {
  if (listenerRegistered) return

  const handleOnline = () => {
    callbacks.forEach(cb => cb(true))
  }

  const handleOffline = () => {
    callbacks.forEach(cb => cb(false))
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  listenerRegistered = true
}

export function useOnlineStatus() {
  const isOnline = ref(navigator.onLine)

  ensureListeners()

  const callback = (online: boolean) => {
    isOnline.value = online
  }

  onMounted(() => {
    callbacks.add(callback)
  })

  onUnmounted(() => {
    callbacks.delete(callback)
  })

  return { isOnline }
}
```

**VueUse alternative:**

```vue
<script setup>
import { useNetwork } from '@vueuse/core'

// VueUse automatically deduplicates listeners
const { isOnline } = useNetwork()
</script>
```

**Impact Analysis:**
- Performance gain: Reduces memory usage and event handling overhead
- Use cases: Keyboard shortcuts, resize listeners, online/offline status
- Considerations: Most useful when the same event is needed by many components

Reference: [VueUse useEventListener](https://vueuse.org/core/useEventListener/)

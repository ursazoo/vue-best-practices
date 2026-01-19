---
title: Use Stable Refs for Event Handlers in Watchers
impact: LOW-MEDIUM
impactDescription: prevents unnecessary watcher re-runs
tags: advanced, watchers, refs, event-handlers, optimization
---

## Use Stable Refs for Event Handlers in Watchers

Store callbacks in refs when used in watchers that shouldn't re-run on callback changes.

**Incorrect (watcher re-runs on every callback change):**

```vue
<script setup lang="ts">
interface Props {
  onSearch: (query: string) => void
}

const props = defineProps<Props>()
const query = ref('')

// ❌ Watcher re-runs when onSearch prop changes
watch([query, () => props.onSearch], ([newQuery, searchFn]) => {
  const timeout = setTimeout(() => searchFn(newQuery), 300)
  return () => clearTimeout(timeout)
})
</script>
```

**Correct (stable watcher, fresh callback):**

```vue
<script setup lang="ts">
interface Props {
  onSearch: (query: string) => void
}

const props = defineProps<Props>()
const query = ref('')

// Store latest callback in ref
const onSearchRef = ref(props.onSearch)

// Update ref when prop changes (doesn't trigger watcher)
watch(() => props.onSearch, (newFn) => {
  onSearchRef.value = newFn
})

// Watcher only re-runs on query changes
watch(query, (newQuery) => {
  const timeout = setTimeout(() => {
    onSearchRef.value(newQuery)
  }, 300)
  return () => clearTimeout(timeout)
})
</script>
```

**Composable pattern:**

```typescript
// composables/useStableCallback.ts
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): Readonly<Ref<T>> {
  const callbackRef = ref(callback) as Ref<T>

  watch(
    () => callback,
    (newCallback) => {
      callbackRef.value = newCallback
    },
    { flush: 'sync' }
  )

  return readonly(callbackRef)
}
```

**Usage in composable:**

```typescript
// composables/useWindowEvent.ts
export function useWindowEvent(
  event: string,
  handler: (e: Event) => void
) {
  // Incorrect: re-subscribes on every handler change
  // watch([() => event, () => handler], ([evt, fn]) => {
  //   window.addEventListener(evt, fn)
  //   return () => window.removeEventListener(evt, fn)
  // })

  // Correct: stable subscription
  const handlerRef = useStableCallback(handler)

  watch(
    () => event,
    (evt, oldEvt) => {
      const listener = (e: Event) => handlerRef.value(e)

      // Remove old listener
      if (oldEvt) {
        window.removeEventListener(oldEvt, listener)
      }

      // Add new listener
      window.addEventListener(evt, listener)

      // Cleanup
      onScopeDispose(() => {
        window.removeEventListener(evt, listener)
      })
    },
    { immediate: true }
  )
}
```

**VueUse implementation:**

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useEventListener(
  target: MaybeRefOrGetter<EventTarget>,
  event: string,
  handler: (e: Event) => void,
  options?: AddEventListenerOptions
) {
  // Store latest handler
  const handlerRef = ref(handler)

  watch(
    () => handler,
    (newHandler) => {
      handlerRef.value = newHandler
    }
  )

  // Stable subscription
  const cleanup = watchEffect((onCleanup) => {
    const el = toValue(target)
    if (!el) return

    const listener = (e: Event) => handlerRef.value(e)
    el.addEventListener(event, listener, options)

    onCleanup(() => {
      el.removeEventListener(event, listener)
    })
  })

  return cleanup
}
```

**Real-world example - keyboard shortcuts:**

```vue
<script setup lang="ts">
interface Props {
  shortcuts: Record<string, () => void>
}

const props = defineProps<Props>()

// Store latest shortcuts in ref
const shortcutsRef = ref(props.shortcuts)

watch(
  () => props.shortcuts,
  (newShortcuts) => {
    shortcutsRef.value = newShortcuts
  }
)

// Stable event listener (doesn't re-subscribe)
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    const key = e.key
    const handler = shortcutsRef.value[key]
    if (handler) {
      e.preventDefault()
      handler()
    }
  }

  window.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
})
</script>
```

**Debounced search with stable callback:**

```vue
<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'

interface Props {
  onSearch: (query: string) => Promise<void>
}

const props = defineProps<Props>()
const query = ref('')
const isSearching = ref(false)

// Store latest callback
const onSearchRef = useStableCallback(props.onSearch)

// Stable debounced watcher
watchDebounced(
  query,
  async (newQuery) => {
    if (!newQuery.trim()) return

    isSearching.value = true
    try {
      await onSearchRef.value(newQuery)
    } finally {
      isSearching.value = false
    }
  },
  { debounce: 300 }
)
</script>

<template>
  <div>
    <input v-model="query" placeholder="Search...">
    <span v-if="isSearching">Searching...</span>
  </div>
</template>
```

**Comparison with direct callback:**

```typescript
// Without stable ref (re-subscribes on every prop change):
watch([query, () => props.onSearch], ([q, fn]) => {
  // Effect runs when EITHER query OR onSearch changes
  fn(q)
})
// 100 query changes + 10 onSearch changes = 110 effect runs

// With stable ref (only re-runs on query change):
const onSearchRef = useStableCallback(props.onSearch)
watch(query, (q) => {
  // Effect only runs when query changes
  onSearchRef.value(q)
})
// 100 query changes = 100 effect runs (10 fewer!)
```

**Best practices:**

✅ **Use stable refs for:**
- Event listeners that don't need re-subscription
- Debounced/throttled callbacks
- Callbacks passed as props in composables
- Callbacks in long-running effects

❌ **Don't use for:**
- Simple component-internal handlers
- Callbacks that need to trigger effect cleanup
- When you specifically want callback changes to trigger effects

**Impact Analysis:**
- Performance gain: Prevents unnecessary effect re-runs and re-subscriptions
- Use cases: Event listeners, debounced searches, polling effects
- Considerations: Adds slight complexity, use when optimization is needed

Reference: [Vue watchers](https://vuejs.org/guide/essentials/watchers.html)

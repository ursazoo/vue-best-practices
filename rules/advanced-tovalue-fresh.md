---
title: Use toValue for Fresh Values in Effects
impact: LOW-MEDIUM
impactDescription: access latest values without triggering effect re-runs
tags: advanced, toValue, refs, watchers, optimization
---

## Use toValue for Fresh Values in Effects

Access latest values in effects without adding them to dependency arrays. Prevents watcher re-runs while avoiding stale closures.

**Incorrect (watcher re-runs on every value change):**

```vue
<script setup lang="ts">
const count = ref(0)
const multiplier = ref(2)

// ❌ Watcher re-runs when either count OR multiplier changes
watch([count, multiplier], ([c, m]) => {
  const timeout = setTimeout(() => {
    console.log(`Result: ${c * m}`)
  }, 1000)
  return () => clearTimeout(timeout)
})
// If count changes 10 times in 1 second, creates 10 timeouts!
</script>
```

**Correct (stable watcher, fresh values):**

```vue
<script setup lang="ts">
const count = ref(0)
const multiplier = ref(2)

// ✅ Only watch count, but access latest multiplier
watch(count, (c) => {
  const timeout = setTimeout(() => {
    // Always gets the latest multiplier value
    console.log(`Result: ${c * multiplier.value}`)
  }, 1000)
  return () => clearTimeout(timeout)
})
// Only creates timeout when count changes
</script>
```

**Composable pattern with toValue:**

```typescript
// composables/useLatest.ts
import { ref, watch, readonly, type Ref } from 'vue'

/**
 * Access latest value without triggering dependencies
 * Similar to React's useLatest hook
 */
export function useLatest<T>(value: Ref<T>): Readonly<Ref<T>> {
  const latestRef = ref(value.value) as Ref<T>

  // Keep latestRef in sync with value
  watch(
    value,
    (newValue) => {
      latestRef.value = newValue
    },
    { flush: 'sync' }
  )

  return readonly(latestRef)
}
```

**Usage in debounced search:**

```vue
<script setup lang="ts">
interface Props {
  filters: Record<string, string>
}

const props = defineProps<Props>()
const query = ref('')

// Get latest filters without re-triggering watcher
const latestFilters = useLatest(toRef(() => props.filters))

watch(query, (newQuery) => {
  const timeout = setTimeout(() => {
    // Always uses latest filters, even if they changed
    search(newQuery, latestFilters.value)
  }, 300)
  return () => clearTimeout(timeout)
})

async function search(q: string, filters: Record<string, string>) {
  await $fetch('/api/search', {
    query: { q, ...filters }
  })
}
</script>
```

**Alternative: closure over ref:**

```vue
<script setup lang="ts">
const count = ref(0)
const settings = ref({ threshold: 10 })

// Instead of adding settings to dependencies:
watch(count, (c) => {
  // Just access settings.value directly in callback
  if (c > settings.value.threshold) {
    console.log('Threshold exceeded!')
  }
})
// Watcher only re-runs when count changes
</script>
```

**Polling with latest config:**

```typescript
// composables/usePolling.ts
export function usePolling(
  interval: Ref<number>,
  callback: () => void
) {
  // Get latest callback without adding to dependencies
  const latestCallback = useLatest(toRef(() => callback))

  watch(
    interval,
    (ms) => {
      const id = setInterval(() => {
        // Always calls latest callback
        latestCallback.value()
      }, ms)

      onScopeDispose(() => {
        clearInterval(id)
      })
    },
    { immediate: true }
  )
}
```

**Usage:**

```vue
<script setup lang="ts">
const pollInterval = ref(5000)
let counter = 0

// Callback can close over changing variables
usePolling(pollInterval, () => {
  counter++
  console.log(`Polled ${counter} times`)
})

// Change interval without recreating polling
function setFast() {
  pollInterval.value = 1000
}
</script>
```

**VueUse implementation:**

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: MaybeRefOrGetter<T>,
  delay: number
) {
  let timeoutId: NodeJS.Timeout | null = null

  function debouncedFn(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      // Always calls latest callback
      const fn = toValue(callback)
      fn(...args)
    }, delay)
  }

  onScopeDispose(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return debouncedFn
}
```

**Real-world example - auto-save:**

```vue
<script setup lang="ts">
const formData = ref({
  title: '',
  content: '',
  tags: []
})

const saveOptions = ref({
  endpoint: '/api/save',
  debounce: 1000
})

// Only watch formData, not saveOptions
watch(
  formData,
  (data) => {
    const timeout = setTimeout(() => {
      // Access latest saveOptions
      const { endpoint, debounce } = saveOptions.value
      $fetch(endpoint, { method: 'POST', body: data })
    }, saveOptions.value.debounce)

    return () => clearTimeout(timeout)
  },
  { deep: true }
)
</script>
```

**Comparison:**

```typescript
// Without useLatest (re-runs on every dependency change):
watch([dataRef, configRef], ([data, config]) => {
  processData(data, config)
})
// 100 data changes + 10 config changes = 110 effect runs

// With useLatest (only re-runs on data changes):
const latestConfig = useLatest(configRef)
watch(dataRef, (data) => {
  processData(data, latestConfig.value)
})
// 100 data changes = 100 effect runs (10 fewer!)
```

**When to use toValue vs adding to dependencies:**

```vue
<script setup>
const primary = ref(0)
const secondary = ref(0)

// ✅ Add to dependencies when changes should trigger effect
watch([primary, secondary], ([p, s]) => {
  updateUI(p, s)
})

// ✅ Don't add to dependencies when only need latest value
watch(primary, (p) => {
  // Just read secondary.value without tracking
  updateUI(p, secondary.value)
})
</script>
```

**Best practices:**

✅ **Use toValue/useLatest for:**
- Configuration values that rarely change
- Callbacks that shouldn't trigger effect re-runs
- Derived state that's expensive to compute
- Props that are used but shouldn't trigger effects

❌ **Don't use for:**
- Primary dependencies that should trigger effects
- Values that need reactive tracking
- When you specifically want changes to trigger re-runs

**Impact Analysis:**
- Performance gain: Reduces unnecessary effect re-runs
- Use cases: Debouncing, polling, auto-save, configuration access
- Considerations: Makes dependency tracking less explicit

Reference: [Vue toValue](https://vuejs.org/api/reactivity-utilities.html#tovalue)

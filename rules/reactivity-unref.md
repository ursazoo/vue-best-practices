---
title: Use Unref and toValue to Reduce .value Access
impact: LOW-MEDIUM
impactDescription: cleaner code and flexibility with refs
tags: reactivity, unref, toValue, code-quality
---

## Use Unref and toValue to Reduce .value Access

> **Vue Version Support**:
> - `unref` is available in Vue 3
> - `toValue` requires Vue 3.3+ (supports getters in addition to refs/values)
> - For Vue 2, pass refs directly or use `.value` explicitly

Use `unref()` and `toValue()` to write code that works with both refs and regular values, reducing `.value` boilerplate.

**Incorrect (repetitive .value access):**

```typescript
// composables/useFormatter.ts
export function useFormatter(input: Ref<string>) {
  const formatted = computed(() => {
    return input.value.trim().toLowerCase()
  })

  function format() {
    return input.value.trim().toLowerCase()
  }

  watch(input, (newVal) => {
    console.log('Input changed:', input.value)
  })

  return { formatted, format }
}

// Only works with refs, not regular values
const text = ref('Hello')
const { formatted } = useFormatter(text)
```

**Correct (works with refs and values):**

```typescript
// composables/useFormatter.ts
import { unref, type MaybeRef } from 'vue'

export function useFormatter(input: MaybeRef<string>) {
  const formatted = computed(() => {
    const value = unref(input)
    return value.trim().toLowerCase()
  })

  function format() {
    const value = unref(input)
    return value.trim().toLowerCase()
  }

  return { formatted, format }
}

// Works with both!
const text = ref('Hello')
const { formatted: f1 } = useFormatter(text) // ✅ Ref

const plain = 'World'
const { formatted: f2 } = useFormatter(plain) // ✅ Plain value
```

**Use toValue (Vue 3.3+):**

```typescript
import { toValue, type MaybeRefOrGetter } from 'vue'

// Accepts ref, value, or getter function
export function useFormatter(input: MaybeRefOrGetter<string>) {
  const formatted = computed(() => {
    // toValue works with refs, values, AND getter functions
    const value = toValue(input)
    return value.trim().toLowerCase()
  })

  return { formatted }
}

// All of these work:
useFormatter(ref('Hello')) // ✅ Ref
useFormatter('World') // ✅ Value
useFormatter(() => someValue) // ✅ Getter
```

**Real-world example - useTitle:**

```typescript
// Incorrect: only accepts string
export function useTitle(title: string) {
  document.title = title

  watch(() => title, (newTitle) => {
    document.title = newTitle
  })
}

// Correct: accepts ref or value
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useTitle(title: MaybeRefOrGetter<string>) {
  watchEffect(() => {
    document.title = toValue(title)
  })
}

// Usage flexibility:
useTitle('Static Title') // ✅
useTitle(ref('Dynamic Title')) // ✅
useTitle(() => `Page ${currentPage.value}`) // ✅
```

**Comparison:**

```typescript
// unref: unwraps ref or returns value
const value = unref(maybeRef)
// If maybeRef is Ref<T>, returns T
// If maybeRef is T, returns T

// toValue: unwraps ref, getter, or returns value (Vue 3.3+)
const value = toValue(maybeRefOrGetter)
// If input is Ref<T>, returns T
// If input is () => T, calls it and returns T
// If input is T, returns T

// isRef: checks if value is a ref
if (isRef(maybeRef)) {
  console.log(maybeRef.value)
}
```

**Flexible composable pattern:**

```typescript
// composables/useFetch.ts
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    try {
      // toValue handles ref, getter, or plain string
      const response = await $fetch(toValue(url))
      data.value = response
    } finally {
      loading.value = false
    }
  }

  // Re-fetch when URL changes
  watchEffect(() => {
    fetchData()
  })

  return { data, loading, refetch: fetchData }
}

// All of these work:
useFetch('/api/users') // Static URL
useFetch(ref('/api/users')) // Reactive URL
useFetch(() => `/api/users/${userId.value}`) // Computed URL
```

**VueUse examples:**

```typescript
import { toValue } from '@vueuse/core'

// useEventListener accepts MaybeRefOrGetter<EventTarget>
useEventListener(
  () => document.getElementById('myDiv'), // Getter
  'click',
  handler
)

// useIntersectionObserver accepts MaybeRefOrGetter<Element>
useIntersectionObserver(
  target, // Can be ref, element, or getter
  ([{ isIntersecting }]) => {
    console.log(isIntersecting)
  }
)
```

**Type utilities:**

```typescript
import type { Ref, MaybeRef, MaybeRefOrGetter } from 'vue'

// Ref<T>: A reactive reference
const count: Ref<number> = ref(0)

// MaybeRef<T>: Can be Ref<T> or T
const value: MaybeRef<number> = ref(0) // or just 0

// MaybeRefOrGetter<T>: Can be Ref<T>, T, or () => T
const flexible: MaybeRefOrGetter<number> =
  ref(0) || 0 || (() => 0)
```

**Best practices:**

✅ **Use toValue/unref for:**
- Composables that should accept both refs and values
- Utility functions that work with reactive state
- Flexible APIs that don't force ref wrapping

❌ **Don't overuse:**
- Simple component-internal logic
- When you specifically need ref behavior
- When unwrapping adds unnecessary complexity

**Impact Analysis:**
- Performance gain: Minimal overhead, cleaner code
- Use cases: Flexible composables, utility functions, library APIs
- Considerations: Use `toValue` (Vue 3.3+) for maximum flexibility

Reference: [Vue unref](https://vuejs.org/api/reactivity-utilities.html#unref)

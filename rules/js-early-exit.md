---
title: Early Exit from Functions
impact: MEDIUM
impactDescription: skip unnecessary computation
tags: javascript, control-flow, performance, early-return
---

## Early Exit from Functions

Use early returns to skip unnecessary computation when conditions aren't met.

**Incorrect (unnecessary work):**

```typescript
function processUser(user: User | null): string {
  let result = ''

  if (user) {
    const normalized = normalizeUser(user) // Expensive operation
    const validated = validateUser(normalized) // Expensive operation

    if (validated) {
      result = formatUser(validated) // Expensive operation
    }
  }

  return result
}
```

**Correct (early exit):**

```typescript
function processUser(user: User | null): string {
  // Exit early if no user
  if (!user) return ''

  const normalized = normalizeUser(user)

  // Exit early if normalization failed
  if (!normalized) return ''

  const validated = validateUser(normalized)

  // Exit early if validation failed
  if (!validated) return ''

  return formatUser(validated)
}
```

**Vue computed property example:**

```vue
<script setup>
// Incorrect
const processedData = computed(() => {
  let result = []

  if (data.value.length > 0) {
    const filtered = expensiveFilter(data.value)
    if (filtered.length > 0) {
      const sorted = expensiveSort(filtered)
      if (sorted.length > 0) {
        result = expensiveTransform(sorted)
      }
    }
  }

  return result
})

// Correct
const processedData = computed(() => {
  if (data.value.length === 0) return []

  const filtered = expensiveFilter(data.value)
  if (filtered.length === 0) return []

  const sorted = expensiveSort(filtered)
  if (sorted.length === 0) return []

  return expensiveTransform(sorted)
})
</script>
```

**Impact Analysis:**
- Performance gain: Skips expensive operations when conditions fail early
- Use cases: Data validation, permission checks, conditional rendering logic
- Considerations: Improves readability by reducing nesting levels

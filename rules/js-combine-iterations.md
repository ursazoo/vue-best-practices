---
title: Combine Multiple Iterations
impact: MEDIUM
impactDescription: reduce iteration overhead
tags: javascript, loops, performance, optimization
---

## Combine Multiple Iterations

Combine multiple array iterations into a single pass when processing the same data multiple times.

**Incorrect (multiple passes over same data):**

```vue
<script setup>
const users = ref([/* 1000+ users */])

const processedData = computed(() => {
  // Pass 1: Filter active users
  const active = users.value.filter(u => u.isActive)

  // Pass 2: Map to extract names
  const names = active.map(u => u.name)

  // Pass 3: Filter out empty names
  const validNames = names.filter(n => n.trim().length > 0)

  // Pass 4: Convert to uppercase
  const uppercase = validNames.map(n => n.toUpperCase())

  return uppercase
})
// 4 iterations over the data!
</script>
```

**Correct (single pass):**

```vue
<script setup>
const users = ref([/* 1000+ users */])

const processedData = computed(() => {
  // Single pass with combined logic
  return users.value
    .filter(u => u.isActive)
    .map(u => u.name)
    .filter(n => n.trim().length > 0)
    .map(n => n.toUpperCase())
})

// Or even better: single reduce
const processedData = computed(() => {
  return users.value.reduce<string[]>((acc, user) => {
    if (user.isActive && user.name.trim().length > 0) {
      acc.push(user.name.toUpperCase())
    }
    return acc
  }, [])
})
// Only 1 iteration!
</script>
```

**Complex aggregation example:**

```typescript
// Incorrect: 3 separate loops
const total = items.reduce((sum, item) => sum + item.price, 0)
const count = items.filter(item => item.inStock).length
const categories = new Set(items.map(item => item.category))

// Correct: 1 loop
const result = items.reduce(
  (acc, item) => {
    acc.total += item.price
    if (item.inStock) acc.count++
    acc.categories.add(item.category)
    return acc
  },
  { total: 0, count: 0, categories: new Set<string>() }
)
```

**For loops vs array methods:**

```typescript
// When you need multiple operations, a single for loop is fastest
const result = {
  total: 0,
  active: [] as User[],
  categories: new Set<string>()
}

for (const user of users) {
  result.total += user.purchases
  if (user.isActive) {
    result.active.push(user)
  }
  result.categories.add(user.category)
}

// Faster than:
// const total = users.reduce(...)
// const active = users.filter(...)
// const categories = new Set(users.map(...))
```

**Impact Analysis:**
- Performance gain: 2-4× faster by reducing iteration overhead
- Use cases: Data processing, filtering, transformations, aggregations
- Considerations: Balance readability with performance; combine only when processing large datasets

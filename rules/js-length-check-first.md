---
title: Check Length Before Iteration
impact: LOW-MEDIUM
impactDescription: skip empty array processing
tags: javascript, performance, early-exit, arrays
---

## Check Length Before Iteration

Check array length before performing expensive operations to skip processing empty arrays.

**Incorrect (processes empty arrays):**

```vue
<script setup>
const items = ref([])

const processedItems = computed(() => {
  // Always runs even when items is empty
  return items.value
    .filter(expensiveFilter)
    .map(expensiveTransform)
    .sort(expensiveSort)
})

// Empty array still goes through all these operations:
// - Creates new arrays
// - Calls filter/map/sort functions
// - Allocates memory
</script>
```

**Correct (early exit for empty arrays):**

```vue
<script setup>
const items = ref([])

const processedItems = computed(() => {
  // Exit early if no items
  if (items.value.length === 0) return []

  return items.value
    .filter(expensiveFilter)
    .map(expensiveTransform)
    .sort(expensiveSort)
})
</script>
```

**Multiple checks in processing pipeline:**

```typescript
// Incorrect
function processData(users: User[]) {
  const active = users.filter(u => u.isActive)
  const enriched = active.map(enrichUser) // Expensive
  const sorted = enriched.sort(sortByName) // Expensive
  return sorted
}

// Correct
function processData(users: User[]) {
  if (users.length === 0) return []

  const active = users.filter(u => u.isActive)
  if (active.length === 0) return []

  const enriched = active.map(enrichUser)
  if (enriched.length === 0) return []

  return enriched.sort(sortByName)
}
```

**Composable pattern:**

```vue
<script setup>
const fetchedData = ref([])

const validData = computed(() => {
  if (fetchedData.value.length === 0) return []

  return fetchedData.value.filter(item => {
    return validateItem(item) // Expensive validation
  })
})

const transformedData = computed(() => {
  // Early exit before expensive transform
  if (validData.value.length === 0) return []

  return validData.value.map(item => {
    return expensiveTransform(item)
  })
})

const sortedData = computed(() => {
  // Early exit before expensive sort
  if (transformedData.value.length === 0) return []

  return [...transformedData.value].sort(expensiveSort)
})
</script>
```

**Loop example:**

```typescript
// Incorrect
function processItems(items: Item[]) {
  for (const item of items) {
    // Loop body never executes if empty, but still has overhead
    expensiveOperation(item)
  }
  return items // Returns original array
}

// Correct
function processItems(items: Item[]) {
  if (items.length === 0) return items

  for (const item of items) {
    expensiveOperation(item)
  }
  return items
}
```

**Impact Analysis:**
- Performance gain: Avoids unnecessary function calls and array allocations
- Use cases: Data processing pipelines, filtering, transformations
- Considerations: Most valuable when operations are expensive or frequently called with empty arrays

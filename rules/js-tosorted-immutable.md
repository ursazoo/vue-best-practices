---
title: Use toSorted() for Immutable Sorting
impact: LOW-MEDIUM
impactDescription: avoid unnecessary array copies
tags: javascript, arrays, immutability, performance, es2023
---

## Use toSorted() for Immutable Sorting

Use the new `toSorted()` method instead of spreading and sorting when you need a sorted copy of an array.

**Incorrect (manual spread creates extra array):**

```vue
<script setup>
const items = ref([
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])

const sortedItems = computed(() => {
  // Creates copy, then sorts in-place
  return [...items.value].sort((a, b) => a.name.localeCompare(b.name))
})
// Two operations: spread + sort
</script>
```

**Correct (toSorted() is optimized):**

```vue
<script setup>
const items = ref([
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])

const sortedItems = computed(() => {
  // Single optimized operation
  return items.value.toSorted((a, b) => a.name.localeCompare(b.name))
})
// Faster and cleaner
</script>
```

**Other immutable array methods (ES2023):**

```typescript
// toReversed() - immutable reverse
// Incorrect
const reversed = [...array].reverse()
// Correct
const reversed = array.toReversed()

// toSpliced() - immutable splice
// Incorrect
const modified = [...array]
modified.splice(2, 1, newItem)
// Correct
const modified = array.toSpliced(2, 1, newItem)

// with() - immutable index update
// Incorrect
const updated = [...array]
updated[5] = newValue
// Correct
const updated = array.with(5, newValue)
```

**Vue reactive benefits:**

```vue
<script setup>
// Incorrect: mutates reactive array
function sortItems() {
  items.value.sort((a, b) => a.name.localeCompare(b.name))
  // Triggers reactivity but mutates original
}

// Correct: creates new array (better for reactivity)
function sortItems() {
  items.value = items.value.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  )
  // Clear reactivity tracking
}
</script>
```

**Chaining immutable operations:**

```typescript
// Incorrect: multiple spreads
const result = [...[...items].sort()].reverse()

// Correct: clean method chaining
const result = items
  .toSorted()
  .toReversed()

// Combined with filtering
const result = items
  .filter(item => item.active)
  .toSorted((a, b) => a.name.localeCompare(b.name))
  .toReversed()
```

**Browser support check:**

```typescript
// Polyfill for older browsers
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function(compareFn) {
    return [...this].sort(compareFn)
  }
}
```

**Impact Analysis:**
- Performance gain: Slightly faster than spread + sort, cleaner code
- Use cases: Sorting without mutation, reactive state management
- Considerations: Requires modern browsers (2023+) or polyfill

Reference: [MDN toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)

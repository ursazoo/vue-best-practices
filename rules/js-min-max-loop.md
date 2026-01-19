---
title: Optimize Min/Max in Loops
impact: LOW-MEDIUM
impactDescription: avoid redundant comparisons
tags: javascript, loops, performance, algorithms
---

## Optimize Min/Max in Loops

Use a single-pass algorithm to find min/max values instead of sorting or multiple passes.

**Incorrect (sorts entire array):**

```vue
<script setup>
const prices = ref([/* 1000+ prices */])

const minPrice = computed(() => {
  // Sorts entire array: O(n log n)
  const sorted = [...prices.value].sort((a, b) => a - b)
  return sorted[0]
})

const maxPrice = computed(() => {
  // Sorts AGAIN: O(n log n)
  const sorted = [...prices.value].sort((a, b) => b - a)
  return sorted[0]
})
// Total: 2 × O(n log n) + 2 array copies
</script>
```

**Correct (single pass):**

```vue
<script setup>
const prices = ref([/* 1000+ prices */])

const priceRange = computed(() => {
  if (prices.value.length === 0) {
    return { min: 0, max: 0 }
  }

  // Single pass: O(n)
  let min = prices.value[0]
  let max = prices.value[0]

  for (let i = 1; i < prices.value.length; i++) {
    const price = prices.value[i]
    if (price < min) min = price
    if (price > max) max = price
  }

  return { min, max }
})

const minPrice = computed(() => priceRange.value.min)
const maxPrice = computed(() => priceRange.value.max)
</script>
```

**Using Math.min/Math.max (for smaller arrays):**

```typescript
// For arrays < 100 items, this is readable and fast
const min = Math.min(...prices)
const max = Math.max(...prices)

// But for large arrays (>1000), use the loop:
// Math.min/max creates function arguments which can cause stack overflow
```

**Finding min/max with additional data:**

```typescript
// Incorrect: multiple passes
const minPrice = Math.min(...products.map(p => p.price))
const cheapestProduct = products.find(p => p.price === minPrice)

const maxPrice = Math.max(...products.map(p => p.price))
const expensiveProduct = products.find(p => p.price === maxPrice)

// Correct: single pass
let cheapest = products[0]
let expensive = products[0]

for (const product of products) {
  if (product.price < cheapest.price) cheapest = product
  if (product.price > expensive.price) expensive = product
}
```

**Reducing multiple aggregations:**

```typescript
// Single pass for multiple metrics
const stats = items.reduce(
  (acc, item) => {
    acc.sum += item.value
    acc.count++
    if (item.value < acc.min) acc.min = item.value
    if (item.value > acc.max) acc.max = item.value
    return acc
  },
  {
    sum: 0,
    count: 0,
    min: items[0]?.value ?? 0,
    max: items[0]?.value ?? 0
  }
)

const average = stats.sum / stats.count
```

**Impact Analysis:**
- Performance gain: O(n) vs O(n log n) - 10× faster for large arrays
- Use cases: Statistics, price ranges, data analysis, charts
- Considerations: Significant improvement when working with 1000+ items

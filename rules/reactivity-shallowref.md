---
title: Use shallowRef for Large Objects
impact: MEDIUM-HIGH
impactDescription: reduces reactivity overhead
tags: reactivity, performance, shallowRef, optimization
---

## Use shallowRef for Large Objects

> **Vue 3 Only**: `shallowRef` is only available in Vue 3. For Vue 2, consider using `Object.freeze()` for large immutable objects.

Use `shallowRef` instead of `ref` for large objects that don't need deep reactivity tracking.

**Incorrect (deep reactivity overhead):**

```vue
<script setup>
// Vue tracks EVERY property recursively
const largeData = ref({
  users: [
    { id: 1, name: 'Alice', posts: [...1000 items] },
    { id: 2, name: 'Bob', posts: [...1000 items] },
    // ... 1000 more users
  ],
  settings: { /* 100 nested properties */ },
  cache: { /* 10000 entries */ }
})

// Every property change triggers reactivity
largeData.value.users[0].posts[0].title = 'New'
// Vue checks all nested paths for changes
</script>
```

**Correct (shallow reactivity):**

```vue
<script setup>
// Only tracks top-level .value, not nested properties
const largeData = shallowRef({
  users: [
    { id: 1, name: 'Alice', posts: [...1000 items] },
    { id: 2, name: 'Bob', posts: [...1000 items] },
    // ... 1000 more users
  ],
  settings: { /* 100 nested properties */ },
  cache: { /* 10000 entries */ }
})

// To trigger updates, replace entire object
function updateUser(userId: number, updates: Partial<User>) {
  largeData.value = {
    ...largeData.value,
    users: largeData.value.users.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    )
  }
}
</script>
```

**Use cases for shallowRef:**

```typescript
// 1. Large arrays of data
const tableData = shallowRef<TableRow[]>([])

function updateTableData(newData: TableRow[]) {
  // Replace entire array to trigger reactivity
  tableData.value = newData
}

// 2. External library instances
const chartInstance = shallowRef<EChartsInstance | null>(null)

onMounted(() => {
  chartInstance.value = echarts.init(chartRef.value)
})

// 3. Large configuration objects
const appConfig = shallowRef({
  theme: { /* 100 properties */ },
  i18n: { /* 1000 translations */ },
  features: { /* 50 feature flags */ }
})

// 4. API responses with nested data
const apiResponse = shallowRef<ApiResponse | null>(null)

async function fetchData() {
  apiResponse.value = await $fetch('/api/large-dataset')
}
```

**shallowReactive for objects:**

```vue
<script setup>
// Only top-level properties are reactive
const state = shallowReactive({
  count: 0,
  nested: {
    // Changes here won't trigger reactivity!
    value: 10
  }
})

// This triggers reactivity
state.count++

// This doesn't trigger reactivity
state.nested.value = 20

// To update nested, replace entire object
state.nested = { value: 20 }
</script>
```

**Comparison:**

```typescript
// ref/reactive: Deep reactivity (default)
const deep = ref({
  a: { b: { c: { d: 1 } } }
})
deep.value.a.b.c.d++ // ✅ Triggers reactivity

// shallowRef/shallowReactive: Shallow reactivity
const shallow = shallowRef({
  a: { b: { c: { d: 1 } } }
})
shallow.value.a.b.c.d++ // ❌ No reactivity
shallow.value = { ...shallow.value } // ✅ Triggers reactivity
```

**When to use shallowRef:**

✅ **Use shallowRef for:**
- Large lists/tables (1000+ items)
- Chart.js, ECharts instances
- Large configuration objects
- API responses with deep nesting
- Immutable data patterns

❌ **Don't use shallowRef for:**
- Form state (needs nested reactivity)
- Small objects (<100 properties)
- Objects with frequent nested updates

**triggerRef for manual updates:**

```vue
<script setup>
const data = shallowRef({ count: 0 })

function increment() {
  // Mutate without triggering
  data.value.count++

  // Manually trigger reactivity
  triggerRef(data)
}
</script>
```

**Impact Analysis:**
- Performance gain: Significantly reduces reactivity overhead for large objects
- Use cases: Large datasets, external libraries, immutable data
- Considerations: Must replace entire value to trigger reactivity

Reference: [Vue shallowRef](https://vuejs.org/api/reactivity-advanced.html#shallowref)

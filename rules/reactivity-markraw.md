---
title: Use markRaw for Non-Reactive Data
impact: MEDIUM-HIGH
impactDescription: prevents unnecessary reactivity overhead
tags: reactivity, markRaw, performance, optimization
---

## Use markRaw for Non-Reactive Data

> **Vue 3 Only**: `markRaw` is only available in Vue 3. For Vue 2, use `Object.freeze()` or avoid adding objects to reactive state.

Use `markRaw()` to mark objects that should never be made reactive, avoiding unnecessary performance overhead.

**Incorrect (makes non-reactive objects reactive):**

```vue
<script setup>
import * as echarts from 'echarts'

const chartInstance = ref(null)

onMounted(() => {
  // Vue wraps ECharts instance in reactivity!
  // Huge performance overhead for no benefit
  chartInstance.value = echarts.init(el)
})
</script>
```

**Correct (skip reactivity with markRaw):**

```vue
<script setup>
import * as echarts from 'echarts'
import { markRaw } from 'vue'

const chartInstance = ref(null)

onMounted(() => {
  // markRaw prevents Vue from making it reactive
  chartInstance.value = markRaw(echarts.init(el))
})
</script>
```

**Common use cases:**

```typescript
// 1. Large external library instances
const editor = shallowRef(null)

onMounted(() => {
  editor.value = markRaw(new Monaco.Editor(...))
})

// 2. Three.js / graphics libraries
const scene = shallowRef(null)
const camera = shallowRef(null)

scene.value = markRaw(new THREE.Scene())
camera.value = markRaw(new THREE.PerspectiveCamera(...))

// 3. Leaflet / mapping libraries
const map = shallowRef(null)

map.value = markRaw(L.map('map'))

// 4. Large data structures from external sources
const largeDataset = shallowRef(null)

largeDataset.value = markRaw(await loadHugeDataset())
```

**markRaw with reactive:**

```vue
<script setup>
// Incorrect: reactive wraps everything
const state = reactive({
  chart: null,
  data: []
})

state.chart = echarts.init(el) // Made reactive!

// Correct: markRaw for non-reactive fields
const state = reactive({
  chart: markRaw(echarts.init(el)),
  data: [] // Only data is reactive
})
</script>
```

**Store pattern with markRaw:**

```typescript
// stores/chartStore.ts
import { markRaw } from 'vue'

const state = reactive({
  charts: new Map() // Map itself is reactive
})

export function useChartStore() {
  function addChart(id: string, instance: EChartsInstance) {
    // Store instance with markRaw
    state.charts.set(id, markRaw(instance))
  }

  function removeChart(id: string) {
    const chart = state.charts.get(id)
    chart?.dispose()
    state.charts.delete(id)
  }

  return { state, addChart, removeChart }
}
```

**Combine with shallowRef:**

```vue
<script setup>
// Best practice: shallowRef + markRaw
const editorInstance = shallowRef(null)

onMounted(() => {
  editorInstance.value = markRaw(
    monaco.editor.create(el, {
      value: code.value,
      language: 'javascript'
    })
  )
})

onUnmounted(() => {
  editorInstance.value?.dispose()
})
</script>
```

**When NOT to use markRaw:**

```typescript
// ❌ Don't mark raw for data you need to track
const user = ref(markRaw({ name: 'Alice' }))
// Changes to user.value.name won't be reactive!

// ❌ Don't mark raw for Vue components
const dynamicComponent = markRaw(MyComponent)
// Will break component reactivity

// ❌ Don't mark raw for small objects
const config = ref(markRaw({ theme: 'dark' }))
// Unnecessary, the overhead is minimal
```

**isReactive check:**

```typescript
const obj = { count: 0 }
const reactiveObj = reactive(obj)
const rawObj = markRaw(obj)

console.log(isReactive(reactiveObj)) // true
console.log(isReactive(rawObj)) // false
```

**Large dataset example:**

```typescript
// composables/useDataTable.ts
import { markRaw, shallowRef } from 'vue'

export function useDataTable() {
  // Store large dataset without reactivity
  const rawData = shallowRef<any[]>([])

  // Only filtered/sorted results are reactive
  const displayData = computed(() => {
    return rawData.value
      .filter(filterFn)
      .sort(sortFn)
      .slice(0, pageSize)
  })

  async function loadData() {
    const data = await fetchLargeDataset()
    // Mark raw to avoid tracking 10,000+ items
    rawData.value = markRaw(data)
  }

  return { displayData, loadData }
}
```

**Complex object with selective reactivity:**

```typescript
// Only make specific fields reactive
const state = reactive({
  // Reactive fields
  isLoading: false,
  error: null,

  // Non-reactive fields
  chartInstance: markRaw(null),
  mapInstance: markRaw(null),
  editorInstance: markRaw(null)
})
```

**Performance comparison:**

```typescript
// Without markRaw (slow):
const chart = ref(echarts.init(el))
// Vue creates 1000+ reactive getters/setters for chart properties

// With markRaw (fast):
const chart = ref(markRaw(echarts.init(el)))
// Vue only tracks the ref, not chart properties
```

**Best practices:**

✅ **Use markRaw for:**
- External library instances (ECharts, Three.js, Monaco, etc.)
- Large data structures that don't need reactivity
- Heavy objects from APIs that are immutable
- Non-Vue components or DOM elements

❌ **Don't use markRaw for:**
- Vue component instances
- Small objects (<100 properties)
- Data that needs reactive tracking
- Props or injected values

**Impact Analysis:**
- Performance gain: Dramatically reduces memory and CPU overhead for large objects
- Use cases: Chart libraries, graphics engines, large datasets
- Considerations: Cannot be made reactive later

Reference: [Vue markRaw](https://vuejs.org/api/reactivity-advanced.html#markraw)

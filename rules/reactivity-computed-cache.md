---
title: Use Computed to Cache Calculated Results
impact: HIGH
impactDescription: Computed properties cache results, avoiding repeated calculations, more efficient than methods
tags: vue2, vue3, computed, reactivity, performance
---

## Use Computed to Cache Calculated Results

Use `computed` instead of `methods` or inline calculations in templates to leverage Vue's caching mechanism and avoid repeated calculations.

**Incorrect (Repeated Calculations):**

```vue
<template>
  <!-- Filter + sort + slice runs on every render -->
  <div v-for="item in items.filter(i => i.active).sort((a,b) => a.price - b.price).slice(0, 10)">
    {{ item.name }}
  </div>

  <!-- Methods run on every render -->
  <div>Total: {{ calculateTotal() }}</div>
  <div>Discount: {{ calculateTotal() * 0.9 }}</div>  <!-- Calculated again -->
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    calculateTotal() {
      console.log('Calculating total')  // Will see multiple outputs
      return this.items.reduce((sum, item) => sum + item.price, 0)
    }
  }
}
</script>
```

```vue
<!-- Vue 3 incorrect example -->
<template>
  <div v-for="item in filterAndSort()">  <!-- Executes on every render -->
    {{ item.name }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([])

function filterAndSort() {
  console.log('Filtering and sorting')  // Will output frequently
  return items.value
    .filter(i => i.active)
    .sort((a, b) => a.price - b.price)
}
</script>
```

**Correct (Using Computed Caching):**

```vue
<template>
  <!-- Computed only recalculates when dependencies change -->
  <div v-for="item in topActiveItems">
    {{ item.name }}
  </div>

  <div>Total: {{ total }}</div>
  <div>Discount: {{ total * 0.9 }}</div>  <!-- Uses cached total -->
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    topActiveItems() {
      return this.items
        .filter(i => i.active)
        .sort((a, b) => a.price - b.price)
        .slice(0, 10)
    },
    total() {
      console.log('Calculating total')  // Only outputs once when items change
      return this.items.reduce((sum, item) => sum + item.price, 0)
    }
  }
}
</script>
```

```vue
<!-- Vue 3 Composition API -->
<script setup>
import { ref, computed } from 'vue'

const items = ref([])

const topActiveItems = computed(() => {
  console.log('Filtering and sorting')  // Only executes when items change
  return items.value
    .filter(i => i.active)
    .sort((a, b) => a.price - b.price)
    .slice(0, 10)
})

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)
</script>

<template>
  <div v-for="item in topActiveItems" :key="item.id">
    {{ item.name }}
  </div>
  <div>Total: {{ total }}</div>
  <div>Discount: {{ total * 0.9 }}</div>
</template>
```

**Impact Analysis:**
- Performance gain: Avoids repeated calculations, especially significant with large datasets or complex calculations
- Use cases: Any scenario requiring derived values from reactive data
- Considerations: Computed should be pure functions without side effects

**When to Use Methods:**
- Need to pass parameters
- Need to execute every time (like form submission)
- Operations with side effects

Reference: [Vue Computed Properties](https://vuejs.org/guide/essentials/computed.html)

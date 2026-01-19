---
title: Use key to Optimize List Rendering
impact: HIGH
impactDescription: Properly using key helps Vue efficiently reuse and reorder existing elements
tags: vue2, vue3, rendering, v-for, key
---

## Use key to Optimize List Rendering

Properly use `key` in `v-for` to help Vue efficiently update the DOM.

**Incorrect:**

```vue
<template>
  <!-- Wrong: using index as key -->
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
    <input v-model="item.value" />
  </div>

  <!-- Wrong: no key -->
  <div v-for="item in items">
    {{ item.name }}
  </div>

  <!-- Wrong: using non-unique value as key -->
  <div v-for="item in items" :key="item.type">
    {{ item.name }}
  </div>
</template>
```

**Why Can't Use Index?**

```vue
<template>
  <!-- Assume initial list: [{id: 1, name: 'A'}, {id: 2, name: 'B'}] -->
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
    <input :value="item.value" />
  </div>

  <!-- After deleting first item: [{id: 2, name: 'B'}] -->
  <!-- Vue thinks the item at index=0 is still the original item, just data changed -->
  <!-- This causes input values to be misaligned! -->
</template>
```

**Correct:**

```vue
<template>
  <!-- Correct: use unique and stable id -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
    <input v-model="item.value" />
  </div>
</template>
```

```vue
<template>
  <!-- Database records -->
  <div v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>

  <!-- API returned data -->
  <div v-for="product in products" :key="product.productId">
    {{ product.title }}
  </div>

  <!-- If no id exists, can generate unique identifier -->
  <div v-for="item in processedItems" :key="item._uid">
    {{ item.name }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const items = ref([/* ... */])

// Generate unique identifiers for data without id
const processedItems = computed(() =>
  items.value.map((item, index) => ({
    ...item,
    _uid: `${item.name}-${index}-${Date.now()}`  // Generated only once when data loads
  }))
)
</script>
```

**When Can Use Index:**

Only when the list satisfies **ALL** of the following conditions:
1. List is static (no add/delete/update)
2. List items have no state (no input fields, selection state, etc.)
3. List items won't be reordered

```vue
<template>
  <!-- Can use index: purely static display -->
  <div v-for="(color, index) in ['red', 'green', 'blue']" :key="index">
    {{ color }}
  </div>
</template>
```

**key in Components:**

```vue
<template>
  <!-- key for component reuse control -->
  <transition>
    <component :is="currentView" :key="currentView" />
  </transition>

  <!-- Force re-render -->
  <my-component :key="resetKey" />
</template>

<script setup>
const resetKey = ref(0)

function resetComponent() {
  resetKey.value++  // Change key to force component recreation
}
</script>
```

**Impact Analysis:**
- Performance gain: Correct key allows Vue to reuse DOM, reducing unnecessary creation/destruction
- Common issues: Using index as key leads to state confusion and performance degradation
- Best practice: Always use stable unique identifiers

**Performance Comparison:**

```js
// Good key: O(1) lookup
items.map(item => ({ ...item, key: item.id }))

// Bad key: may lead to O(n) DOM operations
items.map((item, index) => ({ ...item, key: index }))
```

Reference: [Vue List Rendering - key](https://vuejs.org/guide/essentials/list.html#maintaining-state-with-key)

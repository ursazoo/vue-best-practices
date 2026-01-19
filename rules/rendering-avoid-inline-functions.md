---
title: Avoid Inline Functions in Loops
impact: MEDIUM
impactDescription: Inline functions in v-for are recreated on every render, affecting performance
tags: vue2, vue3, rendering, v-for, performance
---

## Avoid Inline Functions in Loops

Avoid using inline functions and arrow functions in `v-for` loops, as they are recreated on every render.

**Incorrect:**

```vue
<template>
  <!-- New function created on every render -->
  <div v-for="item in items" :key="item.id">
    <button @click="() => handleClick(item.id)">
      Delete
    </button>
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>
```

```vue
<template>
  <!-- New filter function created on every render -->
  <div v-for="item in items.filter(i => i.active)" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

**Correct:**

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <!-- Use method reference -->
    <button @click="handleClick(item.id)">
      Delete
    </button>
    <!-- Use computed or methods -->
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(id) {
      // Handle logic
    },
    formatName(name) {
      return name.toUpperCase()
    }
  }
}
</script>
```

```vue
<template>
  <!-- Use computed for filtering -->
  <div v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </div>
</template>

<script>
export default {
  computed: {
    activeItems() {
      return this.items.filter(i => i.active)
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

// Use computed to cache filter results
const activeItems = computed(() =>
  items.value.filter(i => i.active)
)

// Define at outer level, won't be recreated
function handleClick(id) {
  console.log('Delete', id)
}

function formatName(name) {
  return name.toUpperCase()
}
</script>

<template>
  <div v-for="item in activeItems" :key="item.id">
    <button @click="handleClick(item.id)">Delete</button>
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>
```

**Child Component Optimization:**

```vue
<!-- Wrong: passing new function every time -->
<template>
  <child-item
    v-for="item in items"
    :key="item.id"
    :item="item"
    @delete="() => handleDelete(item.id)"
  />
</template>
```

```vue
<!-- Correct: pass id, emit from child component -->
<template>
  <child-item
    v-for="item in items"
    :key="item.id"
    :item="item"
    @delete="handleDelete"
  />
</template>

<!-- Child component -->
<script setup>
const props = defineProps(['item'])
const emit = defineEmits(['delete'])

function onDelete() {
  emit('delete', props.item.id)
}
</script>
```

**Impact Analysis:**
- Performance gain: Noticeable difference with large lists (100+ items)
- Use cases: v-for loops, event handling, props passing
- Considerations: Watch for `this` binding with method references (not needed in Vue 3)

Reference: [Vue List Rendering](https://vuejs.org/guide/essentials/list.html)

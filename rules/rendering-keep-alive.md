---
title: Use keep-alive to Cache Components
impact: HIGH
impactDescription: keep-alive caches component state, avoiding repeated rendering and data fetching
tags: vue2, vue3, rendering, caching, performance
---

## Use keep-alive to Cache Components

Use `<keep-alive>` to cache inactive component instances, avoiding repeated rendering and data fetching.

**Incorrect (No Caching):**

```vue
<template>
  <!-- Component is destroyed and recreated on tab switch -->
  <component :is="currentTab" />
</template>

<script setup>
import { ref } from 'vue'
import TabA from './TabA.vue'  // Contains expensive API calls
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const currentTab = ref('TabA')
// Data is refetched and re-rendered on every switch
</script>
```

```vue
<!-- Vue Router without caching -->
<template>
  <router-view />  <!-- Component destroyed on page switch -->
</template>
```

**Correct (Using keep-alive):**

```vue
<template>
  <!-- Cache all tabs -->
  <keep-alive>
    <component :is="currentTab" />
  </keep-alive>
</template>

<script setup>
import { ref } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const currentTab = ref('TabA')
// Component state is preserved, no data refetch on switch
</script>
```

```vue
<!-- Selective caching -->
<template>
  <keep-alive :include="['TabA', 'TabB']" :exclude="['TabC']">
    <component :is="currentTab" />
  </keep-alive>
</template>
```

```vue
<!-- Limit cache count -->
<template>
  <keep-alive :max="10">
    <component :is="currentTab" />
  </keep-alive>
</template>
```

```vue
<!-- Vue Router caching -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedPages">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { ref } from 'vue'

// Dynamically control cache
const cachedPages = ref(['HomePage', 'ProductList', 'UserProfile'])
</script>
```

**Lifecycle Hooks:**

```vue
<script>
export default {
  // Vue 2/3 Options API
  activated() {
    // Called when component is activated
    console.log('Component activated, can refresh data')
  },
  deactivated() {
    // Called when component is cached
    console.log('Component cached')
  }
}
</script>
```

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

// Vue 3 Composition API
onActivated(() => {
  console.log('Component activated')
  // Can refresh data here
})

onDeactivated(() => {
  console.log('Component cached')
})
</script>
```

**Impact Analysis:**
- Performance gain: Avoids repeated rendering and data fetching, especially for forms, lists, etc.
- Use cases: Tab switching, route caching, modals
- Considerations:
  - Uses additional memory
  - Use `max` to limit cache count
  - Use `include/exclude` for precise control

**Common Pattern:**

```js
// Mark pages that need caching in route config
{
  path: '/list',
  component: ListView,
  meta: { keepAlive: true }
}

// Control in App.vue based on meta
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" />
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" />
```

Reference: [Vue keep-alive](https://vuejs.org/guide/built-ins/keep-alive.html)

---
title: Parallel Data Fetching with Component Composition
impact: CRITICAL
impactDescription: eliminates server-side waterfalls
tags: server, nuxt, parallel-fetching, composition, useAsyncData
---

## Parallel Data Fetching with Component Composition

Nuxt components with `useAsyncData` execute sequentially within a tree. Restructure with composition to parallelize data fetching.

**Incorrect (Sidebar waits for Page's fetch to complete):**

```vue
<!-- pages/index.vue -->
<script setup>
const { data: header } = await useAsyncData('header', () =>
  $fetch('/api/header')
)
</script>

<template>
  <div>
    <div>{{ header }}</div>
    <Sidebar />
  </div>
</template>

<!-- components/Sidebar.vue -->
<script setup>
// Waits for parent's useAsyncData to complete first!
const { data: items } = await useAsyncData('sidebar', () =>
  $fetch('/api/sidebar-items')
)
</script>
```

**Correct (both fetch simultaneously):**

```vue
<!-- components/Header.vue -->
<script setup>
const { data } = await useAsyncData('header', () =>
  $fetch('/api/header')
)
</script>

<template>
  <div>{{ data }}</div>
</template>

<!-- components/Sidebar.vue -->
<script setup>
const { data: items } = await useAsyncData('sidebar', () =>
  $fetch('/api/sidebar-items')
)
</script>

<template>
  <nav>
    <div v-for="item in items" :key="item.id">
      {{ item }}
    </div>
  </nav>
</template>

<!-- pages/index.vue -->
<script setup>
// Both components fetch in parallel
</script>

<template>
  <div>
    <Header />
    <Sidebar />
  </div>
</template>
```

**Alternative: Combine multiple fetches in one useAsyncData:**

```vue
<script setup>
const { data } = await useAsyncData('page-data', async () => {
  // Fetch in parallel with Promise.all
  const [header, sidebar] = await Promise.all([
    $fetch('/api/header'),
    $fetch('/api/sidebar-items')
  ])

  return { header, sidebar }
})

const header = computed(() => data.value?.header)
const sidebar = computed(() => data.value?.sidebar)
</script>
```

**Impact Analysis:**
- Performance gain: 2-5× faster page loads by eliminating sequential waterfalls
- Use cases: SSR pages, Nuxt layouts, nested components with data dependencies
- Considerations: Most effective when fetches are independent

Reference: [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)

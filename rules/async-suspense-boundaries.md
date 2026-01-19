---
title: Strategic Suspense Boundaries
impact: HIGH
impactDescription: faster initial paint
tags: async, suspense, streaming, layout
---

## Strategic Suspense Boundaries

> **Vue 3 Only**: `<Suspense>` is only available in Vue 3 and is still experimental. For Vue 2, use manual loading states with `v-if`.

Use Suspense boundaries to show wrapper UI faster while data loads, instead of blocking the entire component tree.

**Incorrect (entire layout blocked by data fetching):**

```vue
<script setup>
// Blocks entire page render
const data = await $fetch('/api/data')
</script>

<template>
  <div>
    <div>Sidebar</div>
    <div>Header</div>
    <div>
      <!-- Data display -->
      {{ data.content }}
    </div>
    <div>Footer</div>
  </div>
</template>
```

The entire layout waits for data even though only the middle section needs it.

**Correct (wrapper shows immediately, data streams in):**

```vue
<!-- Parent.vue -->
<template>
  <div>
    <div>Sidebar</div>
    <div>Header</div>
    <Suspense>
      <template #default>
        <DataDisplay />
      </template>
      <template #fallback>
        <Skeleton />
      </template>
    </Suspense>
    <div>Footer</div>
  </div>
</template>

<!-- DataDisplay.vue -->
<script setup>
// Only blocks this component
const data = await $fetch('/api/data')
</script>

<template>
  <div>{{ data.content }}</div>
</template>
```

**With error handling:**

```vue
<!-- Parent.vue -->
<template>
  <div>
    <div>Sidebar</div>
    <div>Header</div>
    <Suspense @resolve="onResolve" @pending="onPending">
      <template #default>
        <DataDisplay />
      </template>
      <template #fallback>
        <Skeleton />
      </template>
    </Suspense>
    <div>Footer</div>
  </div>
</template>

<script setup>
const error = ref<Error | null>(null)

function onResolve() {
  error.value = null
}

function onPending() {
  error.value = null
}
</script>

<!-- DataDisplay.vue with error boundary -->
<script setup>
const { data, error } = await useAsyncData('data', () =>
  $fetch('/api/data')
)

// Handle errors in component
if (error.value) {
  throw error.value
}
</script>

<template>
  <div>{{ data?.content }}</div>
</template>
```

Sidebar, Header, and Footer render immediately. Only DataDisplay waits for data.

**Nuxt with Suspense:**

```vue
<!-- pages/dashboard.vue -->
<template>
  <div>
    <nav>Navigation</nav>

    <Suspense>
      <template #default>
        <AsyncDashboardContent />
      </template>
      <template #fallback>
        <div class="loading">Loading dashboard...</div>
      </template>
    </Suspense>

    <footer>Footer</footer>
  </div>
</template>

<!-- components/AsyncDashboardContent.vue -->
<script setup>
// Use top-level await - automatically works with Suspense
const { data } = await useAsyncData('dashboard', () =>
  $fetch('/api/dashboard')
)
</script>
```

**Share promise across components:**

```vue
<!-- Parent.vue -->
<script setup>
// Start fetch immediately, don't await
const dataPromise = $fetch('/api/data')
</script>

<template>
  <div>
    <nav>Navigation</nav>

    <Suspense>
      <template #default>
        <DataDisplay :promise="dataPromise" />
        <DataSummary :promise="dataPromise" />
      </template>
      <template #fallback>
        <Skeleton />
      </template>
    </Suspense>
  </div>
</template>

<!-- DataDisplay.vue -->
<script setup>
const props = defineProps<{ promise: Promise<Data> }>()
const data = await props.promise // Unwraps the promise
</script>

<!-- DataSummary.vue -->
<script setup>
const props = defineProps<{ promise: Promise<Data> }>()
const data = await props.promise // Reuses the same promise
</script>
```

Both components share the same promise, so only one fetch occurs.

**Multiple Suspense boundaries for fine-grained loading:**

```vue
<template>
  <div>
    <!-- Critical content loads first -->
    <Suspense>
      <AsyncHeader />
      <template #fallback>
        <HeaderSkeleton />
      </template>
    </Suspense>

    <!-- Main content loads separately -->
    <Suspense>
      <AsyncMainContent />
      <template #fallback>
        <ContentSkeleton />
      </template>
    </Suspense>

    <!-- Sidebar loads independently -->
    <Suspense>
      <AsyncSidebar />
      <template #fallback>
        <SidebarSkeleton />
      </template>
    </Suspense>
  </div>
</template>
```

**When NOT to use this pattern:**

- Critical data needed for layout decisions
- SEO-critical content above the fold
- Small, fast queries where Suspense overhead isn't worth it
- When you want to avoid layout shift

**Trade-off:** Faster initial paint vs potential layout shift. Choose based on UX priorities.

Reference: [Vue Suspense](https://vuejs.org/guide/built-ins/suspense.html)

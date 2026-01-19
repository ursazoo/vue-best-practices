---
title: Cache Repeated Function Calls
impact: MEDIUM
impactDescription: avoid redundant computation in loops and renders
tags: javascript, cache, memoization, performance
---

## Cache Repeated Function Calls

Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render or data processing.

**Incorrect (redundant computation):**

```vue
<script setup>
import { slugify } from './utils'

const projects = ref([...]) // 100+ projects

const projectList = computed(() => {
  return projects.value.map(project => ({
    ...project,
    // slugify() called 100+ times for same project names on each render
    slug: slugify(project.name)
  }))
})
</script>
```

**Correct (cached results):**

```vue
<script setup>
import { slugify } from './utils'

// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

const projects = ref([...])

const projectList = computed(() => {
  return projects.value.map(project => ({
    ...project,
    // Computed only once per unique project name
    slug: cachedSlugify(project.name)
  }))
})
</script>
```

**Simpler pattern for single-value functions:**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }

  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null
}
```

**Impact Analysis:**
- Performance gain: Eliminates redundant expensive computations in loops and computed properties
- Use cases: Slugification, formatting, parsing, validation functions called repeatedly
- Considerations: Use Map (not Vue ref/reactive) so it works in utilities, composables, and event handlers

Reference: [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

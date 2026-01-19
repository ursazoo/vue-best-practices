---
title: Parallel Requests Instead of Sequential
impact: CRITICAL
impactDescription: Sequential requests create request waterfalls, severely impacting page load performance
tags: async, api, nuxt, performance
---

## Parallel Requests Instead of Sequential

Execute independent async requests in parallel rather than waiting for each one sequentially. This is one of the most common and impactful performance issues.

**Incorrect (Sequential Requests):**

```vue
<script setup>
// Vue 3 Composition API
const userData = await $fetch('/api/user')
const posts = await $fetch('/api/posts')  // Waits for userData to complete
const comments = await $fetch('/api/comments')  // Waits for posts to complete
</script>
```

```js
// Vue 2 + async/await
async created() {
  this.userData = await this.$axios.$get('/api/user')
  this.posts = await this.$axios.$get('/api/posts')  // Sequential execution
  this.comments = await this.$axios.$get('/api/comments')
}
```

**Correct (Parallel Requests):**

```vue
<script setup>
// Vue 3 Composition API
const [userData, posts, comments] = await Promise.all([
  $fetch('/api/user'),
  $fetch('/api/posts'),
  $fetch('/api/comments')
])
</script>
```

```js
// Vue 2 + async/await
async created() {
  const [userData, posts, comments] = await Promise.all([
    this.$axios.$get('/api/user'),
    this.$axios.$get('/api/posts'),
    this.$axios.$get('/api/comments')
  ])

  this.userData = userData
  this.posts = posts
  this.comments = comments
}
```

```vue
<!-- Nuxt 3 -->
<script setup>
const { data: userData } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')
// Nuxt automatically parallelizes these useFetch calls
</script>
```

**Impact Analysis:**
- Performance gain: 3 requests of 200ms each take 600ms sequentially, but only 200ms in parallel
- Use cases: All data fetching scenarios where requests don't depend on each other
- Considerations: Ensure requests truly have no dependencies

Reference: [MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

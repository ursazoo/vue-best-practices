---
title: Build Index Maps for Repeated Lookups
impact: MEDIUM
impactDescription: O(1) lookups vs repeated O(n) searches
tags: javascript, data-structures, map, indexing, performance
---

## Build Index Maps for Repeated Lookups

When you need to look up items by ID repeatedly, build an index Map upfront instead of searching the array each time.

**Incorrect (repeated O(n) array searches):**

```vue
<script setup>
const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // ...1000 more users
])

const posts = ref([
  { id: 101, userId: 1, title: 'Post 1' },
  { id: 102, userId: 2, title: 'Post 2' },
  // ...5000 more posts
])

// O(n) search for EVERY post
const enrichedPosts = computed(() => {
  return posts.value.map(post => {
    const user = users.value.find(u => u.id === post.userId) // O(n) lookup
    return {
      ...post,
      userName: user?.name ?? 'Unknown'
    }
  })
})
// Total: O(posts × users) = 5000 × 1000 = 5 million operations!
</script>
```

**Correct (build index Map once, O(1) lookups):**

```vue
<script setup>
const users = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // ...1000 more users
])

const posts = ref([
  { id: 101, userId: 1, title: 'Post 1' },
  { id: 102, userId: 2, title: 'Post 2' },
  // ...5000 more posts
])

// Build index Map once: O(users)
const userMap = computed(() => {
  return new Map(users.value.map(u => [u.id, u]))
})

// O(1) lookup for each post
const enrichedPosts = computed(() => {
  return posts.value.map(post => {
    const user = userMap.value.get(post.userId) // O(1) lookup
    return {
      ...post,
      userName: user?.name ?? 'Unknown'
    }
  })
})
// Total: O(users + posts) = 1000 + 5000 = 6000 operations
</script>
```

**Composable pattern for reusable indexing:**

```typescript
// composables/useIndexedData.ts
export function useIndexedData<T extends { id: number | string }>(
  items: Ref<T[]>
) {
  const itemMap = computed(() => {
    return new Map(items.value.map(item => [item.id, item]))
  })

  const getById = (id: number | string) => {
    return itemMap.value.get(id)
  }

  return { itemMap, getById }
}

// Usage
const { getById: getUser } = useIndexedData(users)
const enrichedPosts = computed(() => {
  return posts.value.map(post => ({
    ...post,
    userName: getUser(post.userId)?.name ?? 'Unknown'
  }))
})
```

**Impact Analysis:**
- Performance gain: 100-1000× faster with large datasets and multiple lookups
- Use cases: Joining data, enriching objects, relational data processing
- Considerations: Trade-off of O(n) Map creation for massive O(1) lookup savings

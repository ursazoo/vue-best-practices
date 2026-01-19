---
title: Optimize Payload Serialization
impact: MEDIUM
impactDescription: reduces payload size and parsing time
tags: server, nuxt, serialization, payload, json
---

## Optimize Payload Serialization

Optimize data serialization to reduce payload size and parsing time during SSR hydration.

**Incorrect (sends unnecessary data to client):**

```vue
<!-- pages/user/[id].vue -->
<script setup>
const route = useRoute()
const id = route.params.id

const { data: user } = await useAsyncData('user', async () => {
  const user = await $fetch(`/api/user/${id}`)

  // Sends ENTIRE user object to client (100KB+)
  // Including sensitive/unnecessary fields:
  return user
  // {
  //   id, name, email,
  //   passwordHash, resetToken, // Sensitive!
  //   createdAt, updatedAt,
  //   fullProfileData, // 80KB of data
  //   internalNotes, // Not needed on client
  //   ...50 more fields
  // }
})
</script>
```

**Correct (only send needed data):**

```vue
<!-- pages/user/[id].vue -->
<script setup>
const route = useRoute()
const id = route.params.id

const { data: user } = await useAsyncData('user', async () => {
  const user = await $fetch(`/api/user/${id}`)

  // Only send fields needed for rendering
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    stats: {
      posts: user.postCount,
      followers: user.followerCount
    }
  }
  // Reduced from 100KB to 2KB!
})
</script>
```

**Use transforms to filter server data:**

```typescript
// server/api/user/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const user = await db.user.findUnique({
    where: { id },
    // Only select needed fields at database level
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      _count: {
        select: {
          posts: true,
          followers: true
        }
      }
    }
  })

  return user
})
```

**Avoid serializing large objects:**

```vue
<script setup>
// Incorrect: Serializes Date objects (slow)
const { data } = await useAsyncData('posts', async () => {
  const posts = await $fetch('/api/posts')
  return posts // Contains Date objects
})

// Correct: Convert to ISO strings
const { data } = await useAsyncData('posts', async () => {
  const posts = await $fetch('/api/posts')
  return posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(), // String instead of Date
    updatedAt: post.updatedAt.toISOString()
  }))
})
</script>
```

**Deduplicate repeated data:**

```typescript
// Incorrect: Sends author object for each post
const posts = [
  { id: 1, title: 'Post 1', author: { id: 1, name: 'Alice', bio: '...' } },
  { id: 2, title: 'Post 2', author: { id: 1, name: 'Alice', bio: '...' } },
  { id: 3, title: 'Post 3', author: { id: 1, name: 'Alice', bio: '...' } }
]
// Sends author data 3 times!

// Correct: Normalize data structure
const response = {
  posts: [
    { id: 1, title: 'Post 1', authorId: 1 },
    { id: 2, title: 'Post 2', authorId: 1 },
    { id: 3, title: 'Post 3', authorId: 1 }
  ],
  authors: {
    1: { id: 1, name: 'Alice', bio: '...' }
  }
}
// Sends author data once!
```

**Configure payload extraction:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    // Extract payload to separate file
    payloadExtraction: true
  },

  nitro: {
    // Compress responses
    compressPublicAssets: true
  }
})
```

**Impact Analysis:**
- Performance gain: 50-90% reduction in payload size, faster hydration
- Use cases: User profiles, product listings, large data sets
- Considerations: Always validate data structure before serialization

Reference: [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)

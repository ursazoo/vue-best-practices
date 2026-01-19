---
title: Implement LRU Cache for In-Memory Data
impact: HIGH
impactDescription: prevents memory leaks and improves cache hit rate
tags: server, caching, lru, memory-management
---

## Implement LRU Cache for In-Memory Data

Use an LRU (Least Recently Used) cache for in-memory data storage to prevent unbounded memory growth while maintaining high cache hit rates.

**Incorrect (unbounded Map grows infinitely):**

```typescript
// server/utils/cache.ts
const cache = new Map<string, any>()

export function getCachedData(key: string, fetcher: () => Promise<any>) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const data = await fetcher()
  cache.set(key, data) // Cache grows forever!
  return data
}

// After 10,000 requests with unique keys:
// Memory usage: unbounded, potential memory leak
```

**Correct (LRU cache with max size):**

```typescript
// server/utils/lru-cache.ts
import { LRUCache } from 'lru-cache'

// Create LRU cache with max 1000 items, 1 hour TTL
const cache = new LRUCache<string, any>({
  max: 1000, // Maximum items
  ttl: 1000 * 60 * 60, // 1 hour in milliseconds
  updateAgeOnGet: true, // Refresh TTL on access
  updateAgeOnHas: false
})

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key)
  if (cached !== undefined) {
    return cached
  }

  const data = await fetcher()
  cache.set(key, data)
  return data
}

// After 10,000 requests:
// Memory usage: stable, only stores 1000 most recent items
```

**LRU cache for API responses:**

```typescript
// server/api/user/[id].get.ts
import { getCachedData } from '~/server/utils/lru-cache'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const cacheKey = `user:${id}`

  return await getCachedData(cacheKey, async () => {
    // Expensive database query
    const user = await db.user.findUnique({ where: { id } })

    // Expensive computation
    const enriched = await enrichUserData(user)

    return enriched
  })
})
```

**Custom LRU implementation (lightweight):**

```typescript
// server/utils/simple-lru.ts
class SimpleLRU<K, V> {
  private cache = new Map<K, V>()
  private maxSize: number

  constructor(maxSize: number = 500) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  set(key: K, value: V): void {
    // Delete if exists (to move to end)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Add to end
    this.cache.set(key, value)

    // Evict oldest if over max size
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

export const userCache = new SimpleLRU<string, User>(500)
```

**LRU with size-based eviction:**

```typescript
import { LRUCache } from 'lru-cache'

// Cache based on memory size instead of item count
const imageCache = new LRUCache<string, Buffer>({
  maxSize: 50 * 1024 * 1024, // 50MB max
  sizeCalculation: (value) => value.length,
  ttl: 1000 * 60 * 60 * 24 // 24 hours
})
```

**Impact Analysis:**
- Performance gain: Prevents memory leaks while maintaining high cache hit rates
- Use cases: User data, computed results, frequently accessed API responses
- Considerations: Choose `max` size based on available memory and access patterns

Reference: [lru-cache on npm](https://www.npmjs.com/package/lru-cache)

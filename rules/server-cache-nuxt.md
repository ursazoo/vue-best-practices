---
title: Cache Server Routes with defineCachedEventHandler
impact: HIGH
impactDescription: reduces server load and response time
tags: server, nuxt, caching, nitro, cachedEventHandler
---

## Cache Server Routes with defineCachedEventHandler

Use `defineCachedEventHandler` to cache API responses on the server, reducing database queries and computation.

**Incorrect (no caching, database hit on every request):**

```typescript
// server/api/products.get.ts
export default defineEventHandler(async (event) => {
  // Database query on EVERY request
  const products = await db.query('SELECT * FROM products')

  // Expensive computation on EVERY request
  const enriched = await enrichProductData(products)

  return enriched
})
// 1000 requests = 1000 database queries
```

**Correct (cached for 1 hour):**

```typescript
// server/api/products.get.ts
export default defineCachedEventHandler(
  async (event) => {
    // Database query only when cache is stale
    const products = await db.query('SELECT * FROM products')

    // Expensive computation only when cache is stale
    const enriched = await enrichProductData(products)

    return enriched
  },
  {
    maxAge: 60 * 60, // Cache for 1 hour
    swr: true // Serve stale content while revalidating
  }
)
// 1000 requests in 1 hour = 1-2 database queries
```

**Route Rules for page-level caching:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Cache homepage for 10 minutes
    '/': { swr: 600 },

    // Cache blog posts for 1 hour with stale-while-revalidate
    '/blog/**': { swr: 3600 },

    // Static generation for marketing pages
    '/about': { prerender: true },

    // No cache for admin pages
    '/admin/**': { ssr: false }
  }
})
```

**Custom cache key based on query parameters:**

```typescript
// server/api/search.get.ts
export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event)
    const results = await searchDatabase(query.q)
    return results
  },
  {
    maxAge: 60 * 10, // 10 minutes
    getKey: (event) => {
      const query = getQuery(event)
      return `search:${query.q}:${query.page || 1}`
    }
  }
)
```

**Vary cache by user authentication:**

```typescript
// server/api/user-data.get.ts
export default defineCachedEventHandler(
  async (event) => {
    const userId = event.context.auth?.userId
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const userData = await db.getUserData(userId)
    return userData
  },
  {
    maxAge: 60 * 5, // 5 minutes
    getKey: (event) => {
      const userId = event.context.auth?.userId
      return `user-data:${userId}`
    }
  }
)
```

**Impact Analysis:**
- Performance gain: 10-100× faster responses for cacheable data
- Use cases: Product listings, blog posts, user profiles, search results
- Considerations: Use `swr: true` for better UX (serve stale while revalidating)

Reference: [Nitro Caching](https://nitro.build/guide/cache)

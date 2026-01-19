---
title: Defer Await Until Needed
impact: HIGH
impactDescription: avoids blocking unused code paths
tags: async, await, conditional, optimization
---

## Defer Await Until Needed

Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.

**Incorrect (blocks both branches):**

```typescript
// composables/useUserAction.ts
export async function handleUserRequest(
  userId: string,
  skipProcessing: boolean
) {
  // Always fetches, even when skipping
  const userData = await $fetch(`/api/users/${userId}`)

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }

  // Only this branch uses userData
  return processUserData(userData)
}
```

**Correct (only blocks when needed):**

```typescript
// composables/useUserAction.ts
export async function handleUserRequest(
  userId: string,
  skipProcessing: boolean
) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }

  // Fetch only when needed
  const userData = await $fetch(`/api/users/${userId}`)
  return processUserData(userData)
}
```

**Early return optimization:**

```typescript
// Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const [permissions, resource] = await Promise.all([
    $fetch(`/api/permissions/${userId}`),
    $fetch(`/api/resources/${resourceId}`)
  ])

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}

// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  // Check resource first (fast, often fails)
  const resource = await $fetch(`/api/resources/${resourceId}`)

  if (!resource) {
    return { error: 'Not found' }
  }

  // Only fetch permissions if resource exists
  const permissions = await $fetch(`/api/permissions/${userId}`)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```

**Vue composable example:**

```vue
<script setup>
// composables/useDataFetch.ts
export function useDataFetch(options: FetchOptions) {
  const data = ref(null)
  const loading = ref(false)

  async function fetchData() {
    // Check cache first (synchronous)
    const cached = getCachedData(options.key)
    if (cached && !options.forceRefresh) {
      data.value = cached
      return cached
    }

    // Only fetch if not cached or force refresh
    loading.value = true
    try {
      const result = await $fetch(options.url)
      data.value = result
      cacheData(options.key, result)
      return result
    } finally {
      loading.value = false
    }
  }

  return { data, loading, fetchData }
}
</script>
```

**Conditional loading in components:**

```vue
<script setup>
const props = defineProps<{
  userId: string
  loadDetails: boolean
}>()

const user = ref(null)
const details = ref(null)

onMounted(async () => {
  // Always load user
  user.value = await $fetch(`/api/users/${props.userId}`)

  // Only load details if needed
  if (props.loadDetails) {
    details.value = await $fetch(`/api/users/${props.userId}/details`)
  }
})
</script>
```

**Nuxt server route example:**

```typescript
// server/api/orders/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  // Always fetch order
  const order = await db.order.findUnique({
    where: { id }
  })

  if (!order) {
    throw createError({
      statusCode: 404,
      message: 'Order not found'
    })
  }

  // Only fetch tracking if requested
  if (query.includeTracking === 'true') {
    order.tracking = await fetchTrackingInfo(order.trackingNumber)
  }

  return order
})
```

**Impact Analysis:**
- Performance gain: Eliminates unnecessary async operations in fast-fail paths
- Use cases: Permission checks, validation, conditional features
- Considerations: Most valuable when the skipped branch is frequently taken

This optimization is especially valuable when the deferred operation is expensive or when early returns are common.

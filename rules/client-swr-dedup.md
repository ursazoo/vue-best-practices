---
title: Deduplicate API Requests with Composables
impact: MEDIUM-HIGH
impactDescription: automatic request deduplication and caching
tags: client, deduplication, data-fetching, caching
---

## Deduplicate API Requests with Composables

Share data fetching across component instances to avoid making duplicate requests.

**Incorrect (no deduplication, each instance fetches):**

```vue
<script setup>
// Every component instance makes its own request
const users = ref([])
const loading = ref(true)

onMounted(async () => {
  const response = await fetch('/api/users')
  users.value = await response.json()
  loading.value = false
})
</script>
```

**Correct (shared cache, single request):**

```vue
<script setup>
// composables/useUsers.ts
const usersCache = ref<User[] | null>(null)
const loadingCache = ref(false)
const pendingPromise = ref<Promise<User[]> | null>(null)

export function useUsers() {
  // Return cached data immediately
  if (usersCache.value !== null) {
    return {
      data: usersCache,
      loading: ref(false),
      refresh: fetchUsers
    }
  }

  // If request is in flight, wait for it
  if (pendingPromise.value) {
    return {
      data: usersCache,
      loading: loadingCache,
      refresh: fetchUsers
    }
  }

  // Start new request
  fetchUsers()

  return {
    data: usersCache,
    loading: loadingCache,
    refresh: fetchUsers
  }
}

async function fetchUsers() {
  if (pendingPromise.value) {
    return pendingPromise.value
  }

  loadingCache.value = true

  pendingPromise.value = fetch('/api/users')
    .then(r => r.json())
    .then(data => {
      usersCache.value = data
      loadingCache.value = false
      return data
    })
    .finally(() => {
      pendingPromise.value = null
    })

  return pendingPromise.value
}

// Usage in multiple components:
const { data: users, loading } = useUsers()
// All instances share the same data and request
</script>
```

**Use VueUse's createSharedComposable:**

```typescript
// composables/useUsers.ts
import { createSharedComposable } from '@vueuse/core'

// Regular composable (not shared)
function _useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    const response = await fetch('/api/users')
    users.value = await response.json()
    loading.value = false
  }

  onMounted(() => {
    fetchUsers()
  })

  return { users, loading, refresh: fetchUsers }
}

// Shared version: all instances use the same state
export const useUsers = createSharedComposable(_useUsers)
```

**Usage:**

```vue
<!-- Component A -->
<script setup>
const { users, loading } = useUsers()
// Fetches data
</script>

<!-- Component B -->
<script setup>
const { users, loading } = useUsers()
// Reuses data from Component A, no new fetch!
</script>
```

**Nuxt's useAsyncData (automatic deduplication):**

```vue
<script setup>
// Nuxt automatically deduplicates by key
const { data: users } = await useAsyncData('users', () =>
  $fetch('/api/users')
)

// In another component with the same key:
const { data: users } = await useAsyncData('users', () =>
  $fetch('/api/users')
)
// Nuxt reuses the cached result, no duplicate request!
</script>
```

**With revalidation:**

```typescript
// composables/useUsersWithRevalidation.ts
import { createSharedComposable } from '@vueuse/core'

function _useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      const response = await fetch('/api/users')
      users.value = await response.json()
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on mount
  onMounted(() => {
    fetchUsers()
  })

  // Revalidate on window focus
  useEventListener('focus', () => {
    if (users.value.length > 0) {
      fetchUsers()
    }
  })

  return { users, loading, refresh: fetchUsers }
}

export const useUsers = createSharedComposable(_useUsers)
```

**Impact Analysis:**
- Performance gain: Eliminates duplicate API requests across component instances
- Use cases: User data, configuration, frequently accessed resources
- Considerations: Use Nuxt's `useAsyncData` or VueUse's `createSharedComposable`

Reference: [VueUse createSharedComposable](https://vueuse.org/shared/createSharedComposable/)

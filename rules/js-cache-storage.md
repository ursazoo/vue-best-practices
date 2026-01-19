---
title: Cache Storage API Access
impact: MEDIUM
impactDescription: avoid synchronous storage reads
tags: javascript, storage, localStorage, sessionStorage, performance
---

## Cache Storage API Access

Cache localStorage and sessionStorage reads to avoid synchronous I/O on every access.

**Incorrect (reads storage on every access):**

```vue
<script setup>
import { computed } from 'vue'

const isLoggedIn = computed(() => {
  // Synchronous disk I/O on EVERY computed access
  return localStorage.getItem('auth-token') !== null
})

const userPreferences = computed(() => {
  // Another synchronous read
  const prefs = localStorage.getItem('user-prefs')
  return prefs ? JSON.parse(prefs) : {}
})

// Called hundreds of times during rendering
</script>
```

**Correct (cache storage values):**

```vue
<script setup>
import { ref, computed } from 'vue'

// Read once at initialization
const authToken = ref(localStorage.getItem('auth-token'))
const userPrefs = ref(
  JSON.parse(localStorage.getItem('user-prefs') ?? '{}')
)

const isLoggedIn = computed(() => authToken.value !== null)
const userPreferences = computed(() => userPrefs.value)

// Update cache when storage changes
function updateAuthToken(token: string | null) {
  authToken.value = token
  if (token) {
    localStorage.setItem('auth-token', token)
  } else {
    localStorage.removeItem('auth-token')
  }
}

function updatePreferences(prefs: object) {
  userPrefs.value = prefs
  localStorage.setItem('user-prefs', JSON.stringify(prefs))
}
</script>
```

**Composable for cached storage:**

```typescript
// composables/useLocalStorage.ts
import { ref, watch } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  // Read once from storage
  const storedValue = localStorage.getItem(key)
  const data = ref<T>(
    storedValue ? JSON.parse(storedValue) : defaultValue
  )

  // Write to storage when ref changes
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return data
}

// Usage
const theme = useLocalStorage('theme', 'light')
const settings = useLocalStorage('settings', { notifications: true })
```

**Listen to storage events:**

```typescript
// Sync cache with storage events from other tabs
function setupStorageSync() {
  window.addEventListener('storage', (event) => {
    if (event.key === 'auth-token') {
      authToken.value = event.newValue
    }
    if (event.key === 'user-prefs') {
      userPrefs.value = event.newValue
        ? JSON.parse(event.newValue)
        : {}
    }
  })
}

onMounted(() => {
  setupStorageSync()
})
```

**VueUse example:**

```vue
<script setup>
import { useLocalStorage } from '@vueuse/core'

// Automatically cached and synced
const theme = useLocalStorage('theme', 'light')
const user = useLocalStorage('user', null)
</script>
```

**Impact Analysis:**
- Performance gain: Eliminates synchronous I/O overhead from hot paths
- Use cases: Authentication state, user preferences, cached data
- Considerations: Remember to invalidate cache when storage changes externally

Reference: [VueUse useLocalStorage](https://vueuse.org/core/useLocalStorage/)

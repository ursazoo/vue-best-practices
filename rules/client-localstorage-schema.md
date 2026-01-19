---
title: Version and Minimize localStorage Data
impact: MEDIUM
impactDescription: prevents schema conflicts, reduces storage size
tags: client, localStorage, storage, versioning, data-minimization
---

## Version and Minimize localStorage Data

Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data.

**Incorrect (no version, stores everything):**

```vue
<script setup>
const userConfig = ref({
  theme: 'dark',
  language: 'en',
  // ... 20 more fields
})

// No version, no error handling, stores entire object
localStorage.setItem('userConfig', JSON.stringify(userConfig.value))

// Later:
const data = localStorage.getItem('userConfig')
userConfig.value = JSON.parse(data) // Can throw!
</script>
```

**Correct (versioned, minimal, safe):**

```typescript
// composables/useUserConfig.ts
const VERSION = 'v2'

interface UserConfig {
  theme: 'light' | 'dark'
  language: string
}

export function useUserConfig() {
  const config = ref<UserConfig>({
    theme: 'light',
    language: 'en'
  })

  // Load from localStorage
  function load() {
    try {
      const data = localStorage.getItem(`userConfig:${VERSION}`)
      if (data) {
        config.value = JSON.parse(data)
      }
    } catch (error) {
      // Fails in: incognito mode, quota exceeded, disabled storage
      console.warn('Failed to load config:', error)
    }
  }

  // Save to localStorage
  function save() {
    try {
      localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config.value))
    } catch (error) {
      // Handle quota exceeded, incognito mode, etc.
      console.warn('Failed to save config:', error)
    }
  }

  // Watch for changes and auto-save
  watch(config, save, { deep: true })

  // Load on mount
  onMounted(() => {
    load()
    migrate() // Migrate from older versions
  })

  return { config }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1Data = localStorage.getItem('userConfig:v1')
    if (v1Data) {
      const old = JSON.parse(v1Data)
      // Transform old schema to new schema
      const migrated = {
        theme: old.darkMode ? 'dark' : 'light',
        language: old.lang || 'en'
      }
      localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(migrated))
      localStorage.removeItem('userConfig:v1')
    }
  } catch (error) {
    console.warn('Migration failed:', error)
  }
}
```

**VueUse useLocalStorage (recommended):**

```vue
<script setup>
import { useLocalStorage } from '@vueuse/core'

// Automatically handles serialization, errors, and syncing
const theme = useLocalStorage('theme:v1', 'light')
const language = useLocalStorage('language:v1', 'en')

// Update values normally
theme.value = 'dark'
// Automatically saved to localStorage!
</script>
```

**Store minimal fields from server responses:**

```typescript
interface FullUser {
  id: string
  name: string
  email: string
  passwordHash: string // DON'T store this!
  resetToken: string   // DON'T store this!
  preferences: {
    theme: string
    notifications: boolean
    // ... 20 more fields
  }
  // ... 50 more fields
}

// Only store what UI needs
function cacheUserPreferences(user: FullUser) {
  try {
    const minimal = {
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }
    localStorage.setItem('prefs:v1', JSON.stringify(minimal))
  } catch (error) {
    console.warn('Failed to cache preferences:', error)
  }
}
```

**Composable with versioning:**

```typescript
// composables/useVersionedStorage.ts
export function useVersionedStorage<T>(
  key: string,
  version: string,
  defaultValue: T
) {
  const versionedKey = `${key}:${version}`
  const data = useLocalStorage(versionedKey, defaultValue)

  // Clear old versions
  onMounted(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i)
      if (storageKey?.startsWith(`${key}:`) && storageKey !== versionedKey) {
        localStorage.removeItem(storageKey)
      }
    }
  })

  return data
}

// Usage:
const config = useVersionedStorage('userConfig', 'v3', {
  theme: 'light',
  language: 'en'
})
```

**Error handling best practices:**

```typescript
// Always wrap in try-catch
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    // localStorage.getItem() throws in:
    // - Safari/Firefox private browsing
    // - When localStorage is disabled
    // - When quota is exceeded
    return null
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    // localStorage.setItem() throws when:
    // - Quota exceeded (usually 5-10MB)
    // - Private browsing mode
    // - Storage disabled
    return false
  }
}
```

**Impact Analysis:**
- Performance gain: Prevents schema conflicts, reduces storage size
- Use cases: User preferences, app state, cached data
- Considerations: Always version keys, always wrap in try-catch

Reference: [VueUse useLocalStorage](https://vueuse.org/core/useLocalStorage/)

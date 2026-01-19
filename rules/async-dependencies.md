---
title: Dependency-Based Parallelization
impact: CRITICAL
impactDescription: significantly faster execution through smart parallelization
tags: async, parallelization, dependencies, optimization
---

## Dependency-Based Parallelization

For operations with partial dependencies, maximize parallelism by starting tasks at the earliest possible moment.

> **Installation**: This rule uses the `better-all` package for automatic dependency resolution:
> ```bash
> npm install better-all
> # or pnpm add better-all / yarn add better-all / bun add better-all
> ```
>
> **Package**: [better-all](https://github.com/shuding/better-all) - Maintained by Next.js core team member shuding

**Incorrect (profile waits for config unnecessarily):**

```typescript
// Sequential execution
const [user, config] = await Promise.all([
  $fetch('/api/user'),
  $fetch('/api/config')
])

// Profile waits even though config is done
const profile = await $fetch(`/api/profile/${user.id}`)

// Total time: max(user, config) + profile
```

**Correct with better-all (config and profile run in parallel):**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() {
    return $fetch('/api/user')
  },
  async config() {
    return $fetch('/api/config')
  },
  async profile() {
    // Depends on user, starts as soon as user resolves
    const u = await this.$.user
    return $fetch(`/api/profile/${u.id}`)
  }
})

// Total time: max(user + profile, config)
```

**Manual dependency handling (without better-all):**

```typescript
// Start all fetches that can run immediately
const userPromise = $fetch('/api/user')
const configPromise = $fetch('/api/config')

// Wait for user, then start profile
const user = await userPromise
const profilePromise = $fetch(`/api/profile/${user.id}`)

// Wait for all remaining promises
const [config, profile] = await Promise.all([
  configPromise,
  profilePromise
])
```

**Complex dependency graph:**

```typescript
import { all } from 'better-all'

const result = await all({
  // Independent
  async config() {
    return $fetch('/api/config')
  },

  // Independent
  async user() {
    return $fetch('/api/user')
  },

  // Depends on user
  async profile() {
    const u = await this.$.user
    return $fetch(`/api/profile/${u.id}`)
  },

  // Depends on user
  async preferences() {
    const u = await this.$.user
    return $fetch(`/api/preferences/${u.id}`)
  },

  // Depends on profile and preferences
  async dashboard() {
    const [p, prefs] = await Promise.all([
      this.$.profile,
      this.$.preferences
    ])
    return $fetch('/api/dashboard', {
      query: {
        profileId: p.id,
        theme: prefs.theme
      }
    })
  }
})
```

**Vue composable with dependencies:**

```typescript
// composables/useUserDashboard.ts
export function useUserDashboard() {
  const data = ref(null)
  const loading = ref(true)

  onMounted(async () => {
    const result = await all({
      async config() {
        return $fetch('/api/config')
      },

      async user() {
        return $fetch('/api/user')
      },

      async stats() {
        const user = await this.$.user
        return $fetch(`/api/stats/${user.id}`)
      },

      async notifications() {
        const user = await this.$.user
        return $fetch(`/api/notifications/${user.id}`)
      }
    })

    data.value = result
    loading.value = false
  })

  return { data, loading }
}
```

**Nuxt server API with dependencies:**

```typescript
// server/api/dashboard.get.ts
import { all } from 'better-all'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth.userId

  const data = await all({
    async user() {
      return db.user.findUnique({ where: { id: userId } })
    },

    async config() {
      return db.config.findFirst()
    },

    async posts() {
      const user = await this.$.user
      return db.post.findMany({
        where: { authorId: user.id },
        take: 10
      })
    },

    async analytics() {
      const user = await this.$.user
      return fetchAnalytics(user.id)
    }
  })

  return data
})
```

**Comparison of approaches:**

```typescript
// Approach 1: All sequential (slowest)
const user = await fetchUser()
const config = await fetchConfig()
const profile = await fetchProfile(user.id)
// Time: user + config + profile

// Approach 2: Some parallel
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
// Time: max(user, config) + profile

// Approach 3: Maximum parallel (fastest)
const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
// Time: max(user + profile, config)
```

**Impact Analysis:**
- Performance gain: Dramatically faster for operations with partial dependencies
- Use cases: Dashboard loading, multi-resource fetching, complex workflows
- Considerations: Install `better-all` package or manually manage dependencies

Reference: [better-all](https://github.com/shuding/better-all)

---
title: Cache Repeated Property Access
impact: LOW-MEDIUM
impactDescription: reduce property lookup overhead
tags: javascript, performance, optimization, cache
---

## Cache Repeated Property Access

Cache frequently accessed properties in local variables to avoid repeated lookups, especially in loops and hot paths.

**Incorrect (repeated property access):**

```vue
<script setup>
const items = ref([/* 1000+ items */])

function processItems() {
  // items.value accessed 1000+ times
  for (let i = 0; i < items.value.length; i++) {
    // items.value.length evaluated on EVERY iteration
    const item = items.value[i]

    // Repeated deep property access
    if (item.user.profile.settings.theme === 'dark') {
      console.log(item.user.profile.settings.notifications)
    }
  }
}
</script>
```

**Correct (cached property access):**

```vue
<script setup>
const items = ref([/* 1000+ items */])

function processItems() {
  // Cache array and length once
  const itemsArray = items.value
  const length = itemsArray.length

  for (let i = 0; i < length; i++) {
    const item = itemsArray[i]

    // Cache deep property once
    const settings = item.user?.profile?.settings

    if (settings?.theme === 'dark') {
      console.log(settings.notifications)
    }
  }
}
</script>
```

**Computed properties example:**

```vue
<script setup>
const state = reactive({
  config: {
    api: {
      baseUrl: 'https://api.example.com',
      timeout: 5000
    }
  }
})

// Incorrect: repeated deep access
const fetchData = async () => {
  const response = await fetch(
    `${state.config.api.baseUrl}/users`,
    { timeout: state.config.api.timeout }
  )
  const posts = await fetch(
    `${state.config.api.baseUrl}/posts`,
    { timeout: state.config.api.timeout }
  )
}

// Correct: cache API config
const fetchData = async () => {
  const api = state.config.api
  const baseUrl = api.baseUrl
  const timeout = api.timeout

  const response = await fetch(`${baseUrl}/users`, { timeout })
  const posts = await fetch(`${baseUrl}/posts`, { timeout })
}
</script>
```

**Array methods example:**

```typescript
// Incorrect
function findDuplicates(items: Item[]) {
  return items.filter(item =>
    items.filter(other => other.id === item.id).length > 1
    // items.filter() called for EVERY item
  )
}

// Correct
function findDuplicates(items: Item[]) {
  const idCounts = new Map<string, number>()

  // Cache items reference
  const itemsArray = items

  // Count IDs once
  for (const item of itemsArray) {
    idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1)
  }

  // Filter based on cached counts
  return itemsArray.filter(item => idCounts.get(item.id)! > 1)
}
```

**Impact Analysis:**
- Performance gain: Reduces property lookup overhead in loops and hot code paths
- Use cases: Long loops, deep object access, repeated computations
- Considerations: More significant impact with nested properties and large iterations

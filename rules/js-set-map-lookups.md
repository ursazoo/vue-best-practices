---
title: Use Set/Map for Fast Lookups
impact: MEDIUM
impactDescription: O(1) vs O(n) lookup time
tags: javascript, data-structures, set, map, performance
---

## Use Set/Map for Fast Lookups

Replace array-based lookups with Set or Map for O(1) constant-time lookups instead of O(n) linear time.

**Incorrect (O(n) array lookup):**

```vue
<script setup>
const allowedIds = ref(['id-1', 'id-2', 'id-3', /* ...100 more */])

function isAllowed(id: string): boolean {
  // O(n) - scans entire array on every call
  return allowedIds.value.includes(id)
}

// Called 1000+ times in a loop or computed property
const filtered = computed(() => {
  return items.value.filter(item => isAllowed(item.id))
})
</script>
```

**Correct (O(1) Set lookup):**

```vue
<script setup>
// Convert to Set once
const allowedIds = ref(new Set(['id-1', 'id-2', 'id-3', /* ...100 more */]))

function isAllowed(id: string): boolean {
  // O(1) - instant lookup
  return allowedIds.value.has(id)
}

// Much faster with large datasets
const filtered = computed(() => {
  return items.value.filter(item => isAllowed(item.id))
})
</script>
```

**Use Map for key-value lookups:**

```typescript
// Incorrect: O(n) array.find()
const users = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  // ...1000 more
]

function getUserName(id: string): string {
  const user = users.find(u => u.id === id) // O(n)
  return user?.name ?? 'Unknown'
}

// Correct: O(1) Map lookup
const userMap = new Map([
  ['u1', { id: 'u1', name: 'Alice' }],
  ['u2', { id: 'u2', name: 'Bob' }],
  // ...1000 more
])

function getUserName(id: string): string {
  return userMap.get(id)?.name ?? 'Unknown' // O(1)
}
```

**Impact Analysis:**
- Performance gain: 10-100× faster with large datasets (>50 items)
- Use cases: Permission checks, filtering, validation, lookup tables
- Considerations: Set/Map use slightly more memory but provide massive speed improvements

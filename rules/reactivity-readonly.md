---
title: Use readonly to Prevent Mutations
impact: MEDIUM
impactDescription: prevents accidental mutations and improves code safety
tags: reactivity, readonly, immutability, optimization
---

## Use readonly to Prevent Mutations

Use `readonly` to create immutable refs and prevent accidental mutations in child components or shared state.

**Incorrect (child can mutate parent state):**

```vue
<!-- Parent.vue -->
<script setup>
const user = ref({
  name: 'Alice',
  email: 'alice@example.com'
})

// Child can modify this
</script>

<template>
  <Child :user="user" />
</template>

<!-- Child.vue -->
<script setup>
const props = defineProps<{ user: User }>()

// Accidentally mutates parent state!
function updateName() {
  props.user.name = 'Bob'
}
</script>
```

**Correct (readonly prevents mutations):**

```vue
<!-- Parent.vue -->
<script setup>
const user = ref({
  name: 'Alice',
  email: 'alice@example.com'
})

// Pass readonly version to child
const readonlyUser = readonly(user)
</script>

<template>
  <Child :user="readonlyUser" />
</template>

<!-- Child.vue -->
<script setup>
const props = defineProps<{ user: Readonly<User> }>()

// This will warn in development!
function updateName() {
  props.user.name = 'Bob' // Warning: Cannot assign to 'name' because it is a read-only property
}
</script>
```

**Computed returns readonly:**

```vue
<script setup>
// computed automatically returns readonly
const count = ref(0)
const doubled = computed(() => count.value * 2)

// This throws an error!
doubled.value = 10 // Error: Cannot assign to 'value' because it is a read-only property
</script>
```

**Store pattern with readonly:**

```typescript
// stores/userStore.ts
import { ref, readonly } from 'vue'

const state = ref({
  user: null as User | null,
  isAuthenticated: false
})

export function useUserStore() {
  // Private: mutation functions
  function setUser(user: User) {
    state.value.user = user
    state.value.isAuthenticated = true
  }

  function logout() {
    state.value.user = null
    state.value.isAuthenticated = false
  }

  // Public: readonly state
  return {
    state: readonly(state),
    setUser,
    logout
  }
}

// Usage:
const store = useUserStore()
store.state.user // ✅ Can read
store.state.user = newUser // ❌ Cannot mutate
store.setUser(newUser) // ✅ Use methods instead
```

**Props are readonly by default:**

```vue
<script setup>
// Props are automatically readonly
const props = defineProps<{
  count: number
}>()

// This is NOT allowed!
props.count = 10 // Error in development
</script>
```

**Shallow readonly for performance:**

```vue
<script setup>
// Only makes top-level readonly
const data = shallowReadonly({
  count: 0,
  nested: {
    value: 10 // This CAN be mutated!
  }
})

// These throw errors:
data.count = 1 // ❌ Error
data.nested = {} // ❌ Error

// This works (nested properties not readonly):
data.nested.value = 20 // ✅ No error
</script>
```

**Composable pattern with readonly:**

```typescript
// composables/useCounter.ts
export function useCounter(initial: number = 0) {
  // Private mutable state
  const count = ref(initial)

  // Private mutation functions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initial
  }

  // Return readonly state + methods
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}

// Usage:
const { count, increment } = useCounter(0)
console.log(count.value) // ✅ Read
count.value = 10 // ❌ Cannot mutate
increment() // ✅ Use method
```

**isReadonly check:**

```typescript
const data = ref({ count: 0 })
const readonlyData = readonly(data)

console.log(isReadonly(data)) // false
console.log(isReadonly(readonlyData)) // true
```

**Reactive + readonly:**

```vue
<script setup>
// Mutable state
const state = reactive({
  users: [],
  settings: {}
})

// Readonly view for external use
const readonlyState = readonly(state)

// Internal mutations
function addUser(user: User) {
  state.users.push(user)
}

// Export readonly
defineExpose({
  state: readonlyState,
  addUser
})
</script>
```

**Best practices:**

✅ **Use readonly for:**
- Shared state passed to child components
- Store/composable state exposed to consumers
- Props (automatically readonly)
- Computed values (automatically readonly)

❌ **Don't use readonly for:**
- Internal component state (use ref/reactive)
- Form inputs (need to be mutable)
- Temporary local state

**Impact Analysis:**
- Performance gain: Minimal overhead, prevents unnecessary checks
- Use cases: Shared state, store patterns, preventing mutations
- Considerations: Development warnings only, no runtime enforcement in production

Reference: [Vue readonly](https://vuejs.org/api/reactivity-core.html#readonly)

---
title: Optimize Watch with Lazy and Deep Options
impact: MEDIUM
impactDescription: reduces unnecessary watcher execution
tags: reactivity, watch, performance, optimization
---

## Optimize Watch with Lazy and Deep Options

Configure watchers properly to avoid unnecessary executions and deep traversal overhead.

**Incorrect (immediate execution + deep watching):**

```vue
<script setup>
const user = ref({
  profile: { name: '', email: '' },
  settings: { theme: 'light', lang: 'en' },
  // ... 50 more nested properties
})

// Runs immediately on mount + deeply watches ALL properties
watch(user, (newVal) => {
  console.log('User changed:', newVal)
}, { immediate: true, deep: true })

// Performance issues:
// 1. Executes on mount even when not needed
// 2. Watches every nested property change
</script>
```

**Correct (targeted watching):**

```vue
<script setup>
const user = ref({
  profile: { name: '', email: '' },
  settings: { theme: 'light', lang: 'en' }
})

// Watch specific properties only
watch(() => user.value.profile.name, (newName) => {
  console.log('Name changed:', newName)
})

// Or use computed for derived values
const userName = computed(() => user.value.profile.name)

watch(userName, (newName) => {
  console.log('Name changed:', newName)
})
</script>
```

**Use watchEffect for reactive dependencies:**

```vue
<script setup>
// Incorrect: manual dependency tracking
watch([user, settings], ([newUser, newSettings]) => {
  updateUI(newUser, newSettings)
})

// Correct: automatic dependency tracking
watchEffect(() => {
  // Only tracks properties actually accessed
  updateUI(user.value, settings.value)
})
</script>
```

**Deep watch only when necessary:**

```vue
<script setup>
const form = ref({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    country: ''
  }
})

// Incorrect: deep watch entire form
watch(form, saveFormDraft, { deep: true })
// Triggers on ANY nested property change

// Correct: watch specific fields
watch(
  () => [form.value.name, form.value.email],
  saveFormDraft
)

// Or use computed for specific paths
const addressData = computed(() => form.value.address)
watch(addressData, saveAddressDraft, { deep: true })
</script>
```

**Flush timing optimization:**

```vue
<script setup>
const count = ref(0)
const dom = ref<HTMLElement | null>(null)

// Incorrect: watch runs before DOM updates
watch(count, () => {
  console.log(dom.value?.offsetHeight) // Old value!
})

// Correct: flush: 'post' runs after DOM updates
watch(count, () => {
  console.log(dom.value?.offsetHeight) // Updated value!
}, { flush: 'post' })

// Or use watchPostEffect
watchPostEffect(() => {
  console.log(dom.value?.offsetHeight)
})
</script>
```

**Debounce expensive watchers:**

```vue
<script setup>
import { watchDebounced } from '@vueuse/core'

const searchQuery = ref('')

// Incorrect: executes on every keystroke
watch(searchQuery, async (query) => {
  await expensiveSearchAPI(query)
})

// Correct: debounced watch
watchDebounced(
  searchQuery,
  async (query) => {
    await expensiveSearchAPI(query)
  },
  { debounce: 500 }
)
</script>
```

**Stop watchers when not needed:**

```vue
<script setup>
const isActive = ref(true)

// Watch returns a stop function
const stopWatch = watch(someValue, () => {
  // Expensive operation
})

// Stop watching when inactive
watch(isActive, (active) => {
  if (!active) {
    stopWatch()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  stopWatch()
})
</script>
```

**Watch once pattern:**

```vue
<script setup>
import { watchOnce } from '@vueuse/core'

// Run once when condition becomes true
watchOnce(
  () => user.value?.isLoaded,
  (isLoaded) => {
    if (isLoaded) {
      initializeApp()
    }
  }
)
</script>
```

**Comparison of watch options:**

```typescript
// 1. Immediate execution
watch(source, callback, { immediate: true })
// Runs callback immediately + on changes

// 2. Deep watching
watch(source, callback, { deep: true })
// Watches all nested properties

// 3. Flush timing
watch(source, callback, { flush: 'pre' })  // Before DOM updates (default)
watch(source, callback, { flush: 'post' }) // After DOM updates
watch(source, callback, { flush: 'sync' }) // Synchronous (use rarely)

// 4. Multiple sources
watch([source1, source2], ([new1, new2]) => {})

// 5. Getter function
watch(() => obj.nested.value, callback)
```

**Best practices:**

✅ **Do:**
- Watch specific properties, not entire objects
- Use `watchEffect` for automatic dependency tracking
- Use `flush: 'post'` when accessing DOM
- Debounce expensive operations
- Stop watchers when not needed

❌ **Don't:**
- Use `deep: true` unless necessary
- Use `immediate: true` without checking
- Watch large objects without specifying paths
- Forget to clean up watchers

**Impact Analysis:**
- Performance gain: Significantly reduces watcher overhead
- Use cases: Form validation, API calls, DOM measurements
- Considerations: Choose appropriate flush timing and depth

Reference: [Vue Watch](https://vuejs.org/guide/essentials/watchers.html)

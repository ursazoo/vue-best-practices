---
title: Use <script setup> to Optimize Performance
impact: MEDIUM
impactDescription: Vue 3's <script setup> syntax sugar provides better performance and developer experience
tags: vue3, composition-api, performance
---

## Use <script setup> to Optimize Performance (Vue 3)

Vue 3's `<script setup>` provides compile-time optimizations with more concise code and better performance.

**Incorrect (Regular Syntax - Verbose):**

```vue
<script>
import { ref, computed } from 'vue'
import ChildComponent from './Child.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubled,
      increment
    }
  }
}
</script>
```

**Correct (<script setup> Syntax - More Concise, Better Performance):**

```vue
<script setup>
import { ref, computed } from 'vue'
import ChildComponent from './Child.vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

**Performance Benefits:**

1. **Automatic Component Registration**: No need for `components` option
2. **Better Type Inference**: Better TypeScript support
3. **Compile-Time Optimization**: More efficient template references
4. **Reduced Runtime Overhead**: No need for `return` object

**Advanced Usage:**

```vue
<script setup>
import { ref } from 'vue'

// defineProps and defineEmits are compiler macros, no import needed
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update', 'delete'])

// defineExpose exposes to parent component
const internalCount = ref(0)
defineExpose({
  reset: () => internalCount.value = 0
})
</script>
```

```vue
<script setup>
// With TypeScript
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Type-safe emits
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}>()
</script>
```

**Migration Suggestions:**
- Prioritize `<script setup>` for new components
- Gradually migrate existing components
- Can be mixed with Options API

Reference: [Vue 3 script setup](https://vuejs.org/api/sfc-script-setup.html)

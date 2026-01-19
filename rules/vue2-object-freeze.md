---
title: Use Object.freeze to Freeze Static Data
impact: HIGH
impactDescription: In Vue 2, freezing large read-only data avoids reactive conversion overhead
tags: vue2, reactivity, performance
---

## Use Object.freeze to Freeze Static Data (Vue 2)

In Vue 2, use `Object.freeze()` to freeze large data that doesn't need to be reactive, avoiding Vue's reactivity system processing them.

**Note: Vue 3's reactivity system is already optimized, this technique is mainly for Vue 2.**

**Incorrect:**

```vue
<script>
export default {
  data() {
    return {
      // Large static data, Vue 2 will recursively traverse to add getter/setter
      staticData: [
        { id: 1, name: 'Item 1', description: '...' },
        // ... 1000+ items
      ],
      config: {
        theme: 'dark',
        language: 'en-US',
        features: [/* many config items */]
      }
    }
  }
}
</script>
```

**Correct:**

```vue
<script>
export default {
  data() {
    return {
      // Freeze large static data
      staticData: Object.freeze([
        { id: 1, name: 'Item 1', description: '...' },
        // ... 1000+ items
      ]),
      config: Object.freeze({
        theme: 'dark',
        language: 'en-US',
        features: [/* many config items */]
      })
    }
  }
}
</script>
```

```js
// Or define outside component
const STATIC_DATA = Object.freeze([/* ... */])
const CONFIG = Object.freeze({/* ... */})

export default {
  data() {
    return {
      staticData: STATIC_DATA,
      config: CONFIG
    }
  }
}
```

```js
// Deep freeze nested objects
function deepFreeze(obj) {
  Object.freeze(obj)
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value)
    }
  })
  return obj
}

export default {
  data() {
    return {
      data: deepFreeze({
        nested: {
          deep: {
            values: [1, 2, 3]
          }
        }
      })
    }
  }
}
```

**Impact Analysis:**
- Performance gain: For 1000+ items, can reduce initialization time by 50-70%
- Use cases: Configuration data, static lists, constant tables
- Considerations:
  - Data cannot be modified after freezing
  - Only has significant effect in Vue 2
  - Vue 3 is already optimized, less need for this technique

**Vue 3 Comparison:**

Vue 3 uses Proxy, reactive overhead is significantly reduced, but can still use `shallowRef` or `shallowReactive`:

```vue
<script setup>
import { shallowRef } from 'vue'

// Vue 3: use shallowRef to avoid deep reactivity
const staticData = shallowRef([/* large data */])
</script>
```

Reference: [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

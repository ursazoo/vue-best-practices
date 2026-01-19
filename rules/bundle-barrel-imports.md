---
title: Avoid Barrel File Imports
impact: CRITICAL
impactDescription: enables tree-shaking and reduces bundle size
tags: bundle, tree-shaking, imports, optimization
---

## Avoid Barrel File Imports

Import directly from source files instead of barrel files (index.js) to enable tree-shaking and reduce bundle size.

**Incorrect (imports entire library through barrel):**

```vue
<script setup>
// Imports ALL of lodash (~500KB) even though only using 2 functions
import { debounce, throttle } from 'lodash'

// Imports entire UI library even though only using 2 components
import { Button, Input } from '@company/ui-components'
</script>
```

**Correct (imports only what's needed):**

```vue
<script setup>
// Import specific lodash functions (~2KB each)
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// Or use lodash-es for better tree-shaking
import { debounce, throttle } from 'lodash-es'

// Import components directly from source
import Button from '@company/ui-components/src/Button.vue'
import Input from '@company/ui-components/src/Input.vue'
</script>
```

**Nuxt auto-imports pattern (recommended):**

```vue
<script setup>
// Nuxt auto-imports composables from these directories:
// - composables/
// - utils/
// - No barrel files needed!

// ❌ Don't create barrel files:
// composables/index.ts that exports everything

// ✅ Instead, let Nuxt auto-import:
// composables/useAuth.ts
// composables/useUser.ts
// Direct imports, no barrel needed!

const { user } = useAuth()
const { profile } = useUser()
</script>
```

**Component library example:**

```typescript
// ❌ Bad: barrel file that exports everything
// components/ui/index.ts
export { default as Button } from './Button.vue'
export { default as Input } from './Input.vue'
export { default as Modal } from './Modal.vue'
// ... 50 more components
// Bundler can't tree-shake because of re-exports!

// ✅ Good: No barrel file, direct imports
// components/ui/Button.vue
// components/ui/Input.vue
// components/ui/Modal.vue

// Usage:
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
```

**Utility functions pattern:**

```typescript
// ❌ Bad: utils/index.ts barrel file
export * from './string'
export * from './array'
export * from './object'
export * from './date'
// Imports everything!

// ✅ Good: Direct imports
// utils/string.ts
// utils/array.ts
// utils/object.ts
// utils/date.ts

// Usage in Nuxt (auto-imports):
const formatted = formatDate(date) // From utils/date.ts
const slugified = slugify(text)     // From utils/string.ts
```

**Library configuration for tree-shaking:**

```typescript
// package.json
{
  "name": "@company/ui-library",
  "version": "1.0.0",
  "sideEffects": false, // Enable tree-shaking
  "exports": {
    "./Button": "./src/Button.vue",
    "./Input": "./src/Input.vue",
    "./Modal": "./src/Modal.vue"
  }
}

// Usage:
import Button from '@company/ui-library/Button'
import Input from '@company/ui-library/Input'
```

**Configure Nuxt to optimize imports:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      // Pre-bundle these for better tree-shaking
      include: ['lodash-es', 'date-fns']
    }
  }
})
```

**Impact Analysis:**
- Performance gain: 50-90% reduction in bundle size for large libraries
- Use cases: UI libraries, utility libraries, third-party packages
- Considerations: Use `lodash-es` instead of `lodash` for better tree-shaking

Reference: [Vite Tree-shaking](https://vitejs.dev/guide/features.html#tree-shaking)

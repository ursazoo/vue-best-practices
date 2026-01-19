---
title: Prevent Hydration Mismatch Without Flickering
impact: HIGH
impactDescription: eliminates layout shift and hydration errors
tags: rendering, ssr, hydration, nuxt
---

## Prevent Hydration Mismatch Without Flickering

Avoid hydration mismatches when content depends on client-only state (like localStorage or media queries) without causing flickers.

**Incorrect (causes hydration mismatch):**

```vue
<template>
  <div :class="theme">
    <!-- Server renders with default theme -->
    <!-- Client hydrates with localStorage theme -->
    <!-- Mismatch causes hydration error! -->
    <h1>Hello World</h1>
  </div>
</template>

<script setup>
// ❌ Server doesn't have localStorage
const theme = ref(localStorage.getItem('theme') || 'light')
</script>
```

**Console error:**
```
[Vue warn]: Hydration node mismatch:
- Client vnode: div.dark
- Server vnode: div.light
```

**Correct (inline script prevents mismatch):**

```vue
<!-- app.vue or layouts/default.vue -->
<template>
  <div>
    <Head>
      <script>
        // ⚠️ This runs BEFORE hydration
        (function() {
          const theme = localStorage.getItem('theme') || 'light'
          document.documentElement.classList.add(theme)
        })()
      </script>
    </Head>

    <div :class="theme">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const theme = ref('')

onMounted(() => {
  // Safe to access localStorage after mount
  theme.value = localStorage.getItem('theme') || 'light'
})
</script>
```

**Using Nuxt useHead:**

```vue
<script setup lang="ts">
// Inject inline script before HTML
useHead({
  script: [
    {
      children: `
        (function() {
          try {
            const theme = localStorage.getItem('theme') || 'light';
            document.documentElement.className = theme;
          } catch (e) {}
        })()
      `,
      // Critical: must run immediately
      tagPosition: 'bodyOpen'
    }
  ]
})

const theme = ref('')

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'light'
})
</script>

<template>
  <div :class="theme">
    <NuxtPage />
  </div>
</template>
```

**Client-only components:**

```vue
<template>
  <div>
    <!-- Server: renders comment placeholder -->
    <!-- Client: renders actual component after hydration -->
    <ClientOnly>
      <UserPreferences />
      <template #fallback>
        <UserPreferencesSkeleton />
      </template>
    </ClientOnly>
  </div>
</template>
```

**VueUse usePreferredDark with SSR:**

```vue
<script setup lang="ts">
import { usePreferredDark } from '@vueuse/core'

// ❌ Causes mismatch
const isDark = usePreferredDark()

// ✅ Correct: defer to client
const isDark = ref(false)

onMounted(() => {
  isDark.value = usePreferredDark().value
})
</script>

<template>
  <div :class="{ dark: isDark }">
    <NuxtPage />
  </div>
</template>
```

**Store pattern with SSR:**

```typescript
// composables/useTheme.ts
export function useTheme() {
  // Safe default for SSR
  const theme = useState('theme', () => 'light')
  const isHydrated = ref(false)

  onMounted(() => {
    // Only read localStorage on client
    const stored = localStorage.getItem('theme')
    if (stored) {
      theme.value = stored as 'light' | 'dark'
    }
    isHydrated.value = true
  })

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    if (process.client) {
      localStorage.setItem('theme', newTheme)
      document.documentElement.className = newTheme
    }
  }

  return {
    theme: readonly(theme),
    setTheme,
    isHydrated: readonly(isHydrated)
  }
}
```

**Suppress hydration mismatch warnings:**

```vue
<template>
  <div>
    <!-- For intentional mismatches -->
    <ClientOnly>
      <span>{{ new Date().toLocaleString() }}</span>
    </ClientOnly>

    <!-- Or suppress warning (use sparingly) -->
    <div v-suppress-hydration>
      {{ currentTime }}
    </div>
  </div>
</template>

<script setup>
const currentTime = ref(new Date().toLocaleString())
</script>
```

**Nuxt plugin for theme initialization:**

```typescript
// plugins/theme.client.ts
export default defineNuxtPlugin(() => {
  // Runs on client only
  const theme = localStorage.getItem('theme') || 'light'
  document.documentElement.className = theme
})
```

**Cookie-based theme (SSR-safe):**

```vue
<script setup lang="ts">
// Server can read cookies!
const themeCookie = useCookie('theme', {
  default: () => 'light'
})

// No mismatch: same value on server and client
const theme = computed(() => themeCookie.value)

function setTheme(newTheme: 'light' | 'dark') {
  themeCookie.value = newTheme
  document.documentElement.className = newTheme
}
</script>

<template>
  <div :class="theme">
    <button @click="setTheme(theme === 'light' ? 'dark' : 'light')">
      Toggle Theme
    </button>
    <NuxtPage />
  </div>
</template>
```

**Media query hydration:**

```vue
<script setup lang="ts">
// ❌ Server doesn't have matchMedia
const isMobile = ref(window.matchMedia('(max-width: 768px)').matches)

// ✅ Safe approach
const isMobile = ref(false)

onMounted(() => {
  const query = window.matchMedia('(max-width: 768px)')
  isMobile.value = query.matches

  const handler = (e: MediaQueryListEvent) => {
    isMobile.value = e.matches
  }
  query.addEventListener('change', handler)

  onUnmounted(() => {
    query.removeEventListener('change', handler)
  })
})
</script>

<template>
  <div>
    <ClientOnly>
      <MobileNav v-if="isMobile" />
      <DesktopNav v-else />
    </ClientOnly>
  </div>
</template>
```

**Complete theme system example:**

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// 1. Inline script (no flicker)
useHead({
  script: [
    {
      children: `
        (function() {
          try {
            const theme = localStorage.getItem('theme')
              || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.className = theme;
            document.documentElement.style.colorScheme = theme;
          } catch (e) {}
        })()
      `,
      tagPosition: 'bodyOpen'
    }
  ],
  htmlAttrs: {
    // SSR default
    class: 'light'
  }
})

// 2. Cookie for SSR persistence
const themeCookie = useCookie('theme')

// 3. Sync on mount
onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored && stored !== themeCookie.value) {
    themeCookie.value = stored
  }
})
</script>
```

**Best practices:**

✅ **Do:**
- Use inline script in `<head>` for theme initialization
- Use `ClientOnly` for client-specific content
- Use cookies for SSR-accessible state
- Provide fallback/skeleton for client-only components
- Initialize client-only state in `onMounted()`

❌ **Don't:**
- Access `localStorage`/`window` during SSR
- Rely on `process.client` checks without `ClientOnly`
- Ignore hydration mismatch warnings
- Use `v-if="isMounted"` (causes layout shift)

**Impact Analysis:**
- Performance gain: Eliminates layout shift and hydration errors
- Use cases: Theme systems, user preferences, responsive layouts
- Considerations: Balance between SSR compatibility and client-side features

Reference: [Nuxt ClientOnly](https://nuxt.com/docs/api/components/client-only)

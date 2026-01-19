---
title: Preload Critical Resources
impact: HIGH
impactDescription: reduces LCP and improves perceived performance
tags: bundle, preload, performance, critical-resources
---

## Preload Critical Resources

Use resource hints (preload, prefetch, modulepreload) to prioritize loading of critical resources and defer non-critical ones.

**Incorrect (no resource hints):**

```vue
<template>
  <!-- Browser discovers font only after parsing CSS -->
  <div class="hero">
    <h1>Welcome</h1>
  </div>
</template>

<style>
@font-face {
  font-family: 'CustomFont';
  /* Browser discovers this late! */
  src: url('/fonts/custom-font.woff2') format('woff2');
}

.hero h1 {
  font-family: 'CustomFont';
}
</style>
```

**Correct (preload critical font):**

```vue
<script setup>
useHead({
  link: [
    {
      rel: 'preload',
      href: '/fonts/custom-font.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous'
    }
  ]
})
</script>

<template>
  <div class="hero">
    <h1>Welcome</h1>
  </div>
</template>
```

**Preload critical images:**

```vue
<script setup>
useHead({
  link: [
    {
      // Preload hero image (above the fold)
      rel: 'preload',
      href: '/images/hero-banner.webp',
      as: 'image',
      type: 'image/webp'
    },
    {
      // Prefetch image for next page
      rel: 'prefetch',
      href: '/images/product-details.webp',
      as: 'image'
    }
  ]
})
</script>

<template>
  <img src="/images/hero-banner.webp" alt="Hero" />
</template>
```

**Nuxt auto-prefetches links:**

```vue
<template>
  <!-- Nuxt automatically prefetches on hover/visibility -->
  <NuxtLink to="/products">
    Products
  </NuxtLink>

  <!-- Control prefetch behavior -->
  <NuxtLink
    to="/admin"
    prefetch-on="interaction"
  >
    Admin (prefetch on hover only)
  </NuxtLink>

  <!-- Disable prefetch for specific links -->
  <NuxtLink
    to="/large-page"
    :prefetch="false"
  >
    Large Page (no prefetch)
  </NuxtLink>
</template>
```

**Configure global prefetch behavior:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  experimental: {
    defaults: {
      nuxtLink: {
        // Prefetch only on interaction (hover/focus)
        prefetchOn: 'interaction'
      }
    }
  }
})
```

**Preload critical API data:**

```vue
<script setup>
// Preload critical data in parent layout
const { data: user } = await useAsyncData('user', () =>
  $fetch('/api/user')
)

// Prefetch likely next page data
onMounted(() => {
  // Prefetch product list after 2 seconds
  setTimeout(() => {
    $fetch('/api/products')
  }, 2000)
})
</script>
```

**Module preload for dynamic imports:**

```typescript
// Nuxt automatically adds modulepreload for dynamic imports
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)

// Generated HTML includes:
// <link rel="modulepreload" href="/_nuxt/HeavyComponent.abc123.js">
```

**Resource hint priorities:**

```vue
<script setup>
useHead({
  link: [
    // 1. Preload: Highest priority, fetch ASAP
    {
      rel: 'preload',
      href: '/critical-style.css',
      as: 'style'
    },

    // 2. Modulepreload: For ES modules
    {
      rel: 'modulepreload',
      href: '/_nuxt/app.js'
    },

    // 3. Prefetch: Low priority, fetch when idle
    {
      rel: 'prefetch',
      href: '/next-page-data.json'
    },

    // 4. DNS-prefetch: Resolve DNS early
    {
      rel: 'dns-prefetch',
      href: 'https://api.example.com'
    },

    // 5. Preconnect: DNS + TCP + TLS
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
      crossorigin: ''
    }
  ]
})
</script>
```

**What to preload:**

✅ **Preload these:**
- Above-the-fold images
- Critical web fonts
- Critical CSS files
- Hero videos

❌ **Don't preload these:**
- Below-the-fold content
- Non-critical scripts
- Analytics
- Third-party widgets

**Impact Analysis:**
- Performance gain: 10-30% improvement in LCP (Largest Contentful Paint)
- Use cases: Fonts, hero images, critical CSS/JS, API data
- Considerations: Overusing preload can slow down initial load

Reference: [Resource Hints](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)

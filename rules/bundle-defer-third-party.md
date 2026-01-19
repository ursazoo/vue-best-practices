---
title: Defer Third-Party Scripts
impact: HIGH
impactDescription: improves initial page load time
tags: bundle, third-party, performance, loading
---

## Defer Third-Party Scripts

Defer loading of third-party scripts (analytics, ads, chat widgets) until after critical content is loaded.

**Incorrect (blocks initial render):**

```vue
<script setup>
// Loaded immediately, blocks rendering
import GoogleAnalytics from '@analytics/google-analytics'
import Intercom from 'intercom-client'
import Hotjar from '@hotjar/browser'

// All initialize synchronously
GoogleAnalytics.init({ trackingId: 'UA-XXXXX' })
Intercom.boot({ app_id: 'xxxxx' })
Hotjar.init(123456, 6)
</script>
```

**Correct (load after mount):**

```vue
<script setup>
onMounted(async () => {
  // Defer to next idle callback
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadThirdPartyScripts)
  } else {
    setTimeout(loadThirdPartyScripts, 1000)
  }
})

async function loadThirdPartyScripts() {
  // Load analytics
  const { default: GoogleAnalytics } = await import('@analytics/google-analytics')
  GoogleAnalytics.init({ trackingId: 'UA-XXXXX' })

  // Load chat widget
  const { default: Intercom } = await import('intercom-client')
  Intercom.boot({ app_id: 'xxxxx' })

  // Load heatmap
  const { default: Hotjar } = await import('@hotjar/browser')
  Hotjar.init(123456, 6)
}
</script>
```

**Use Nuxt plugin with onNuxtReady:**

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // Only loads after Nuxt is ready
  onNuxtReady(async () => {
    const { default: GoogleAnalytics } = await import('@analytics/google-analytics')

    GoogleAnalytics.init({
      trackingId: useRuntimeConfig().public.gaTrackingId
    })
  })
})
```

**Load scripts with useHead:**

```vue
<script setup>
useHead({
  script: [
    {
      // Load at end of body instead of head
      src: 'https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID',
      tagPosition: 'bodyClose',
      async: true,
      // Defer execution until after parse
      defer: true
    },
    {
      src: 'https://js.stripe.com/v3/',
      tagPosition: 'bodyClose',
      async: true,
      // Load only when needed
      onload: 'window.stripeLoaded = true'
    }
  ]
})
</script>
```

**Conditionally load based on user action:**

```vue
<script setup>
const chatLoaded = ref(false)

async function openChat() {
  if (!chatLoaded.value) {
    // Load chat widget only when user clicks
    const { default: Intercom } = await import('intercom-client')
    Intercom.boot({ app_id: 'xxxxx' })
    chatLoaded.value = true
  }

  // Open chat
  window.Intercom('show')
}
</script>

<template>
  <button @click="openChat">Chat with us</button>
</template>
```

**Use Nuxt Scripts module (recommended):**

```vue
<script setup>
// Install @nuxt/scripts first
const { onLoaded, proxy } = useScriptGoogleAnalytics({
  id: 'G-1234567',
  scriptOptions: {
    // Wait for user interaction before loading
    trigger: 'onInteraction'
  }
})

// Queue events to be sent when GA loads
proxy.gtag('config', 'UA-123456789-1')

// Or wait until GA is loaded
onLoaded((gtag) => {
  console.log('Google Analytics loaded')
})
</script>
```

**Common third-party scripts to defer:**

- Analytics (Google Analytics, Mixpanel, Amplitude)
- Chat widgets (Intercom, Zendesk, Drift)
- Heatmaps (Hotjar, FullStory, LogRocket)
- Ad networks (Google Ads, Facebook Pixel)
- Social widgets (Twitter, Facebook, Instagram embeds)
- Payment processors (Stripe, PayPal)
- Marketing tools (HubSpot, Marketo)

**Impact Analysis:**
- Performance gain: 20-50% improvement in Time to Interactive (TTI)
- Use cases: All third-party integrations, analytics, marketing tools
- Considerations: Balance tracking accuracy with performance

Reference: [Nuxt Scripts](https://nuxt.com/modules/scripts)

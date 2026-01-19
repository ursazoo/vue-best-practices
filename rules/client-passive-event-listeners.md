---
title: Use Passive Event Listeners for Scrolling Performance
impact: MEDIUM
impactDescription: eliminates scroll delay caused by event listeners
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## Use Passive Event Listeners for Scrolling Performance

Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.

**Incorrect (blocks scrolling):**

```vue
<script setup>
onMounted(() => {
  const handleTouch = (e: TouchEvent) => {
    console.log(e.touches[0].clientX)
  }

  const handleWheel = (e: WheelEvent) => {
    console.log(e.deltaY)
  }

  // Browser waits for these handlers before scrolling
  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  })
})
</script>
```

**Correct (immediate scrolling):**

```vue
<script setup>
onMounted(() => {
  const handleTouch = (e: TouchEvent) => {
    console.log(e.touches[0].clientX)
  }

  const handleWheel = (e: WheelEvent) => {
    console.log(e.deltaY)
  }

  // Passive: browser scrolls immediately without waiting
  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })

  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  })
})
</script>
```

**VueUse with passive option:**

```vue
<script setup>
import { useEventListener } from '@vueuse/core'

// VueUse supports passive option
useEventListener(window, 'touchstart', (e) => {
  console.log(e.touches[0].clientX)
}, { passive: true })

useEventListener(window, 'wheel', (e) => {
  console.log(e.deltaY)
}, { passive: true })
</script>
```

**Composable with passive listeners:**

```typescript
// composables/useScrollTracking.ts
export function useScrollTracking() {
  const scrollY = ref(0)

  onMounted(() => {
    const handleScroll = () => {
      scrollY.value = window.scrollY
    }

    // Passive: we're only reading, not preventing
    window.addEventListener('scroll', handleScroll, { passive: true })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })

  return { scrollY }
}
```

**When to use passive:**

✅ **Use passive for:**
- Scroll tracking/analytics
- Touch position tracking
- Wheel delta logging
- Any listener that only reads event data

❌ **Don't use passive for:**
- Custom swipe gestures (need `preventDefault()`)
- Custom zoom controls (need `preventDefault()`)
- Drag-and-drop (need `preventDefault()`)
- Any listener that calls `preventDefault()`

**Template event handlers (automatically passive in Vue):**

```vue
<template>
  <!-- Vue's @touchstart is NOT automatically passive -->
  <div @touchstart="handleTouch">
    Touch me
  </div>

  <!-- Use .passive modifier for passive listeners -->
  <div @touchstart.passive="handleTouch">
    Touch me (passive)
  </div>

  <!-- Same for wheel and scroll -->
  <div
    @wheel.passive="handleWheel"
    @scroll.passive="handleScroll"
  >
    Content
  </div>
</template>
```

**Impact Analysis:**
- Performance gain: Eliminates 100-300ms scroll delay on mobile devices
- Use cases: Analytics, scroll tracking, touch gestures (read-only)
- Considerations: Cannot use `preventDefault()` with passive listeners

Reference: [Passive Event Listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive)

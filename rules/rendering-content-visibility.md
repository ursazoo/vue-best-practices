---
title: Use content-visibility for Long Lists
impact: HIGH
impactDescription: drastically improves initial render performance
tags: rendering, performance, css, content-visibility
---

## Use content-visibility for Long Lists

Use CSS `content-visibility: auto` to defer rendering of off-screen content, dramatically improving performance for long lists.

**Incorrect (renders everything immediately):**

```vue
<template>
  <div class="product-list">
    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >
      <!-- Complex card with images, descriptions, etc. -->
      <img :src="product.image" :alt="product.name">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <div class="price">{{ product.price }}</div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  /* No content-visibility */
  padding: 20px;
  border: 1px solid #ddd;
}
</style>
```

**Correct (defers off-screen rendering):**

```vue
<template>
  <div class="product-list">
    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
    >
      <img :src="product.image" :alt="product.name">
      <h3>{{ product.name }}</h3>
      <p>{{ product.description }}</p>
      <div class="price">{{ product.price }}</div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  /* Browser only renders visible items */
  content-visibility: auto;

  /* Estimated height for better scrollbar */
  contain-intrinsic-size: auto 350px;

  padding: 20px;
  border: 1px solid #ddd;
}
</style>
```

**With dynamic height estimation:**

```vue
<template>
  <div class="feed">
    <article
      v-for="post in posts"
      :key="post.id"
      class="post"
      :style="{ containIntrinsicSize: `auto ${estimateHeight(post)}px` }"
    >
      <h2>{{ post.title }}</h2>
      <div v-html="post.content"></div>
      <div class="comments">
        <div v-for="comment in post.comments" :key="comment.id">
          {{ comment.text }}
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Comment {
  id: string
  text: string
}

interface Post {
  id: string
  title: string
  content: string
  comments: Comment[]
}

const posts = ref<Post[]>([])

// Estimate height based on content
function estimateHeight(post: Post): number {
  const baseHeight = 200
  const commentHeight = post.comments.length * 80
  const contentHeight = Math.min(post.content.length / 10, 400)
  return baseHeight + commentHeight + contentHeight
}
</script>

<style scoped>
.post {
  content-visibility: auto;
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
}
</style>
```

**Virtual scrolling alternative:**

```vue
<template>
  <div class="container">
    <!-- For very long lists, consider vue-virtual-scroller -->
    <RecycleScroller
      :items="items"
      :item-size="120"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="item">
        {{ item.name }}
      </div>
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))
</script>
```

**Nuxt with SSR considerations:**

```vue
<template>
  <div class="list-container">
    <div
      v-for="item in items"
      :key="item.id"
      class="list-item"
    >
      <LazyImage :src="item.image" :alt="item.title" />
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Server-side: fetch data
const { data: items } = await useAsyncData('items', () =>
  $fetch('/api/items')
)
</script>

<style scoped>
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: auto 280px;

  /* Containment for better performance */
  contain: layout style paint;

  padding: 16px;
  margin-bottom: 8px;
}
</style>
```

**Intersection Observer fallback:**

```vue
<template>
  <div class="timeline">
    <div
      v-for="event in events"
      :key="event.id"
      ref="eventRefs"
      class="event"
    >
      <div v-if="visibleEvents.has(event.id)">
        <!-- Only render when visible -->
        <h3>{{ event.title }}</h3>
        <p>{{ event.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

interface Event {
  id: string
  title: string
  description: string
}

const events = ref<Event[]>([])
const eventRefs = ref<HTMLElement[]>([])
const visibleEvents = ref(new Set<string>())

// For browsers without content-visibility support
onMounted(() => {
  if (!CSS.supports('content-visibility', 'auto')) {
    eventRefs.value.forEach((el, index) => {
      useIntersectionObserver(
        el,
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            visibleEvents.value.add(events.value[index].id)
          }
        },
        { rootMargin: '100px' }
      )
    })
  } else {
    // All visible if content-visibility is supported
    events.value.forEach(event => {
      visibleEvents.value.add(event.id)
    })
  }
})
</script>

<style scoped>
.event {
  content-visibility: auto;
  contain-intrinsic-size: auto 200px;
  min-height: 200px;
}
</style>
```

**Performance comparison:**

```typescript
// Without content-visibility:
// 10,000 items × 50ms = 500,000ms (8+ minutes to render)

// With content-visibility:
// Only visible items render (e.g., 20 items × 50ms = 1,000ms)
// 500× faster initial render!
```

**Best practices:**

✅ **Use content-visibility for:**
- Long feeds (social media, news)
- Product listings (e-commerce)
- Data tables with many rows
- Comment sections
- Search results

❌ **Don't use for:**
- Short lists (<100 items)
- Above-the-fold content
- Critical content that must be indexed by search engines

**Browser support check:**

```vue
<script setup>
const supportsContentVisibility = computed(() => {
  return CSS.supports('content-visibility', 'auto')
})

// Fallback strategy
const strategy = computed(() => {
  if (supportsContentVisibility.value) {
    return 'content-visibility'
  }
  if (items.value.length > 1000) {
    return 'virtual-scroll'
  }
  return 'intersection-observer'
})
</script>
```

**Impact Analysis:**
- Performance gain: Dramatically faster initial render for long lists (1000+ items)
- Use cases: Long lists, feeds, tables, galleries
- Considerations: Set appropriate `contain-intrinsic-size` for smooth scrolling

Reference: [MDN content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

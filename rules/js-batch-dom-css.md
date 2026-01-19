---
title: Batch DOM Reads and Writes
impact: MEDIUM
impactDescription: prevent layout thrashing
tags: javascript, dom, performance, layout-thrashing
---

## Batch DOM Reads and Writes

Group DOM reads together and DOM writes together to avoid forced synchronous layouts (layout thrashing).

**Incorrect (layout thrashing):**

```vue
<script setup>
import { onMounted } from 'vue'

const cards = ref<HTMLElement[]>([])

onMounted(() => {
  // Causes layout thrashing: read-write-read-write pattern
  cards.value.forEach(card => {
    const height = card.offsetHeight // READ (forces layout)
    card.style.width = height + 'px' // WRITE (invalidates layout)

    const width = card.offsetWidth // READ (forces layout again!)
    card.style.height = width + 'px' // WRITE (invalidates layout)
  })
  // Each read after a write forces a full page reflow!
})
</script>
```

**Correct (batched reads and writes):**

```vue
<script setup>
import { onMounted } from 'vue'

const cards = ref<HTMLElement[]>([])

onMounted(() => {
  // Batch all reads first
  const dimensions = cards.value.map(card => ({
    height: card.offsetHeight,
    width: card.offsetWidth
  }))

  // Then batch all writes
  cards.value.forEach((card, index) => {
    const { height, width } = dimensions[index]
    card.style.width = height + 'px'
    card.style.height = width + 'px'
  })
  // Only 1 layout pass instead of N!
})
</script>
```

**Use requestAnimationFrame for batching:**

```typescript
// Incorrect: immediate DOM updates
function updateElements() {
  element1.style.transform = 'translateX(100px)'
  const rect1 = element1.getBoundingClientRect() // Forces layout

  element2.style.transform = 'translateY(100px)'
  const rect2 = element2.getBoundingClientRect() // Forces layout again
}

// Correct: batch with requestAnimationFrame
function updateElements() {
  // Batch writes in one frame
  requestAnimationFrame(() => {
    element1.style.transform = 'translateX(100px)'
    element2.style.transform = 'translateY(100px)'

    // Batch reads in next frame
    requestAnimationFrame(() => {
      const rect1 = element1.getBoundingClientRect()
      const rect2 = element2.getBoundingClientRect()
    })
  })
}
```

**CSS classes over inline styles:**

```vue
<script setup>
// Incorrect: multiple style changes
function highlightCard(card: HTMLElement) {
  card.style.backgroundColor = 'yellow' // Write
  card.style.border = '2px solid red' // Write
  card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)' // Write
  // 3 separate style recalculations
}

// Correct: single class change
function highlightCard(card: HTMLElement) {
  card.classList.add('highlighted') // 1 style recalculation
}
</script>

<style scoped>
.highlighted {
  background-color: yellow;
  border: 2px solid red;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>
```

**Impact Analysis:**
- Performance gain: 5-10× faster with multiple DOM operations
- Use cases: Animations, dynamic layouts, drag-and-drop, batch updates
- Considerations: Critical for smooth 60fps animations and interactions

Reference: [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

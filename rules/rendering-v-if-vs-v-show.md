---
title: Choosing Between v-if and v-show
impact: MEDIUM
impactDescription: Choose appropriate conditional rendering method based on toggle frequency
tags: vue2, vue3, rendering, directives
---

## Choosing Between v-if and v-show

Choose `v-if` or `v-show` based on the element's toggle frequency.

**Incorrect:**

```vue
<template>
  <!-- Frequent toggle but using v-if, destroying/rebuilding every time -->
  <div v-if="isVisible">
    <heavy-component />  <!-- Expensive component -->
  </div>

  <!-- Rare toggle but using v-show, always occupying memory -->
  <div v-show="userIsAdmin">
    <admin-panel />  <!-- Large admin panel -->
  </div>
</template>
```

**Correct:**

```vue
<template>
  <!-- Use v-show for frequent toggling -->
  <div v-show="isVisible">
    <heavy-component />
  </div>

  <!-- Use v-if for rare toggling -->
  <div v-if="userIsAdmin">
    <admin-panel />
  </div>

  <!-- Use v-if for elements not needed on initial render -->
  <div v-if="showModal">
    <modal-content />
  </div>
</template>
```

**Decision Rules:**
- `v-if`: Low initial render cost, high toggle cost (destroy/rebuild)
  - Condition rarely changes
  - Initial condition is false
  - Contains expensive components

- `v-show`: High initial render cost, low toggle cost (CSS display)
  - Frequently toggled (like tabs, collapsible panels)
  - Simple DOM elements
  - Need to preserve state

Reference: [Vue Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html)

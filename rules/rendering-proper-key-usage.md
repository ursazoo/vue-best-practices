---
title: 使用 key 优化列表渲染
impact: HIGH
impactDescription: 正确使用 key 可以帮助 Vue 高效地复用和重新排序现有元素
tags: vue2, vue3, rendering, v-for, key
---

## 使用 key 优化列表渲染

在 `v-for` 中正确使用 `key`，帮助 Vue 高效地更新 DOM。

**错误示例：**

```vue
<template>
  <!-- 错误：使用 index 作为 key -->
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
    <input v-model="item.value" />
  </div>

  <!-- 错误：没有 key -->
  <div v-for="item in items">
    {{ item.name }}
  </div>

  <!-- 错误：使用非唯一值作为 key -->
  <div v-for="item in items" :key="item.type">
    {{ item.name }}
  </div>
</template>
```

**为什么不能用 index？**

```vue
<template>
  <!-- 假设初始列表：[{id: 1, name: 'A'}, {id: 2, name: 'B'}] -->
  <div v-for="(item, index) in items" :key="index">
    {{ item.name }}
    <input :value="item.value" />
  </div>

  <!-- 删除第一项后：[{id: 2, name: 'B'}] -->
  <!-- Vue 认为 index=0 的项还是原来的项，只是数据变了 -->
  <!-- 这会导致 input 的值错位！ -->
</template>
```

**正确示例：**

```vue
<template>
  <!-- 正确：使用唯一且稳定的 id -->
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
    <input v-model="item.value" />
  </div>
</template>
```

```vue
<template>
  <!-- 数据库记录 -->
  <div v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>

  <!-- API 返回的数据 -->
  <div v-for="product in products" :key="product.productId">
    {{ product.title }}
  </div>

  <!-- 如果确实没有 id，可以生成唯一标识 -->
  <div v-for="item in processedItems" :key="item._uid">
    {{ item.name }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const items = ref([/* ... */])

// 为没有 id 的数据生成唯一标识
const processedItems = computed(() =>
  items.value.map((item, index) => ({
    ...item,
    _uid: `${item.name}-${index}-${Date.now()}`  // 仅在数据加载时生成一次
  }))
)
</script>
```

**何时可以使用 index：**

只有当列表满足以下**所有**条件时：
1. 列表是静态的（不会增删改）
2. 列表项没有状态（无输入框、选中状态等）
3. 列表项不会重新排序

```vue
<template>
  <!-- 可以用 index：纯静态展示 -->
  <div v-for="(color, index) in ['red', 'green', 'blue']" :key="index">
    {{ color }}
  </div>
</template>
```

**组件中的 key：**

```vue
<template>
  <!-- key 用于组件复用控制 -->
  <transition>
    <component :is="currentView" :key="currentView" />
  </transition>

  <!-- 强制重新渲染 -->
  <my-component :key="resetKey" />
</template>

<script setup>
const resetKey = ref(0)

function resetComponent() {
  resetKey.value++  // 改变 key 强制重新创建组件
}
</script>
```

**影响分析：**
- 性能提升：正确的 key 可以让 Vue 复用 DOM，减少不必要的创建/销毁
- 常见问题：使用 index 作为 key 会导致状态错乱、性能下降
- 最佳实践：始终使用稳定的唯一标识

**性能对比：**

```js
// 好的 key：O(1) 查找
items.map(item => ({ ...item, key: item.id }))

// 坏的 key：可能导致 O(n) 的 DOM 操作
items.map((item, index) => ({ ...item, key: index }))
```

参考资料：[Vue 列表渲染 - key](https://cn.vuejs.org/guide/essentials/list.html#maintaining-state-with-key)

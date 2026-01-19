---
title: 避免在循环中使用内联函数
impact: MEDIUM
impactDescription: v-for 中的内联函数会在每次渲染时重新创建，影响性能
tags: vue2, vue3, rendering, v-for, performance
---

## 避免在循环中使用内联函数

在 `v-for` 循环中避免使用内联函数和箭头函数，它们会在每次渲染时重新创建。

**错误示例：**

```vue
<template>
  <!-- 每次渲染都创建新函数 -->
  <div v-for="item in items" :key="item.id">
    <button @click="() => handleClick(item.id)">
      删除
    </button>
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>
```

```vue
<template>
  <!-- 每次渲染都创建新的过滤函数 -->
  <div v-for="item in items.filter(i => i.active)" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

**正确示例：**

```vue
<template>
  <div v-for="item in items" :key="item.id">
    <!-- 使用方法引用 -->
    <button @click="handleClick(item.id)">
      删除
    </button>
    <!-- 使用 computed 或 methods -->
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(id) {
      // 处理逻辑
    },
    formatName(name) {
      return name.toUpperCase()
    }
  }
}
</script>
```

```vue
<template>
  <!-- 使用 computed 过滤 -->
  <div v-for="item in activeItems" :key="item.id">
    {{ item.name }}
  </div>
</template>

<script>
export default {
  computed: {
    activeItems() {
      return this.items.filter(i => i.active)
    }
  }
}
</script>
```

```vue
<!-- Vue 3 Composition API -->
<script setup>
import { ref, computed } from 'vue'

const items = ref([])

// 使用 computed 缓存过滤结果
const activeItems = computed(() =>
  items.value.filter(i => i.active)
)

// 定义在外层，不会重复创建
function handleClick(id) {
  console.log('删除', id)
}

function formatName(name) {
  return name.toUpperCase()
}
</script>

<template>
  <div v-for="item in activeItems" :key="item.id">
    <button @click="handleClick(item.id)">删除</button>
    <span>{{ formatName(item.name) }}</span>
  </div>
</template>
```

**子组件优化：**

```vue
<!-- 错误：每次都传递新函数 -->
<template>
  <child-item
    v-for="item in items"
    :key="item.id"
    :item="item"
    @delete="() => handleDelete(item.id)"
  />
</template>
```

```vue
<!-- 正确：传递 id，在子组件触发 -->
<template>
  <child-item
    v-for="item in items"
    :key="item.id"
    :item="item"
    @delete="handleDelete"
  />
</template>

<!-- 子组件 -->
<script setup>
const props = defineProps(['item'])
const emit = defineEmits(['delete'])

function onDelete() {
  emit('delete', props.item.id)
}
</script>
```

**影响分析：**
- 性能提升：大列表（100+ 项）时差异明显
- 适用场景：v-for 循环、事件处理、props 传递
- 注意事项：方法引用要注意 this 绑定（Vue 3 不需要）

参考资料：[Vue 列表渲染](https://cn.vuejs.org/guide/essentials/list.html)

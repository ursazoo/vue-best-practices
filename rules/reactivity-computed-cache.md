---
title: 使用 computed 缓存计算结果
impact: HIGH
impactDescription: computed 会缓存结果，避免重复计算，比 methods 和直接计算更高效
tags: vue2, vue3, computed, reactivity, performance
---

## 使用 computed 缓存计算结果

使用 `computed` 而不是 `methods` 或模板内直接计算，利用 Vue 的缓存机制避免重复计算。

**错误示例（重复计算）：**

```vue
<template>
  <!-- 每次渲染都会执行 filter + sort + slice -->
  <div v-for="item in items.filter(i => i.active).sort((a,b) => a.price - b.price).slice(0, 10)">
    {{ item.name }}
  </div>

  <!-- methods 每次渲染都会执行 -->
  <div>总价：{{ calculateTotal() }}</div>
  <div>折扣：{{ calculateTotal() * 0.9 }}</div>  <!-- 又算了一遍 -->
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  methods: {
    calculateTotal() {
      console.log('计算总价')  // 会看到多次输出
      return this.items.reduce((sum, item) => sum + item.price, 0)
    }
  }
}
</script>
```

```vue
<!-- Vue 3 错误示例 -->
<template>
  <div v-for="item in filterAndSort()">  <!-- 每次渲染都执行 -->
    {{ item.name }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([])

function filterAndSort() {
  console.log('过滤排序')  // 会频繁输出
  return items.value
    .filter(i => i.active)
    .sort((a, b) => a.price - b.price)
}
</script>
```

**正确示例（使用 computed 缓存）：**

```vue
<template>
  <!-- computed 只在依赖变化时重新计算 -->
  <div v-for="item in topActiveItems">
    {{ item.name }}
  </div>

  <div>总价：{{ total }}</div>
  <div>折扣：{{ total * 0.9 }}</div>  <!-- 使用缓存的 total -->
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    topActiveItems() {
      return this.items
        .filter(i => i.active)
        .sort((a, b) => a.price - b.price)
        .slice(0, 10)
    },
    total() {
      console.log('计算总价')  // 只在 items 变化时输出一次
      return this.items.reduce((sum, item) => sum + item.price, 0)
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

const topActiveItems = computed(() => {
  console.log('过滤排序')  // 只在 items 变化时执行
  return items.value
    .filter(i => i.active)
    .sort((a, b) => a.price - b.price)
    .slice(0, 10)
})

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)
</script>

<template>
  <div v-for="item in topActiveItems" :key="item.id">
    {{ item.name }}
  </div>
  <div>总价：{{ total }}</div>
  <div>折扣：{{ total * 0.9 }}</div>
</template>
```

**影响分析：**
- 性能提升：避免重复计算，特别是在数据量大或计算复杂时效果显著
- 适用场景：任何需要根据响应式数据派生新值的场景
- 注意事项：computed 应该是纯函数，不要有副作用

**何时使用 methods：**
- 需要传递参数
- 需要每次都执行（如提交表单）
- 有副作用的操作

参考资料：[Vue Computed 属性](https://cn.vuejs.org/guide/essentials/computed.html)

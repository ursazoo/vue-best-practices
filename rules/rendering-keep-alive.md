---
title: 使用 keep-alive 缓存组件
impact: HIGH
impactDescription: keep-alive 可以缓存组件状态，避免重复渲染和数据获取
tags: vue2, vue3, rendering, caching, performance
---

## 使用 keep-alive 缓存组件

使用 `<keep-alive>` 缓存不活跃的组件实例，避免重复渲染和数据获取。

**错误示例（无缓存）：**

```vue
<template>
  <!-- Tab 切换时，组件会被销毁和重建 -->
  <component :is="currentTab" />
</template>

<script setup>
import { ref } from 'vue'
import TabA from './TabA.vue'  // 包含昂贵的 API 调用
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const currentTab = ref('TabA')
// 每次切换都会重新请求数据、重新渲染
</script>
```

```vue
<!-- Vue Router 无缓存 -->
<template>
  <router-view />  <!-- 页面切换时组件被销毁 -->
</template>
```

**正确示例（使用 keep-alive）：**

```vue
<template>
  <!-- 缓存所有 tab -->
  <keep-alive>
    <component :is="currentTab" />
  </keep-alive>
</template>

<script setup>
import { ref } from 'vue'
import TabA from './TabA.vue'
import TabB from './TabB.vue'
import TabC from './TabC.vue'

const currentTab = ref('TabA')
// 切换时保持组件状态，不重新请求数据
</script>
```

```vue
<!-- 选择性缓存 -->
<template>
  <keep-alive :include="['TabA', 'TabB']" :exclude="['TabC']">
    <component :is="currentTab" />
  </keep-alive>
</template>
```

```vue
<!-- 限制缓存数量 -->
<template>
  <keep-alive :max="10">
    <component :is="currentTab" />
  </keep-alive>
</template>
```

```vue
<!-- Vue Router 缓存 -->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedPages">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { ref } from 'vue'

// 动态控制缓存
const cachedPages = ref(['HomePage', 'ProductList', 'UserProfile'])
</script>
```

**生命周期钩子：**

```vue
<script>
export default {
  // Vue 2/3 Options API
  activated() {
    // 组件被激活时调用
    console.log('组件激活，可以刷新数据')
  },
  deactivated() {
    // 组件被缓存时调用
    console.log('组件缓存')
  }
}
</script>
```

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

// Vue 3 Composition API
onActivated(() => {
  console.log('组件激活')
  // 可以在这里刷新数据
})

onDeactivated(() => {
  console.log('组件缓存')
})
</script>
```

**影响分析：**
- 性能提升：避免重复渲染和数据获取，特别是表单、列表等组件
- 适用场景：Tab 切换、路由缓存、弹窗
- 注意事项：
  - 会占用额外内存
  - 使用 `max` 限制缓存数量
  - 使用 `include/exclude` 精确控制

**常见模式：**

```js
// 路由配置中标记需要缓存的页面
{
  path: '/list',
  component: ListView,
  meta: { keepAlive: true }
}

// App.vue 中根据 meta 控制
<keep-alive>
  <router-view v-if="$route.meta.keepAlive" />
</keep-alive>
<router-view v-if="!$route.meta.keepAlive" />
```

参考资料：[Vue keep-alive](https://cn.vuejs.org/guide/built-ins/keep-alive.html)

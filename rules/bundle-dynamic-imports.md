---
title: 使用动态导入减小 Bundle
impact: CRITICAL
impactDescription: 动态导入可以实现代码分割，大幅减小初始加载的 JavaScript 体积
tags: bundle, code-splitting, vue-router, performance
---

## 使用动态导入减小 Bundle

使用动态导入（Dynamic Import）进行代码分割，避免将所有代码打包到一个大文件中。

**错误示例（静态导入）：**

```js
// Vue Router 配置
import Home from './views/Home.vue'
import About from './views/About.vue'
import Dashboard from './views/Dashboard.vue'
import AdminPanel from './views/AdminPanel.vue'  // 大型组件
import Reports from './views/Reports.vue'  // 大型组件

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/dashboard', component: Dashboard },
  { path: '/admin', component: AdminPanel },  // 所有用户都会加载
  { path: '/reports', component: Reports }
]
```

```vue
<script>
// 组件内静态导入
import HeavyChart from './components/HeavyChart.vue'
import DataTable from './components/DataTable.vue'

export default {
  components: {
    HeavyChart,
    DataTable
  }
}
</script>
```

**正确示例（动态导入）：**

```js
// Vue Router 配置 - 路由级代码分割
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  },
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ './views/AdminPanel.vue')
  },
  {
    path: '/reports',
    component: () => import(/* webpackChunkName: "reports" */ './views/Reports.vue')
  }
]
```

```vue
<script>
// Vue 3 Composition API - 异步组件
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() =>
  import('./components/HeavyChart.vue')
)

const DataTable = defineAsyncComponent(() =>
  import('./components/DataTable.vue')
)
</script>
```

```vue
<script>
// Vue 2 - 异步组件
export default {
  components: {
    HeavyChart: () => import('./components/HeavyChart.vue'),
    DataTable: () => import('./components/DataTable.vue')
  }
}
</script>
```

```vue
<!-- 条件性动态导入 -->
<script setup>
import { defineAsyncComponent, ref } from 'vue'

const showAdmin = ref(false)

const AdminPanel = defineAsyncComponent(() => {
  if (showAdmin.value) {
    return import('./components/AdminPanel.vue')
  }
})
</script>
```

**影响分析：**
- 性能提升：初始 bundle 可减小 50-70%，首屏加载时间大幅降低
- 适用场景：路由组件、条件性渲染的大组件、第三方库
- 注意事项：需要处理加载状态，避免过度分割导致请求过多

参考资料：[Vue 异步组件](https://cn.vuejs.org/guide/components/async.html)

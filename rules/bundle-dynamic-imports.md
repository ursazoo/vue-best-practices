---
title: Use Dynamic Imports to Reduce Bundle Size
impact: CRITICAL
impactDescription: Dynamic imports enable code splitting, dramatically reducing initial JavaScript bundle size
tags: bundle, code-splitting, vue-router, performance
---

## Use Dynamic Imports to Reduce Bundle Size

Use dynamic imports for code splitting to avoid bundling all code into one large file.

**Incorrect (Static Imports):**

```js
// Vue Router configuration
import Home from './views/Home.vue'
import About from './views/About.vue'
import Dashboard from './views/Dashboard.vue'
import AdminPanel from './views/AdminPanel.vue'  // Large component
import Reports from './views/Reports.vue'  // Large component

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/dashboard', component: Dashboard },
  { path: '/admin', component: AdminPanel },  // Loaded for all users
  { path: '/reports', component: Reports }
]
```

```vue
<script>
// Static imports in component
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

**Correct (Dynamic Imports):**

```js
// Vue Router configuration - Route-level code splitting
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
// Vue 3 Composition API - Async components
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
// Vue 2 - Async components
export default {
  components: {
    HeavyChart: () => import('./components/HeavyChart.vue'),
    DataTable: () => import('./components/DataTable.vue')
  }
}
</script>
```

```vue
<!-- Conditional dynamic import -->
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

**Impact Analysis:**
- Performance gain: Initial bundle can be reduced by 50-70%, dramatically improving first page load time
- Use cases: Route components, conditionally rendered large components, third-party libraries
- Considerations: Need to handle loading states, avoid over-splitting which leads to too many requests

Reference: [Vue Async Components](https://vuejs.org/guide/components/async.html)

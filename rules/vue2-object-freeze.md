---
title: 使用 Object.freeze 冻结静态数据
impact: HIGH
impactDescription: Vue 2 中冻结大型只读数据可以避免响应式转换的开销
tags: vue2, reactivity, performance
---

## 使用 Object.freeze 冻结静态数据 (Vue 2)

在 Vue 2 中，使用 `Object.freeze()` 冻结不需要响应式的大型数据，避免 Vue 的响应式系统处理它们。

**注意：Vue 3 的响应式系统已优化，此技巧主要适用于 Vue 2。**

**错误示例：**

```vue
<script>
export default {
  data() {
    return {
      // 大型静态数据，Vue 2 会递归遍历添加 getter/setter
      staticData: [
        { id: 1, name: 'Item 1', description: '...' },
        // ... 1000+ 条数据
      ],
      config: {
        theme: 'dark',
        language: 'zh-CN',
        features: [/* 大量配置项 */]
      }
    }
  }
}
</script>
```

**正确示例：**

```vue
<script>
export default {
  data() {
    return {
      // 冻结大型静态数据
      staticData: Object.freeze([
        { id: 1, name: 'Item 1', description: '...' },
        // ... 1000+ 条数据
      ]),
      config: Object.freeze({
        theme: 'dark',
        language: 'zh-CN',
        features: [/* 大量配置项 */]
      })
    }
  }
}
</script>
```

```js
// 或者在组件外定义
const STATIC_DATA = Object.freeze([/* ... */])
const CONFIG = Object.freeze({/* ... */})

export default {
  data() {
    return {
      staticData: STATIC_DATA,
      config: CONFIG
    }
  }
}
```

```js
// 深度冻结嵌套对象
function deepFreeze(obj) {
  Object.freeze(obj)
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value)
    }
  })
  return obj
}

export default {
  data() {
    return {
      data: deepFreeze({
        nested: {
          deep: {
            values: [1, 2, 3]
          }
        }
      })
    }
  }
}
```

**影响分析：**
- 性能提升：对于 1000+ 条数据，可减少 50-70% 的初始化时间
- 适用场景：配置数据、静态列表、常量表
- 注意事项：
  - 冻结后数据无法修改
  - 只对 Vue 2 有显著效果
  - Vue 3 已自动优化，不太需要此技巧

**Vue 3 对比：**

Vue 3 使用 Proxy，响应式开销已大幅降低，但仍可使用 `shallowRef` 或 `shallowReactive`：

```vue
<script setup>
import { shallowRef } from 'vue'

// Vue 3: 使用 shallowRef 避免深层响应
const staticData = shallowRef([/* 大型数据 */])
</script>
```

参考资料：[Object.freeze](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

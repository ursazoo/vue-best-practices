---
title: 正确使用 watch 避免不必要的监听
impact: MEDIUM
impactDescription: 不当的 watch 使用会导致性能问题和难以追踪的 bug
tags: vue2, vue3, watch, reactivity, performance
---

## 正确使用 watch 避免不必要的监听

合理使用 `watch`，避免过度监听和循环依赖。

**错误示例：**

```vue
<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      fullName: ''
    }
  },
  watch: {
    // 错误：应该用 computed
    firstName(val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}
</script>
```

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// 错误：立即监听但没有必要
watch(count, (val) => {
  console.log(val)
}, { immediate: true, deep: true })  // deep 对 ref 数字无意义
</script>
```

```vue
<script setup>
// 错误：监听了大型对象的所有属性
const state = reactive({
  user: { /* 大型对象 */ },
  settings: { /* 大型对象 */ },
  data: { /* 大型对象 */ }
})

watch(state, () => {
  // 任何属性变化都会触发
}, { deep: true })  // 性能开销大
</script>
```

**正确示例：**

```vue
<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: ''
    }
  },
  // 正确：使用 computed
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    }
  }
}
</script>
```

```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

// 正确：只在必要时使用选项
watch(count, (val) => {
  console.log(val)
})  // 默认 lazy，不需要 immediate

// 正确：只监听需要的属性
const state = reactive({
  user: {},
  settings: {},
  data: {}
})

watch(() => state.user.name, (newName) => {
  // 只监听 user.name
})
</script>
```

```vue
<script setup>
// 正确：使用 watchEffect 自动追踪依赖
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

watchEffect(() => {
  // 自动追踪 count 的变化
  doubled.value = count.value * 2
})
</script>
```

**Vue 3 watch vs watchEffect:**

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const x = ref(0)
const y = ref(0)

// watch: 明确指定监听源
watch([x, y], ([newX, newY]) => {
  console.log(`x: ${newX}, y: ${newY}`)
})

// watchEffect: 自动追踪依赖
watchEffect(() => {
  console.log(`x: ${x.value}, y: ${y.value}`)
})
</script>
```

**性能优化技巧：**

```vue
<script setup>
// 使用 flush: 'post' 延迟到 DOM 更新后
watch(source, callback, { flush: 'post' })

// 使用 flush: 'sync' 同步执行（慎用）
watch(source, callback, { flush: 'sync' })

// 停止监听
const stop = watch(source, callback)
// 在某个时机停止
stop()
</script>
```

**适用场景：**
- ✅ 执行异步操作（API 调用）
- ✅ 访问 DOM
- ✅ 有副作用的操作
- ❌ 简单的派生值（用 computed）

参考资料：[Vue 侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)

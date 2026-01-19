---
title: 使用 <script setup> 优化性能
impact: MEDIUM
impactDescription: Vue 3 的 <script setup> 语法糖提供更好的性能和开发体验
tags: vue3, composition-api, performance
---

## 使用 <script setup> 优化性能 (Vue 3)

Vue 3 的 `<script setup>` 提供编译时优化，代码更简洁且性能更好。

**错误示例（普通写法 - 冗长）：**

```vue
<script>
import { ref, computed } from 'vue'
import ChildComponent from './Child.vue'

export default {
  components: {
    ChildComponent
  },
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    function increment() {
      count.value++
    }

    return {
      count,
      doubled,
      increment
    }
  }
}
</script>
```

**正确示例（<script setup> 写法 - 更简洁，性能更好）：**

```vue
<script setup>
import { ref, computed } from 'vue'
import ChildComponent from './Child.vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

**性能优势：**

1. **自动组件注册**：无需 `components` 选项
2. **更好的类型推断**：TypeScript 支持更好
3. **编译时优化**：模板引用更高效
4. **减少运行时开销**：无需 `return` 对象

**高级用法：**

```vue
<script setup>
import { ref } from 'vue'

// defineProps 和 defineEmits 是编译器宏，无需导入
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update', 'delete'])

// defineExpose 暴露给父组件
const internalCount = ref(0)
defineExpose({
  reset: () => internalCount.value = 0
})
</script>
```

```vue
<script setup>
// 结合 TypeScript
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 类型安全的 emits
const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}>()
</script>
```

**迁移建议：**
- 新组件优先使用 `<script setup>`
- 逐步迁移现有组件
- 与 Options API 可以混用

参考资料：[Vue 3 script setup](https://cn.vuejs.org/api/sfc-script-setup.html)

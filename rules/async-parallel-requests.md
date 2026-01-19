---
title: 并行请求而非串行
impact: CRITICAL
impactDescription: 串行请求会导致请求瀑布流，严重影响页面加载速度
tags: async, api, nuxt, performance
---

## 并行请求而非串行

将独立的异步请求并行执行，而不是串行等待。这是最常见也是影响最大的性能问题之一。

**错误示例（串行请求）：**

```vue
<script setup>
// Vue 3 Composition API
const userData = await $fetch('/api/user')
const posts = await $fetch('/api/posts')  // 等待 userData 完成后才开始
const comments = await $fetch('/api/comments')  // 再等待 posts 完成
</script>
```

```js
// Vue 2 + async/await
async created() {
  this.userData = await this.$axios.$get('/api/user')
  this.posts = await this.$axios.$get('/api/posts')  // 串行执行
  this.comments = await this.$axios.$get('/api/comments')
}
```

**正确示例（并行请求）：**

```vue
<script setup>
// Vue 3 Composition API
const [userData, posts, comments] = await Promise.all([
  $fetch('/api/user'),
  $fetch('/api/posts'),
  $fetch('/api/comments')
])
</script>
```

```js
// Vue 2 + async/await
async created() {
  const [userData, posts, comments] = await Promise.all([
    this.$axios.$get('/api/user'),
    this.$axios.$get('/api/posts'),
    this.$axios.$get('/api/comments')
  ])

  this.userData = userData
  this.posts = posts
  this.comments = comments
}
```

```vue
<!-- Nuxt 3 -->
<script setup>
const { data: userData } = await useFetch('/api/user')
const { data: posts } = await useFetch('/api/posts')
const { data: comments } = await useFetch('/api/comments')
// Nuxt 会自动并行这些 useFetch 调用
</script>
```

**影响分析：**
- 性能提升：3 个各需 200ms 的请求，串行需要 600ms，并行只需 200ms
- 适用场景：所有不相互依赖的数据获取场景
- 注意事项：确保请求之间真的没有依赖关系

参考资料：[MDN Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

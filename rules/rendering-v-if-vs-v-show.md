---
title: v-if vs v-show 的选择
impact: MEDIUM
impactDescription: 根据切换频率选择合适的条件渲染方式
tags: vue2, vue3, rendering, directives
---

## v-if vs v-show 的选择

根据元素的切换频率选择 `v-if` 或 `v-show`。

**错误示例：**

```vue
<template>
  <!-- 频繁切换却使用 v-if，每次都销毁/重建 -->
  <div v-if="isVisible">
    <heavy-component />  <!-- 昂贵的组件 -->
  </div>

  <!-- 很少切换却使用 v-show，一直占用内存 -->
  <div v-show="userIsAdmin">
    <admin-panel />  <!-- 大型管理面板 -->
  </div>
</template>
```

**正确示例：**

```vue
<template>
  <!-- 频繁切换使用 v-show -->
  <div v-show="isVisible">
    <heavy-component />
  </div>

  <!-- 很少切换使用 v-if -->
  <div v-if="userIsAdmin">
    <admin-panel />
  </div>

  <!-- 初始渲染时就不需要的用 v-if -->
  <div v-if="showModal">
    <modal-content />
  </div>
</template>
```

**决策规则：**
- `v-if`：初始渲染代价低，切换代价高（销毁/重建）
  - 条件很少改变
  - 初始条件为 false
  - 包含昂贵的组件

- `v-show`：初始渲染代价高，切换代价低（CSS display）
  - 频繁切换（如 tabs、折叠面板）
  - 简单的 DOM 元素
  - 需要保持状态

参考资料：[Vue 条件渲染](https://cn.vuejs.org/guide/essentials/conditional.html)

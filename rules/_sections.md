# Vue Best Practices 性能分类

## 1. 消除异步瀑布流 (Eliminating Async Waterfalls)
**前缀**: `async-`
**影响等级**: CRITICAL
**描述**: 避免串行异步操作，通过并行请求、预加载和智能数据获取来消除请求瀑布流。适用于 Vue 2/3 和 Nuxt。

## 2. Bundle 大小优化 (Bundle Size Optimization)
**前缀**: `bundle-`
**影响等级**: CRITICAL
**描述**: 减少 JavaScript bundle 大小，通过代码分割、Tree-shaking、动态导入和第三方库优化来提升加载性能。

## 3. 服务端性能 (Server-Side Performance)
**前缀**: `server-`
**影响等级**: HIGH
**描述**: 优化 SSR/SSG 性能，包括缓存策略、并行数据获取和服务端渲染优化。主要针对 Nuxt 应用。

## 4. 客户端数据获取 (Client-Side Data Fetching)
**前缀**: `client-`
**影响等级**: HIGH
**描述**: 优化客户端 API 调用和数据获取策略，减少不必要的请求和重复获取。

## 5. 响应式优化 (Reactivity Optimization)
**前缀**: `reactivity-`
**影响等级**: MEDIUM-HIGH
**描述**: 优化 Vue 的响应式系统使用，避免不必要的响应式追踪和更新。包括 computed、watch 的正确使用。

## 6. 渲染性能 (Rendering Performance)
**前缀**: `rendering-`
**影响等级**: MEDIUM
**描述**: 优化组件渲染性能，包括虚拟滚动、条件渲染、keep-alive 等技术。

## 7. Vue 2 特有优化 (Vue 2 Specific)
**前缀**: `vue2-`
**影响等级**: MEDIUM
**描述**: Vue 2 特有的性能优化技巧，包括 Object.freeze、函数式组件等。

## 8. Vue 3 特有优化 (Vue 3 Specific)
**前缀**: `vue3-`
**影响等级**: MEDIUM
**描述**: Vue 3 特有的性能优化技巧，包括 Composition API、Teleport、Suspense 等新特性的最佳实践。

## 9. JavaScript 性能 (JavaScript Performance)
**前缀**: `js-`
**影响等级**: LOW-MEDIUM
**描述**: 框架无关的 JavaScript 性能优化，包括循环优化、正则表达式、数据结构选择等。

## 10. 高级模式 (Advanced Patterns)
**前缀**: `advanced-`
**影响等级**: LOW
**描述**: 高级优化模式和技巧，适用于复杂场景和性能关键路径。

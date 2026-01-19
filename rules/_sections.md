# Vue Best Practices Performance Categories

## 1. Eliminating Async Waterfalls
**Prefix**: `async-`
**Impact Level**: CRITICAL
**Description**: Avoid sequential async operations, eliminate request waterfalls through parallel requests, preloading, and smart data fetching. Applicable to Vue 2/3 and Nuxt.

## 2. Bundle Size Optimization
**Prefix**: `bundle-`
**Impact Level**: CRITICAL
**Description**: Reduce JavaScript bundle size through code splitting, tree-shaking, dynamic imports, and third-party library optimization to improve loading performance.

## 3. Server-Side Performance
**Prefix**: `server-`
**Impact Level**: HIGH
**Description**: Optimize SSR/SSG performance, including caching strategies, parallel data fetching, and server-side rendering optimization. Mainly for Nuxt applications.

## 4. Client-Side Data Fetching
**Prefix**: `client-`
**Impact Level**: HIGH
**Description**: Optimize client-side API calls and data fetching strategies, reduce unnecessary requests and duplicate fetching.

## 5. Reactivity Optimization
**Prefix**: `reactivity-`
**Impact Level**: MEDIUM-HIGH
**Description**: Optimize Vue's reactivity system usage, avoid unnecessary reactive tracking and updates. Includes proper use of computed and watch.

## 6. Rendering Performance
**Prefix**: `rendering-`
**Impact Level**: MEDIUM
**Description**: Optimize component rendering performance, including virtual scrolling, conditional rendering, keep-alive, etc.

## 7. Vue 2 Specific
**Prefix**: `vue2-`
**Impact Level**: MEDIUM
**Description**: Performance optimization techniques specific to Vue 2, including Object.freeze, functional components, etc.

## 8. Vue 3 Specific
**Prefix**: `vue3-`
**Impact Level**: MEDIUM
**Description**: Performance optimization techniques specific to Vue 3, including best practices for Composition API, Teleport, Suspense, and other new features.

## 9. JavaScript Performance
**Prefix**: `js-`
**Impact Level**: LOW-MEDIUM
**Description**: Framework-agnostic JavaScript performance optimization, including loop optimization, regular expressions, data structure selection, etc.

## 10. Advanced Patterns
**Prefix**: `advanced-`
**Impact Level**: LOW
**Description**: Advanced optimization patterns and techniques for complex scenarios and performance-critical paths.

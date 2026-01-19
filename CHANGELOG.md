# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-19

### Added

#### New Rules - Client Optimization (4 rules)
- **client-event-listeners.md** - Deduplicate global event listeners across component instances
- **client-passive-event-listeners.md** - Use passive event listeners for scroll/touch events
- **client-swr-dedup.md** - Automatic request deduplication with composables
- **client-localstorage-schema.md** - LocalStorage schema versioning and migration

#### New Rules - Async Optimization (3 rules)
- **async-suspense-boundaries.md** - Strategic Suspense boundaries for faster initial paint
- **async-defer-await.md** - Defer await operations to needed branches
- **async-dependencies.md** - Dependency-based parallelization with better-all

#### New Rules - Reactivity Optimization (5 rules)
- **reactivity-shallowref.md** - Use shallowRef for large objects to reduce overhead
- **reactivity-watch-optimization.md** - Optimize watch with lazy and deep options
- **reactivity-readonly.md** - Use readonly to prevent accidental mutations
- **reactivity-unref.md** - Use unref and toValue for flexible APIs
- **reactivity-markraw.md** - Use markRaw for non-reactive external library instances

#### New Rules - Rendering Optimization (3 rules)
- **rendering-content-visibility.md** - CSS content-visibility for long lists
- **rendering-svg-optimization.md** - Optimize SVG file size with SVGO
- **rendering-hydration.md** - Prevent SSR hydration mismatch without flickering

#### New Rules - Advanced Patterns (2 rules)
- **advanced-stable-callback-refs.md** - Stable callback refs in watchers
- **advanced-tovalue-fresh.md** - Access fresh values without triggering effects

### Fixed

#### Critical Fixes
- **client-swr-dedup.md** - Fixed recursive function call (renamed `fetch()` to `fetchUsers()`)
- **rendering-content-visibility.md** - Added missing `Comment` interface definition
- **async-dependencies.md** - Added installation instructions and package verification for `better-all`
- **advanced-tovalue-fresh.md** - Fixed `useLatest` implementation using correct `ref` + `watch` pattern

#### High Priority Fixes
- **reactivity-unref.md** - Renamed ambiguous `fetch()` function to `fetchData()` for clarity
- **async-suspense-boundaries.md** - Added comprehensive error handling examples with `@resolve` and `@pending` events
- **All rules** - Replaced specific performance percentages with qualitative descriptions (e.g., "50-90%" → "Significantly reduces")

#### Documentation Improvements
- **reactivity-markraw.md** - Added Vue 3 only compatibility note
- **reactivity-shallowref.md** - Added Vue 3 only compatibility note with Vue 2 alternatives
- **reactivity-unref.md** - Added detailed Vue version support (unref: Vue 3, toValue: Vue 3.3+)
- **async-suspense-boundaries.md** - Added Suspense experimental status and Vue 2 alternatives

### Changed

- **Impact descriptions** - Updated 5+ rules to use qualitative performance descriptions instead of unverified percentages
- **Type safety** - Enhanced TypeScript type definitions across multiple rules
- **Code examples** - Improved code clarity and consistency throughout all new rules

### Project Stats

- **Total rules**: 46 (up from 30)
- **New rules added**: 16
- **Files modified**: 8
- **Critical bugs fixed**: 4
- **Documentation improvements**: 8+

## [1.0.0] - 2026-01-18

### Added

- Initial release with 30 Vue Best Practices rules
- 10 major performance categories
- Automated build system for AGENTS.md
- Validation scripts for rule format
- Test case extraction for LLM evaluation
- Complete documentation in English and Chinese

### Categories Included

1. Eliminate Async Waterfalls (3 rules)
2. Bundle Size Optimization (4 rules)
3. Server-Side Performance (5 rules)
4. Reactivity Optimization (1 rule)
5. Rendering Performance (5 rules)
6. Vue 2 Specific (1 rule)
7. Vue 3 Specific (1 rule)
8. JavaScript Performance (10 rules)

---

## Version History Summary

| Version | Date | Rules | Highlights |
|---------|------|-------|------------|
| 1.1.0 | 2026-01-19 | 46 | +16 rules, critical bug fixes, Vue 2/3 compat notes |
| 1.0.0 | 2026-01-18 | 30 | Initial release with core categories |

## Links

- [Repository](https://github.com/ursazoo/vue-best-practices)
- [Issues](https://github.com/ursazoo/vue-best-practices/issues)
- [Inspired by](https://github.com/vercel-labs/agent-skills)

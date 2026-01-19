# Vue Best Practices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Vue performance optimization best practices - A structured knowledge base optimized for AI Agents and developers

> [简体中文](README.zh-CN.md)

Inspired by [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), this repository organizes years of Vue 2/3 and Nuxt optimization experience into a structured format for AI Agents and development teams.

## Features

- 📚 **Systematic Categorization**: 10 major performance categories covering async, bundle, reactivity, rendering, etc.
- 🎯 **Impact Level Assessment**: CRITICAL → LOW, helping prioritize optimization efforts
- 💡 **Practical Examples**: Every rule includes incorrect vs. correct code examples
- 🔄 **Vue 2/3 Compatible**: Best practices for both Vue 2 and Vue 3
- 🤖 **AI-Friendly**: Compiles to AGENTS.md for AI coding assistants
- 🚀 **Nuxt Optimization**: Includes SSR/SSG performance optimization techniques

## Quick Start

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Build AGENTS.md

```bash
npm run build
```

### Validate Rules

```bash
npm run validate
```

### Extract Test Cases

```bash
npm run extract-tests
```

## Project Structure

```
vue-best-practices/
├── rules/                    # Rules directory
│   ├── _sections.md          # Performance category definitions
│   ├── _template.md          # Rule template
│   ├── async-*.md            # Async/waterfall optimizations
│   ├── bundle-*.md           # Bundle size optimizations
│   ├── server-*.md           # Server-side performance
│   ├── client-*.md           # Client-side data fetching
│   ├── reactivity-*.md       # Reactivity optimizations
│   ├── rendering-*.md        # Rendering performance
│   ├── vue2-*.md             # Vue 2 specific
│   ├── vue3-*.md             # Vue 3 specific
│   ├── js-*.md               # JavaScript performance
│   └── advanced-*.md         # Advanced patterns
├── src/                      # Build scripts
│   ├── build.ts              # Compile rules to AGENTS.md
│   ├── validate.ts           # Validate rule format
│   └── extract-tests.ts      # Extract test cases
├── metadata.json             # Project metadata
├── AGENTS.md                 # Compiled documentation (generated)
├── test-cases.json           # Test cases (generated)
└── README.md                 # Project documentation
```

## Performance Categories

### 1. Eliminate Async Waterfalls (async-) 🔴 CRITICAL
Avoid sequential async operations, use parallel requests and preloading for data fetching optimization.

### 2. Bundle Size Optimization (bundle-) 🔴 CRITICAL
Code splitting, tree-shaking, dynamic imports to reduce JavaScript size.

### 3. Server-Side Performance (server-) 🟠 HIGH
SSR/SSG optimization, caching strategies, Nuxt performance improvements.

### 4. Client-Side Data Fetching (client-) 🟠 HIGH
API call optimization, reduce duplicate requests.

### 5. Reactivity Optimization (reactivity-) 🟡 MEDIUM-HIGH
Proper use of computed and watch, avoid unnecessary reactive tracking.

### 6. Rendering Performance (rendering-) 🟡 MEDIUM
Virtual scrolling, conditional rendering, keep-alive, key optimization.

### 7. Vue 2 Specific (vue2-) 🟡 MEDIUM
Object.freeze, functional components and other Vue 2 optimization techniques.

### 8. Vue 3 Specific (vue3-) 🟡 MEDIUM
Composition API, Teleport, Suspense and other new features best practices.

### 9. JavaScript Performance (js-) 🟢 LOW-MEDIUM
Framework-agnostic JS optimizations: loops, regex, data structures.

### 10. Advanced Patterns (advanced-) 🟢 LOW
Advanced optimizations for complex scenarios and performance-critical paths.

## Creating New Rules

1. Copy the template file:
```bash
cp rules/_template.md rules/area-description.md
```

2. Choose an appropriate prefix:
   - `async-` - Async waterfalls
   - `bundle-` - Bundle optimization
   - `server-` - Server-side performance
   - `client-` - Client-side data
   - `reactivity-` - Reactivity optimization
   - `rendering-` - Rendering performance
   - `vue2-` - Vue 2 specific
   - `vue3-` - Vue 3 specific
   - `js-` - JavaScript performance
   - `advanced-` - Advanced patterns

3. Fill in the rule content, including:
   - Title and impact level
   - Incorrect examples
   - Correct examples
   - Impact analysis
   - References

4. Run the build:
```bash
npm run build
```

## Impact Levels

- **CRITICAL** - Highest priority, major performance improvements
- **HIGH** - Significant performance gains
- **MEDIUM-HIGH** - Medium-high benefits
- **MEDIUM** - Moderate performance improvements
- **LOW-MEDIUM** - Medium-low benefits
- **LOW** - Incremental improvements

## Using with AI Coding Assistants

### Claude Code / Cursor

Add the project as an Agent Skill:

```bash
npx add-skill /path/to/vue-best-practices
```

Or use the compiled `AGENTS.md` file directly as context.

### Manual Integration

Copy the contents of `AGENTS.md` into your AI assistant's custom instructions.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-rule`)
3. Add or modify rule files
4. Run validation (`npm run validate`)
5. Commit your changes (`git commit -m 'Add amazing rule'`)
6. Push to the branch (`git push origin feature/amazing-rule`)
7. Create a Pull Request

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- Inspired by [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
- Vue.js team for their excellent work
- All contributors

## Related Resources

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 Official Documentation](https://v2.vuejs.org/)
- [Nuxt Official Documentation](https://nuxt.com/)
- [Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html)

---

If this project helps you, please give it a ⭐️!

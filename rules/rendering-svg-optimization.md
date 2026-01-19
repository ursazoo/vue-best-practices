---
title: Optimize SVG for Smaller File Size
impact: MEDIUM
impactDescription: reduces bundle size and improves load time
tags: rendering, svg, optimization, performance
---

## Optimize SVG for Smaller File Size

Reduce SVG coordinate precision and remove unnecessary metadata to significantly decrease file size.

**Incorrect (high precision, large files):**

```vue
<template>
  <!-- Unoptimized SVG with excessive precision -->
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0000000000,2.0000000000 L22.3923048454,
      12.3923048454 L12.0000000000,22.7846096908 L1.6076951546,
      12.3923048454 Z" fill="#3B82F6"/>
    <!-- Metadata bloat -->
    <metadata>
      <rdf:RDF>...</rdf:RDF>
    </metadata>
    <!-- Comments -->
    <!-- Created with Adobe Illustrator -->
    <!-- Converted from Sketch -->
  </svg>
</template>
```

**Correct (optimized SVG):**

```vue
<template>
  <!-- Optimized: precision=1, no metadata -->
  <svg viewBox="0 0 24 24">
    <path d="M12,2L22.4,12.4L12,22.8L1.6,12.4Z" fill="#3B82F6"/>
  </svg>
</template>
```

**Automated optimization with SVGO:**

```bash
# Install SVGO
npm install -g svgo

# Optimize single file
svgo icon.svg --precision=1

# Optimize directory
svgo -f ./assets/icons --precision=1

# Custom config
svgo icon.svg --config=svgo.config.js
```

**SVGO configuration file:**

```javascript
// svgo.config.js
module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Reduce coordinate precision
          cleanupNumericValues: {
            floatPrecision: 1
          },
          // Remove unnecessary attributes
          removeViewBox: false,
          // Keep IDs for animations
          cleanupIds: false
        }
      }
    },
    // Remove metadata
    'removeMetadata',
    // Remove comments
    'removeComments',
    // Remove hidden elements
    'removeHiddenElems',
    // Minify styles
    'minifyStyles'
  ]
}
```

**Nuxt build-time optimization:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    plugins: [
      {
        name: 'svg-optimizer',
        transform(code, id) {
          if (id.endsWith('.svg')) {
            // Use svgo programmatically
            const { optimize } = require('svgo')
            const result = optimize(code, {
              path: id,
              plugins: [
                {
                  name: 'preset-default',
                  params: { overrides: { cleanupNumericValues: { floatPrecision: 1 } } }
                }
              ]
            })
            return result.data
          }
        }
      }
    ]
  }
})
```

**Vue component with optimized SVG:**

```vue
<!-- components/Icon.vue -->
<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    :class="className"
    v-bind="$attrs"
  >
    <component :is="iconComponent" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: number | string
  viewBox?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  viewBox: '0 0 24 24'
})

// Lazy load optimized SVG components
const iconComponent = computed(() => {
  return defineAsyncComponent(() =>
    import(`./icons/${props.name}.svg?component`)
  )
})
</script>
```

**Using vite-svg-loader:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    plugins: [
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: { floatPrecision: 1 },
                  removeViewBox: false
                }
              }
            }
          ]
        }
      })
    ]
  }
})
```

```vue
<template>
  <!-- Import as component -->
  <IconCheck class="icon" />
</template>

<script setup lang="ts">
import IconCheck from '~/assets/icons/check.svg?component'
</script>
```

**Inline SVG optimization:**

```vue
<template>
  <div class="icon-grid">
    <!-- Before: 2.4 KB -->
    <svg viewBox="0 0 100 100">
      <circle cx="50.0000" cy="50.0000" r="40.0000" />
    </svg>

    <!-- After: 1.2 KB (50% reduction) -->
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  </div>
</template>
```

**Dynamic SVG sprite:**

```vue
<!-- composables/useSvgSprite.ts -->
export function useSvgSprite() {
  const sprites = ref<Map<string, string>>(new Map())

  async function loadSprite(name: string) {
    if (sprites.value.has(name)) {
      return sprites.value.get(name)
    }

    const svg = await import(`~/assets/icons/${name}.svg?raw`)
    const optimized = optimizeSvg(svg.default)
    sprites.value.set(name, optimized)

    return optimized
  }

  function optimizeSvg(svg: string): string {
    // Runtime optimization (use only if necessary)
    return svg
      .replace(/\d+\.\d{2,}/g, (match) => parseFloat(match).toFixed(1))
      .replace(/<!--[\s\S]*?-->/g, '')
  }

  return { loadSprite, sprites }
}
```

**File size comparison:**

```typescript
// Icon library stats:

// Before optimization:
// 100 icons × 3 KB average = 300 KB

// After optimization (precision=1, no metadata):
// 100 icons × 1.2 KB average = 120 KB
// 60% reduction!

// Gzip compression:
// Optimized + gzip: 40 KB
// 87% total reduction!
```

**Best practices:**

✅ **Do:**
- Use SVGO with `--precision=1` or `--precision=2`
- Remove metadata, comments, and hidden elements
- Use `viewBox` instead of width/height when possible
- Lazy load icon components
- Create SVG sprites for frequently used icons

❌ **Don't:**
- Manually edit SVG files (automate with tools)
- Use excessive decimal precision (1-2 digits is enough)
- Embed unoptimized SVGs in components
- Inline large SVGs without optimization

**Precision levels:**

```svg
<!-- precision=4 (default in some tools) - 1.8 KB -->
<path d="M12.0000,2.0000 L22.3923,12.3923 L12.0000,22.7846"/>

<!-- precision=2 - 1.4 KB -->
<path d="M12.00,2.00 L22.39,12.39 L12.00,22.78"/>

<!-- precision=1 - 1.2 KB (recommended) -->
<path d="M12.0,2.0 L22.4,12.4 L12.0,22.8"/>

<!-- precision=0 - 1.0 KB (only for simple shapes) -->
<path d="M12,2 L22,12 L12,23"/>
```

**Impact Analysis:**
- Performance gain: 40-60% file size reduction
- Use cases: Icon libraries, illustrations, logos
- Considerations: Balance precision with visual quality

Reference: [SVGO](https://github.com/svg/svgo)

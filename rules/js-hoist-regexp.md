---
title: Hoist RegExp Outside Functions
impact: LOW-MEDIUM
impactDescription: avoid recreating regex on every call
tags: javascript, regexp, performance, hoisting
---

## Hoist RegExp Outside Functions

Move RegExp declarations outside function scope to avoid recreating them on every invocation.

**Incorrect (recreates regex on every call):**

```vue
<script setup>
function validateEmail(email: string): boolean {
  // RegExp created on EVERY function call
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Called 1000+ times in a loop
const validEmails = computed(() => {
  return emails.value.filter(validateEmail)
})
</script>
```

**Correct (regex created once):**

```vue
<script setup>
// RegExp created once at module load
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

const validEmails = computed(() => {
  return emails.value.filter(validateEmail)
})
</script>
```

**Multiple regex patterns:**

```typescript
// Incorrect
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Created on every call
    .replace(/javascript:/gi, '') // Created on every call
    .replace(/on\w+=/gi, '') // Created on every call
}

// Correct
const HTML_TAGS_REGEX = /[<>]/g
const JAVASCRIPT_PROTOCOL_REGEX = /javascript:/gi
const EVENT_HANDLERS_REGEX = /on\w+=/gi

function sanitizeInput(input: string): string {
  return input
    .replace(HTML_TAGS_REGEX, '')
    .replace(JAVASCRIPT_PROTOCOL_REGEX, '')
    .replace(EVENT_HANDLERS_REGEX, '')
}
```

**Impact Analysis:**
- Performance gain: Eliminates regex compilation overhead in hot paths
- Use cases: Validation functions, string formatting, data sanitization
- Considerations: Particularly important when functions are called repeatedly in loops or watchers

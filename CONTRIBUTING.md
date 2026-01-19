# Contributing to Vue Best Practices

First off, thank you for considering contributing to Vue Best Practices! 🎉

This document provides guidelines for contributing to this project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Creating a New Rule](#creating-a-new-rule)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include code examples if applicable**

### Adding New Rules

We welcome new performance optimization rules! Before adding a rule:

1. Check if a similar rule already exists
2. Ensure the rule provides measurable performance benefits
3. Include real-world examples from Vue 2/3 or Nuxt applications

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/your-username/vue-best-practices.git
cd vue-best-practices

# Add upstream remote
git remote add upstream https://github.com/ursazoo/vue-best-practices.git

# Install dependencies
npm install
```

### Running Scripts

```bash
# Build AGENTS.md from rules
npm run build

# Validate all rule files
npm run validate

# Extract test cases
npm run extract-tests

# Run all checks
npm run dev
```

## Creating a New Rule

### 1. Use the Template

Copy the template file:

```bash
cp rules/_template.md rules/category-rule-name.md
```

### 2. Choose the Correct Prefix

Select a category prefix based on the rule's primary focus:

| Prefix | Category | Impact Level |
|--------|----------|--------------|
| `async-` | Eliminate Async Waterfalls | CRITICAL |
| `bundle-` | Bundle Size Optimization | CRITICAL |
| `server-` | Server-Side Performance | HIGH |
| `client-` | Client-Side Data Fetching | HIGH |
| `reactivity-` | Reactivity Optimization | MEDIUM-HIGH |
| `rendering-` | Rendering Performance | MEDIUM |
| `vue2-` | Vue 2 Specific | MEDIUM |
| `vue3-` | Vue 3 Specific | MEDIUM |
| `js-` | JavaScript Performance | LOW-MEDIUM |
| `advanced-` | Advanced Patterns | LOW |

### 3. Fill in the Rule Content

Your rule should include:

#### Frontmatter

```markdown
---
title: Descriptive Rule Title
impact: MEDIUM-HIGH
impactDescription: brief description of the performance gain
tags: tag1, tag2, tag3
---
```

#### Main Content

- **Title and Introduction**: Brief explanation of the rule
- **Incorrect Example**: Show the anti-pattern with explanation
- **Correct Example**: Show the optimal implementation
- **Additional Context**: Explain why this matters
- **Impact Analysis**: Quantify or describe the performance benefit
- **References**: Link to official documentation

**Example Structure:**

```markdown
## Rule Title Here

Brief explanation of why this rule matters.

> **Vue 3 Only**: Add version compatibility notes if applicable

**Incorrect (describe what's wrong):**

\`\`\`vue
<!-- Bad example with clear anti-pattern -->
<script setup>
const data = ref(heavyObject) // Makes everything reactive
</script>
\`\`\`

**Correct (describe what's right):**

\`\`\`vue
<!-- Good example showing best practice -->
<script setup>
const data = shallowRef(heavyObject) // Only top-level reactive
</script>
\`\`\`

**Impact Analysis:**
- Performance gain: Significantly reduces overhead
- Use cases: Large datasets, external libraries
- Considerations: Must replace entire value to trigger updates

Reference: [Vue Documentation](https://vuejs.org/...)
```

### 4. Test Your Rule

```bash
# Validate the rule format
npm run validate

# Build to check it's included correctly
npm run build

# Check the output
cat AGENTS.md | grep "Your Rule Title"
```

## Submitting Changes

### 1. Create a Branch

```bash
git checkout -b feat/add-rule-name
# or
git checkout -b fix/correct-rule-issue
```

### 2. Make Your Changes

- Follow the [Style Guidelines](#style-guidelines)
- Write clear, concise content
- Include code examples
- Add appropriate tags

### 3. Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git commit -m "feat: add rule for optimizing X"
git commit -m "fix: correct example in rule Y"
git commit -m "docs: improve explanation in rule Z"
```

**Commit Types:**

- `feat:` - New rule or feature
- `fix:` - Bug fix in a rule or script
- `docs:` - Documentation improvements
- `chore:` - Maintenance (deps, config)
- `refactor:` - Code restructuring
- `test:` - Test additions or fixes
- `perf:` - Performance improvements

### 4. Push to Your Fork

```bash
git push origin feat/add-rule-name
```

### 5. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Related Issues**: Link any related issues
   - **Screenshots**: If applicable

**PR Title Examples:**
- `feat: add client-side caching rule`
- `fix: correct TypeScript types in reactivity rule`
- `docs: add Vue 2 compatibility notes`

## Style Guidelines

### Markdown

- Use ATX-style headers (`#` not `===`)
- Use fenced code blocks with language identifiers
- Use **bold** for emphasis, not *italic*
- Keep lines under 120 characters when possible

### Code Examples

- Use TypeScript for type-annotated examples
- Use `<script setup>` syntax for Vue 3
- Include comments to explain non-obvious code
- Show both incorrect and correct examples
- Keep examples concise and focused

### Writing Style

- Write in clear, simple English
- Use active voice ("Use X" not "X should be used")
- Be specific about versions (Vue 2/3, Nuxt)
- Include performance impact when known
- Link to official documentation

### Example Quality Checklist

- [ ] Examples are complete and runnable
- [ ] TypeScript types are correct
- [ ] Vue 2/3 compatibility is noted
- [ ] Performance impact is described
- [ ] References are included
- [ ] Code follows Vue style guide

## Review Process

### What We Look For

- **Correctness**: Examples work as described
- **Clarity**: Easy to understand for all skill levels
- **Performance**: Rule actually improves performance
- **Completeness**: Includes all required sections
- **Compatibility**: Vue 2/3 notes when relevant

### After Submission

- Maintainers will review within 3-5 business days
- You may be asked to make changes
- Once approved, your PR will be merged
- Your contribution will be credited in release notes

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/ursazoo/vue-best-practices/discussions)
- **Bug Reports**: Create an [Issue](https://github.com/ursazoo/vue-best-practices/issues)
- **Quick Help**: Comment on existing issues or PRs

## Recognition

All contributors will be:
- Listed in release notes
- Credited in the repository
- Added to CONTRIBUTORS.md (if created)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Vue Best Practices! 🙌

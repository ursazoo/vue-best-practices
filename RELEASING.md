# Release Process

This document describes the release process for Vue Best Practices.

## Prerequisites

- Write access to the repository
- Node.js 18+ installed
- All tests passing
- All PRs merged and ready for release

## Release Checklist

### 1. Update Version

Update the version in `metadata.json`:

```json
{
  "version": "1.1.0",
  "date": "January 2026",
  ...
}
```

### 2. Update CHANGELOG.md

Add a new section for the release:

```markdown
## [1.1.0] - 2026-01-19

### Added
- List new features and rules

### Fixed
- List bug fixes

### Changed
- List changes to existing features
```

### 3. Build and Validate

```bash
# Build AGENTS.md
npm run build

# Validate all rules
npm run validate

# Extract test cases
npm run extract-tests
```

Ensure the build output shows the correct number of rules.

### 4. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
git add .
git commit -m "chore(release): v1.1.0"
```

**Commit Message Format:**

- `feat:` - New feature or rule
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks (releases, deps)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `perf:` - Performance improvements

**Examples:**
```bash
git commit -m "feat: add client-side optimization rules"
git commit -m "fix: correct recursive function call in client-swr-dedup"
git commit -m "docs: add Vue 2/3 compatibility notes"
git commit -m "chore(release): v1.1.0"
```

### 5. Create Git Tag

```bash
git tag -a v1.1.0 -m "Release v1.1.0: Add 16 new rules and fix critical issues"
git push origin main --tags
```

### 6. Create GitHub Release

1. Go to [GitHub Releases](https://github.com/ursazoo/vue-best-practices/releases)
2. Click "Draft a new release"
3. Choose the tag `v1.1.0`
4. **Release title:** `v1.1.0`
5. **Release notes:** Copy from CHANGELOG.md

**Release Notes Template:**

```markdown
## What's New in v1.1.0

### 🎉 New Rules (16)

**Client Optimization**
- Deduplicate global event listeners
- Passive event listeners for better scroll performance
- Automatic request deduplication
- LocalStorage schema versioning

**Async Optimization**
- Strategic Suspense boundaries
- Defer await to needed branches
- Dependency-based parallelization

**Reactivity Optimization**
- shallowRef for large objects
- Watch optimization strategies
- readonly for mutation prevention
- unref/toValue for flexible APIs
- markRaw for external libraries

**Rendering Optimization**
- CSS content-visibility for long lists
- SVG optimization with SVGO
- SSR hydration without flickering

**Advanced Patterns**
- Stable callback refs in watchers
- Fresh values without triggering effects

### 🐛 Critical Fixes

- Fixed recursive function calls in multiple rules
- Added missing TypeScript type definitions
- Verified and documented `better-all` package
- Corrected `useLatest` implementation

### 📚 Documentation

- Added Vue 2/3 compatibility notes
- Enhanced error handling examples
- Improved performance descriptions
- Added installation instructions

### 📊 Stats

- **Total rules:** 46 (up from 30)
- **Categories:** 10
- **Files modified:** 8
- **Critical bugs fixed:** 4

## Full Changelog

See [CHANGELOG.md](CHANGELOG.md) for complete details.

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/ursazoo/vue-best-practices.git

# Install dependencies
npm install

# Build AGENTS.md
npm run build
\`\`\`

## Using with AI Assistants

\`\`\`bash
npx add-skill /path/to/vue-best-practices
\`\`\`

---

**Contributors:** Thank you to all contributors who made this release possible!
```

### 7. Announce Release (Optional)

Share the release on:

- Twitter/X
- Vue.js Discord
- Reddit r/vuejs
- Dev.to
- Your blog

**Social Media Template:**

```
🚀 Vue Best Practices v1.1.0 is out!

✨ 16 new performance optimization rules
🐛 Critical bug fixes
📚 Vue 2/3 compatibility notes
🤖 AI-agent friendly format

From client-side optimization to advanced reactivity patterns.

👉 https://github.com/ursazoo/vue-best-practices

#VueJS #WebPerf #AI
```

## Post-Release

### Monitor for Issues

- Watch GitHub issues for bug reports
- Check Discussions for questions
- Monitor CI/CD pipelines

### Update Documentation

If needed, update:
- README.md
- Contributing guidelines
- Examples and tutorials

## Emergency Hotfix Process

For critical bugs in production:

1. Create a hotfix branch:
   ```bash
   git checkout -b hotfix/v1.1.1
   ```

2. Fix the issue and test thoroughly

3. Update version to `1.1.1`

4. Commit with prefix `fix:` or `hotfix:`
   ```bash
   git commit -m "fix: critical issue in rule X"
   ```

5. Merge to main and release immediately

6. Tag as `v1.1.1` and create release notes

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR (2.0.0):** Breaking changes
- **MINOR (1.1.0):** New features, backward compatible
- **PATCH (1.0.1):** Bug fixes, backward compatible

**Examples:**
- `1.0.0` → `1.1.0`: Added 16 new rules (minor)
- `1.1.0` → `1.1.1`: Fixed critical bug (patch)
- `1.1.1` → `2.0.0`: Changed rule format (major)

## Release Frequency

- **Major releases:** As needed (breaking changes)
- **Minor releases:** Monthly or when significant features are ready
- **Patch releases:** As needed (critical bugs)

---

For questions about the release process, open a discussion on GitHub.

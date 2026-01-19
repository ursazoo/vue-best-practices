#!/bin/bash

# Vue Best Practices Release Script
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 1.1.0

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "❌ Error: Version is required"
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh 1.1.0"
  exit 1
fi

echo "🚀 Starting release process for v$VERSION..."
echo ""

# Step 1: Validate
echo "📋 Step 1/6: Validating rules..."
npm run validate
echo "✅ Validation passed"
echo ""

# Step 2: Build
echo "🔨 Step 2/6: Building AGENTS.md..."
npm run build
echo "✅ Build complete"
echo ""

# Step 3: Extract tests
echo "🧪 Step 3/6: Extracting test cases..."
npm run extract-tests
echo "✅ Tests extracted"
echo ""

# Step 4: Update metadata
echo "📝 Step 4/6: Updating metadata.json..."
# Use jq if available, otherwise manual edit required
if command -v jq &> /dev/null; then
  TEMP_FILE=$(mktemp)
  jq --arg version "$VERSION" '.version = $version' metadata.json > "$TEMP_FILE"
  mv "$TEMP_FILE" metadata.json
  echo "✅ metadata.json updated to v$VERSION"
else
  echo "⚠️  jq not found. Please update metadata.json manually:"
  echo "   \"version\": \"$VERSION\""
fi
echo ""

# Step 5: Git operations
echo "📦 Step 5/6: Creating git commit and tag..."
git add .
git commit -m "chore(release): v$VERSION"
git tag -a "v$VERSION" -m "Release v$VERSION"
echo "✅ Commit and tag created"
echo ""

# Step 6: Summary
echo "📊 Step 6/6: Release summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Version: v$VERSION"
echo "Commit: $(git rev-parse --short HEAD)"
echo "Tag: v$VERSION"
echo ""
RULE_COUNT=$(grep -c "^## [0-9]" AGENTS.md || echo "Unknown")
echo "Total rules: $RULE_COUNT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Push confirmation
echo "⚠️  Ready to push? This will:"
echo "   1. Push commit to origin/main"
echo "   2. Push tag v$VERSION"
echo ""
read -p "Push to remote? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 Pushing to remote..."
  git push origin main
  git push origin "v$VERSION"
  echo ""
  echo "✅ Release complete!"
  echo ""
  echo "Next steps:"
  echo "1. Go to https://github.com/ursazoo/vue-best-practices/releases"
  echo "2. GitHub Actions will automatically create a release"
  echo "3. Review and publish the release"
  echo "4. Share on social media!"
else
  echo ""
  echo "ℹ️  Release prepared but not pushed."
  echo "To push later, run:"
  echo "   git push origin main"
  echo "   git push origin v$VERSION"
fi

echo ""
echo "🎉 Done!"

# Drop-API-ID Setup Guide

Complete step-by-step guide to get your development environment ready.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org))
- **npm** (comes with Node.js) or **pnpm** (optional, faster)
- **Git** installed ([Download](https://git-scm.com))
- A code editor (VS Code recommended)

### Check Your Setup

```bash
# Check Node.js version (should be 18 or higher)
node --version
# Expected: v18.x.x or v20.x.x

# Check npm version
npm --version
# Expected: 9.x.x or higher

# Check git
git --version
# Expected: git version 2.x.x
```

---

## Installation Steps

### Step 1: Download/Clone the Project

**Option A: If you downloaded the folder**
```bash
# Navigate to the folder
cd path/to/drop-api-id
```

**Option B: If you want to clone from GitHub (after uploading)**
```bash
git clone https://github.com/yourusername/drop-api-id.git
cd drop-api-id
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# OR using pnpm (faster)
pnpm install

# OR using yarn
yarn install
```

This will install:
- `nanoid` - ID generation (production dependency)
- TypeScript, tsup, vitest, eslint, prettier (development dependencies)

**Expected output:**
```
added 150 packages in 15s
```

### Step 3: Verify Installation

```bash
# Check that node_modules folder exists
ls node_modules

# Should see folders like: nanoid, typescript, vitest, etc.
```

---

## Development Workflow

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**Expected output:**
```
✓ tests/index.test.ts (30 tests) 
  Test Files  1 passed (1)
       Tests  30 passed (30)
```

### Build the Package

```bash
# Build for production
npm run build
```

**This creates the `dist/` folder with:**
- `dist/index.js` - CommonJS version (for require())
- `dist/index.mjs` - ES Module version (for import)
- `dist/index.d.ts` - TypeScript type definitions

**Verify build:**
```bash
ls dist/
# Should show: index.js, index.mjs, index.d.ts
```

### Development Mode

```bash
# Watch mode - rebuilds on file changes
npm run dev
```

Leave this running while you code!

### Linting and Formatting

```bash
# Check and fix linting issues
npm run lint

# Format all files
npm run format

# Type check without building
npm run typecheck
```

---

## Project Structure

```
drop-api-id/
├── src/
│   └── index.ts              # Main source code
├── tests/
│   └── index.test.ts         # Test suite
├── dist/                     # Build output (created after npm run build)
│   ├── index.js             # CommonJS build
│   ├── index.mjs            # ES Module build
│   └── index.d.ts           # TypeScript types
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
├── tsup.config.ts           # Build configuration
├── vitest.config.ts         # Test configuration
├── .eslintrc.js             # Linting rules
├── .prettierrc.js           # Code formatting rules
├── .gitignore               # Git ignore rules
├── .npmignore               # npm ignore rules
├── LICENSE                  # MIT License
├── README.md                # Package documentation
├── CHANGELOG.md             # Version history
└── SETUP.md                 # This file
```

---

## Testing Your Package Locally

### Test in Another Project

1. **Build your package:**
```bash
npm run build
```

2. **Create a test project:**
```bash
cd ..
mkdir test-drop-api-id
cd test-drop-api-id
npm init -y
```

3. **Install your local package:**
```bash
npm install ../drop-api-id
```

4. **Test it:**
```bash
# Create test file
cat > test.js << 'EOF'
const { dropid } = require('drop-api-id');

console.log('Simple ID:', dropid('user'));
console.log('Prefixed ID:', dropid('user', 'acme'));
console.log('Custom length:', dropid('user', undefined, { length: 16 }));
EOF

# Run it
node test.js
```

**Expected output:**
```
Simple ID: user_a3f2b9c1d4e5
Prefixed ID: acme_user_x7k9m2n4p1q8
Custom length: user_k8j3m9n2l4p6q1r7
```

### Test TypeScript Support

```bash
# In your test project
npm install -D typescript tsx

# Create TypeScript test
cat > test.ts << 'EOF'
import { dropid, configure, createPrefixedId } from 'drop-api-id';

// Test basic usage
console.log(dropid('user'));

// Test configuration
configure({ length: 16 });
console.log(dropid('post'));

// Test prefixed generator
const acmeId = createPrefixedId('acme');
console.log(acmeId('order'));
EOF

# Run it
npx tsx test.ts
```

---

## Making Changes

### Modify the Code

1. **Edit source file:**
```bash
# Open in your editor
code src/index.ts
# or
vim src/index.ts
```

2. **Run in watch mode:**
```bash
npm run dev
```

3. **Run tests:**
```bash
npm run test:watch
```

### Add New Features

1. **Write the feature in `src/index.ts`**
2. **Add tests in `tests/index.test.ts`**
3. **Run tests to make sure they pass**
4. **Update README.md with documentation**
5. **Update CHANGELOG.md**

### Example: Adding a New Function

**1. Add to `src/index.ts`:**
```typescript
export function shortid(modelName: string): string {
  return dropid(modelName, undefined, { length: 8 });
}
```

**2. Add test in `tests/index.test.ts`:**
```typescript
it('should generate short ID', () => {
  const id = shortid('user');
  expect(id).toMatch(/^user_[0-9a-z]{8}$/);
});
```

**3. Run tests:**
```bash
npm test
```

**4. Build:**
```bash
npm run build
```

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tests fail

**Solution:**
```bash
# Make sure you're on Node 18+
node --version

# Reinstall dependencies
rm -rf node_modules
npm install

# Run tests with verbose output
npm test -- --reporter=verbose
```

### Issue: Build fails

**Solution:**
```bash
# Clean and rebuild
rm -rf dist
npm run build

# Check for TypeScript errors
npm run typecheck
```

### Issue: `nanoid` not found

**Solution:**
```bash
# Reinstall nanoid
npm install nanoid@^5.0.7
```

### Issue: TypeScript errors in editor

**Solution:**
```bash
# Generate types
npm run build

# Restart your editor
# VS Code: Cmd/Ctrl + Shift + P → "Reload Window"
```

---

## Publishing to npm

When you're ready to publish:

### 1. Update package.json

```json
{
  "name": "drop-api-id",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/drop-api-id.git"
  }
}
```

### 2. Create npm Account

```bash
npm adduser
# Follow prompts
```

### 3. Build and Test

```bash
# Run all checks
npm run lint
npm run typecheck
npm test
npm run build

# Or use the release script (does all of above)
npm run prepublishOnly
```

### 4. Publish

```bash
npm publish

# OR for scoped package
npm publish --access public
```

### 5. Verify

```bash
# Check it's live
npm view drop-api-id

# Install and test
mkdir test && cd test
npm init -y
npm install drop-api-id
```

---

## Development Tips

### Use VS Code Extensions

Install these for better DX:
- **ESLint** - Linting in editor
- **Prettier** - Auto-formatting
- **TypeScript Vue Plugin** - Better TS support
- **Error Lens** - Inline error messages

### Use Auto-format on Save

**.vscode/settings.json:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Use Git Hooks (Optional)

```bash
# Install husky for pre-commit hooks
npm install -D husky

# Setup
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build` | Build for production |
| `npm run dev` | Build in watch mode |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Check TypeScript types |
| `npm run prepublishOnly` | Run all checks before publish |
| `npm run release` | Build, test, and publish |

---

## Next Steps

1. ✅ Install dependencies (`npm install`)
2. ✅ Run tests (`npm test`)
3. ✅ Build package (`npm run build`)
4. ✅ Test locally (see "Testing Your Package Locally")
5. 📝 Customize package.json with your info
6. 📝 Update README.md if needed
7. 🚀 Publish to npm (`npm publish`)

---

## Getting Help

- **Issues**: Open an issue on GitHub
- **Questions**: Check existing issues or open a discussion
- **Contributing**: See CONTRIBUTING.md (if you have one)

---

## Summary

You now have a complete, production-ready npm package!

**What's included:**
✅ TypeScript source code with full types
✅ Comprehensive test suite (30+ tests)
✅ Build system (tsup) for CJS + ESM
✅ Linting (ESLint) and formatting (Prettier)
✅ GitHub Actions CI/CD
✅ Complete documentation

**You're ready to:**
- Develop locally
- Run tests
- Build for production
- Publish to npm

Good luck! 🚀

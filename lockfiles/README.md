# Package Lock Files

This directory contains package manager lock files that ensure consistent dependency versions across environments.

## Files

- **package-lock.json**: npm lock file (used when running `npm install`)
- **bun.lockb**: Bun lock file (used when running `bun install`)

## ⚠️ Important Note

**Lock files in a subdirectory may not be automatically detected by package managers.**

Package managers (npm, yarn, bun) typically expect lock files to be in the same directory as `package.json` (the root). While keeping them here makes the root cleaner, you may need to:

### Option 1: Symlink (Recommended)
Create symbolic links in the root:
```bash
# For npm
New-Item -ItemType SymbolicLink -Path "package-lock.json" -Target "lockfiles\package-lock.json"

# For bun
New-Item -ItemType SymbolicLink -Path "bun.lockb" -Target "lockfiles\bun.lockb"
```

### Option 2: Copy When Needed
Copy the lock file to root before installing:
```bash
Copy-Item "lockfiles\package-lock.json" "package-lock.json"
npm install
```

### Option 3: Keep in Root
Move them back if automatic detection is needed:
```bash
Move-Item "lockfiles\package-lock.json" "package-lock.json"
Move-Item "lockfiles\bun.lockb" "bun.lockb"
```

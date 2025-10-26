# 🔧 Quick Fix: Build Errors on Render

## ❌ The Problem

You're seeing TypeScript compilation errors:

- `error TS7016: Could not find a declaration file for module 'bcryptjs'`
- `error TS7016: Could not find a declaration file for module 'jsonwebtoken'`
- `error TS7016: Could not find a declaration file for module 'cors'`

## ✅ The Solution

Render uses `npm install` which skips `devDependencies` by default. You need dev dependencies for the TypeScript build.

### Quick Fix Steps:

1. **In Render Dashboard:**

   - Go to your service
   - Click **"Settings"** tab
   - Find **"Build Command"**
   - Change from: `npm install && npm run build`
   - Change to: `npm ci && npm run build`
   - Click **"Save Changes"**

2. **Or update in your .render.yaml file:**
   ```yaml
   buildCommand: npm ci && npm run build
   ```
3. **Then redeploy:**
   - Go to **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**

### Why This Works

- `npm ci` installs ALL dependencies (including devDependencies) needed for the build
- Your `@types/*` packages are in devDependencies and are needed for TypeScript compilation
- After building, only production dependencies are needed at runtime

### Alternative: Move Type Definitions

If the above doesn't work, you can move the type definitions to dependencies:

```bash
npm install --save @types/bcryptjs @types/jsonwebtoken @types/cors
```

But the `npm ci` solution is better!

---

## 🎉 After Fix

Once you redeploy with the correct build command, your build should succeed! ✅

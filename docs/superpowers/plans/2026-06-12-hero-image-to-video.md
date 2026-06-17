# Hero Image → Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace two static hero PNG images with their existing MP4 video counterparts.

**Architecture:** One-file change in `src/components/Landing.tsx` — swap `<Image>` tags for `<video>` tags with `autoPlay muted loop playsInline preload="auto"`, keeping the same container div and theme CSS classes.

**Tech Stack:** Next.js, React, HTML5 `<video>`

---

### Task 1: Swap images for videos in Landing.tsx

**Files:**
- Modify: `src/components/Landing.tsx:79-82`

- [ ] **Step 1: Replace the two `<Image>` elements with `<video>` elements**

Current code (lines 79-82):
```tsx
      <div className="hero-image" aria-hidden="true">
        <Image className="theme-art theme-art-dark" src="/landing/hero-robot-dark.png" alt="" fill priority sizes="100vw"/>
        <Image className="theme-art theme-art-light" src="/landing/hero-robot-light.png" alt="" fill priority sizes="100vw"/>
      </div>
```

Replace with:
```tsx
      <div className="hero-image" aria-hidden="true">
        <video className="theme-art theme-art-dark" src="/landing/hero-robot-dark.mp4" autoPlay muted loop playsInline preload="auto" />
        <video className="theme-art theme-art-light" src="/landing/hero-robot-light.mp4" autoPlay muted loop playsInline preload="auto" />
      </div>
```

- [ ] **Step 2: Verify build succeeds**

Run:
```bash
cd /Users/mila/dens-workspace && npm run build 2>&1 | tail -20
```

Expected: Build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Landing.tsx
git commit -m "feat: replace hero robot PNGs with MP4 videos

Co-Authored-By: Claude <noreply@anthropic.com>"
```

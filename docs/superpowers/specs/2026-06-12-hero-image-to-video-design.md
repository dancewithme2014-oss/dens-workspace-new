# Hero Image → Video Swap

**Date:** 2026-06-12
**Status:** Approved by user
**Type:** UI enhancement

## Summary

Replace two static PNG hero images (`hero-robot-dark.png`, `hero-robot-light.png`) with their existing MP4 video counterparts (`hero-robot-dark.mp4`, `hero-robot-light.mp4`) on the landing page.

## Current Implementation

In `src/components/Landing.tsx` (lines 79-82), the hero section renders two `<Image>` components inside a `<div className="hero-image">`. Each image is toggled via CSS class (`theme-art-dark` / `theme-art-light`) based on the current theme:

```tsx
<div className="hero-image" aria-hidden="true">
  <Image className="theme-art theme-art-dark" src="/landing/hero-robot-dark.png" alt="" fill priority sizes="100vw"/>
  <Image className="theme-art theme-art-light" src="/landing/hero-robot-light.png" alt="" fill priority sizes="100vw"/>
</div>
```

Both `.mp4` files already exist in `public/landing/`.

## Change

Replace each `<Image>` with a `<video>` element, keeping:
- Same container (`div.hero-image`)
- Same theme toggle classes (`theme-art-dark` / `theme-art-light`)
- Same `aria-hidden="true"` (decorative, not informational)

### Video attributes

| Attribute | Value | Reason |
|-----------|-------|--------|
| `autoPlay` | — | Start playing when loaded |
| `muted` | — | Required by browsers for autoplay; decorative video has no audio |
| `loop` | — | Continuous playback as background decoration |
| `playsInline` | — | iOS Safari requires this for autoplay |
| `preload` | `"auto"` | Eager load (replaces `priority` from Image) |
| `className` | `"theme-art theme-art-dark"` or `"theme-art theme-art-light"` | Same theme visibility CSS |

## Non-Goals

- No layout or style changes to `.hero-image` or its parent
- No changes to theme-switching logic
- No audio track (videos remain muted)

## Files Affected

1. `src/components/Landing.tsx` — replace two `<Image>` with `<video>`

## Self-Review Checklist

- [x] No placeholders or TODOs
- [x] One focused change: image → video, nothing else
- [x] All attributes accounted for (autoplay, muted, loop, playsInline, preload)
- [x] Theme-class preservation keeps dark/light switching working
- [x] No layout regressions expected (same container, same CSS classes)

'use client'

import { useEffect, useRef } from 'react'

/**
 * Dependency-free canvas cosmic scene: three concentric 3D dust rings that
 * spin forever and slowly wobble in 3D (galaxy-style), over a sparse drifting
 * dust layer — everything repelled by the cursor.
 *
 * All rings are concentric and share one fixed global 3D orientation
 * (equivalent to CSS `scale(0.75) rotateY(-30deg) rotateX(45deg)
 * translateZ(4.5rem)`); inside that shared plane each ring spins endlessly
 * around its own axis at its own speed/direction. Scrolling is spin-reactive:
 * scroll impulses temporarily multiply every ring's own spin rate (down =
 * faster, up = backward), decaying back to the normal speed once scrolling
 * stops. The X tilt is additionally scroll-linked: scrolling from the hero
 * down to #education smoothly flips the formation to the opposite X angle. Points are rotated and
 * perspective-projected each frame; depth drives size and brightness so the
 * near edges read clearly in front.
 *
 * Cursor interaction happens in screen space: when the pointer comes within
 * REPEL_RADIUS of a particle's projected position, a radial push offset is
 * eased in, opening a clear space in the rings; it springs back once the
 * pointer moves away. The spin itself never stops.
 *
 * Colors adapt to the `dark` class on <html>, and animation is skipped for
 * users who prefer reduced motion (a single static frame is drawn instead).
 */
export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const context = el.getContext('2d')
    if (!context) return
    // Non-null locals so control-flow narrowing survives into the closures below.
    const canvas: HTMLCanvasElement = el
    const g: CanvasRenderingContext2D = context

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const REPEL_RADIUS = 130
    const REPEL_FORCE = 70

    // Ring layers, inner to outer. `spin` (rad/s, negative = reverse) turns
    // each ring around its own axis inside the shared plane.
    const LAYERS = [
      { radius: 0.26, spread: 0.20, spin: 0.18, share: 0.28 },
      { radius: 0.40, spread: 0.18, spin: -0.13, share: 0.34 },
      { radius: 0.53, spread: 0.16, spin: 0.10, share: 0.38 },
    ]

    // Shared 3D orientation for the whole formation, mirroring the CSS
    // `transform: scale(0.75) rotateY(-30deg) rotateX(45deg) translateZ(4.5rem)`.
    // Rings start face-on in the screen plane, are tipped back around X,
    // turned around Y, scaled down and nudged toward the viewer.
    const ROT_X = Math.PI / 4 // rotateX(45deg)
    const ROT_Y = -Math.PI / 6 // rotateY(-30deg)
    const SCALE = 0.9
    const LIFT_Z = 72 // translateZ(4.5rem) toward the viewer, in px

    // Scroll-linked X rotation: the formation sits at ROT_X at the top of
    // the page and eases to the opposite angle (-ROT_X) by the time the
    // Education section reaches the viewport top.
    let rotXCur = ROT_X
    let scrollRange = 1
    const measureScrollRange = () => {
      const edu = document.getElementById('education')
      scrollRange = Math.max(1, edu ? edu.offsetTop - 80 : window.innerHeight * 2)
    }

    let width = 0
    let height = 0
    let baseRadius = 0
    let raf = 0
    const mouse = { x: -9999, y: -9999 }

    // Scroll-reactive spin: each ring accumulates its own angle so scrolling
    // can momentarily change the spin rate without snapping positions.
    // `spinBoost` is a multiplier delta on every ring's own speed — scroll
    // impulses push it up (down-scroll) or negative (up-scroll, rings run
    // backward) and it decays back to 0, i.e. normal speed, between gestures.
    const spinAngles = LAYERS.map(() => 0)
    let spinBoost = 0
    let lastScrollY = 0
    const SCROLL_SPIN_SENSITIVITY = 0.008 // boost per px scrolled
    const SPIN_BOOST_MAX = 6 // cap at 7x forward / 5x backward
    const SPIN_BOOST_DECAY = 0.92 // per-frame ease back to normal speed

    interface RingParticle {
      layer: number
      theta: number // fixed angle on its ring
      radius: number // distance from center (band spread)
      yOff: number // vertical thickness of the band
      size: number
      alpha: number
      hue: number
      ox: number // eased screen-space repulsion offset
      oy: number
    }
    interface DustParticle {
      x: number
      y: number
      hx: number
      hy: number
      vx: number
      vy: number
      size: number
      alpha: number
    }
    let ring: RingParticle[] = []
    let dust: DustParticle[] = []

    const isDark = () => document.documentElement.classList.contains('dark')

    function initParticles() {
      const total = Math.min(1400, Math.max(450, Math.floor((width * height) / 1000)))
      ring = []
      LAYERS.forEach((layer, li) => {
        const count = Math.floor(total * layer.share)
        for (let i = 0; i < count; i++) {
          // Average two randoms so each band is denser in the middle, wispy at the edges.
          const band = (Math.random() + Math.random()) / 2
          ring.push({
            layer: li,
            theta: Math.random() * Math.PI * 2,
            radius: baseRadius * (layer.radius + (band - 0.5) * layer.spread),
            yOff: (Math.random() - 0.5) * baseRadius * 0.07,
            size: Math.random() * 1.2 + 0.35,
            alpha: Math.random() * 0.5 + 0.25,
            hue: 195 + Math.random() * 40, // sky blue -> blue, matching the site palette
            ox: 0,
            oy: 0,
          })
        }
      })

      const dustCount = Math.min(120, Math.max(40, Math.floor((width * height) / 16000)))
      dust = Array.from({ length: dustCount }, () => {
        const x = Math.random() * width
        const y = Math.random() * height
        return {
          x,
          y,
          hx: x,
          hy: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.3 + 0.1,
        }
      })
    }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      baseRadius = Math.min(width, height)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
      if (reduced) draw()
    }

    // Screen-space cursor repulsion shared by both layers: returns the
    // target offset for a point currently projected at (sx, sy).
    function repel(sx: number, sy: number): [number, number] {
      const dx = sx - mouse.x
      const dy = sy - mouse.y
      const dist = Math.hypot(dx, dy)
      if (dist >= REPEL_RADIUS || dist === 0) return [0, 0]
      const f = 1 - dist / REPEL_RADIUS
      return [(dx / dist) * f * REPEL_FORCE, (dy / dist) * f * REPEL_FORCE]
    }

    function draw() {
      g.clearRect(0, 0, width, height)
      const dark = isDark()
      const dustBase = dark ? '255, 255, 255' : '50, 76, 91' // dark: white, light: slate #324C5B
      const lightness = dark ? 74 : 48

      // --- Background dust layer ---
      for (const p of dust) {
        p.hx += p.vx
        p.hy += p.vy
        if (p.hx < 0) p.hx = width
        else if (p.hx > width) p.hx = 0
        if (p.hy < 0) p.hy = height
        else if (p.hy > height) p.hy = 0

        const [rx, ry] = repel(p.hx, p.hy)
        p.x += (p.hx + rx - p.x) * 0.12
        p.y += (p.hy + ry - p.y) * 0.12

        g.beginPath()
        g.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        g.fillStyle = `rgba(${dustBase}, ${p.alpha})`
        g.fill()
      }

      // --- Spinning, wobbling 3D rings ---
      const cx = width / 2
      const cy = height / 2
      const cam = baseRadius * 2.2 // camera distance for perspective
      const maxR = baseRadius // depth normalization bound

      // Shared orientation for every ring, spin angle per layer. The X tilt
      // eases toward its scroll-driven target (flips sign across the
      // hero -> education range).
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange))
      rotXCur += (ROT_X * (1 - 2 * progress) - rotXCur) * 0.08
      const cosX = Math.cos(rotXCur)
      const sinX = Math.sin(rotXCur)
      const cosY = Math.cos(ROT_Y)
      const sinY = Math.sin(ROT_Y)
      const angles = spinAngles

      for (const p of ring) {
        const a = p.theta + angles[p.layer]
        // Ring face-on in the screen (XY) plane, scaled; yOff is band thickness.
        const x0 = Math.cos(a) * p.radius * SCALE
        const y0 = Math.sin(a) * p.radius * SCALE
        const z0 = p.yOff * SCALE
        // rotateX(45deg): tip the ring back.
        const y1 = y0 * cosX - z0 * sinX
        const z1 = y0 * sinX + z0 * cosX
        // rotateY(-30deg): turn the formation.
        const x2 = x0 * cosY + z1 * sinY
        const z2 = -x0 * sinY + z1 * cosY - LIFT_Z

        // Perspective projection; near half of each ring gets bigger + brighter.
        const s = cam / (cam + z2)
        const sx = cx + x2 * s
        const sy = cy + y1 * s
        const near = (maxR - z2) / (2 * maxR) // 0 far ... 1 near

        const [rx, ry] = repel(sx, sy)
        p.ox += (rx - p.ox) * 0.14
        p.oy += (ry - p.oy) * 0.14

        g.beginPath()
        g.arc(sx + p.ox, sy + p.oy, p.size * s, 0, Math.PI * 2)
        g.fillStyle = `hsla(${p.hue}, 85%, ${lightness}%, ${p.alpha * (0.2 + 0.8 * near)})`
        g.fill()
      }
    }

    function loop() {
      spinBoost *= SPIN_BOOST_DECAY
      const rate = 1 + spinBoost
      LAYERS.forEach((layer, i) => {
        spinAngles[i] += layer.spin * 0.016 * rate
      })
      draw()
      raf = requestAnimationFrame(loop)
    }

    function onScroll() {
      const y = window.scrollY
      spinBoost = Math.max(
        -SPIN_BOOST_MAX,
        Math.min(SPIN_BOOST_MAX, spinBoost + (y - lastScrollY) * SCROLL_SPIN_SENSITIVITY)
      )
      lastScrollY = y
    }

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    measureScrollRange()
    window.addEventListener('resize', resize)
    window.addEventListener('resize', measureScrollRange)
    // Layout above #education can shift as fonts/images load in.
    window.addEventListener('load', measureScrollRange)
    if (!reduced) {
      lastScrollY = window.scrollY
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseleave', onLeave)
      window.addEventListener('scroll', onScroll, { passive: true })
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', measureScrollRange)
      window.removeEventListener('load', measureScrollRange)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

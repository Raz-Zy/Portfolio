'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// px of slack when deciding whether the sticky viewport is pinned
const SNAP_TOLERANCE = 8
// ms of wheel silence that separates one trackpad gesture from the next
const GESTURE_GAP = 250
// ms after a swap during which all scroll input is swallowed (lets the swap
// animation play and absorbs the strongest part of a flick's momentum tail)
const STEP_COOLDOWN = 700
// accumulated deltaY that triggers a swap on a fresh gesture — small so even
// a light two-finger nudge works
const STEP_THRESHOLD = 15
// accumulated deltaY needed while the same gesture continues (fingers still
// on the trackpad, or a decaying momentum tail) — higher so inertia alone
// rarely swaps, but deliberate continuous scrolling keeps stepping
const CONTINUE_THRESHOLD = 150
// accumulated deltaY at a boundary card (after the cooldown) that hands the
// page back to native scrolling mid-gesture — low enough that continuous
// scrolling flows straight out, high enough that a dying momentum tail
// (small, decaying deltas) fades out before reaching it
const EDGE_RELEASE_THRESHOLD = 100

// Gesture-stepped card stack backed by real page scroll: attach containerRef
// to an outer div that is total*100vh tall with a position:sticky h-screen
// inner viewport, so each card owns one screen-height of genuine scroll
// distance — the scrollbar moves as cards swap. A wheel/touch gesture
// animates the page to the next card's scroll position (one gesture = one
// card); scrollbar dragging and keyboard scrolling move through the same
// positions and swap cards too. Past the first/last card, scrolling
// continues natively. When the container is display:none (rect.height 0),
// all handlers no-op.
export function useScrollStepper(total: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const activeRef = useRef(0)
  // releasedDir: +1/-1 while the page has been handed back to native scroll
  // at a boundary card (0 = capturing normally)
  const gesture = useRef({ lastEvent: 0, lastStep: 0, accum: 0, fresh: false, releasedDir: 0 })
  // programmatic smooth scroll in flight: target scrollY and a deadline
  const settle = useRef({ target: -1, until: 0 })
  const goToRef = useRef<(index: number) => void>(() => {})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const setCard = (next: number, dir: number) => {
      activeRef.current = next
      setDirection(dir)
      setActive(next)
    }

    // animate the page to card `next`'s scroll position (moves the scrollbar)
    const scrollToCard = (next: number, dir: number) => {
      setCard(next, dir)
      gesture.current.lastStep = performance.now()
      gesture.current.releasedDir = 0
      const rect = container.getBoundingClientRect()
      const target = Math.round(window.scrollY + rect.top + next * window.innerHeight)
      // Deadline scales with travel distance: a multi-card jump (clicking a
      // far title/dot) smooth-scrolls several screen heights and takes well
      // over a fixed 1200ms — expiring early would let onScroll adopt an
      // intermediate card mid-flight.
      const travel = Math.abs(target - window.scrollY)
      settle.current = { target, until: performance.now() + Math.min(3000, 800 + travel * 0.6) }
      window.scrollTo({ top: target, behavior: 'smooth' })
    }

    goToRef.current = (index: number) => {
      const next = Math.min(total - 1, Math.max(0, index))
      if (next === activeRef.current) return
      scrollToCard(next, next > activeRef.current ? 1 : -1)
    }

    // scrollbar drag / keyboard / anchor jumps: derive the card from the
    // actual scroll position (each card owns one screen-height segment)
    const onScroll = () => {
      const rect = container.getBoundingClientRect()
      if (rect.height === 0) return
      const s = settle.current
      if (s.target >= 0) {
        if (Math.abs(window.scrollY - s.target) < 4 || performance.now() > s.until) {
          settle.current = { target: -1, until: 0 }
        } else {
          return // our own smooth scroll is still travelling
        }
      }
      const vh = window.innerHeight
      if (rect.top > SNAP_TOLERANCE || rect.bottom < vh - SNAP_TOLERANCE) return
      const idx = Math.min(total - 1, Math.max(0, Math.round(-rect.top / vh)))
      if (idx !== activeRef.current) {
        setCard(idx, idx > activeRef.current ? 1 : -1)
        gesture.current.lastStep = performance.now()
      }
    }

    const handleDelta = (deltaY: number, e: Event) => {
      const rect = container.getBoundingClientRect()
      if (rect.height === 0) return // display:none on small screens
      const vh = window.innerHeight
      // capture only while the sticky viewport is pinned
      if (rect.top > SNAP_TOLERANCE || rect.bottom < vh - SNAP_TOLERANCE) return

      const dir = deltaY > 0 ? 1 : -1
      const atEdge =
        (dir > 0 && activeRef.current === total - 1) ||
        (dir < 0 && activeRef.current === 0)

      const now = performance.now()
      const g = gesture.current
      if (now - g.lastEvent > GESTURE_GAP) {
        // silence gap = fingers lifted; the next input is a fresh gesture
        g.accum = 0
        g.fresh = true
      }
      g.lastEvent = now
      const inCooldown = now - g.lastStep < STEP_COOLDOWN

      if (atEdge) {
        // Already handed back to native scroll in this direction — stay out
        // of the way until the user steps or scrolls back in.
        if (g.releasedDir === dir) return
        // Swallow the swipe that just landed on this boundary card so it
        // doesn't immediately push the page while the swap animation plays.
        if (inCooldown) {
          e.preventDefault()
          g.accum = 0
          return
        }
        // A new gesture after settling releases immediately...
        if (g.fresh) {
          g.releasedDir = dir
          return
        }
        // ...and so does continued deliberate scrolling (fingers never
        // lifted): once it accumulates clearly past what a dying momentum
        // tail produces, hand the page back — no cursor wiggle needed.
        e.preventDefault()
        if (g.accum !== 0 && Math.sign(deltaY) !== Math.sign(g.accum)) g.accum = 0
        g.accum += deltaY
        if (Math.abs(g.accum) >= EDGE_RELEASE_THRESHOLD) {
          g.accum = 0
          g.releasedDir = dir
        }
        return
      }

      g.releasedDir = 0
      e.preventDefault()

      // swallow input right after a swap: the animation plays and the
      // strongest part of a flick's momentum tail is absorbed
      if (inCooldown) {
        g.accum = 0
        return
      }

      // direction change resets the accumulator
      if (g.accum !== 0 && Math.sign(deltaY) !== Math.sign(g.accum)) g.accum = 0
      g.accum += deltaY

      // fresh gestures swap on a light nudge; a continuing gesture (fingers
      // still down, or leftover inertia) needs a clearly deliberate amount
      const threshold = g.fresh ? STEP_THRESHOLD : CONTINUE_THRESHOLD
      if (Math.abs(g.accum) >= threshold) {
        g.accum = 0
        g.fresh = false
        scrollToCard(activeRef.current + dir, dir)
      }
    }

    const onWheel = (e: WheelEvent) => handleDelta(e.deltaY, e)

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
      gesture.current.accum = 0
      gesture.current.fresh = true
      gesture.current.lastEvent = performance.now()
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const delta = touchY - y
      touchY = y
      handleDelta(delta, e)
    }

    // Window-level listeners: while the stack is pinned, scrolling anywhere
    // in the viewport (over the card, heading, or any other spot) swaps cards.
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [total])

  const goTo = useCallback((index: number) => goToRef.current(index), [])

  // true while the sticky viewport is pinned to the screen — callers can use
  // this to gate behaviors (e.g. auto-advance) that scroll the page
  const isPinned = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.height === 0) return false
    return rect.top <= SNAP_TOLERANCE && rect.bottom >= window.innerHeight - SNAP_TOLERANCE
  }, [])

  return { containerRef, active, direction, goTo, isPinned }
}

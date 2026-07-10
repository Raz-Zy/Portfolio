'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Scroll-scrubbed wrapper: parallax drift + fade/scale as the section enters
// and leaves the viewport. Keep parallax <= ~40px so anchor jumps still land
// within the 80px scroll-padding-top offset.
// Do not wrap sections that rely on position: sticky or fixed descendants —
// a transformed ancestor changes their containing block.
export default function ScrollSection({
  children,
  parallax = 40,
}: {
  children: React.ReactNode
  parallax?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax])
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0.4, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.97])

  if (reducedMotion) {
    return <div>{children}</div>
  }

  return (
    <div ref={ref}>
      <motion.div style={{ y, opacity, scale }}>{children}</motion.div>
    </div>
  )
}

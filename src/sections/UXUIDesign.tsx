'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useScrollStepper } from '@/lib/useScrollStepper'
import {
  FaPaintBrush,
  FaUsers,
  FaLightbulb,
  FaSearch,
  FaRocket,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaMousePointer
} from 'react-icons/fa'
import { useTranslation } from '@/i18n/useTranslation'

type DesignStatus = 'completed' | 'in-progress' | 'concept'

// Visual config — step/icon/color; title & description come from messages
// (design.process), index-aligned with this array.
interface DesignProcessConfig {
  icon: React.ReactNode
  color: string
}

// Config — title/image/tools/link/status; type/description/features come from
// messages (design.projects), index-aligned with this array.
interface DesignProjectConfig {
  title: string
  image: string
  tools: string[]
  status: DesignStatus
  link?: string
}

const designProcess: DesignProcessConfig[] = [
  { icon: <FaSearch />, color: '#6C5CE7' },
  { icon: <FaLightbulb />, color: '#00B894' },
  { icon: <FaPaintBrush />, color: '#E17055' },
  { icon: <FaUsers />, color: '#0984E3' },
  { icon: <FaRocket />, color: '#A29BFE' },
]

const designProjects: DesignProjectConfig[] = [
  {
    title: 'Assessify',
    image: '/images/Assessify-Logo.png',
    tools: ['Figma', 'UX Research', 'Prototyping'],
    status: 'completed',
    link: 'https://www.figma.com/design/hoiAIG1eN6GMvVdiBAxnO3/Evaluate-UX-UI?node-id=4-2&t=8uzMDpIu1zCRTx3O-1'
  },
  {
    title: 'PipeJet',
    image: '/images/PipeJet-Logo.png',
    tools: ['Figma', 'User Journey Mapping', 'Wireframing'],
    status: 'completed',
    link: 'https://www.figma.com/design/wmCufkckRSjcVJRMuADGZe/AutoShip?node-id=2-3&t=pX74OSvUJcJPCvJ7-1'
  },
  {
    title: 'ZenTrio',
    image: '/images/Zentrio-Logo.png',
    tools: ['Figma', 'UX Design', 'Interaction Design'],
    status: 'completed',
    link: 'https://www.figma.com/design/73E7bqg2USMoNZMNaCDDJi/UX---UI?node-id=38-12588&t=CQ6gKtttjFrlLIuB-1'
  }
]

// --- Animated step visuals (right panel of the process block) ---

function ResearchScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Document being researched */}
      <div className="w-3/4 max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 space-y-3">
        {[100, 85, 92, 70, 88, 60].map((w, i) => (
          <motion.div
            key={i}
            className="h-3 rounded-full bg-gray-200 dark:bg-gray-600"
            style={{ width: `${w}%` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      {/* Magnifying glass scanning the document */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-4 border-[#6C5CE7] bg-white/30 dark:bg-white/10 backdrop-blur-[2px] shadow-lg"
        animate={{ x: [-70, 60, -40, 70, -70], y: [-50, -10, 50, 20, -50] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute -bottom-7 -right-3 w-3 h-12 rounded-full bg-[#6C5CE7] -rotate-45" />
      </motion.div>
    </div>
  )
}

function IdeationScene() {
  const boxes = [
    'left-4 right-4 top-4 h-6',
    'left-4 top-14 w-[55%] h-16',
    'right-4 top-14 w-[28%] h-16',
    'left-4 bottom-4 w-[28%] h-12',
    'left-[36%] bottom-4 w-[28%] h-12',
    'right-4 bottom-4 w-[28%] h-12',
  ]
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <motion.div
        className="text-4xl text-yellow-400 mb-4 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.1, 0.95] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FaLightbulb />
      </motion.div>
      {/* Wireframe sketching itself in */}
      <div className="relative w-3/4 max-w-sm h-52 rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
        {boxes.map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-md border-2 border-dashed border-[#00B894]/70 ${pos}`}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 6, times: [0, 0.15, 0.85, 1], repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>
    </div>
  )
}

function PrototypeScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Browser mock */}
      <div className="relative w-3/4 max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="p-5 space-y-4">
          <div className="h-3 w-2/3 rounded-full bg-gray-200 dark:bg-gray-600" />
          <div className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-gray-600" />
          <div className="flex gap-3">
            <motion.div
              className="h-16 flex-1 rounded-lg bg-gray-100 dark:bg-gray-700"
              animate={{ scale: [1, 1, 0.94, 1, 1] }}
              transition={{ duration: 6, times: [0, 0.32, 0.36, 0.4, 1], repeat: Infinity }}
            />
            <div className="h-16 flex-1 rounded-lg bg-gray-100 dark:bg-gray-700" />
          </div>
          <motion.div
            className="h-9 w-28 rounded-lg bg-[#E17055] flex items-center justify-center text-white text-xs font-semibold"
            animate={{ scale: [1, 1, 0.92, 1, 1] }}
            transition={{ duration: 6, times: [0, 0.68, 0.72, 0.76, 1], repeat: Infinity }}
          >
            Get Started
          </motion.div>
        </div>
      </div>
      {/* Click ripples (synced with cursor arrival) */}
      <motion.span
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#E17055]"
        style={{ left: '38%', top: '52%' }}
        animate={{ scale: [0, 0, 1.8, 0, 0], opacity: [0, 0, 0.8, 0, 0] }}
        transition={{ duration: 6, times: [0, 0.32, 0.42, 0.43, 1], repeat: Infinity }}
      />
      <motion.span
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#E17055]"
        style={{ left: '45%', top: '72%' }}
        animate={{ scale: [0, 0, 1.8, 0, 0], opacity: [0, 0, 0.8, 0, 0] }}
        transition={{ duration: 6, times: [0, 0.68, 0.78, 0.79, 1], repeat: Infinity }}
      />
      {/* Moving cursor */}
      <motion.div
        className="absolute z-10 text-xl text-gray-900 dark:text-white drop-shadow-lg"
        style={{ left: '60%', top: '30%' }}
        animate={{
          left: ['60%', '38%', '38%', '45%', '45%', '60%'],
          top: ['30%', '52%', '52%', '72%', '72%', '30%'],
        }}
        transition={{ duration: 6, times: [0, 0.3, 0.42, 0.66, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}
      >
        <FaMousePointer />
      </motion.div>
    </div>
  )
}

function TestScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-3/4 max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 space-y-4">
        {['w-4/5', 'w-3/5', 'w-11/12', 'w-2/3'].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <motion.span
              className="text-green-500 shrink-0"
              animate={{ scale: [0, 0, 1.3, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }}
              transition={{
                duration: 6,
                times: [0, i * 0.12 + 0.05, i * 0.12 + 0.12, i * 0.12 + 0.18, 0.92, 1],
                repeat: Infinity,
              }}
            >
              <FaCheckCircle />
            </motion.span>
            <div className={`h-3 rounded-full bg-gray-200 dark:bg-gray-600 ${w}`} />
          </div>
        ))}
        <div className="pt-2">
          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#0984E3]"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LaunchScene() {
  const stars: Array<[number, number]> = [
    [15, 20], [80, 15], [65, 70], [25, 75], [50, 10], [85, 60], [10, 50], [70, 35],
  ]
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {stars.map(([x, y], i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#A29BFE]"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [45, -45] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' }}
      >
        <FaRocket className="text-6xl -rotate-45 text-gray-800 dark:text-white" />
        <motion.div
          className="w-3 rounded-full bg-gradient-to-b from-orange-400 via-yellow-400 to-transparent -mt-1"
          animate={{ height: [16, 40, 16], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </motion.div>
      <div className="absolute bottom-8 w-1/2 max-w-[220px]">
        <div className="h-2 rounded-full bg-white/60 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#A29BFE]"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}

const stepScenes = [ResearchScene, IdeationScene, PrototypeScene, TestScene, LaunchScene]

// Scene swap animation, matching the skills cards: the new scene slides in
// from the scroll direction while the old one slides away opposite.
const sceneVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? '60%' : '-60%', opacity: 0, scale: 0.96 }),
  center: { y: '0%', opacity: 1, scale: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? '-45%' : '45%', opacity: 0, scale: 0.96 }),
}

// Presentational process block: step titles on the left (active one black,
// rest slate), animated scene for the active step on the right.
function ProcessShowcase({
  active,
  direction,
  onSelect,
}: {
  active: number
  direction: number
  onSelect: (index: number) => void
}) {
  const { t, m } = useTranslation()
  const ActiveScene = stepScenes[active]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Section header — pinned along with the process stack on desktop */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-4xl md:text-5xl py-2 font-bold mb-4 text-gradient">
          {t('design.title')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('design.subtitle')}
        </p>
      </div>
      <h3 className="text-2xl font-bold text-center mb-6 md:mb-8 text-gray-900 dark:text-white">
        {t('design.processTitle')}
      </h3>
      <div className="glass-card rounded-3xl p-6 md:p-10 shadow-primary">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: step titles */}
          <div>
            {designProcess.map((_, index) => {
              const isActive = index === active
              return (
                <button
                  key={index}
                  onClick={() => onSelect(index)}
                  className="block w-full text-left py-3 group focus:outline-none"
                >
                  <span
                    className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-black dark:text-white'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  >
                    {m.design.process[index].title}
                  </span>
                  {/* CSS grid-rows expansion, NOT a framer-motion height:'auto'
                      animation: measuring 'auto' makes motion call
                      window.scrollTo to restore the page position, which
                      cancels the stepper's in-flight smooth scroll and
                      strands the scrollbar mid-card. */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-md">
                        {m.design.process[index].description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {/* Right: animated visual for the active step */}
          <div
            className="relative h-[340px] md:h-[min(420px,55vh)] md:min-h-[340px] rounded-3xl overflow-hidden transition-colors duration-500"
            style={{
              background: `linear-gradient(135deg, ${designProcess[active].color}18, ${designProcess[active].color}40)`,
            }}
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={active}
                custom={direction}
                variants={sceneVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ActiveScene />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
              <span style={{ color: designProcess[active].color }}>
                {designProcess[active].icon}
              </span>
              {t('design.stepLabel', { step: active + 1 })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Small screens / reduced motion: steps auto-advance on a timer and can be
// clicked, but scrolling moves the page normally.
function ProcessSimple() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const select = (index: number) => {
    setDirection(index > active ? 1 : -1)
    setActive(index)
  }

  // Auto-advance the active step; clicking a title resets the timer.
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setActive((s) => (s + 1) % designProcess.length)
    }, 6000)
    return () => clearInterval(id)
  }, [active])

  return <ProcessShowcase active={active} direction={direction} onSelect={select} />
}

// Desktop: pinned scroll stack (same mechanics as the Technical Skills
// stack) — scrolling steps through the process while the block stays on
// screen. Auto-advance and click-to-jump still work; both go through goTo
// so the scrollbar stays in sync with the active step.
function ProcessStack() {
  const total = designProcess.length
  const { containerRef, active, direction, goTo, isPinned } = useScrollStepper(total)

  // Auto-advance only while the stack is pinned — goTo moves the page
  // scroll, which must not fire while the user is elsewhere on the page.
  // It stops at the last step instead of wrapping: wrapping would smooth-
  // scroll 4 screens back up, and a user gesture interrupting that travel
  // strands the page (and the active step) somewhere in the middle.
  useEffect(() => {
    const id = setInterval(() => {
      if (isPinned() && active < total - 1) goTo(active + 1)
    }, 6000)
    return () => clearInterval(id)
  }, [active, goTo, isPinned, total])

  return (
    <div ref={containerRef} className="relative" style={{ height: `${total * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        <div className="container mx-auto px-6">
          <ProcessShowcase active={active} direction={direction} onSelect={goTo} />
        </div>
      </div>
    </div>
  )
}

export default function UXUIDesign() {
  const { t, m } = useTranslation()
  const reducedMotion = useReducedMotion()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'concept': return 'bg-primary-100 text-primary-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20">
      {/* Design Process: pinned scroll stack on desktop, simple auto/click
          block on small screens and for reduced motion. Dual render is
          CSS-only to stay SSR-safe. */}
      <div className="mb-20">
        {reducedMotion ? (
          <div className="container mx-auto px-6">
            <ProcessSimple />
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <ProcessStack />
            </div>
            <div className="lg:hidden container mx-auto px-6">
              <ProcessSimple />
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-6">
        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('design.projectsTitle')}
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {designProjects.map((project, index) => (
                             <motion.div
                 key={project.title}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.1 }}
                 viewport={{ once: true }}
                 whileHover={{ y: -5 }}
                 onClick={() => window.open(project.link, '_blank')}
                 className="glass-card rounded-xl shadow-primary overflow-hidden cursor-pointer group"
               >
                                 <div className="relative overflow-hidden">
                   <div className="w-full h-48 bg-white/60 dark:bg-white/10 flex items-center justify-center p-6">
                     <img 
                       src={project.image} 
                       alt={`${project.title} logo`}
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {m.design.status[project.status]}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExternalLinkAlt className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h4>
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {m.design.projects[index].type}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {m.design.projects[index].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tools.map((tool) => (
                      <span 
                        key={tool}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {m.design.projects[index].features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        
      </div>
    </section>
  )
} 
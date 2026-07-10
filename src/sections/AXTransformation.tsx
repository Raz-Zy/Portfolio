'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useAnimationFrame,
  useReducedMotion,
  MotionValue,
} from 'framer-motion'
import {
  FaFolder,
  FaFolderOpen,
  FaFileAlt,
  FaGithub,
  FaRobot,
  FaChevronRight,
} from 'react-icons/fa'
import { useTranslation } from '@/i18n/useTranslation'

const REPO_URL =
  'https://github.com/14th-Basic-Instructor-AI-Training/full-stack-destination'

// Sprint-stat values are locale-invariant; labels come from messages
// (ax.stats), index-aligned with this array. Subagent/skill/hook counts
// sum both .claude/ trees (frontend 10/16/5 + API 9/9/5).
const statValues = ['5', '161', '19', '25', '10']
const statColors = ['#6C5CE7', '#00B894', '#0984E3', '#E17055', '#A29BFE']

// Monorepo tree mirroring the real full-stack-destination repo (abridged).
// `noteIdx` points into messages ax.treeNotes; `badge` is locale-invariant.
// Nodes with an `id` are the collapsible top-level folders — the scroll
// journey expands exactly one of them per stage; id-less children render
// whenever their parent is open.
interface TreeNode {
  id?: string
  name: string
  dir?: boolean
  badge?: string
  noteIdx?: number
  children?: TreeNode[]
}

const monorepoTree: TreeNode[] = [
  { name: 'CLAUDE.md', noteIdx: 0 },
  { name: 'deploy/', dir: true, noteIdx: 1 },
  {
    id: 'destination',
    name: 'destination/',
    dir: true,
    noteIdx: 2,
    children: [
      { name: 'CLAUDE.md', noteIdx: 4 },
      {
        name: '.claude/',
        dir: true,
        noteIdx: 5,
        children: [
          { name: 'rules/', dir: true, badge: '×6' },
          { name: 'skills/', dir: true, badge: '×16' },
          { name: 'agents/', dir: true, badge: '×10' },
          { name: 'hooks/', dir: true, badge: '×5' },
        ],
      },
      {
        name: 'src/',
        dir: true,
        children: [
          { name: 'app/[locale]/', dir: true, badge: 'CLAUDE.md', noteIdx: 6 },
          {
            name: 'features/',
            dir: true,
            badge: '×17',
            children: [
              { name: 'CLAUDE.md', noteIdx: 7 },
              { name: '*/CLAUDE.md', badge: '×6', noteIdx: 8 },
            ],
          },
          {
            // kept to one row (counts in the badge) so the stage-2 card fits
            // below junction 2 without scrolling
            name: 'components/ · ui/ · lib/',
            dir: true,
            badge: 'CLAUDE.md ×3',
          },
          { name: 'locales/', dir: true, badge: 'en · kh · kr' },
        ],
      },
    ],
  },
  {
    id: 'destination-api',
    name: 'destination-api/',
    dir: true,
    noteIdx: 3,
    children: [
      { name: 'CLAUDE.md', noteIdx: 9 },
      {
        // kept to one row (counts in the badge) so the stage-3 card stays
        // short enough to fit below the spine's end dot
        name: '.claude/',
        dir: true,
        noteIdx: 5,
        badge: 'rules ×6 · skills ×9 · agents ×9 · hooks ×5',
      },
      {
        name: 'src/main/',
        dir: true,
        children: [
          { name: 'java/…/feature/', dir: true, badge: '×14', noteIdx: 10 },
          { name: 'java/…/shared/', dir: true, noteIdx: 11 },
          { name: 'resources/db/migration/', dir: true, noteIdx: 12 },
        ],
      },
    ],
  },
]

// Journey stages: which top-level folder is expanded and where the pinned
// card sits (left → right → bottom-center). left/x keeps the card inside the
// track at any viewport width. top/y place each card BELOW its junction on
// the spine (stage 1 centered under junction 1 at 12%, stage 2 top-anchored
// under junction 2 at 34%, stage 3 below the spine's end dot at 56%), so
// every branch can dock down into the card from above it.
const stages = [
  { expanded: null as string | null, left: '0%', x: '0%', top: '50%', y: '-50%' },
  { expanded: 'destination', left: '100%', x: '-100%', top: '38%', y: '0%' },
  { expanded: 'destination-api', left: '50%', x: '-50%', top: '60%', y: '0%' },
]

// Recursive tree renderer. Folders with an `id` collapse/expand against
// `expandedId` with an animated unfold; CLAUDE.md files are highlighted as
// the AI-memory thread running through the repo.
function TreeRows({
  nodes,
  expandedId,
}: {
  nodes: TreeNode[]
  expandedId: string | null
}) {
  const { m } = useTranslation()

  return (
    <>
      {nodes.map((node) => {
        const collapsible = node.id !== undefined
        const open = !!node.children && (!collapsible || node.id === expandedId)
        const isClaudeFile = node.name.includes('CLAUDE.md')

        return (
          <div key={node.name}>
            <div className="flex items-center gap-1.5 leading-5">
              {collapsible && (
                <FaChevronRight
                  className={`flex-none text-[0.55rem] transition-transform duration-500 ${
                    open ? 'rotate-90 text-primary-400' : 'text-gray-500'
                  }`}
                />
              )}
              {node.dir ? (
                open ? (
                  <FaFolderOpen className="text-primary-400 flex-none text-[0.7rem]" />
                ) : (
                  <FaFolder className="text-primary-400 flex-none text-[0.7rem]" />
                )
              ) : isClaudeFile ? (
                <FaRobot className="text-accent-400 flex-none text-[0.7rem]" />
              ) : (
                <FaFileAlt className="text-gray-500 flex-none text-[0.7rem]" />
              )}
              <span
                className={
                  node.dir
                    ? 'text-primary-300'
                    : isClaudeFile
                      ? 'text-accent-300 font-semibold'
                      : 'text-gray-300'
                }
              >
                {node.name}
              </span>
              {node.badge && (
                <span className="px-1.5 rounded bg-white/10 text-accent-300 text-[0.65rem]">
                  {node.badge}
                </span>
              )}
              {node.noteIdx !== undefined && (
                <span className="text-gray-500 italic text-[0.7rem]">
                  — {m.ax.treeNotes[node.noteIdx]}
                </span>
              )}
            </div>
            {/* CSS grid-rows expansion, NOT a framer-motion height:'auto'
                animation: measuring 'auto' makes motion call window.scrollTo
                to restore the page position, which cancels any in-flight
                smooth scroll (stage changes fire WHILE anchor/Go-Up scrolls
                pass through this pinned section, stranding the page). */}
            {node.children && (
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-[5px] border-l border-white/10 pl-4">
                    <TreeRows nodes={node.children} expandedId={expandedId} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

// Terminal-style card holding the monorepo tree in one of its three states.
// `bodyMax` caps the tree body height — the journey passes a per-stage cap
// so each card fits between its junction on the spine and the viewport
// bottom (the mobile stack keeps the roomy default).
function TreeCard({
  expandedId,
  stage,
  bodyMax = 'max-h-[70vh]',
}: {
  expandedId: string | null
  stage: number
  bodyMax?: string
}) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-gray-900 dark:bg-black/60 border border-white/10 shadow-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-gray-400 text-xs md:text-sm font-mono flex items-center gap-2">
          <FaRobot className="text-primary-400" /> {t('ax.structureTitle')}
        </span>
        <span className="ml-auto font-mono text-[0.65rem] text-gray-500">
          0{stage + 1} / 03
        </span>
      </div>
      <div className={`p-5 overflow-y-auto overflow-x-auto ${bodyMax}`}>
        <div className="font-mono text-xs md:text-sm whitespace-nowrap">
          <div className="flex items-center gap-1.5 leading-5">
            <FaFolderOpen className="text-primary-400 flex-none text-[0.7rem]" />
            <span className="text-primary-300 font-semibold">
              full-stack-destination/
            </span>
          </div>
          <div className="ml-[5px] border-l border-white/10 pl-4">
            <TreeRows nodes={monorepoTree} expandedId={expandedId} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Journey line: a straight vertical spine pinned to the middle of the
// viewport, drawn top-to-bottom by scroll with a glowing light at its head.
// Each stage plays in sequence: a branch with a glowing dot at its tip draws
// out from junction 1 to link the left card, retracts back into the spine on
// the next scroll step while junction 2 branches to the right card, then that
// retracts too and the light simply drops to the spine's end — with the
// stage-3 card sitting below the dropped dot. Coordinates live in a 0..1000
// viewBox → /10 converts to % of the viewport.
const SPINE_X = 500
const SPINE_TOP = 60
const SPINE_BOTTOM = 560
const SPINE_PATH = `M ${SPINE_X} ${SPINE_TOP} L ${SPINE_X} ${SPINE_BOTTOM}`
// junction heights on the spine, spaced EQUALLY (220 apart) so the three
// stops read as one even rhythm. Every junction still sits ABOVE its stage's
// card (see `stages`), so the branch always docks down into the card's top
// rather than disappearing behind it. The head's travel is choreographed to
// park on each junction while its branch links (see spineProgress).
const JUNCTIONS = [120, 340, SPINE_BOTTOM]
// spine-length fractions of the junctions, for parking the head on them
const F0 = (JUNCTIONS[0] - SPINE_TOP) / (SPINE_BOTTOM - SPINE_TOP)
const F1 = (JUNCTIONS[1] - SPINE_TOP) / (SPINE_BOTTOM - SPINE_TOP)
// initial branch routes — replaced on the first frame by live measurement of
// the card's actual position (see the useAnimationFrame in JourneyLine)
const BRANCH_LEFT_PTS = [
  { x: SPINE_X, y: JUNCTIONS[0] },
  { x: 250, y: JUNCTIONS[0] },
  { x: 250, y: 400 },
]
const BRANCH_RIGHT_PTS = [
  { x: SPINE_X, y: JUNCTIONS[1] },
  { x: 780, y: JUNCTIONS[1] },
]
const toPath = (pts: { x: number; y: number }[]) =>
  `M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')}`

// point at user-space fraction f along a polyline — the same space SVG
// dasharray uses, so a dot driven by this stays glued to the stroke tip
function pointAlong(pts: { x: number; y: number }[], f: number) {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y))
  const total = lens.reduce((a, b) => a + b, 0)
  let d = Math.min(1, Math.max(0, f)) * total
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const t = lens[i] === 0 ? 0 : d / lens[i]
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      }
    }
    d -= lens[i]
  }
  return pts[pts.length - 1]
}

// glowing dot riding the tip of a branch as it draws toward the card and
// retracts back into the spine
function BranchDot({
  pts,
  progress,
}: {
  pts: { x: number; y: number }[]
  progress: MotionValue<number>
}) {
  const left = useMotionValue(`${pts[0].x / 10}%`)
  const top = useMotionValue(`${pts[0].y / 10}%`)
  const opacity = useTransform(progress, [0, 0.08], [0, 1])

  const move = useCallback(
    (v: number) => {
      const p = pointAlong(pts, v)
      left.set(`${p.x / 10}%`)
      top.set(`${p.y / 10}%`)
    },
    [pts, left, top]
  )

  useMotionValueEvent(progress, 'change', move)
  useEffect(() => move(progress.get()), [move, progress])

  return (
    <motion.span
      style={{ left, top, opacity }}
      className="absolute -translate-x-1/2 -translate-y-1/2 block w-2 h-2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(79,181,219,0.9),0_0_20px_8px_rgba(85,110,235,0.4)]"
    />
  )
}

function JourneyLine({
  progress,
  stage,
  cardRef,
  stickyRef,
}: {
  progress: MotionValue<number>
  stage: number
  cardRef: React.RefObject<HTMLDivElement | null>
  stickyRef: React.RefObject<HTMLDivElement | null>
}) {
  // Choreography (fractions of the pin scroll): the head travels down to a
  // junction and PARKS on it while that stage's branch draws out to link the
  // card; when the next stage takes over the branch retracts as the head
  // travels on — ending with the drop onto the spine's last point. All of it
  // reverses when scrolling back up.
  const spineProgress = useTransform(
    progress,
    [0, 0.08, 0.36, 0.44, 0.69, 0.8, 1],
    [0, F0, F0, F1, F1, 1, 1]
  )
  const branchLeft = useTransform(progress, [0.1, 0.2, 0.36, 0.46], [0, 1, 1, 0])
  // starts at 0.44 — the instant the head parks on junction 2 — so the
  // stage-2 card is never left sitting unlinked while the head waits
  const branchRight = useTransform(progress, [0.44, 0.54, 0.69, 0.79], [0, 1, 1, 0])
  // the dashed route preview grows with the scroll too, staying one stretch
  // ahead of the travelled line (clip rect height, in viewBox units)
  const ghostHeight = useTransform(spineProgress, (v) =>
    SPINE_TOP + (SPINE_BOTTOM - SPINE_TOP) * Math.min(1, v + 0.2)
  )
  const headTop = useMotionValue(`${SPINE_TOP / 10}%`)
  // how many junctions the head has physically reached (lights them up)
  const [lit, setLit] = useState(0)

  // Live branch geometry: each frame, measure the card's real rect (in the
  // sticky viewport's coordinate space) and aim the active stage's branch at
  // it — into the card's top-center when the junction sits above the card,
  // otherwise straight into its near side edge. Only the active branch is
  // retargeted; a retracting branch keeps the path it docked with. setState
  // is skipped while the geometry is unchanged, so idle frames are free.
  const [branchPts, setBranchPts] = useState({
    left: BRANCH_LEFT_PTS,
    right: BRANCH_RIGHT_PTS,
  })
  // the frame callback may be registered once — read the live stage through a
  // ref so it never acts on a stale value
  const stageRef = useRef(stage)
  stageRef.current = stage
  useAnimationFrame(() => {
    const st = stageRef.current
    if (st > 1) return
    const card = cardRef.current
    const vp = stickyRef.current
    if (!card || !vp) return
    const c = card.getBoundingClientRect()
    const v = vp.getBoundingClientRect()
    if (!c.width || !v.width || !v.height) return
    const toX = (px: number) => Math.round(((px - v.left) / v.width) * 1000)
    const toY = (px: number) => Math.round(((px - v.top) / v.height) * 1000)
    const j = JUNCTIONS[st]
    const cx = toX(c.left + c.width / 2)
    const cardTop = toY(c.top)
    // side-dock at junction height only when the card clearly covers it;
    // anything lower L-docks down onto the card's top-center (a near-junction
    // top edge must never get a straight line that skims past above it)
    const pts =
      cardTop <= j - 20
        ? [
            { x: SPINE_X, y: j },
            { x: st === 0 ? toX(c.right) - 10 : toX(c.left) + 10, y: j },
          ]
        : [
            { x: SPINE_X, y: j },
            { x: cx, y: j },
            { x: cx, y: cardTop + 10 },
          ]
    const key = st === 0 ? 'left' : 'right'
    setBranchPts((prev) => {
      const prevPts = prev[key]
      const same =
        prevPts.length === pts.length &&
        prevPts.every(
          (p, i) => Math.abs(p.x - pts[i].x) < 2 && Math.abs(p.y - pts[i].y) < 2
        )
      return same ? prev : { ...prev, [key]: pts }
    })
  })

  const moveHead = useCallback(
    (f: number) => {
      const c = Math.min(1, Math.max(0, f))
      headTop.set(`${(SPINE_TOP + (SPINE_BOTTOM - SPINE_TOP) * c) / 10}%`)
      setLit(c >= 0.99 ? 3 : c >= F1 - 0.01 ? 2 : c >= F0 - 0.01 ? 1 : 0)
    },
    [headTop]
  )

  useMotionValueEvent(spineProgress, 'change', moveHead)
  useEffect(() => moveHead(spineProgress.get()), [moveHead, spineProgress])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* ghost of the spine — revealed top-down by the clip rect so the
            dashed line visibly extends as the journey progresses (framer's
            pathLength would override the dash pattern, hence the clip) */}
        <path
          d={SPINE_PATH}
          className="text-gray-400/40 dark:text-white/10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 10"
          vectorEffect="non-scaling-stroke"
          clipPath="url(#axGhostClip)"
        />
        {/* branch connectors: spine → left card, spine → right card */}
        {[
          { d: toPath(branchPts.left), length: branchLeft },
          { d: toPath(branchPts.right), length: branchRight },
        ].map((branch, i) => (
          <g key={i}>
            <motion.path
              d={branch.d}
              stroke="url(#axLineGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              className="opacity-25 blur-[5px]"
              style={{ pathLength: branch.length }}
            />
            <motion.path
              d={branch.d}
              stroke="url(#axLineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: branch.length }}
            />
          </g>
        ))}
        {/* soft glow underlay of the travelled spine */}
        <motion.path
          d={SPINE_PATH}
          stroke="url(#axLineGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          className="opacity-25 blur-[5px]"
          style={{ pathLength: spineProgress }}
        />
        {/* travelled spine */}
        <motion.path
          d={SPINE_PATH}
          stroke="url(#axLineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: spineProgress }}
        />
        <defs>
          <linearGradient id="axLineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FB5DB" />
            <stop offset="100%" stopColor="#556EEB" />
          </linearGradient>
          <clipPath id="axGhostClip">
            <motion.rect x="0" y="0" width="1000" height={ghostHeight} />
          </clipPath>
        </defs>
      </svg>
      {/* stage junctions stay hidden until the head physically reaches them */}
      {JUNCTIONS.map((y, i) => (
        <span
          key={i}
          style={{ left: `${SPINE_X / 10}%`, top: `${y / 10}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-400 shadow-[0_0_12px_3px_rgba(79,181,219,0.65)] transition-opacity duration-500 ${
            lit > i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {/* glowing dots riding each branch tip out to the card and back */}
      <BranchDot pts={branchPts.left} progress={branchLeft} />
      <BranchDot pts={branchPts.right} progress={branchRight} />
      {/* glowing light at the head of the spine */}
      <motion.span
        style={{ left: `${SPINE_X / 10}%`, top: headTop }}
        className="absolute -translate-x-1/2 -translate-y-1/2 block w-3 h-3 rounded-full bg-white shadow-[0_0_10px_3px_rgba(79,181,219,0.95),0_0_32px_12px_rgba(85,110,235,0.45)]"
      />
    </div>
  )
}

// Desktop scroll journey: a 460vh runway pins the viewport while the tree
// card slides left → right → bottom-center, expanding destination/ then
// destination-api/, with the glowing journey line scrubbed behind it.
// position: sticky — this section must NOT be wrapped in ScrollSection.
function ArchitectureJourney() {
  const { m } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  // spring gives the drawn line and its light a gentle lag behind the scroll
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
  })

  // the stage follows the SPRINGED value, not the raw scroll — a fast flick
  // can't teleport the card ahead of the line and its branch connectors
  const stageAt = (v: number) => (v < 0.34 ? 0 : v < 0.67 ? 1 : 2)
  useMotionValueEvent(lineProgress, 'change', (v) => setStage(stageAt(v)))
  useEffect(() => setStage(stageAt(lineProgress.get())), [lineProgress])

  // jump targets sit past each stage's branch-draw window, so clicking a dot
  // always lands on a fully linked scene
  const goTo = (idx: number) => {
    const el = containerRef.current
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + [0.22, 0.6, 1][idx] * travel, behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="relative h-[460vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        <JourneyLine
          progress={lineProgress}
          stage={stage}
          cardRef={cardRef}
          stickyRef={stickyRef}
        />

        {/* track inset with side margins (NOT padding — absolute children
            ignore a containing block's padding) so the card keeps clear of
            the screen edges and leaves the center spine room for branches */}
        <div className="relative h-full mx-10 xl:mx-24 2xl:mx-32">
          {/* width is additionally capped against 50vw minus the track margin
              and branch clearance, so the side cards can never reach across
              the center spine and swallow their connector line */}
          <motion.div
            ref={cardRef}
            className="absolute w-full max-w-[min(32rem,50vw_-_4rem)] xl:max-w-[min(36rem,50vw_-_7.5rem)]"
            initial={false}
            animate={{
              left: stages[stage].left,
              x: stages[stage].x,
              top: stages[stage].top,
              y: stages[stage].y,
            }}
            transition={{ type: 'spring', stiffness: 55, damping: 15, mass: 0.9 }}
          >
            <TreeCard
              expandedId={stages[stage].expanded}
              stage={stage}
              bodyMax={['max-h-[70vh]', 'max-h-[50vh]', 'max-h-[36vh]'][stage]}
            />
          </motion.div>
        </div>

        {/* stage label + jump dots — bottom-left corner, clear of the
            stage-3 card that occupies the lower center */}
        <div className="absolute bottom-8 left-10 xl:left-16 flex flex-col items-start gap-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-sm font-mono text-gray-600 dark:text-gray-300"
            >
              {m.ax.stageLabels[stage]}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-2">
            {stages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={m.ax.stageLabels[index]}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === stage
                    ? 'w-8 bg-gradient-to-r from-primary-500 to-accent-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile / reduced-motion fallback: the three tree states stacked vertically,
// joined by short glowing connectors instead of the scrubbed journey line.
function ArchitectureStack() {
  const { m } = useTranslation()

  return (
    <div className="container mx-auto px-6">
      {stages.map((s, index) => (
        <div key={index}>
          {index > 0 && (
            <div className="relative mx-auto h-14 w-px bg-gradient-to-b from-primary-400 to-accent-500">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_3px_rgba(79,181,219,0.8)]" />
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.15 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-center text-sm font-mono text-gray-600 dark:text-gray-300 mb-3">
              {m.ax.stageLabels[index]}
            </p>
            <TreeCard expandedId={s.expanded} stage={index} />
          </motion.div>
        </div>
      ))}
    </div>
  )
}

// Vertical 5-day sprint timeline; day titles/descriptions come from
// messages (ax.days), colors index-aligned here.
function SprintTimeline() {
  const { m, t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {t('ax.sprintTitle')}
      </h3>
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
        {t('ax.sprintIntro')}
      </p>
      <div className="relative pl-12">
        {/* timeline spine */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-300 to-accent-400 dark:from-primary-700 dark:to-accent-600" />
        <div className="space-y-5">
          {m.ax.days.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="absolute -left-12 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                style={{ background: statColors[index] }}
              >
                {index + 1}
              </div>
              <div className="glass-card rounded-2xl p-4 shadow-primary">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: statColors[index] }}
                  >
                    {t('ax.dayLabel', { day: index + 1 })}
                  </span>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {day.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {day.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AXTransformation() {
  const { t, m } = useTranslation()
  const reducedMotion = useReducedMotion()

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl py-2 font-bold mb-4 text-gradient">
            {t('ax.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('ax.subtitle')}
          </p>
        </motion.div>

        {/* Sprint stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 max-w-4xl mx-auto"
        >
          {statValues.map((value, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl px-4 py-5 text-center shadow-primary"
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: statColors[index] }}
              >
                {value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                {m.ax.stats[index]}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Monorepo & AI architecture journey (full-bleed, pinned on desktop) */}
      {reducedMotion ? (
        <ArchitectureStack />
      ) : (
        <>
          <div className="hidden lg:block">
            <ArchitectureJourney />
          </div>
          <div className="lg:hidden">
            <ArchitectureStack />
          </div>
        </>
      )}

      <div className="container mx-auto px-6 mt-14">
        <div className="mb-14">
          <SprintTimeline />
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 md:p-10 shadow-primary max-w-3xl mx-auto text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('ax.repoTitle')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {t('ax.repoText')}
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-primary-lg hover:opacity-90 transition-opacity"
          >
            <FaGithub className="text-lg" />
            {t('ax.repoCta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}

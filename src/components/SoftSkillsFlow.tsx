'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ReactFlow,
  Handle,
  Position,
  getBezierPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export interface SoftSkillItem {
  icon: React.ReactNode
  name: string
  description: string
}

// Two layouts share the same nodes/edges components:
// - radial (lg+): hub at the origin, cards on an ellipse around it
// - tree (mobile): hub centered at the top, cards in a 2-column fan below
const RADIAL = {
  cardW: 224,
  cardH: 150,
  hub: 176,
  rx: 430,
  ry: 290,
}
// cardH is FIXED (not a content estimate): tree cards get an explicit equal
// height so the vertical rhythm stays uniform no matter how the description
// text wraps.
const TREE = {
  cardW: 200,
  cardH: 170,
  hub: 160,
  colGap: 20,
  rowGap: 20,
  hubGap: 60,
}

// Radial slot angles start at the top and go clockwise; each entry also
// decides which sides the connecting edge attaches to so the bezier curves
// flow outward naturally.
const SLOTS: Array<{ angle: number; source: string; target: Position }> = [
  { angle: -90, source: 'top', target: Position.Bottom },
  { angle: -45, source: 'right', target: Position.Left },
  { angle: 0, source: 'right', target: Position.Left },
  { angle: 45, source: 'right', target: Position.Left },
  { angle: 90, source: 'bottom', target: Position.Top },
  { angle: 135, source: 'left', target: Position.Right },
  { angle: 180, source: 'left', target: Position.Right },
  { angle: -135, source: 'left', target: Position.Right },
]

// Handles are only anchors for the edges — never shown or interactive.
const hiddenHandle = { opacity: 0, pointerEvents: 'none' as const }

type HubNode = Node<{ label: string; size: number }, 'hub'>
type SkillNode = Node<
  {
    icon: React.ReactNode
    name: string
    description: string
    handlePosition: Position
    delay: number
    width: number
    height?: number
    compact?: boolean
  },
  'skill'
>

function HubNodeView({ data }: NodeProps<HubNode>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative flex items-center justify-center rounded-full"
      style={{ width: data.size, height: data.size }}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 opacity-40 blur-xl animate-pulse" />
      <span className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-primary-lg" />
      <span className="relative text-white text-2xl font-bold text-center px-6 leading-tight">
        {data.label}
      </span>
      <Handle id="top" type="source" position={Position.Top} style={hiddenHandle} />
      <Handle id="right" type="source" position={Position.Right} style={hiddenHandle} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={hiddenHandle} />
      <Handle id="left" type="source" position={Position.Left} style={hiddenHandle} />
    </motion.div>
  )
}

function SkillNodeView({ data }: NodeProps<SkillNode>) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: data.delay }}
      viewport={{ once: true }}
      className={`bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/40 dark:to-accent-900/40 border border-primary-100 dark:border-primary-800/60 ${
        data.compact ? 'p-4' : 'p-5'
      } rounded-2xl text-center shadow-primary card-hover flex flex-col justify-center overflow-hidden`}
      style={{ width: data.width, height: data.height }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3">
        {data.icon}
      </div>
      <h5 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
        {data.name}
      </h5>
      <p className="text-xs text-gray-600 dark:text-gray-300">{data.description}</p>
      <Handle type="target" position={data.handlePosition} style={hiddenHandle} />
    </motion.div>
  )
}

// Edge = static base line + marching dash overlay (see globals.css keyframes)
// + a glowing dot travelling from the hub to the card via SMIL animateMotion.
function AnimatedGlowEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const dur = `${2.4 + ((data?.seed as number) ?? 0) * 0.35}s`

  return (
    <g aria-hidden>
      <path
        d={edgePath}
        fill="none"
        strokeWidth={2}
        className="stroke-primary-200 dark:stroke-primary-800"
      />
      <path
        d={edgePath}
        fill="none"
        strokeWidth={2}
        strokeDasharray="6 12"
        strokeLinecap="round"
        className="stroke-accent-400 soft-skill-edge-dash"
      />
      <circle r={7} className="fill-accent-400/40">
        <animateMotion dur={dur} repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r={3} className="fill-accent-500 dark:fill-primary-300">
        <animateMotion dur={dur} repeatCount="indefinite" path={edgePath} />
      </circle>
    </g>
  )
}

const nodeTypes = { hub: HubNodeView, skill: SkillNodeView }
const edgeTypes = { glow: AnimatedGlowEdge }

function buildRadial(title: string, items: SoftSkillItem[]) {
  const nodes: Node[] = [
    {
      id: 'hub',
      type: 'hub',
      position: { x: -RADIAL.hub / 2, y: -RADIAL.hub / 2 },
      data: { label: title, size: RADIAL.hub },
      draggable: false,
    },
    ...items.map((item, i) => {
      const slot = SLOTS[i % SLOTS.length]
      const rad = (slot.angle * Math.PI) / 180
      return {
        id: `skill-${i}`,
        type: 'skill',
        position: {
          x: RADIAL.rx * Math.cos(rad) - RADIAL.cardW / 2,
          y: RADIAL.ry * Math.sin(rad) - RADIAL.cardH / 2,
        },
        data: {
          ...item,
          handlePosition: slot.target,
          delay: i * 0.08,
          width: RADIAL.cardW,
        },
        draggable: false,
      }
    }),
  ]

  const edges: Edge[] = items.map((_, i) => ({
    id: `edge-${i}`,
    source: 'hub',
    sourceHandle: SLOTS[i % SLOTS.length].source,
    target: `skill-${i}`,
    type: 'glow',
    data: { seed: i % 4 },
  }))

  return { nodes, edges }
}

// Mobile: hub centered at the top, cards in a 2-column fan below it, every
// edge dropping from the hub's bottom into the top of its card.
function buildTree(title: string, items: SoftSkillItem[]) {
  const rowPitch = TREE.cardH + TREE.rowGap
  const nodes: Node[] = [
    {
      id: 'hub',
      type: 'hub',
      position: { x: -TREE.hub / 2, y: 0 },
      data: { label: title, size: TREE.hub },
      draggable: false,
    },
    ...items.map((item, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      return {
        id: `skill-${i}`,
        type: 'skill',
        position: {
          x: col === 0 ? -TREE.cardW - TREE.colGap / 2 : TREE.colGap / 2,
          y: TREE.hub + TREE.hubGap + row * rowPitch,
        },
        data: {
          ...item,
          handlePosition: Position.Top,
          delay: i * 0.08,
          width: TREE.cardW,
          height: TREE.cardH,
          compact: true,
        },
        draggable: false,
      }
    }),
  ]

  const edges: Edge[] = items.map((_, i) => ({
    id: `edge-${i}`,
    source: 'hub',
    sourceHandle: 'bottom',
    target: `skill-${i}`,
    type: 'glow',
    data: { seed: i % 4 },
  }))

  return { nodes, edges }
}

function FlowCanvas({
  nodes,
  edges,
  fitPadding = 0.05,
}: {
  nodes: Node[]
  edges: Edge[]
  fitPadding?: number
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: fitPadding }}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      elementsSelectable={false}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
    />
  )
}

export default function SoftSkillsFlow({
  title,
  items,
}: {
  title: string
  items: SoftSkillItem[]
}) {
  const radial = useMemo(() => buildRadial(title, items), [title, items])
  const tree = useMemo(() => buildTree(title, items), [title, items])

  // The wrapper reproduces the tree layout's aspect ratio so fitView is
  // equally constrained by width and height — no dead side margins at any
  // device width.
  const treeW = 2 * TREE.cardW + TREE.colGap
  const treeH = TREE.hub + TREE.hubGap + 4 * TREE.cardH + 3 * TREE.rowGap

  // Dual render is CSS-only to stay SSR-safe (same pattern as the pinned
  // scroll sections): radial mind map on lg+, top-hub tree fan below lg.
  // The mobile flow is full-bleed (-mx-6 cancels the section padding) and
  // pointer-events-none: it is purely decorative there, and React Flow's
  // touch-action:none pane would otherwise swallow finger scrolling.
  return (
    <>
      <div className="hidden lg:block h-[640px] w-full">
        <FlowCanvas nodes={radial.nodes} edges={radial.edges} />
      </div>
      <div
        className="lg:hidden -mx-6 pointer-events-none"
        style={{ aspectRatio: `${treeW} / ${treeH}` }}
      >
        <FlowCanvas nodes={tree.nodes} edges={tree.edges} fitPadding={0.02} />
      </div>
    </>
  )
}

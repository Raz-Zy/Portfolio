'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useScrollStepper } from '@/lib/useScrollStepper'
import {
  FaCode,
  FaPaintBrush,
  FaVideo,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaJava,
  FaLightbulb,
  FaClock,
  FaUsers,
  FaPuzzlePiece,
  FaHeart,
  FaEye,
  FaHandshake,
  FaDocker,
  FaJenkins,
  FaServer,
  FaTools,
  FaChartLine,
  FaComments,
  FaRobot
} from 'react-icons/fa'
import {
  SiTailwindcss,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiAdobeaftereffects,
  SiNextdotjs,
  SiKubernetes,
  SiAnsible,
  SiGrafana,
  SiOpenai,
  SiAnthropic
} from 'react-icons/si'
import { useTranslation } from '@/i18n/useTranslation'

// Visual config only — category titles come from messages (skills.categories),
// index-aligned with this array. Skill names/levels are locale-invariant.
interface SkillCategory {
  icon: React.ReactNode
  color: string
  skills: Array<{
    name: string
    icon: React.ReactNode
    level: number
  }>
}

// Icons only — names/descriptions come from messages (skills.soft), index-aligned.
interface SoftSkill {
  icon: React.ReactNode
}

const hardSkillsData: SkillCategory[] = [
  {
    icon: <FaCode />,
    color: "from-blue-500 to-primary-600",
    skills: [
      { name: "C#", icon: <FaCode />, level: 75 },
      { name: "Java", icon: <FaJava />, level: 85 },
      { name: "HTML/CSS", icon: <FaHtml5 />, level: 90 },
      { name: "Python", icon: <FaPython />, level: 80 },
      { name: "React", icon: <FaReact />, level: 85 },
      { name: "Next.js", icon: <SiNextdotjs />, level: 85 },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 90 }
    ]
  },
  {
    icon: <FaServer />,
    color: "from-orange-500 to-red-600",
    skills: [
      { name: "Jenkins", icon: <FaJenkins />, level: 85 },
      { name: "ArgoCD", icon: <FaServer />, level: 80 },
      { name: "Ansible", icon: <SiAnsible />, level: 85 },
      { name: "Docker (Advanced)", icon: <FaDocker />, level: 90 },
      { name: "Grafana", icon: <SiGrafana />, level: 80 },
      { name: "Kubernetes", icon: <SiKubernetes />, level: 85 },
      { name: "Nagios", icon: <FaChartLine />, level: 65 }
    ]
  },
  {
    icon: <FaPaintBrush />,
    color: "from-accent-500 to-rose-600",
    skills: [
      { name: "Photoshop", icon: <SiAdobephotoshop />, level: 85 },
      { name: "Illustrator", icon: <SiAdobeillustrator />, level: 80 },
      { name: "Corel Draw", icon: <FaPaintBrush />, level: 75 }
    ]
  },
  {
    icon: <FaVideo />,
    color: "from-green-500 to-teal-600",
    skills: [
      { name: "Premiere Pro", icon: <SiAdobepremierepro />, level: 85 },
      { name: "After Effects", icon: <SiAdobeaftereffects />, level: 80 },
      { name: "Sony Vegas", icon: <FaVideo />, level: 75 }
    ]
  },
  {
    icon: <FaRobot />,
    color: "from-cyan-500 to-blue-600",
    skills: [
      { name: "ChatGPT", icon: <SiOpenai />, level: 90 },
      { name: "Claude AI", icon: <SiAnthropic />, level: 90 },
      { name: "Claude Code", icon: <SiAnthropic />, level: 90 },
      { name: "Cursor", icon: <FaRobot />, level: 90 }
    ]
  }
]

const softSkillsData: SoftSkill[] = [
  { icon: <FaLightbulb /> },
  { icon: <FaClock /> },
  { icon: <FaUsers /> },
  { icon: <FaPuzzlePiece /> },
  { icon: <FaComments /> },
  { icon: <FaHeart /> },
  { icon: <FaEye /> },
  { icon: <FaHandshake /> },
]

// Skill rows shared by the pinned stack card and the grid fallback.
// animateBars: 'in-view' uses whileInView (grid); 'active' animates whenever
// isActive flips true (pinned stack, where everything is always in view).
function SkillRows({
  category,
  animateBars,
  isActive = false,
}: {
  category: SkillCategory
  animateBars: 'in-view' | 'active'
  isActive?: boolean
}) {
  return (
    <div className="space-y-4">
      {category.skills.map((skill, skillIndex) => (
        <div key={skillIndex} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">
            {skill.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {skill.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {skill.level}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              {animateBars === 'in-view' ? (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: skillIndex * 0.1 }}
                  viewport={{ once: true }}
                  className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                />
              ) : (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? `${skill.level}%` : '0%' }}
                  transition={{ duration: 0.8, delay: isActive ? skillIndex * 0.08 : 0 }}
                  className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Card swap animation: the new card slides in from the gesture direction
// while the old one scales away toward the opposite side.
const cardVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? '55vh' : '-55vh', opacity: 0, scale: 0.96 }),
  center: { y: '0vh', opacity: 1, scale: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? '-40vh' : '40vh', opacity: 0, scale: 0.92 }),
}

// Gesture-stepped card stack backed by real page scroll — the stepping
// mechanics live in useScrollStepper (shared with the UX/UI design process).
function HardSkillsStack({ titles }: { titles: string[] }) {
  const { t } = useTranslation()
  const total = hardSkillsData.length
  const { containerRef, active, direction, goTo } = useScrollStepper(total)

  const category = hardSkillsData[active]

  return (
    <div ref={containerRef} className="relative" style={{ height: `${total * 100}vh` }}>
      <div className="sticky top-0 h-screen pt-20 flex flex-col items-center justify-center bg-white dark:bg-gray-900 overflow-hidden">
      <h3 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        {t('skills.technicalTitle')}
      </h3>
      <div className="relative w-full flex-none h-[60vh] min-h-[420px] overflow-hidden pt-4">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={active}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 flex justify-center px-6"
          >
            <div className="w-full max-w-3xl bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-primary-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-white text-2xl`}>
                    {category.icon}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {titles[active]}
                  </h4>
                </div>
                <span className="text-sm font-mono text-gray-400 dark:text-gray-500">
                  0{active + 1} / 0{total}
                </span>
              </div>
              <SkillRows category={category} animateBars="active" isActive />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
        {/* Step dots mirror the active card; clicking one jumps to it */}
        <div className="flex gap-2 mt-6">
          {hardSkillsData.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={titles[index]}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === active
                  ? 'w-8 bg-gradient-to-r from-primary-500 to-accent-500'
                  : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Original 2-col grid — mobile/tablet and reduced-motion fallback.
function HardSkillsGrid({ titles }: { titles: string[] }) {
  return (
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 items-start">
        {hardSkillsData.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-primary card-hover"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-white text-xl`}>
                {category.icon}
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {titles[categoryIndex]}
              </h4>
            </div>
            <SkillRows category={category} animateBars="in-view" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const { t, m } = useTranslation()
  const reducedMotion = useReducedMotion()
  const titles = m.skills.categories

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {t('skills.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('skills.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Hard Skills: pinned scroll stack on desktop, grid on small screens
          and for reduced motion. Dual render is CSS-only to stay SSR-safe. */}
      <div className="mb-20">
        {reducedMotion ? (
          <>
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              {t('skills.technicalTitle')}
            </h3>
            <HardSkillsGrid titles={titles} />
          </>
        ) : (
          <>
            <div className="hidden lg:block">
              <HardSkillsStack titles={titles} />
            </div>
            <div className="lg:hidden">
              <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                {t('skills.technicalTitle')}
              </h3>
              <HardSkillsGrid titles={titles} />
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-6">
        {/* Soft Skills */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('skills.softTitle')}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {softSkillsData.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-2xl text-center card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {skill.icon}
                </div>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {m.skills.soft[index].name}
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {m.skills.soft[index].description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

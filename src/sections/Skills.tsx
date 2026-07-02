'use client'

import { motion } from 'framer-motion'
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
    color: "from-blue-500 to-purple-600",
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
    color: "from-pink-500 to-rose-600",
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

export default function Skills() {
  const { t, m } = useTranslation()
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

        {/* Hard Skills */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {t('skills.technicalTitle')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 items-start">
            {hardSkillsData.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-white text-xl`}>
                    {category.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {m.skills.categories[categoryIndex]}
                  </h4>
                </div>
                
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
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: skillIndex * 0.1 }}
                            viewport={{ once: true }}
                            className={`h-2 bg-gradient-to-r ${category.color} rounded-full`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl text-center card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
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
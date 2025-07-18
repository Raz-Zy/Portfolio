'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  FaPaintBrush, 
  FaUsers, 
  FaLightbulb, 
  FaSearch, 
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaExternalLinkAlt
} from 'react-icons/fa'




interface DesignProject {
  title: string
  type: string
  description: string
  image: string
  tools: string[]
  features: string[]
  status: 'completed' | 'in-progress' | 'concept'
  link?: string
}

interface DesignProcess {
  step: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}



const designProcess: DesignProcess[] = [
  {
    step: 1,
    title: 'Research & Discovery',
    description: 'Understanding user needs, market research, and competitive analysis',
    icon: <FaSearch />,
    color: '#6C5CE7'
  },
  {
    step: 2,
    title: 'Ideation & Concept',
    description: 'Brainstorming solutions, user journey mapping, and wireframing',
    icon: <FaLightbulb />,
    color: '#00B894'
  },
  {
    step: 3,
    title: 'Design & Prototype',
    description: 'Creating high-fidelity designs, prototypes, and design systems',
    icon: <FaPaintBrush />,
    color: '#E17055'
  },
  {
    step: 4,
    title: 'Test & Iterate',
    description: 'User testing, feedback collection, and continuous improvement',
    icon: <FaUsers />,
    color: '#0984E3'
  },
  {
    step: 5,
    title: 'Deliver & Launch',
    description: 'Final implementation, handoff to development, and launch analysis',
    icon: <FaRocket />,
    color: '#A29BFE'
  }
]

const designProjects: DesignProject[] = [
  {
    title: 'Assessify',
    type: 'Web Application',
    description: 'An employee evaluation system to streamline performance assessments with intuitive user experience',
    image: '/images/Assessify-Logo.png',
    tools: ['Figma', 'UX Research', 'Prototyping'],
    features: ['Performance Evaluation', 'Employee Dashboard', 'Progress Tracking', 'Reporting System'],
    status: 'completed',
    link: 'https://www.figma.com/design/hoiAIG1eN6GMvVdiBAxnO3/Evaluate-UX-UI?node-id=4-2&t=8uzMDpIu1zCRTx3O-1'
  },
  {
    title: 'PipeJet',
    type: 'Web Platform',
    description: 'A platform for automated deployment processes with focus on developer experience and workflow optimization',
    image: '/images/PipeJet-Logo.png',
    tools: ['Figma', 'User Journey Mapping', 'Wireframing'],
    features: ['Automated Deployment', 'Pipeline Management', 'Developer Dashboard', 'Status Monitoring'],
    status: 'completed',
    link: 'https://www.figma.com/design/wmCufkckRSjcVJRMuADGZe/AutoShip?node-id=2-3&t=pX74OSvUJcJPCvJ7-1'
  },
  {
    title: 'ZenTrio',
    type: 'Task Management System',
    description: 'A comprehensive task management system designed for improved productivity and team collaboration',
    image: '/images/Zentrio-Logo.png',
    tools: ['Figma', 'UX Design', 'Interaction Design'],
    features: ['Task Organization', 'Team Collaboration', 'Progress Visualization', 'Productivity Analytics'],
    status: 'completed',
    link: 'https://www.figma.com/design/73E7bqg2USMoNZMNaCDDJi/UX---UI?node-id=38-12588&t=CQ6gKtttjFrlLIuB-1'
  }
]



export default function UXUIDesign() {
  const [selectedProject, setSelectedProject] = useState(0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'concept': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            UX/UI Design
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Designing user-centered digital experiences for web applications including employee evaluation systems, deployment platforms, and task management tools
          </p>
        </motion.div>

        {/* Design Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            My Design Process
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {designProcess.map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl"
                    style={{ backgroundColor: process.color }}
                  >
                    {process.icon}
                  </div>
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    STEP {process.step}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                    {process.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {process.description}
                  </p>
                </div>
                {index < designProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <FaArrowRight className="text-gray-400 text-lg" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Featured Design Projects
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
                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer group"
               >
                                 <div className="relative overflow-hidden">
                   <div className="w-full h-48 bg-white dark:bg-gray-900 flex items-center justify-center p-6">
                     <img 
                       src={project.image} 
                       alt={`${project.title} logo`}
                       className="max-w-full max-h-full object-contain"
                     />
                   </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
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
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      {project.type}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {project.description}
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
                    {project.features.map((feature, featureIndex) => (
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
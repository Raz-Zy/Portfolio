'use client'

import { motion } from 'framer-motion'
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa'

interface ExperienceItem {
  title: string
  company: string
  type: string
  duration: string
  location: string
  description: string[]
  technologies?: string[]
  link?: string
}

const experienceData: ExperienceItem[] = [
  {
    title: "Computer Teacher",
    company: "Educational Institution",
    type: "Full-time",
    duration: "Aug 2022 - Mar 2025",
    location: "Cambodia",
    description: [
      "Served as a computer teacher, gaining valuable experience in my first professional role",
      "Developed effective teaching methodologies to help students understand complex concepts",
      "Learned how to explain technical concepts clearly and adapt to different learning styles",
      "Built strong communication skills while managing classroom environments",
      "Mentored students in computer literacy and basic programming concepts"
    ],
    technologies: ["Microsoft Office", "Windows", "Educational Software", "Basic Programming"]
  },
  {
    title: "Computer Repair Technician",
    company: "Freelance",
    type: "Contract",
    duration: "Ongoing",
    location: "Cambodia",
    description: [
      "Provided technical support and computer repair services to customers",
      "Specialized in Windows setup, configuration, and troubleshooting",
      "Diagnosed and resolved hardware and software issues for desktops and laptops",
      "Delivered excellent customer service while explaining technical problems in simple terms",
      "Gained hands-on experience with various computer hardware and software systems"
    ],
    technologies: ["Windows OS", "Hardware Troubleshooting", "Software Installation", "System Diagnostics"]
  },
  {
    title: "Software Developer",
    company: "Personal Projects",
    type: "Project-based",
    duration: "2023 - Present",
    location: "Cambodia",
    description: [
      "Developed Assessify - An employee evaluation system to streamline performance assessments",
      "Created ZenTrio - A comprehensive task management system for improved productivity",
      "Built PipeJet - A platform for automated deployment processes",
      "Gained experience in full-stack development and project management",
      "Applied modern development practices and technologies in real-world applications"
    ],
    technologies: ["React", "Node.js", "JavaScript", "Database Management", "Deployment Automation"]
  }
]

export default function Experience() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My professional journey and the projects that have shaped my career.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500 hidden md:block"></div>
            
            {experienceData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col md:flex-row items-start mb-16 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg hidden md:block"></div>
                
                {/* Content card */}
                <div className="w-full md:ml-16 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg card-hover">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex items-start gap-4 mb-4 lg:mb-0">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaBriefcase className="text-purple-600 dark:text-purple-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold mb-1">
                          {item.company}
                        </p>
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                      >
                        <FaExternalLinkAlt />
                        <span className="text-sm">View Project</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {item.description.map((desc, descIndex) => (
                        <li key={descIndex} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {item.technologies && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Technologies Used:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
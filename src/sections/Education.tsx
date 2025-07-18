'use client'

import { motion } from 'framer-motion'
import { FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

interface EducationItem {
  degree: string
  institution: string
  duration: string
  location: string
  description?: string
}

const educationData: EducationItem[] = [
  {
    degree: "Instructor Position",
    institution: "Korea Software HRD Center",
    duration: "2025 - Present",
    location: "Phnom Penh, Cambodia",
    description: "Currently serving as an instructor, teaching software development and IT skills to students in the Korea Software HRD Center program."
  },
  {
    degree: "Software Development Training",
    institution: "Korea Software HRD Center",
    duration: "2024 - 2025",
    location: "Phnom Penh, Cambodia",
    description: "Intensive software development training program focusing on modern programming languages, web development, and software engineering practices."
  },
  {
    degree: "Bachelor of Information Technology",
    institution: "Royal University of Phnom Penh",
    duration: "2020 - 2024",
    location: "Phnom Penh, Cambodia",
    description: "Comprehensive IT education covering software development, database management, networking, and computer systems. Gained strong foundation in programming and technology."
  },
  {
    degree: "High School Diploma",
    institution: "10 January 1979 High School",
    duration: "2019 - 2020",
    location: "Siem Reap, Cambodia",
    description: "Successfully completed secondary education with focus on science and mathematics, laying the foundation for further studies in technology."
  }
]

export default function Education() {
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
            Education
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My academic journey and the foundations that shaped my expertise.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            {educationData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex items-start mb-12 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                
                {/* Content card */}
                <div className="ml-16 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg card-hover w-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="text-purple-600 dark:text-purple-400 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {item.degree}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold">
                          {item.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-purple-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
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
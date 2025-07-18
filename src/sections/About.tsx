'use client'

import { motion } from 'framer-motion'
import { FaUser, FaHeart, FaLightbulb } from 'react-icons/fa'

export default function About() {
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
            About Me
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get to know me better - my journey, passions, and what drives me forward.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <FaUser className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold">My Journey</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm a passionate developer and creative designer with a love for crafting beautiful, 
                functional digital experiences. My journey began with curiosity about how things work 
                and evolved into a deep appreciation for clean code and thoughtful design.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                  <FaHeart className="text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold">What I Love</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I'm driven by the intersection of technology and creativity. Whether it's building 
                responsive web applications, creating stunning visual designs, or solving complex 
                problems, I find joy in bringing ideas to life.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-2xl text-white card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center glass-effect">
                  <FaLightbulb className="text-white" />
                </div>
                <h3 className="text-xl font-semibold">My Philosophy</h3>
              </div>
              <blockquote className="text-lg leading-relaxed mb-6 italic">
                "Great design is not just about making things look good - it's about making them work beautifully."
              </blockquote>
              <p className="text-white/90 leading-relaxed">
                I believe in continuous learning, attention to detail, and the power of 
                collaboration. Every project is an opportunity to grow and create something 
                meaningful that makes a positive impact.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { FaArrowDown, FaEnvelope, FaEye, FaGithub, FaFacebook, FaTelegram } from 'react-icons/fa'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300 mt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full blur-3xl animate-float opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-full blur-3xl animate-float-delay opacity-60"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full blur-2xl animate-float opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full blur-2xl animate-float-delay opacity-40"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-15 dark:opacity-10">
        <div className="w-full h-full bg-grid-pattern bg-grid-size"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Enhanced Profile Image */}
          <motion.div 
            className="w-80 h-80 mx-auto mb-4 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Floating Animation Container */}
            <motion.div
              className="relative w-full h-full"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Gradient Background Ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 rounded-full p-1 shadow-2xl">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full p-1">
                  {/* Profile Image */}
                  <motion.img
                    src="/Profile.png"
                    alt="Tan Dara Profile"
                    className="w-full h-full object-cover rounded-full shadow-xl relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                </div>
              </div>
              
              {/* Floating Shadow */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent dark:via-purple-400/30 rounded-full blur-md opacity-60"></div>
              
              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 dark:from-purple-400/20 dark:via-pink-400/20 dark:to-orange-400/20 rounded-full blur-lg animate-pulse -z-10"></div>
              
              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-white to-yellow-200 dark:from-yellow-200 dark:to-white rounded-full opacity-80"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-br from-white to-blue-200 dark:from-blue-200 dark:to-white rounded-full opacity-70"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              <motion.div
                className="absolute top-4 -left-4 w-1.5 h-1.5 bg-gradient-to-br from-white to-pink-200 dark:from-pink-200 dark:to-white rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gradient">Tan Dara</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-4 text-gray-700 dark:text-gray-300 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Aspiring Developer & Creative Designer
          </motion.p>
          
          <motion.p 
            className="text-lg xl:text-lg 2xl:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Passionate about creating beautiful, functional digital experiences through code and design. 
            Let's build something amazing together.
          </motion.p>
        </motion.div>
        
        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
        >
          <motion.button 
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEye />
            View My Work
          </motion.button>
          
          <motion.button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope />
            Contact Me
          </motion.button>
        </motion.div>
        
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center gap-6 mb-2"
        >
          <motion.a
            href="https://github.com/Raz-Zy"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FaGithub size={20} />
          </motion.a>
          <motion.a
            href="https://www.facebook.com/dara.tan.583"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <FaFacebook size={20} />
          </motion.a>
          <motion.a
            href="https://t.me/TanDaras"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-sky-500 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FaTelegram size={20} />
          </motion.a>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Scroll Down to Explore</p>
          <motion.div 
            className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center bg-gray-50 dark:bg-gray-800/50 shadow-inner"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-gradient-to-b from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-full mt-2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
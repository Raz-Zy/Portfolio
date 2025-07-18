'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaHome, FaUser, FaGraduationCap, FaCog, FaPaintBrush, FaGithub, FaBriefcase, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: <FaHome /> },
  { id: 'about', label: 'About', icon: <FaUser /> },
  { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
  { id: 'skills', label: 'Skills', icon: <FaCog /> },
  { id: 'design', label: 'UX/UI Design', icon: <FaPaintBrush /> },
  { id: 'github', label: 'GitHub', icon: <FaGithub /> },
  { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
  { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolled, setIsScrolled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Initialize dark mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }

    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)

      // Check if user has scrolled to the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10

      if (isAtBottom) {
        // If at bottom, set the last section as active
        setActiveSection(navItems[navItems.length - 1].id)
      } else {
        // Find the active section based on scroll position
        const sections = navItems.map(item => item.id)
        let currentSection = sections[0] // Default to first section
        
        // Find the section that is currently most visible
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i])
          if (element) {
            const rect = element.getBoundingClientRect()
            // Check if the top of the section is above the middle of the viewport
            if (rect.top <= window.innerHeight / 2) {
              currentSection = sections[i]
              break
            }
          }
        }
        
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gradient cursor-pointer"
              onClick={() => scrollToSection('hero')}
            >
              Portfolio
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center xl:space-x-3 2xl:space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FaSun className="text-yellow-500 text-sm" />
                ) : (
                  <FaMoon className="text-gray-700 text-sm" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(activeSection === 'menu' ? 'hero' : 'menu')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={activeSection === 'menu' ? 'Close menu' : 'Open menu'}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                  {/* Top line */}
                  <motion.div
                    animate={{
                      rotate: activeSection === 'menu' ? 45 : 0,
                      y: activeSection === 'menu' ? 0 : -4,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-5 h-0.5 bg-current absolute"
                  />
                  
                  {/* Middle line */}
                  <motion.div
                    animate={{
                      opacity: activeSection === 'menu' ? 0 : 1,
                      scale: activeSection === 'menu' ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-5 h-0.5 bg-current absolute"
                  />
                  
                  {/* Bottom line */}
                  <motion.div
                    animate={{
                      rotate: activeSection === 'menu' ? -45 : 0,
                      y: activeSection === 'menu' ? 0 : 4,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="w-5 h-0.5 bg-current absolute"
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: activeSection === 'menu' ? 1 : 0,
          y: activeSection === 'menu' ? 0 : -20
        }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md xl:hidden ${
          activeSection === 'menu' ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeSection === 'menu' ? 1 : 0,
                y: activeSection === 'menu' ? 0 : 20
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => {
                scrollToSection(item.id)
                setActiveSection(item.id)
              }}
              className="flex items-center space-x-3 px-8 py-4 rounded-full text-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
          
          {/* Mobile Dark Mode Toggle */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: activeSection === 'menu' ? 1 : 0,
              y: activeSection === 'menu' ? 0 : 20
            }}
            transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 px-8 py-4 rounded-full text-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span>{darkMode ? <FaSun /> : <FaMoon />}</span>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Navigation Dots (Desktop) */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 hidden xl:block z-50">
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <div key={item.id} className="relative group">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection(item.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-purple-600 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={item.label}
              />
              
              {/* Simple Tooltip */}
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 px-3 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900 dark:border-l-gray-800"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
} 
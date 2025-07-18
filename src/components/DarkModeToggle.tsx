'use client'

import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a preference stored
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

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
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 xl:right-20 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-[60] border border-gray-200 dark:border-gray-700"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FaSun className="text-yellow-500 text-lg" />
      ) : (
        <FaMoon className="text-gray-700 text-lg" />
      )}
    </button>
  )
}
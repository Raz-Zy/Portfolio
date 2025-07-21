'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaCalendar, FaCode, FaBuilding, FaUser, FaFilter, FaArrowLeft, FaChevronRight } from 'react-icons/fa'
import { Repository, GitHubUser, Organization } from '@/types/github'

export default function GitHub() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'personal' | 'organization'>('personal')
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [orgRepositories, setOrgRepositories] = useState<Repository[]>([])
  const [orgLoading, setOrgLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Raz-Zy'

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/github?endpoint=user')
        const userData = await userResponse.json()
        
        if (userResponse.ok) {
          setUser(userData)
        } else {
          throw new Error('Failed to fetch user data')
        }

        // Fetch user's organizations
        const orgsResponse = await fetch('/api/github?endpoint=orgs')
        const orgsData = await orgsResponse.json()
        
        if (orgsResponse.ok) {
          setOrganizations(orgsData)
          console.log('Organizations found:', orgsData.length)
        } else {
          console.log('Failed to fetch organizations')
          setOrganizations([])
        }

        // Fetch repositories
        const reposResponse = await fetch('/api/github?endpoint=repos')
        const reposData = await reposResponse.json()
        
        if (reposResponse.ok) {
          console.log('All accessible repos found:', reposData.length)

          // Separate personal and organization repositories
          const personalRepos = reposData.filter((repo: Repository) => repo.owner.login === username)
          const orgRepos = reposData.filter((repo: Repository) => repo.owner.login !== username)

          console.log('Personal repos:', personalRepos.length)
          console.log('Organization repos:', orgRepos.length)

          setRepositories(reposData)
          setDebugInfo(`Personal: ${personalRepos.length}, Organization: ${orgRepos.length}, Total: ${reposData.length}`)
        } else {
          throw new Error('Failed to fetch repositories')
        }
        
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        setDebugInfo('Error fetching GitHub data')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username])

  const fetchOrgRepositories = async (orgLogin: string) => {
    setSelectedOrg(orgLogin)
    setOrgLoading(true)
    setOrgRepositories([]) // Clear previous repositories
    
    try {
      const response = await fetch(`/api/github?endpoint=org-repos&org=${orgLogin}`)
      const orgRepos = await response.json()
      
      if (response.ok) {
        setOrgRepositories(orgRepos)
      } else {
        console.error('Failed to fetch organization repositories:', orgRepos)
        setOrgRepositories([])
      }
    } catch (error) {
      console.error('Error fetching organization repositories:', error)
      setOrgRepositories([])
    } finally {
      setOrgLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#b07219',
      'C#': '#239120',
      'C++': '#f34b7d',
      'C': '#555555',
      'HTML': '#e34c26',
      'CSS': '#1572b6',
      'React': '#61dafb',
      'Vue': '#4fc08d',
      'PHP': '#777bb4',
      'Ruby': '#701516',
      'Go': '#00add8',
      'Rust': '#dea584',
      'Swift': '#fa7343',
      'Kotlin': '#a97bff',
      'Dart': '#0175c2',
      'Shell': '#89e051',
      'Dockerfile': '#384d54'
    }
    return colors[language] || '#6b7280'
  }

  const filteredRepositories = repositories.filter(repo => {
    if (filter === 'personal') return repo.owner.login === username
    if (filter === 'organization') return false // Don't show any repositories for organization filter
    return false // This should never be reached
  }).slice(0, 9) // Show top 9 repositories

  const getRepositoryType = (repo: Repository) => {
    return repo.owner.login === username ? 'personal' : 'organization'
  }

  const getFilteredCount = (filterType: 'personal' | 'organization') => {
    if (filterType === 'personal') return repositories.filter(repo => repo.owner.login === username).length
    if (filterType === 'organization') return organizations.length
    return 0 // This should never be reached
  }

  const handleBackToOverview = () => {
    setSelectedOrg(null)
    setOrgRepositories([])
    setFilter('organization') // Return to organizations view
  }

  const renderRepositoryCard = (repo: Repository, index: number) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 card-hover"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {getRepositoryType(repo) === 'personal' ? (
                          <FaUser className="text-green-500" size={12} title="Personal Repository" />
                        ) : (
                          <FaBuilding className="text-blue-500" size={12} title="Organization Repository" />
                        )}
                        {repo.private && (
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full whitespace-nowrap">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                      {repo.full_name}
                    </p>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors flex-shrink-0 ml-2"
                  >
                    <FaExternalLinkAlt size={14} />
                  </a>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-2">
                  {repo.description || 'No description available'}
                </p>
                
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full truncate max-w-20 sm:max-w-none"
                        title={topic}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                        />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-16 sm:max-w-none">
                          {repo.language}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" size={12} />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {repo.stargazers_count}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCodeBranch className="text-gray-500" size={12} />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaCalendar className="text-gray-400" size={10} />
                    <span className="whitespace-nowrap">
                      {formatDate(repo.updated_at)}
                    </span>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading GitHub data...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gradient">
              GitHub Portfolio
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Explore my latest projects and contributions on GitHub
            </p>
            {/* Debug info - remove in production */}
            {debugInfo && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Debug: {debugInfo}
              </p>
            )}
          </motion.div>
        )}

        {/* GitHub Profile Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                <img 
                  src={user.avatar_url} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                  {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 truncate">@{user.login}</p>
                {user.bio && (
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 line-clamp-2">{user.bio}</p>
                )}
                <div className="flex justify-center md:justify-start gap-4 sm:gap-8">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.public_repos}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {user.followers}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {organizations.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Organizations</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <a
                  href={`https://github.com/${user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 dark:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaGithub />
                  View Profile
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Show organization repositories if one is selected */}
        {selectedOrg ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <button
                onClick={handleBackToOverview}
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm sm:text-base"
              >
                <FaArrowLeft />
                Back to Organizations
              </button>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {selectedOrg} Repositories
              </h3>
            </div>
            
            {orgLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading organization repositories...</p>
              </div>
            ) : orgRepositories.length > 0 ? (
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">
                  Showing {orgRepositories.length} repositories
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {orgRepositories.map((repo, index) => renderRepositoryCard(repo, index))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBuilding className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No repositories found for {selectedOrg}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                  This organization may not have public repositories or you may not have access to them.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div>

            {/* Repository Filter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center mb-6 sm:mb-8 px-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-full p-1 sm:p-2 shadow-lg w-full max-w-md">
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => setFilter('personal')}
                    className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 flex-1 text-xs sm:text-sm ${
                      filter === 'personal'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <FaUser size={12} />
                    <span className="truncate">Personal ({getFilteredCount('personal')})</span>
                  </button>
                  <button
                    onClick={() => setFilter('organization')}
                    className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 flex-1 text-xs sm:text-sm ${
                      filter === 'organization'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <FaBuilding size={12} />
                    <span className="truncate">Organizations ({getFilteredCount('organization')})</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Show organizations when organization filter is selected */}
            {filter === 'organization' && organizations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
              >
                {organizations.map((org, index) => (
                  <motion.div
                    key={org.login}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fetchOrgRepositories(org.login)}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 card-hover cursor-pointer"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <img 
                        src={org.avatar_url} 
                        alt={org.login}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                          {org.login}
                        </h3>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <FaBuilding size={10} />
                          Organization
                        </div>
                      </div>
                      <FaChevronRight className="text-gray-400 flex-shrink-0" size={14} />
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {org.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <FaExternalLinkAlt size={10} />
                        Click to view repositories
                  </div>
                </div>
              </motion.div>
            ))}
              </motion.div>
            )}

            {/* No repositories message */}
            {filteredRepositories.length === 0 && filter !== 'organization' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <FaGithub className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No {filter} repositories found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                  Try switching to a different filter or check back later.
                </p>
              </motion.div>
            )}

            {/* No organizations message */}
            {filter === 'organization' && organizations.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <FaBuilding className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No organizations found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                  You don't seem to be part of any organizations yet.
                </p>
              </motion.div>
            )}

            {/* Repositories Grid */}
            {filteredRepositories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredRepositories.map((repo, index) => renderRepositoryCard(repo, index))}
              </div>
            )}
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 px-4"
        >
          <a
            href="https://github.com/Raz-Zy?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FaCode />
            View All Repositories
          </a>
        </motion.div>
      </div>
    </section>
  )
} 
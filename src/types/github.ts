export interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  owner: {
    login: string
    avatar_url: string
    type: string
  }
  private: boolean
}

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface Organization {
  login: string
  avatar_url: string
  description: string
} 
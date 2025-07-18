import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Raz-Zy'

// Create headers for authenticated requests
const getHeaders = () => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website',
  }
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }
  
  return headers
}

// Fetch data with authentication
const fetchWithAuth = async (url: string) => {
  const response = await fetch(url, { headers: getHeaders() })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 })
    }

    let data

    switch (endpoint) {
      case 'user':
        data = await fetchWithAuth(`https://api.github.com/users/${GITHUB_USERNAME}`)
        break
      
      case 'orgs':
        // Use authenticated endpoint if token is available to get all orgs including private memberships
        if (GITHUB_TOKEN) {
          data = await fetchWithAuth(`https://api.github.com/user/orgs`)
        } else {
          data = await fetchWithAuth(`https://api.github.com/users/${GITHUB_USERNAME}/orgs`)
        }
        break
      
      case 'repos':
        // Try authenticated endpoint first (includes private repos and organization repos)
        if (GITHUB_TOKEN) {
          try {
            data = await fetchWithAuth(`https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator,organization_member`)
          } catch (error) {
            console.log('Authenticated repo fetch failed, falling back to public repos')
            // Fallback to public repos
            data = await fetchWithAuth(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`)
          }
        } else {
          // No token, fetch public repos only
          data = await fetchWithAuth(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`)
        }
        break
      
      case 'org-repos':
        const orgLogin = searchParams.get('org')
        if (!orgLogin) {
          return NextResponse.json({ error: 'Organization login is required' }, { status: 400 })
        }
        
        try {
          // Try to get all repos (public and private if authenticated)
          const url = `https://api.github.com/orgs/${orgLogin}/repos?sort=updated&per_page=100&type=all`
          console.log(`Fetching repos from: ${url}`)
          
          const response = await fetch(url, { headers: getHeaders() })
          
          if (!response.ok) {
            console.log(`GitHub API error for ${orgLogin}:`, response.status, response.statusText)
            // If forbidden, try public repos only
            if (response.status === 403 || response.status === 404) {
              const publicUrl = `https://api.github.com/orgs/${orgLogin}/repos?sort=updated&per_page=100&type=public`
              console.log(`Trying public repos only: ${publicUrl}`)
              const publicResponse = await fetch(publicUrl, { headers: getHeaders() })
              data = await publicResponse.json()
            } else {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
          } else {
            data = await response.json()
          }
          
          console.log(`Found ${data.length} repositories for ${orgLogin}`)
        } catch (error) {
          console.log(`Failed to fetch repos for organization ${orgLogin}:`, error)
          data = []
        }
        break
      
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
} 
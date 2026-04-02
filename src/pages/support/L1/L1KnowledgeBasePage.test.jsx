import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { L1KnowledgeBasePage } from './L1KnowledgeBasePage'
import * as supportApi from '../../../api/supportApi'

// Mock the API
vi.mock('../../../api/supportApi', () => ({
  supportApi: {
    l1: {
      getKnowledgeBase: vi.fn()
    }
  }
}))

const mockArticles = [
  {
    _id: '1',
    title: 'How to reset password',
    category: 'Account',
    tags: ['password', 'security'],
    content: 'To reset your password, click the forgot password link on the login page.',
    helpful_count: 24,
    created_at: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Common errors',
    category: 'Troubleshooting',
    tags: ['error', 'help'],
    content: 'Here are common errors and how to fix them.',
    helpful_count: 12,
    created_at: new Date().toISOString()
  }
]

describe('L1KnowledgeBasePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    supportApi.supportApi.l1.getKnowledgeBase.mockResolvedValue({
      data: mockArticles,
      total: 2,
      page: 1,
      per_page: 10
    })
  })

  it('renders loading spinner initially', () => {
    supportApi.supportApi.l1.getKnowledgeBase.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        data: [],
        total: 0,
        page: 1,
        per_page: 10
      }), 1000))
    )
    
    const { container } = render(<L1KnowledgeBasePage />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('fetches and displays articles on mount', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(supportApi.supportApi.l1.getKnowledgeBase).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      })
    })

    expect(screen.getByText('How to reset password')).toBeInTheDocument()
    expect(screen.getByText('Common errors')).toBeInTheDocument()
  })

  it('displays article cards with all information', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })

    // Check for category tags
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Troubleshooting')).toBeInTheDocument()

    // Check for tags
    expect(screen.getByText('password')).toBeInTheDocument()

    // Check for helpful count
    expect(screen.getByText(/24 found this helpful/)).toBeInTheDocument()
  })

  it('opens modal when article is clicked', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })

    const articleCard = screen.getByText('How to reset password').closest('div')
    fireEvent.click(articleCard)

    await waitFor(() => {
      expect(screen.getByText(/To reset your password/)).toBeInTheDocument()
    })
  })

  it('closes modal when close button is clicked', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })

    const articleCard = screen.getByText('How to reset password').closest('div')
    fireEvent.click(articleCard)

    await waitFor(() => {
      expect(screen.getByText(/To reset your password/)).toBeInTheDocument()
    })

    const closeButton = screen.getAllByText('Close')[0]
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/To reset your password/)).not.toBeInTheDocument()
    })
  })

  it('filters articles by category', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })

    const categorySelect = screen.getByDisplayValue('all')
    fireEvent.change(categorySelect, { target: { value: 'Account' } })

    await waitFor(() => {
      expect(supportApi.supportApi.l1.getKnowledgeBase).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        category: 'Account'
      })
    })
  })

  it('searches articles with debounce', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search articles...')
    fireEvent.change(searchInput, { target: { value: 'password' } })

    // Wait for debounce (500ms)
    await waitFor(() => {
      expect(supportApi.supportApi.l1.getKnowledgeBase).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'password'
      })
    }, { timeout: 1000 })
  })

  it('shows result count', async () => {
    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Showing 1-2 of 2 results/)).toBeInTheDocument()
    })
  })

  it('displays error message and retry button on API failure', async () => {
    const error = new Error('Network error')
    supportApi.supportApi.l1.getKnowledgeBase.mockRejectedValue(error)

    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load knowledge base articles. Please try again.')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('retries fetch when retry button is clicked', async () => {
    const error = new Error('Network error')
    supportApi.supportApi.l1.getKnowledgeBase.mockRejectedValueOnce(error)
    supportApi.supportApi.l1.getKnowledgeBase.mockResolvedValueOnce({
      data: mockArticles,
      total: 2,
      page: 1,
      per_page: 10
    })

    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load knowledge base articles. Please try again.')).toBeInTheDocument()
    })

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('How to reset password')).toBeInTheDocument()
    })
  })

  it('shows empty state when no articles found', async () => {
    supportApi.supportApi.l1.getKnowledgeBase.mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      per_page: 10
    })

    render(<L1KnowledgeBasePage />)
    
    await waitFor(() => {
      expect(screen.getByText('No articles available')).toBeInTheDocument()
    })
  })
})

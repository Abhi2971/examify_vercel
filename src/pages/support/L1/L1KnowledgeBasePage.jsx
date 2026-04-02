import { useEffect, useState, useCallback, useRef } from 'react'
import { supportApi } from '../../../api/supportApi'
import { Search, BookOpen, MessageCircle } from 'lucide-react'

export function L1KnowledgeBasePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState(['all'])
  
  const debounceTimerRef = useRef(null)

  const debouncedSearch = useCallback((value, callback) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      callback(value)
    }, 500)
  }, [])

  const fetchArticles = useCallback(async (page = 1, search = '', category = 'all') => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page,
        limit: pageSize,
        ...(search && { search }),
        ...(category !== 'all' && { category })
      }
      
      const response = await supportApi.l1.getKnowledgeBase(params)
      
      setArticles(response.data || [])
      setTotal(response.total || 0)
      setCurrentPage(response.page || page)
      
      // Extract unique categories from articles for filter dropdown
      const allArticles = response.data || []
      const uniqueCategories = ['all', ...new Set(allArticles
        .filter(a => a.category)
        .map(a => a.category)
      )]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error('Failed to load KB:', err)
      setError('Failed to load knowledge base articles. Please try again.')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  // Fetch on category change
  useEffect(() => {
    setCurrentPage(1)
    fetchArticles(1, searchTerm, categoryFilter)
  }, [categoryFilter, fetchArticles, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
        <p className="text-white/70">Find answers to common questions</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:border-[#00C4B4]/50 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      {error ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <MessageCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-300 font-medium">{error}</p>
          <button
            onClick={() => fetchArticles(currentPage, searchTerm, categoryFilter)}
            className="mt-4 px-4 py-2 bg-[#00C4B4]/20 hover:bg-[#00C4B4]/30 text-[#00C4B4] rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <BookOpen size={48} className="mx-auto text-white/40 mb-4" />
          <p className="text-white/70">
            {searchTerm || categoryFilter !== 'all' ? 'No articles found matching your search' : 'No articles available'}
          </p>
        </div>
      ) : (
        <>
          <div className="text-white/60 text-sm mb-4">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} of {total} results
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(article => (
              <div
                key={article._id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 cursor-pointer hover:border-[#00C4B4]/50 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="text-[#00C4B4] flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">{article.title}</h3>
                    <p className="text-white/60 text-xs mt-1">{new Date(article.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  {article.content.substring(0, 150).replace(/\n+/g, ' ')}...
                </p>
                
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="inline-block bg-[#00C4B4]/20 text-[#00C4B4] text-xs px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  {article.tags && article.tags.length > 0 && (
                    <>
                      {article.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="inline-block bg-white/10 text-white/70 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-white/50 text-xs">+{article.tags.length - 2}</span>
                      )}
                    </>
                  )}
                </div>
                
                {article.helpful_count > 0 && (
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <span>👍</span>
                    <span>{article.helpful_count} found this helpful</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {articles.length > 0 && total > pageSize && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => {
              const newPage = Math.max(currentPage - 1, 1)
              setCurrentPage(newPage)
              fetchArticles(newPage, searchTerm, categoryFilter)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            ← Previous
          </button>
          
          <div className="text-white/70 text-sm">
            Page {currentPage} of {Math.ceil(total / pageSize)}
          </div>
          
          <button
            onClick={() => {
              const newPage = currentPage + 1
              setCurrentPage(newPage)
              fetchArticles(newPage, searchTerm, categoryFilter)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            disabled={currentPage >= Math.ceil(total / pageSize)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#081120] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-[#081120] border-b border-white/10 p-6 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedArticle.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block bg-[#00C4B4]/20 text-[#00C4B4] text-xs px-3 py-1 rounded-full">
                    {selectedArticle.category}
                  </span>
                  {selectedArticle.tags && selectedArticle.tags.map((tag, idx) => (
                    <span key={idx} className="inline-block bg-white/10 text-white/70 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-3">
                  Created: {new Date(selectedArticle.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{selectedArticle.content}</p>
              </div>
            </div>
            
            <div className="border-t border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>👍 {selectedArticle.helpful_count || 0} found this helpful</span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

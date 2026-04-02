import { useState, useEffect } from 'react'
import { supportApi } from '../../api/supportApi'
import { BookOpen, Search, X, ArrowLeft } from 'lucide-react'

export function KnowledgeBasePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const data = await supportApi.getKnowledgeBase()
      setArticles(Array.isArray(data) ? data : data.articles || [])
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(articles.map(a => a.category || 'Uncategorized'))]

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return date.toLocaleDateString()
  }

  const openArticleDetail = (article) => {
    setSelectedArticle(article)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#00C4B4]/30 border-t-[#00C4B4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FF]">Knowledge Base</h1>
        <p className="text-[#F0F6FF]/50 mt-1">Find answers and best practices</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F0F6FF]/50" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-[#F0F6FF] placeholder-[#F0F6FF]/30 focus:outline-none focus:border-[#00C4B4]/50 transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[#F0F6FF] focus:outline-none focus:border-[#00C4B4]/50 transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-[#081120]">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="text-[#00C4B4] hover:text-[#00E5FF] font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-[#F0F6FF]/20 mx-auto mb-3" />
          <p className="text-[#F0F6FF]/50">
            {articles.length === 0 
              ? 'No articles available.'
              : 'No articles match your search. Try different keywords.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <button
              key={article._id || article.id}
              onClick={() => openArticleDetail(article)}
              className="text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00C4B4]/30 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-[#F0F6FF] group-hover:text-[#00C4B4] transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
              
              <p className="text-sm text-[#F0F6FF]/50 line-clamp-2 mb-3">
                {article.content?.substring(0, 100)}...
              </p>

              <div className="flex items-center justify-between">
                <span className="inline-block px-2 py-1 bg-[#00C4B4]/20 text-[#00C4B4] text-xs rounded font-medium">
                  {article.category || 'Uncategorized'}
                </span>
                <span className="text-xs text-[#F0F6FF]/50">
                  {formatDate(article.created_at)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedArticle(null)
        }}
      />
    </div>
  )
}

function ArticleDetailModal({ article, isOpen, onClose }) {
  if (!isOpen || !article) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] z-50 p-4 overflow-y-auto">
        <div className="bg-[#081120] border border-white/10 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#081120]">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[#F0F6FF]/50 hover:text-[#F0F6FF] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={onClose}
              className="text-[#F0F6FF]/50 hover:text-[#F0F6FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-4">
            {/* Title */}
            <h2 className="text-2xl font-bold text-[#F0F6FF]">{article.title}</h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1 bg-[#00C4B4]/20 text-[#00C4B4] rounded-full font-medium">
                {article.category || 'Uncategorized'}
              </span>
              <span className="text-[#F0F6FF]/50">
                Created: {formatDate(article.created_at)}
              </span>
            </div>

            {/* Body */}
            <div className="prose prose-invert max-w-none">
              <p className="text-[#F0F6FF] whitespace-pre-wrap leading-relaxed">
                {article.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

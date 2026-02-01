import { useState, useEffect, useRef } from 'react'
import { Search, Filter, Bookmark, X, BookOpen, Users, Calendar, TrendingUp, FileText, ExternalLink, ChevronDown, Sparkles, History, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'

// Types
interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  year: number
  journal: string
  citations: number
  doi?: string
  url?: string
  keywords: string[]
  relevance?: number
  type: 'article' | 'review' | 'proceedings' | 'book'
}

interface SearchFilters {
  years: [number, number]
  types: string[]
  journals: string[]
  minCitations: number
  sortBy: 'relevance' | 'date' | 'citations'
}

// Mock data for demonstration
const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Advances in Machine Learning for Scientific Discovery',
    authors: ['Chen, L.', 'Wang, M.', 'Smith, J.', 'Johnson, A.'],
    abstract: 'This paper presents a comprehensive review of machine learning applications in scientific research. We demonstrate how deep learning models can accelerate discovery in materials science, drug discovery, and genomics. Our novel approach achieves state-of-the-art results on multiple benchmark datasets.',
    year: 2024,
    journal: 'Nature Machine Intelligence',
    citations: 156,
    doi: '10.1038/s42256-024-00123-4',
    keywords: ['Machine Learning', 'Scientific Discovery', 'Deep Learning', 'AI'],
    relevance: 95,
    type: 'review'
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Cryptography',
    authors: ['Zhang, Y.', 'Brown, R.', 'Lee, S.'],
    abstract: 'We explore the potential impact of quantum computing on modern cryptographic systems. Our analysis shows that post-quantum cryptographic methods can provide robust security against quantum attacks while maintaining computational efficiency.',
    year: 2023,
    journal: 'IEEE Transactions on Quantum Engineering',
    citations: 89,
    keywords: ['Quantum Computing', 'Cryptography', 'Security', 'Post-Quantum'],
    relevance: 88,
    type: 'article'
  },
  {
    id: '3',
    title: 'Climate Change Modeling Using Neural Networks',
    authors: ['Garcia, M.', 'Martinez, C.', 'Rodriguez, A.', 'Lopez, K.'],
    abstract: 'This study introduces a novel neural network architecture for climate prediction. The model integrates satellite data, ocean temperature measurements, and atmospheric patterns to improve long-term climate forecasts.',
    year: 2024,
    journal: 'Climate Dynamics',
    citations: 234,
    keywords: ['Climate Change', 'Neural Networks', 'Environmental Science', 'Prediction'],
    relevance: 82,
    type: 'article'
  },
  {
    id: '4',
    title: 'CRISPR-Cas9: Recent Advances and Therapeutic Applications',
    authors: ['Patel, N.', 'Kim, H.', 'Müller, F.', 'Suzuki, T.'],
    abstract: 'A comprehensive review of CRISPR-Cas9 gene editing technology and its therapeutic applications. We discuss recent breakthroughs in treating genetic disorders and the future potential of personalized gene therapy.',
    year: 2023,
    journal: 'Cell',
    citations: 445,
    keywords: ['CRISPR', 'Gene Editing', 'Therapeutics', 'Biotechnology'],
    relevance: 79,
    type: 'review'
  },
  {
    id: '5',
    title: 'Blockchain Technology for Supply Chain Management',
    authors: ['Anderson, P.', 'Wilson, D.'],
    abstract: 'This paper proposes a blockchain-based framework for transparent and secure supply chain management. The system enables real-time tracking, verification of authenticity, and automated compliance checking.',
    year: 2022,
    journal: 'International Journal of Production Economics',
    citations: 178,
    keywords: ['Blockchain', 'Supply Chain', 'Logistics', 'Smart Contracts'],
    relevance: 75,
    type: 'article'
  },
  {
    id: '6',
    title: 'Natural Language Processing for Healthcare Applications',
    authors: ['Taylor, E.', 'Davies, R.', 'Chen, X.'],
    abstract: 'We present a transformer-based model for analyzing medical records and extracting clinical insights. The system demonstrates high accuracy in diagnosis prediction and treatment recommendation tasks.',
    year: 2024,
    journal: 'Journal of Biomedical Informatics',
    citations: 67,
    keywords: ['NLP', 'Healthcare', 'Transformers', 'Medical AI'],
    relevance: 71,
    type: 'article'
  },
  {
    id: '7',
    title: 'Sustainable Energy Solutions: A Comprehensive Analysis',
    authors: ['Nakamura, Y.', 'Thompson, B.', 'Vargas, L.'],
    abstract: 'This study analyzes renewable energy technologies and their integration into existing power grids. We provide recommendations for policy makers and utilities seeking to transition to sustainable energy sources.',
    year: 2023,
    journal: 'Renewable and Sustainable Energy Reviews',
    citations: 312,
    keywords: ['Renewable Energy', 'Sustainability', 'Power Grid', 'Climate'],
    relevance: 68,
    type: 'review'
  },
  {
    id: '8',
    title: 'Edge Computing for IoT: Architecture and Applications',
    authors: ['Rossi, A.', 'Ferrari, M.', 'Bianchi, C.'],
    abstract: 'We propose a novel edge computing architecture for IoT applications that reduces latency and bandwidth usage. The system enables real-time data processing and intelligent decision-making at the network edge.',
    year: 2024,
    journal: 'IEEE Internet of Things Journal',
    citations: 94,
    keywords: ['Edge Computing', 'IoT', 'Distributed Systems', 'Architecture'],
    relevance: 65,
    type: 'article'
  }
]

const popularSearches = [
  'Machine Learning',
  'Climate Change',
  'Quantum Computing',
  'CRISPR',
  'Artificial Intelligence'
]

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Paper[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [savedPapers, setSavedPapers] = useState<Set<string>>(new Set())
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'history'>('search')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<SearchFilters>({
    years: [2015, 2024],
    types: [],
    journals: [],
    minCitations: 0,
    sortBy: 'relevance'
  })

  const typeOptions = [
    { id: 'article', label: 'Articles' },
    { id: 'review', label: 'Reviews' },
    { id: 'proceedings', label: 'Proceedings' },
    { id: 'book', label: 'Books' }
  ]

  const journalOptions = [
    'Nature', 'Science', 'Cell', 'IEEE Transactions',
    'Nature Machine Intelligence', 'Climate Dynamics',
    'Renewable and Sustainable Energy Reviews', 'Journal of Biomedical Informatics'
  ]

  // Simulate semantic search with relevance scoring
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)

    // Simulate API delay
    setTimeout(() => {
      const queryLower = searchQuery.toLowerCase()
      const queryWords = queryLower.split(/\s+/)

      const scored = mockPapers.map(paper => {
        let score = 0

        // Title matches (highest weight)
        const titleLower = paper.title.toLowerCase()
        queryWords.forEach(word => {
          if (titleLower.includes(word)) score += 30
          if (titleLower.startsWith(word)) score += 10
        })

        // Abstract matches (medium weight)
        const abstractLower = paper.abstract.toLowerCase()
        queryWords.forEach(word => {
          if (abstractLower.includes(word)) score += 15
        })

        // Keyword matches (high weight)
        paper.keywords.forEach(keyword => {
          if (queryLower.includes(keyword.toLowerCase())) score += 25
        })

        // Author matches (lower weight)
        paper.authors.forEach(author => {
          if (queryLower.includes(author.toLowerCase())) score += 10
        })

        // Journal matches
        if (queryLower.includes(paper.journal.toLowerCase())) score += 15

        return { ...paper, relevance: Math.min(score, 100) }
      })

      // Apply filters
      let filtered = scored.filter(paper => {
        if (paper.year < filters.years[0] || paper.year > filters.years[1]) return false
        if (filters.types.length > 0 && !filters.types.includes(paper.type)) return false
        if (filters.journals.length > 0 && !filters.journals.includes(paper.journal)) return false
        if (paper.citations < filters.minCitations) return false
        return true
      })

      // Sort results
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date': return b.year - a.year
          case 'citations': return b.citations - a.citations
          default: return (b.relevance || 0) - (a.relevance || 0)
        }
      })

      setResults(filtered)
      setIsSearching(false)

      // Add to history
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)]
        return newHistory.slice(0, 10)
      })
    }, 600)
  }

  useEffect(() => {
    // Load saved history from localStorage
    const savedHistory = localStorage.getItem('scholarSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }

    const savedBookmarks = localStorage.getItem('scholarSavedPapers')
    if (savedBookmarks) {
      setSavedPapers(new Set(JSON.parse(savedBookmarks)))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('scholarSearchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem('scholarSavedPapers', JSON.stringify(Array.from(savedPapers)))
  }, [savedPapers])

  const toggleSave = (paperId: string) => {
    setSavedPapers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(paperId)) {
        newSet.delete(paperId)
      } else {
        newSet.add(paperId)
      }
      return newSet
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const clearHistory = () => {
    setSearchHistory([])
  }

  const getTypeIcon = (type: Paper['type']) => {
    switch (type) {
      case 'review': return <BookOpen className="w-3.5 h-3.5" />
      case 'proceedings': return <Users className="w-3.5 h-3.5" />
      case 'book': return <FileText className="w-3.5 h-3.5" />
      default: return <FileText className="w-3.5 h-3.5" />
    }
  }

  const getTypeLabel = (type: Paper['type']) => {
    switch (type) {
      case 'review': return 'Review'
      case 'proceedings': return 'Proceedings'
      case 'book': return 'Book'
      default: return 'Article'
    }
  }

  const savedPapersList = mockPapers.filter(p => savedPapers.has(p.id))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3 safe-area-inset-top">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">ScholarSearch</span>
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="h-8 bg-muted/50">
                  <TabsTrigger value="search" className="px-3 h-7">Search</TabsTrigger>
                  <TabsTrigger value="saved" className="px-3 h-7">
                    Saved {savedPapers.size > 0 && <Badge variant="secondary" className="ml-1.5 h-4.5 px-1 text-xs">{savedPapers.size}</Badge>}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-safe">
        {activeTab === 'search' && (
          <>
            {/* Search Section */}
            <div className="px-4 pt-4 pb-3">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search papers, authors, topics..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-2xl bg-card text-base"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('')
                          setResults([])
                          searchInputRef.current?.focus()
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button
                        type="button"
                        variant={filters.types.length > 0 || filters.journals.length > 0 || filters.minCitations > 0 ? "default" : "outline"}
                        size="icon"
                        className="h-12 w-12 rounded-2xl flex-shrink-0"
                      >
                        <SlidersHorizontal className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="mt-6 h-[calc(100vh-220px)]">
                        <div className="space-y-6 px-1 pb-20">
                          {/* Year Range */}
                          <div>
                            <h3 className="font-medium mb-3">Publication Year</h3>
                            <div className="flex items-center gap-4">
                              <Input
                                type="number"
                                value={filters.years[0]}
                                onChange={(e) => setFilters(f => ({ ...f, years: [Number(e.target.value), f.years[1]] }))}
                                className="flex-1"
                                min="1900"
                                max="2024"
                              />
                              <span className="text-muted-foreground">to</span>
                              <Input
                                type="number"
                                value={filters.years[1]}
                                onChange={(e) => setFilters(f => ({ ...f, years: [f.years[0], Number(e.target.value)] }))}
                                className="flex-1"
                                min="1900"
                                max="2024"
                              />
                            </div>
                          </div>

                          <Separator />

                          {/* Document Type */}
                          <div>
                            <h3 className="font-medium mb-3">Document Type</h3>
                            <div className="space-y-2">
                              {typeOptions.map(option => (
                                <div key={option.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={option.id}
                                    checked={filters.types.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      setFilters(f => ({
                                        ...f,
                                        types: checked
                                          ? [...f.types, option.id]
                                          : f.types.filter(t => t !== option.id)
                                      }))
                                    }}
                                  />
                                  <label htmlFor={option.id} className="text-sm cursor-pointer">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Minimum Citations */}
                          <div>
                            <h3 className="font-medium mb-3">Minimum Citations</h3>
                            <Input
                              type="number"
                              value={filters.minCitations}
                              onChange={(e) => setFilters(f => ({ ...f, minCitations: Number(e.target.value) }))}
                              min="0"
                            />
                          </div>

                          <Separator />

                          {/* Sort By */}
                          <div>
                            <h3 className="font-medium mb-3">Sort By</h3>
                            <div className="space-y-2">
                              {[
                                { id: 'relevance', label: 'Relevance' },
                                { id: 'date', label: 'Publication Date (Newest)' },
                                { id: 'citations', label: 'Citation Count' }
                              ].map(option => (
                                <div key={option.id} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    id={option.id}
                                    name="sort"
                                    checked={filters.sortBy === option.id}
                                    onChange={() => setFilters(f => ({ ...f, sortBy: option.id as any }))}
                                    className="w-4 h-4"
                                  />
                                  <label htmlFor={option.id} className="text-sm cursor-pointer">
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="flex gap-3 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setFilters({
                                years: [2015, 2024],
                                types: [],
                                journals: [],
                                minCitations: 0,
                                sortBy: 'relevance'
                              })}
                            >
                              Reset
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => {
                                performSearch(query)
                                setShowFilters(false)
                              }}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
              </form>

              {/* Search History */}
              {searchHistory.length > 0 && query && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Recent searches</span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 4).map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(term)
                          performSearch(term)
                        }}
                        className="text-xs px-2.5 py-1 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Popular Searches */}
            {!query && results.length === 0 && (
              <div className="px-4 pb-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(term)
                        performSearch(term)
                      }}
                      className="px-3 py-1.5 bg-card border rounded-full text-sm hover:bg-accent transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="px-4">
              {isSearching ? (
                <div className="py-8 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">Searching...</p>
                </div>
              ) : query && results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                    {(filters.types.length > 0 || filters.minCitations > 0) && (
                      <Button variant="ghost" size="sm" onClick={() => setShowFilters(true)}>
                        <Filter className="w-4 h-4 mr-1" />
                        Filters active
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3 pb-4">
                    {results.map((paper) => (
                      <Card key={paper.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="text-left">
                                    <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
                                      {paper.title}
                                    </h3>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl leading-snug">{paper.title}</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 space-y-4">
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" />
                                        {paper.authors.join(', ')}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {paper.year}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        {paper.citations} citations
                                      </span>
                                    </div>
                                    <Separator />
                                    <div>
                                      <h4 className="font-medium mb-2">Abstract</h4>
                                      <p className="text-sm leading-relaxed text-muted-foreground">{paper.abstract}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                      <h4 className="font-medium mb-2">Publication</h4>
                                      <p className="text-sm text-muted-foreground">{paper.journal}</p>
                                      {paper.doi && (
                                        <p className="text-xs text-muted-foreground mt-1">DOI: {paper.doi}</p>
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Keywords</h4>
                                      <div className="flex flex-wrap gap-1.5">
                                        {paper.keywords.map((keyword, idx) => (
                                          <Badge key={idx} variant="secondary">{keyword}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <Button className="flex-1">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Full Paper
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => toggleSave(paper.id)}
                                      >
                                        <Bookmark className={`w-4 h-4 ${savedPapers.has(paper.id) ? 'fill-current' : ''}`} />
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2 text-xs text-muted-foreground">
                                <span>{paper.authors[0]}{paper.authors.length > 1 && ' et al.'}</span>
                                <span>•</span>
                                <span>{paper.journal}</span>
                                <span>•</span>
                                <span>{paper.year}</span>
                              </div>

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{paper.abstract}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{paper.citations}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs h-6 px-2 gap-1.5">
                                    {getTypeIcon(paper.type)}
                                    {getTypeLabel(paper.type)}
                                  </Badge>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleSave(paper.id)}
                                  className="h-8 w-8"
                                >
                                  <Bookmark className={`w-4 h-4 ${savedPapers.has(paper.id) ? 'fill-current' : ''}`} />
                                </Button>
                              </div>

                              {/* Relevance indicator for semantic search */}
                              {paper.relevance !== undefined && filters.sortBy === 'relevance' && (
                                <div className="mt-2">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary/60 rounded-full"
                                        style={{ width: `${paper.relevance}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{paper.relevance}%</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : query && !isSearching ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">No results found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : !query && (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Smart Semantic Search</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Search for papers, authors, topics, or ask natural language questions
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div className="px-4 py-4">
            {savedPapersList.length > 0 ? (
              <div className="space-y-3">
                {savedPapersList.map((paper) => (
                  <Card key={paper.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-left">
                                <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
                                  {paper.title}
                                </h3>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl leading-snug">{paper.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    {paper.authors.join(', ')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {paper.year}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    {paper.citations} citations
                                  </span>
                                </div>
                                <Separator />
                                <div>
                                  <h4 className="font-medium mb-2">Abstract</h4>
                                  <p className="text-sm leading-relaxed text-muted-foreground">{paper.abstract}</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button className="flex-1">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Full Paper
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2 text-xs text-muted-foreground">
                            <span>{paper.authors[0]}{paper.authors.length > 1 && ' et al.'}</span>
                            <span>•</span>
                            <span>{paper.journal}</span>
                            <span>•</span>
                            <span>{paper.year}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSave(paper.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No saved papers</h3>
                <p className="text-sm text-muted-foreground">Bookmark papers to access them later</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom safe area for iOS */}
      <div className="h-6 safe-area-inset bg-background" />
    </div>
  )
}

export default App

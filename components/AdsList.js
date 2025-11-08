"use client"
import { useEffect, useState } from 'react'
import AdCard from './AdCard'

export default function AdsList() {
  const [ads, setAds] = useState(null)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All')
  const [q, setQ] = useState('')

  // sync with URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const qp = params.get('q') || ''
    const cat = params.get('category') || 'All'
    const p = parseInt(params.get('page') || '1', 10)
    setQ(qp)
    setCategory(cat)
    setPage(p)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setAds(null)

    ;(async () => {
      try {
        const params = new URLSearchParams({ page, category })
        if (q) params.set('q', q)
        const res = await fetch(`/api/ads?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) {
          console.error('Failed to fetch ads', res.status)
          setAds([])
          return
        }

        // read text first to avoid JSON parse errors on empty responses
        const text = await res.text()
        if (!text) {
          setAds([])
          return
        }

        let data
        try {
          data = JSON.parse(text)
        } catch (err) {
          console.error('Invalid JSON from /api/ads', err)
          setAds([])
          return
        }

        setAds(data)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Error fetching ads', err)
        setAds([])
      }
    })()

    return () => controller.abort()
  }, [page, category, q])

  if (!ads) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#23e5db] border-t-transparent"></div>
        <div className="mt-4 text-gray-600">Loading ads...</div>
      </div>
    </div>
  )
  
  if (!Array.isArray(ads)) return (
    <div className="text-center py-16">
      <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <div className="text-xl text-gray-600 mt-4">No ads found</div>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <label className="font-semibold text-gray-700">Filter by Category:</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Cars', 'Mobiles', 'Electronics', 'Furniture'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {setCategory(cat); setPage(1)}}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#002f34] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          <span className="font-semibold">{ads.length}</span> ads found
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ads.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <button 
            className="px-6 py-2 bg-white border-2 border-[#002f34] text-[#002f34] rounded-lg font-semibold hover:bg-[#002f34] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={()=>setPage(p=>Math.max(1,p-1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <div className="px-6 py-2 bg-[#002f34] text-white rounded-lg font-semibold shadow-md">
            Page {page}
          </div>
          <button 
            className="px-6 py-2 bg-white border-2 border-[#002f34] text-[#002f34] rounded-lg font-semibold hover:bg-[#002f34] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={()=>setPage(p=>p+1)}
            disabled={ads.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
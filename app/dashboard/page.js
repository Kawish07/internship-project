"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session } = useSession()
  const [ads, setAds] = useState(null)

  useEffect(() => {
    if (!session) return
    fetch('/api/ads')
      .then((r) => r.json())
      .then((data) => setAds(data.filter(a => a.userId === session.user.id)))
  }, [session])

  if (!session) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <svg className="w-20 h-20 mx-auto text-[#002f34] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
        <p className="text-gray-600 mb-4">Please login to view your dashboard</p>
        <Link href="/signin" className="inline-block bg-[#002f34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003d44] transition">
          Login Now
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002f34] to-[#003d44] text-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Ads Dashboard</h1>
              <p className="text-gray-200">Manage all your posted ads</p>
            </div>
            <Link 
              href="/dashboard/create" 
              className="bg-[#23e5db] text-[#002f34] px-6 py-3 rounded-lg font-bold hover:bg-[#1fd4cb] transition flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Ad
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Total Ads</div>
                <div className="text-3xl font-bold text-[#002f34]">{ads?.length || 0}</div>
              </div>
              <div className="bg-[#23e5db] bg-opacity-20 p-3 rounded-full">
                <svg className="w-8 h-8 text-[#002f34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">Active</div>
                <div className="text-3xl font-bold text-green-600">{ads?.length || 0}</div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">This Month</div>
                <div className="text-3xl font-bold text-blue-600">{ads?.filter(a => {
                  const date = new Date(a.createdAt)
                  const now = new Date()
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                }).length || 0}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {!ads && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#23e5db] border-t-transparent"></div>
              <div className="mt-4 text-gray-600">Loading your ads...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {ads && ads.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-16 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Ads Yet</h3>
            <p className="text-gray-600 mb-6">Start selling by posting your first ad</p>
            <Link 
              href="/dashboard/create" 
              className="inline-flex items-center gap-2 bg-[#002f34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003d44] transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Your First Ad
            </Link>
          </div>
        )}

        {/* Ads List */}
        <div className="grid grid-cols-1 gap-4">
          {ads?.map(ad => (
            <div key={ad._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4 p-5">
                {/* Image */}
                <div className="md:w-64 flex-shrink-0">
                  {ad.image ? (
                    <img src={ad.image} alt={ad.title} className="w-full h-48 md:h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-48 md:h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{ad.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        ACTIVE
                      </span>
                    </div>
                    
                    <div className="text-2xl font-bold text-[#002f34] mb-2">
                      Rs {ad.price?.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {ad.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(ad.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2">{ad.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <Link 
                      href={`/ad/${ad._id}`} 
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <Link 
                      href={`/dashboard/edit/${ad._id}`} 
                      className="px-4 py-2 bg-[#002f34] text-white rounded-lg font-semibold hover:bg-[#003d44] transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button 
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition flex items-center gap-2"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this ad?')) return
                        const res = await fetch(`/api/ads/${ad._id}`, { method: 'DELETE' })
                        if (res.ok) setAds(prev => prev.filter(x => x._id !== ad._id))
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
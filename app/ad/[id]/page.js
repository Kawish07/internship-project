import { connectToDB } from '../../../lib/mongodb'
import Ad from '../../../models/Ad'
import User from '../../../models/User'
import Link from 'next/link'

export default async function AdPage({ params }) {
  await connectToDB()
  const ad = await Ad.findById(params.id).lean()
  if (!ad) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ad Not Found</h2>
        <p className="text-gray-600 mb-6">This ad may have been removed or doesn't exist</p>
        <Link href="/" className="inline-block bg-[#002f34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003d44] transition">
          Browse All Ads
        </Link>
      </div>
    </div>
  )
  
  const user = await User.findById(ad.userId).lean()

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#002f34] transition">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/?category=${ad.category}`} className="hover:text-[#002f34] transition">{ad.category}</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{ad.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {ad.image ? (
                <div className="relative">
                  <img 
                    src={ad.image} 
                    alt={ad.title} 
                    className="w-full h-[400px] md:h-[500px] object-contain bg-gray-900" 
                  />
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="border-b pb-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{ad.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {ad.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Rawalpindi, Punjab
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(ad.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{ad.description}</p>
              </div>
            </div>

            {/* Ad ID Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Ad ID: {ad._id?.toString()}</span>
                <button className="flex items-center gap-1 text-red-600 hover:text-red-700 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Report this ad
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-4xl font-bold text-[#002f34] mb-2">
                  Rs {ad.price?.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Negotiable
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div className="font-semibold text-yellow-900 mb-1">Safety tips</div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Meet in a safe public place</li>
                    <li>• Check the item before buying</li>
                    <li>• Pay only after collecting item</li>
                    <li>• Don't share financial info</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Ads Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Ads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Placeholder for related ads */}
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No related ads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
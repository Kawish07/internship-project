import Link from 'next/link'

export default function AdCard({ ad }) {
  return (
    <Link href={`/ad/${ad._id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {ad.image ? (
            <img 
              src={ad.image} 
              alt={ad.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Featured Badge */}
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900 mb-2">
            Rs {ad.price?.toLocaleString()}
          </div>

          {/* Title */}
          <h3 className="text-base font-normal text-gray-800 mb-2 line-clamp-2 h-12">
            {ad.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {ad.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="uppercase">{ad.category}</span>
            </div>
            <div className="text-xs text-gray-400">
              {new Date(ad.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Posted By */}
          {ad.postedBy && (
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {ad.postedBy}
            </div>
          )}
        </div>

        {/* Hover Effect Border */}
        <div className="h-1 bg-gradient-to-r from-[#23e5db] to-[#002f34] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </Link>
  )
}
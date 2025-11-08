"use client"
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '')

  const doSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const q = searchTerm?.trim()
    const category = searchParams?.get('category') || 'All'
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }

  return (
    <nav className="bg-[#002f34] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white px-3 py-1 rounded">
              <span className="text-2xl font-bold text-[#002f34]">OLX</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={doSearch} className="hidden md:flex flex-1 mx-8 max-w-2xl">
            <input 
              type="text" 
              placeholder="Find Cars, Mobile Phones and more..." 
              className="w-full px-4 py-2 rounded-l border-2 border-[#002f34] focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-[#002f34] text-white px-6 py-2 rounded-r border-2 border-[#002f34] hover:bg-[#003d44]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-3">
            {!session && (
              <>
                <button onClick={() => signIn()} className="text-white font-semibold hover:text-[#23e5db] transition">
                  Login
                </button>
              </>
            )}

            {session && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setOpen(!open)} 
                    className="flex items-center gap-2 text-white hover:text-[#23e5db] transition"
                  >
                    <img 
                      src={session.user?.image || '/favicon.ico'} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border-2 border-white" 
                    />
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-xl py-2">
                      <div className="px-4 py-2 border-b">
                        <div className="font-semibold text-gray-800">{session.user?.name}</div>
                        <div className="text-sm text-gray-500">{session.user?.email}</div>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                        My Ads
                      </Link>
                      <button 
                        onClick={() => signOut()} 
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Categories */}
        <div className="hidden md:flex items-center gap-6 text-white text-sm pt-2 border-t border-[#003d44]">
          <Link href="/?category=All" className="hover:text-[#23e5db] transition">ALL CATEGORIES</Link>
          <Link href="/?category=Cars" className="hover:text-[#23e5db] transition">Cars</Link>
          <Link href="/?category=Mobiles" className="hover:text-[#23e5db] transition">Mobiles</Link>
          <Link href="/?category=Electronics" className="hover:text-[#23e5db] transition">Electronics</Link>
          <Link href="/?category=Furniture" className="hover:text-[#23e5db] transition">Furniture</Link>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <form onSubmit={doSearch}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full px-4 py-2 rounded border-2 border-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>
    </nav>
  )
}
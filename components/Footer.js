import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto p-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
        <div className="mb-4 md:mb-0">
          <strong className="text-gray-800">AdvertEase</strong>
          <div>Classified ads platform • Built with Next.js & MongoDB</div>
        </div>
        <div className="mt-4 md:mt-0 text-xs text-gray-500">© {new Date().getFullYear()} AdvertEase. All rights reserved.</div>
      </div>
    </footer>
  )
}

"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdForm({ initial = {}, onSuccess, redirectPath }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    category: initial.category || 'Mobiles',
    price: initial.price || 0,
    image: initial.image || ''
  })
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const data = new FormData()
    data.append('file', file)
    setLoading(true)
    setUploadError('')
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) {
        console.error('Upload error', json)
        setUploadError(json.error || 'Upload failed')
        if ((json.error || '').toLowerCase().includes('cloudinary')) setShowUrlInput(true)
        throw new Error(json.error || 'Upload failed')
      }
      if (json.url) setForm({ ...form, image: json.url })
      else {
        setUploadError('Upload returned no URL')
        throw new Error('Upload returned no URL')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const method = initial._id ? 'PUT' : 'POST'
      const url = initial._id ? `/api/ads/${initial._id}` : '/api/ads'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      if (typeof onSuccess === 'function') {
        onSuccess(data)
      } else if (redirectPath) {
        router.push(redirectPath)
      }
    } catch (err) {
      console.error(err)
      alert('Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002f34] to-[#003d44] text-white rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            {initial._id ? 'Edit Your Ad' : 'Post Your Ad'}
          </h1>
          <p className="text-gray-200">
            {initial._id ? 'Update the details below' : 'Fill in the details to sell your item'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ad Title *
              </label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#23e5db] focus:outline-none transition"
                placeholder="e.g. iPhone 13 Pro Max 256GB"
                required 
              />
              <p className="text-xs text-gray-500 mt-1">Mention the key features (e.g. brand, model, age)</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#23e5db] focus:outline-none transition appearance-none bg-white"
                >
                  <option>Cars</option>
                  <option>Mobiles</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                </select>
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Set a Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  Rs
                </span>
                <input 
                  name="price" 
                  type="number" 
                  value={form.price} 
                  onChange={handleChange} 
                  className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#23e5db] focus:outline-none transition"
                  placeholder="0"
                  required 
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#23e5db] focus:outline-none transition resize-none"
                rows={6}
                placeholder="Include condition, features and reason for selling"
                required 
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.description.length}/4096 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photos
              </label>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#23e5db] transition">
                <input 
                  type="file" 
                  onChange={handleFile} 
                  accept="image/*" 
                  id="file-upload"
                  className="hidden" 
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="text-[#002f34] font-semibold">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                </label>
              </div>

              {/* Upload Error */}
              {uploadError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-red-800">Upload Failed</div>
                    <div className="text-sm text-red-600">{uploadError}</div>
                  </div>
                </div>
              )}

              {/* URL Input Fallback */}
              {showUrlInput && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste image URL
                  </label>
                  <input 
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#23e5db] focus:outline-none transition"
                    value={form.image} 
                    onChange={(e)=>setForm({...form,image:e.target.value})} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              )}

              {/* Image Preview */}
              {form.image && (
                <div className="mt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Preview</div>
                  <div className="relative inline-block">
                    <img 
                      src={form.image} 
                      alt="preview" 
                      className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200" 
                    />
                    <button
                      type="button"
                      onClick={() => setForm({...form, image: ''})}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-[#002f34] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#003d44] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  {initial._id ? 'Updating...' : 'Posting...'}
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {initial._id ? 'Update Ad' : 'Post Ad'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="font-semibold text-blue-900 mb-1">Tips for a great ad</div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a clear, well-lit photo</li>
                <li>• Write an accurate description</li>
                <li>• Set a reasonable price</li>
                <li>• Respond quickly to buyers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"
import AdForm from '../../../components/AdForm'

export default function CreatePage() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Create Ad</h2>
      <AdForm redirectPath={'/dashboard'} />
    </div>
  )
}

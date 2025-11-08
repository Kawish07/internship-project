"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/signin')
    else alert('Signup failed')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign up</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow">
        <label className="block mb-2">Name
          <input className="input" name="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        </label>
        <label className="block mb-2">Email
          <input className="input" name="email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        </label>
        <label className="block mb-2">Password
          <input className="input" name="password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        </label>
        <div className="mt-3"><button className="btn" type="submit">Sign up</button></div>
      </form>
    </div>
  )
}

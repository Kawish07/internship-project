"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SigninPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const router = useRouter()

  const submit = async (e) => {
    e.preventDefault()
    const res = await signIn('credentials', { redirect: false, email: form.email, password: form.password, callbackUrl: '/dashboard' })
    if (res?.ok) router.push('/dashboard')
    else alert('Sign in failed')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign in</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow">
        <label className="block mb-2">Email
          <input className="input" name="email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        </label>
        <label className="block mb-2">Password
          <input className="input" name="password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        </label>
        <div className="mt-3 flex gap-2">
          <button className="btn" type="submit">Sign in</button>
          <button type="button" className="btn" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>Sign in with Google</button>
        </div>
      </form>
      <div className="mt-4 text-sm text-center">
        <p>First time here? <a href="/signup" className="text-blue-600 hover:underline">Create an account</a> or use the button above to sign in with Google.</p>
      </div>
    </div>
  )
}

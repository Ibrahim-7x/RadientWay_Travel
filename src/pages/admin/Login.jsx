import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, Lock, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button, Field, TextInput } from '../../components/admin/ui'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/admin'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-gradient opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold-gradient opacity-10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-card-hover"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient text-white shadow-gold">
            <Plane className="h-7 w-7" />
          </span>
          <h1 className="font-display text-2xl font-bold text-navy-950">RadiantWay Admin</h1>
          <p className="mt-1 text-sm text-navy-500">Sign in to manage your travel content</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <TextInput
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@radiantwaytravel.com"
                className="pl-9"
              />
            </div>
          </Field>
          <Field label="Password">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <TextInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
            </div>
          </Field>
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

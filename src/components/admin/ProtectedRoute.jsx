import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from './ui'

// Gate for /admin routes. Redirects to login when unauthenticated.
export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Spinner />
      </div>
    )
  }
  if (!isAuthed) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return children
}

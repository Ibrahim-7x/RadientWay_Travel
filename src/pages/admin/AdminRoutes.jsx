import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../../components/admin/ProtectedRoute'
import AdminShell from '../../components/admin/AdminShell'
import Login from './Login'
import Dashboard from './Dashboard'
import ResourceList from './ResourceList'
import ResourceForm from './ResourceForm'
import Bookings from './Bookings'
import Leads from './Leads'
import Subscribers from './Subscribers'
import SettingsPage from './SettingsPage'
import { resources } from './resourceConfig'

// All /admin/* routes. Rendered outside the public site's Navbar/Footer.
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {Object.values(resources).map((cfg) => (
          <Route key={cfg.path}>
            <Route path={cfg.path} element={<ResourceList config={cfg} />} />
            <Route path={`${cfg.path}/:id`} element={<ResourceForm config={cfg} />} />
          </Route>
        ))}
        <Route path="bookings" element={<Bookings />} />
        <Route path="leads" element={<Leads />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

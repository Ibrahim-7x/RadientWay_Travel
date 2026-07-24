import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, MapPin, StampIcon, Quote, HelpCircle,
  LayoutGrid, CalendarCheck, Mail, Users, Settings, LogOut, Menu, X, Plane,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { section: 'Content' },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/visas', label: 'Visa Services', icon: StampIcon },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/services', label: 'Services', icon: LayoutGrid },
  { section: 'Leads' },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/leads', label: 'Messages', icon: Mail },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { section: 'System' },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-navy-50/40 text-navy-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 text-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient text-white">
            <Plane className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">RadiantWay</p>
            <p className="text-[11px] text-navy-300">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2 no-scrollbar">
          {nav.map((item, i) =>
            item.section ? (
              <p key={`s-${i}`} className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-navy-400">
                {item.section}
              </p>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-gradient text-white shadow-gold'
                      : 'text-navy-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 px-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-[11px] text-navy-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-950/5 bg-white/80 px-5 py-3.5 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 text-navy-700 hover:bg-navy-100">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display font-bold text-navy-950">RadiantWay Admin</span>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

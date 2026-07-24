import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, MapPin, StampIcon, CalendarCheck, Mail, Users, Quote, HelpCircle, ArrowUpRight,
} from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Spinner, Card, Badge } from '../../components/admin/ui'

const statCards = [
  { key: 'packages', label: 'Packages', icon: Package, to: '/admin/packages', accent: 'bg-gold-gradient' },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck, to: '/admin/bookings', accent: 'bg-navy-950', badge: 'newBookings' },
  { key: 'leads', label: 'Messages', icon: Mail, to: '/admin/leads', accent: 'bg-blue-600', badge: 'newLeads' },
  { key: 'destinations', label: 'Destinations', icon: MapPin, to: '/admin/destinations', accent: 'bg-emerald-600' },
  { key: 'visas', label: 'Visa Services', icon: StampIcon, to: '/admin/visas', accent: 'bg-purple-600' },
  { key: 'subscribers', label: 'Subscribers', icon: Users, to: '/admin/subscribers', accent: 'bg-amber-600' },
  { key: 'testimonials', label: 'Testimonials', icon: Quote, to: '/admin/testimonials', accent: 'bg-pink-600' },
  { key: 'faqs', label: 'FAQs', icon: HelpCircle, to: '/admin/faqs', accent: 'bg-teal-600' },
]

export default function Dashboard() {
  const toast = useToast()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        setData(await api.get('/admin/dashboard'))
      } catch (e) {
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [toast])

  if (loading) return <Spinner />
  if (!data) return null

  const { counts, recentBookings, recentLeads } = data

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your travel business at a glance." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {statCards.map((c) => {
          const badgeCount = c.badge ? counts[c.badge] : 0
          return (
            <Link
              key={c.key}
              to={c.to}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-navy-950/5 transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.accent}`}>
                  <c.icon className="h-5 w-5" />
                </span>
                {badgeCount > 0 && <Badge tone="new">{badgeCount} new</Badge>}
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-navy-950">{counts[c.key] ?? 0}</p>
              <p className="text-sm text-navy-500">{c.label}</p>
              <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-navy-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-950">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              View all
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-400">No bookings yet.</p>
          ) : (
            <ul className="divide-y divide-navy-950/5">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">{b.name}</p>
                    <p className="truncate text-xs text-navy-400">{b.packageName || 'Custom enquiry'}</p>
                  </div>
                  <Badge tone={b.status}>{b.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-950">Recent messages</h2>
            <Link to="/admin/leads" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              View all
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-400">No messages yet.</p>
          ) : (
            <ul className="divide-y divide-navy-950/5">
              {recentLeads.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">{l.name}</p>
                    <p className="truncate text-xs text-navy-400">{l.message}</p>
                  </div>
                  <Badge tone={l.status}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}

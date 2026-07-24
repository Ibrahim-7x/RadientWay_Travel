import { useEffect, useState, useCallback } from 'react'
import { Trash2, Phone, Mail } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Select, Badge } from '../../components/admin/ui'
import DataTable from '../../components/admin/DataTable'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled']
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function Bookings() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [target, setTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = filter ? `?status=${filter}` : ''
      setRows(await api.get(`/admin/bookings${qs}`))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [filter, toast])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}`, { status })
      toast.success('Status updated')
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.del(`/admin/bookings/${target.id}`)
      toast.success('Booking deleted')
      setTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Traveller',
      render: (r) => (
        <div>
          <p className="font-semibold text-navy-900">{r.name}</p>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-navy-400">
            <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-gold-600"><Mail className="h-3 w-3" />{r.email}</a>
            <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-gold-600"><Phone className="h-3 w-3" />{r.phone}</a>
          </div>
        </div>
      ),
    },
    { key: 'packageName', label: 'Package', render: (r) => r.packageName || <span className="text-navy-400">Custom</span> },
    {
      key: 'trip',
      label: 'Trip',
      render: (r) => (
        <span className="text-xs text-navy-500">
          {r.travellers} pax · {r.occupancy || '—'}<br />{r.date || 'Flexible'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Received', render: (r) => fmtDate(r.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="w-36 py-1.5 text-xs">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </Select>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Booking requests submitted from the site."
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No bookings yet"
        emptySubtitle="Booking requests from the Book Now page will appear here."
        actions={(row) => (
          <button
            onClick={() => setTarget(row)}
            className="rounded-lg p-2 text-navy-500 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      />
      <ConfirmDialog
        open={!!target}
        title="Delete this booking?"
        message={`The booking request from ${target?.name} will be permanently removed.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  )
}

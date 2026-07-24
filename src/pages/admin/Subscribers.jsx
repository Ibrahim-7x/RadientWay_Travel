import { useEffect, useState, useCallback } from 'react'
import { Trash2, Mail, Download } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Button } from '../../components/admin/ui'
import DataTable from '../../components/admin/DataTable'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function Subscribers() {
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setRows(await api.get('/admin/subscribers'))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.del(`/admin/subscribers/${target.id}`)
      toast.success('Subscriber removed')
      setTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  const exportCsv = () => {
    const csv = ['email,subscribed_at', ...rows.map((r) => `${r.email},${r.createdAt}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'email', label: 'Email', render: (r) => (
      <span className="inline-flex items-center gap-2 font-medium text-navy-900">
        <Mail className="h-4 w-4 text-navy-400" />{r.email}
      </span>
    ) },
    { key: 'createdAt', label: 'Subscribed', render: (r) => fmtDate(r.createdAt) },
  ]

  return (
    <>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="People who signed up for updates."
        actions={rows.length > 0 && (
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        )}
      />
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No subscribers yet"
        emptySubtitle="Newsletter sign-ups will appear here."
        actions={(row) => (
          <button
            onClick={() => setTarget(row)}
            className="rounded-lg p-2 text-navy-500 hover:bg-red-50 hover:text-red-600"
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      />
      <ConfirmDialog
        open={!!target}
        title="Remove this subscriber?"
        message={`${target?.email} will be removed from the list.`}
        confirmLabel="Remove"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  )
}

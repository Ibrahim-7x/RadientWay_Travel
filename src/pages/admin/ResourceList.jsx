import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Button } from '../../components/admin/ui'
import DataTable from '../../components/admin/DataTable'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

// Generic list page driven by a resource config.
export default function ResourceList({ config }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [target, setTarget] = useState(null) // row pending deletion
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setRows(await api.get(`/admin/${config.path}`))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [config.path, toast])

  useEffect(() => {
    load()
  }, [load])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.del(`/admin/${config.path}/${target.id}`)
      toast.success(`${config.singular} deleted`)
      setTarget(null)
      load()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <Button onClick={() => navigate(`/admin/${config.path}/new`)}>
            <Plus className="h-4 w-4" /> New {config.singular}
          </Button>
        }
      />

      <DataTable
        columns={config.columns}
        rows={rows}
        loading={loading}
        emptyTitle={`No ${config.title.toLowerCase()} yet`}
        emptySubtitle={`Create your first ${config.singular.toLowerCase()} to get started.`}
        emptyAction={
          <Button onClick={() => navigate(`/admin/${config.path}/new`)}>
            <Plus className="h-4 w-4" /> New {config.singular}
          </Button>
        }
        actions={(row) => (
          <>
            <button
              onClick={() => navigate(`/admin/${config.path}/${row.id}`)}
              className="rounded-lg p-2 text-navy-500 hover:bg-navy-100 hover:text-navy-900"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTarget(row)}
              className="rounded-lg p-2 text-navy-500 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!target}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        message={`“${target?.name || target?.title || target?.question || target?.country}” will be permanently removed. This cannot be undone.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  )
}

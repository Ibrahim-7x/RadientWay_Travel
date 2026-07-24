import { Spinner, EmptyState } from './ui'
import { Inbox } from 'lucide-react'

// Generic table.
// columns: [{ key, label, render?(row), className? }]
// rows: array of records. `actions` renders trailing action cell per row.
export default function DataTable({
  columns,
  rows,
  loading,
  actions,
  emptyTitle = 'Nothing here yet',
  emptySubtitle,
  emptyAction,
  rowKey = (r) => r.id,
}) {
  if (loading) return <Spinner />
  if (!rows?.length)
    return (
      <EmptyState icon={Inbox} title={emptyTitle} subtitle={emptySubtitle} action={emptyAction} />
    )

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-navy-950/5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-950/5 text-xs uppercase tracking-wide text-navy-400">
            {columns.map((c) => (
              <th key={c.key} className={`px-5 py-3.5 font-semibold ${c.className || ''}`}>
                {c.label}
              </th>
            ))}
            {actions && <th className="px-5 py-3.5 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-950/5">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-navy-50/40">
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-3.5 text-navy-700 ${c.cellClassName || ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && (
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

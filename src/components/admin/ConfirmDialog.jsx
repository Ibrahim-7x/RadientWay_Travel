import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui'

// Controlled confirmation modal. Pass `open`, `onConfirm`, `onCancel`.
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-hover"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-navy-950">{title}</h3>
                {message && <p className="mt-1 text-sm text-navy-500">{message}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={onCancel} type="button">
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm} loading={loading} type="button">
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

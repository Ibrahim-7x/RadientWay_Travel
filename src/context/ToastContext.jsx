import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)
let idSeq = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = idSeq++
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className={`flex items-start gap-3 rounded-2xl p-4 text-sm shadow-card-hover ring-1 ${
                t.type === 'error'
                  ? 'bg-red-50 text-red-800 ring-red-200'
                  : 'bg-white text-navy-800 ring-navy-950/10'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              )}
              <span className="flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-navy-400 hover:text-navy-700">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

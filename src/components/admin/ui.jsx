import { Loader2 } from 'lucide-react'

// ── Buttons ──────────────────────────────────────────────────────────────────
export function Button({ variant = 'primary', className = '', loading, children, ...props }) {
  const styles = {
    primary: 'bg-gold-gradient text-white shadow-gold hover:-translate-y-0.5 hover:shadow-gold-lg',
    dark: 'bg-navy-950 text-white hover:bg-navy-800',
    ghost: 'bg-transparent text-navy-600 hover:bg-navy-100',
    outline: 'border border-navy-950/15 bg-white text-navy-800 hover:border-gold-400 hover:text-gold-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

// ── Form field wrapper ───────────────────────────────────────────────────────
export function Field({ label, hint, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-navy-700">
          {label}
          {required && <span className="text-gold-600">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-navy-400">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-navy-950/10 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-200'

export function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputCls} resize-y ${props.className || ''}`} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputCls} ${props.className || ''}`}>
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-gold-500' : 'bg-navy-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </span>
      {label && <span className="text-sm font-medium text-navy-700">{label}</span>}
    </button>
  )
}

// ── Misc ─────────────────────────────────────────────────────────────────────
export function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-950">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-navy-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 ${className}`}>
      {children}
    </div>
  )
}

const badgeColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  read: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  replied: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  archived: 'bg-navy-100 text-navy-500',
  published: 'bg-green-100 text-green-700',
  draft: 'bg-navy-100 text-navy-500',
}

export function Badge({ children, tone }) {
  const cls = badgeColors[tone] || 'bg-navy-100 text-navy-600'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {children}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-navy-950/10 py-16 text-center">
      {Icon && <Icon className="mb-3 h-10 w-10 text-navy-300" />}
      <p className="font-semibold text-navy-800">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-navy-400">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

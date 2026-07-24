import { useRef, useState } from 'react'
import { Upload, Link2, ImageOff } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { TextInput } from './ui'

// Image field: paste a URL OR upload a file (stored on the server).
// `value` is the image URL string; `onChange` receives the new URL.
export default function ImageInput({ value = '', onChange }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { url } = await api.upload('/admin/upload', fd)
      onChange(url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex gap-4">
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-navy-50 ring-1 ring-navy-950/10">
        {value ? (
          <img
            src={value}
            alt="preview"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-300">
            <ImageOff className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="relative">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <TextInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className="pl-9"
          />
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-navy-950/15 bg-white px-3 py-2 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-700 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Upload file'}
          </button>
        </div>
      </div>
    </div>
  )
}

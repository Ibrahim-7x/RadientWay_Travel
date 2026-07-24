import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Button, Field, TextInput, TextArea, Select, Toggle, Spinner } from '../../components/admin/ui'
import ArrayInput from '../../components/admin/ArrayInput'
import ImageInput from '../../components/admin/ImageInput'
import ItineraryEditor from '../../components/admin/ItineraryEditor'

// Generic create/edit form driven by a resource config.
export default function ResourceForm({ config }) {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(config.defaults)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isNew) return
    let alive = true
    ;(async () => {
      try {
        const data = await api.get(`/admin/${config.path}/${id}`)
        if (alive) setForm({ ...config.defaults, ...data })
      } catch (e) {
        toast.error(e.message)
        navigate(`/admin/${config.path}`)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isNew) {
        await api.post(`/admin/${config.path}`, form)
      } else {
        await api.put(`/admin/${config.path}/${id}`, form)
      }
      toast.success(`${config.singular} ${isNew ? 'created' : 'saved'}`)
      navigate(`/admin/${config.path}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={`${isNew ? 'New' : 'Edit'} ${config.singular}`}
        actions={
          <>
            <Button variant="ghost" type="button" onClick={() => navigate(`/admin/${config.path}`)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" /> Save
            </Button>
          </>
        }
      />

      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
              <FieldControl field={field} value={form[field.name]} onChange={(v) => set(field.name, v)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => navigate(`/admin/${config.path}`)}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          <Save className="h-4 w-4" /> Save {config.singular}
        </Button>
      </div>
    </form>
  )
}

function FieldControl({ field, value, onChange }) {
  switch (field.type) {
    case 'toggle':
      return (
        <div className="pt-1">
          <Toggle checked={!!value} onChange={onChange} label={field.label} />
          {field.hint && <p className="mt-1 text-xs text-navy-400">{field.hint}</p>}
        </div>
      )
    case 'textarea':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <TextArea rows={field.rows || 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Field>
      )
    case 'number':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <TextInput
            type="number"
            step={field.step || 1}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </Field>
      )
    case 'select':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <Select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      )
    case 'image':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <ImageInput value={value ?? ''} onChange={onChange} />
        </Field>
      )
    case 'array':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <ArrayInput value={value ?? []} onChange={onChange} placeholder={field.placeholder} />
        </Field>
      )
    case 'itinerary':
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <ItineraryEditor value={value ?? []} onChange={onChange} />
        </Field>
      )
    default:
      return (
        <Field label={field.label} required={field.required} hint={field.hint}>
          <TextInput value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
        </Field>
      )
  }
}

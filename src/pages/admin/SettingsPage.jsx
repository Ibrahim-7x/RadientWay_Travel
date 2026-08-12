import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { PageHeader, Button, Field, TextInput, TextArea, Spinner, Card } from '../../components/admin/ui'

const socialIcons = ['Instagram', 'Facebook', 'MessageCircle', 'Globe']

export default function SettingsPage() {
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api.get('/admin/settings')
        setForm({ socials: [], ...data })
      } catch (e) {
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [toast])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setSocial = (i, k, v) =>
    setForm((f) => ({ ...f, socials: f.socials.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }))
  const addSocial = () => setForm((f) => ({ ...f, socials: [...(f.socials || []), { name: '', href: '', icon: 'Globe' }] }))
  const removeSocial = (i) => setForm((f) => ({ ...f, socials: f.socials.filter((_, idx) => idx !== i) }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', form)
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />
  if (!form) return null

  return (
    <form onSubmit={submit}>
      <PageHeader
        title="Company Settings"
        subtitle="Contact details and links used across the public site."
        actions={<Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save</Button>}
      />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-950">Identity</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Company name"><TextInput value={form.name || ''} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label="Short name"><TextInput value={form.shortName || ''} onChange={(e) => set('shortName', e.target.value)} /></Field>
            <Field label="Tagline" className="sm:col-span-2"><TextInput value={form.tagline || ''} onChange={(e) => set('tagline', e.target.value)} /></Field>
            <Field label="Intro" className="sm:col-span-2"><TextArea rows={3} value={form.intro || ''} onChange={(e) => set('intro', e.target.value)} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-display text-lg font-semibold text-navy-950">Contact</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Phone" hint="Main display number"><TextInput value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} /></Field>
            <Field label="Phone link" hint="e.g. tel:+971..."><TextInput value={form.phoneHref || ''} onChange={(e) => set('phoneHref', e.target.value)} /></Field>
            <Field label="Holidays & Tours number" hint="Listed in the navbar; also the Call button on destination cards"><TextInput value={form.holidaysPhone || ''} onChange={(e) => set('holidaysPhone', e.target.value)} placeholder="+971 ..." /></Field>
            <Field label="Visa Services number" hint="Listed in the navbar beside the Holidays number"><TextInput value={form.visaPhone || ''} onChange={(e) => set('visaPhone', e.target.value)} placeholder="+971 ..." /></Field>
            <Field label="Email"><TextInput value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></Field>
            <Field label="Email link" hint="e.g. mailto:info@..."><TextInput value={form.emailHref || ''} onChange={(e) => set('emailHref', e.target.value)} /></Field>
            <Field label="WhatsApp link" hint="Drives every WhatsApp Call button — e.g. https://wa.me/9715…"><TextInput value={form.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} /></Field>
            <Field label="Hours"><TextInput value={form.hours || ''} onChange={(e) => set('hours', e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><TextArea rows={2} value={form.address || ''} onChange={(e) => set('address', e.target.value)} /></Field>
            <Field label="Review URL"><TextInput value={form.reviewUrl || ''} onChange={(e) => set('reviewUrl', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Rating"><TextInput type="number" step="0.1" value={form.rating ?? ''} onChange={(e) => set('rating', Number(e.target.value))} /></Field>
              <Field label="Review count"><TextInput type="number" value={form.reviewCount ?? ''} onChange={(e) => set('reviewCount', Number(e.target.value))} /></Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-950">Social links</h2>
            <Button type="button" variant="outline" onClick={addSocial}><Plus className="h-4 w-4" /> Add</Button>
          </div>
          <div className="space-y-3">
            {(form.socials || []).map((s, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 rounded-xl bg-navy-50/50 p-3 sm:grid-cols-[1fr_2fr_1fr_auto]">
                <TextInput value={s.name || ''} onChange={(e) => setSocial(i, 'name', e.target.value)} placeholder="Name" />
                <TextInput value={s.href || ''} onChange={(e) => setSocial(i, 'href', e.target.value)} placeholder="https://…" />
                <select
                  value={s.icon || 'Globe'}
                  onChange={(e) => setSocial(i, 'icon', e.target.value)}
                  className="rounded-xl border border-navy-950/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400"
                >
                  {socialIcons.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <button type="button" onClick={() => removeSocial(i)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(form.socials || []).length === 0 && <p className="text-sm text-navy-400">No social links yet.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" loading={saving}><Save className="h-4 w-4" /> Save settings</Button>
      </div>
    </form>
  )
}

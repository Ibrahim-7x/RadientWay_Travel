import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import { getIcon } from '../lib/icons'
import { img } from '../data/packages'
import { api } from '../lib/api'
import { useToast } from '../context/ToastContext'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'
import { useContent } from '../context/ContentContext'

const contactItems = [
  { icon: Phone, label: 'Call us', value: company.phone, href: company.phoneHref },
  { icon: Mail, label: 'Email us', value: company.email, href: company.emailHref },
  { icon: MapPin, label: 'Visit us', value: company.address },
  { icon: Clock, label: 'Hours', value: company.hours },
]

export default function Contact() {
  const { company } = useContent()
  const toast = useToast()
  const [params] = useSearchParams()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  // Tour/Umrah pages link here with ?enquiry=<package name> so the message
  // arrives already saying what the traveller is asking about.
  const enquiry = params.get('enquiry')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: enquiry ? `I'd like to enquire about: ${enquiry}\n\n` : '',
  })

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.post('/contact', form, { auth: false })
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      toast.error(err.message || 'Could not send your message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHero
        title="Get in Touch"
        subtitle="Questions, custom trips or a quick hello — we'd love to hear from you."
        image={img('1488085061387-422e29b40080', 1920)}
        crumb="Contact"
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Info + socials */}
          <div>
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-4 sm:grid-cols-2"
            >
              {contactItems.map((c) => (
                <motion.a
                  key={c.label}
                  variants={fadeUp}
                  href={c.href || undefined}
                  className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-950/5 transition-shadow hover:shadow-card-hover"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-gradient text-gold-400">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs uppercase tracking-wide text-navy-400">{c.label}</span>
                  <span className="text-sm font-medium text-navy-900">{c.value}</span>
                </motion.a>
              ))}
            </motion.div>

            <div className="mt-6 flex gap-3">
              {(company.socials || []).map((s) => {
                const Icon = getIcon(s.icon)
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 text-white transition-colors hover:bg-gold-500 hover:text-navy-950"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-3xl shadow-card ring-1 ring-navy-950/5">
              <iframe
                title="RadiantWay Travel location"
                src="https://www.google.com/maps?q=Aspin+Commercial+Tower+Sheikh+Zayed+Road+Dubai&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            onSubmit={submit}
            className="rounded-3xl bg-white p-8 shadow-card-hover ring-1 ring-navy-950/5"
          >
            <h2 className="font-display text-2xl font-semibold text-navy-950">Send us a message</h2>
            <p className="mt-1 text-sm text-navy-500">We usually reply within a few hours.</p>

            <div className="mt-6 grid gap-5">
              <Field label="Full name" value={form.name} onChange={update('name')} placeholder="Your name" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" required />
                <Field label="Phone" value={form.phone} onChange={update('phone')} placeholder="+971 ..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-700">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your dream trip..."
                  className="w-full resize-none rounded-2xl border border-navy-950/10 bg-cream px-4 py-3 text-sm text-navy-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />
              </div>
              <button type="submit" disabled={sending} className="btn-gold w-full disabled:opacity-60">
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : sent ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? 'Sending…' : sent ? 'Message sent — thank you!' : 'Send message'}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </>
  )
}

function Field({ label, type = 'text', ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-700">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded-2xl border border-navy-950/10 bg-cream px-4 py-3 text-sm text-navy-900 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
      />
    </div>
  )
}

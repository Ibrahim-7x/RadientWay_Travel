import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, PartyPopper } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import { packages, img } from '../data/packages'
import { company } from '../data/company'

const steps = ['Destination', 'Trip details', 'Your info', 'Done']

export default function BookNow() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    pkg: '',
    date: '',
    travellers: 2,
    occupancy: 'Quad sharing',
    name: '',
    email: '',
    phone: '',
  })

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }))
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const canProceed =
    (step === 0 && data.pkg) ||
    (step === 1 && data.date) ||
    (step === 2 && data.name && data.email && data.phone)

  return (
    <>
      <PageHero
        title="Book Your Journey"
        subtitle="A few quick details and our team will craft your perfect trip."
        image={img('1502920917128-1aa500764cbd', 1920)}
        crumb="Book Now"
      />

      <section className="py-16 sm:py-20">
        <div className="container-x max-w-3xl">
          {/* Progress */}
          <div className="mb-12 flex items-center justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 ${
                      i < step
                        ? 'bg-gold-gradient text-navy-950'
                        : i === step
                        ? 'bg-navy-950 text-gold-400 ring-4 ring-gold-200'
                        : 'bg-navy-100 text-navy-400'
                    }`}
                  >
                    {i < step ? <Check className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`hidden text-xs font-medium sm:block ${i <= step ? 'text-navy-900' : 'text-navy-400'}`}>
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded bg-navy-100">
                    <motion.div
                      className="h-full bg-gold-gradient"
                      initial={false}
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-card-hover ring-1 ring-navy-950/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy-950">Where to?</h2>
                    <p className="mt-1 text-sm text-navy-500">Pick a package to get started.</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {packages.map((p) => (
                        <button
                          key={p.slug}
                          onClick={() => set('pkg', p.slug)}
                          className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                            data.pkg === p.slug
                              ? 'border-gold-400 bg-gold-50'
                              : 'border-navy-950/10 hover:border-navy-300'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-navy-950">{p.name}</p>
                            <p className="text-xs text-navy-500">{p.city} · from {p.currency} {p.price.toLocaleString()}</p>
                          </div>
                          {data.pkg === p.slug && <Check className="h-5 w-5 text-gold-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy-950">Trip details</h2>
                    <p className="mt-1 text-sm text-navy-500">When and how many are travelling?</p>
                    <div className="mt-6 grid gap-5">
                      <Labeled label="Preferred start date">
                        <input
                          type="date"
                          value={data.date}
                          onChange={(e) => set('date', e.target.value)}
                          className="input"
                        />
                      </Labeled>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Labeled label="Travellers">
                          <input
                            type="number"
                            min="1"
                            value={data.travellers}
                            onChange={(e) => set('travellers', e.target.value)}
                            className="input"
                          />
                        </Labeled>
                        <Labeled label="Occupancy">
                          <select value={data.occupancy} onChange={(e) => set('occupancy', e.target.value)} className="input">
                            <option>Quad sharing</option>
                            <option>Triple sharing</option>
                            <option>Twin sharing</option>
                            <option>Single</option>
                          </select>
                        </Labeled>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy-950">Your details</h2>
                    <p className="mt-1 text-sm text-navy-500">So we can send your tailored quote.</p>
                    <div className="mt-6 grid gap-5">
                      <Labeled label="Full name">
                        <input value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" className="input" />
                      </Labeled>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Labeled label="Email">
                          <input type="email" value={data.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" className="input" />
                        </Labeled>
                        <Labeled label="Phone">
                          <input value={data.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+971 ..." className="input" />
                        </Labeled>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-gradient text-navy-950"
                    >
                      <PartyPopper className="h-10 w-10" />
                    </motion.div>
                    <h2 className="mt-6 font-display text-3xl font-semibold text-navy-950">Request received!</h2>
                    <p className="mx-auto mt-3 max-w-md text-navy-500">
                      Thank you, {data.name || 'traveller'}. Our team will reach out within a few hours
                      with your tailored quote. For anything urgent, message us on WhatsApp.
                    </p>
                    <a href={company.whatsapp} className="btn-gold mt-7 inline-flex">
                      Chat on WhatsApp
                    </a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            {step < 3 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="flex items-center gap-2 text-sm font-semibold text-navy-500 disabled:opacity-0"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!canProceed}
                  className="btn-gold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === 2 ? 'Submit request' : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-700">{label}</span>
      {children}
    </label>
  )
}

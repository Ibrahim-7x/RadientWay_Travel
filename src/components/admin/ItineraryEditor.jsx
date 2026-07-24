import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { TextInput, TextArea, Button } from './ui'

// Edits a day-by-day itinerary: [{ day, title, detail }].
export default function ItineraryEditor({ value = [], onChange }) {
  const update = (i, key, val) => {
    const next = value.map((d, idx) => (idx === i ? { ...d, [key]: val } : d))
    onChange(next)
  }

  const add = () => {
    const nextDay = value.length ? Math.max(...value.map((d) => Number(d.day) || 0)) + 1 : 1
    onChange([...value, { day: nextDay, title: '', detail: '' }])
  }

  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i))

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {value.map((day, i) => (
        <div key={i} className="rounded-xl border border-navy-950/10 bg-navy-50/50 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="w-20">
              <TextInput
                type="number"
                value={day.day ?? ''}
                onChange={(e) => update(i, 'day', Number(e.target.value))}
                placeholder="Day"
              />
            </div>
            <TextInput
              value={day.title || ''}
              onChange={(e) => update(i, 'title', e.target.value)}
              placeholder="Day title (e.g. Arrival in Yerevan)"
            />
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100" title="Move up">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded-lg p-1.5 text-navy-400 hover:bg-navy-100" title="Move down">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => removeAt(i)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" title="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <TextArea
            rows={2}
            value={day.detail || ''}
            onChange={(e) => update(i, 'detail', e.target.value)}
            placeholder="What happens on this day…"
          />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={add}>
        <Plus className="h-4 w-4" /> Add day
      </Button>
    </div>
  )
}

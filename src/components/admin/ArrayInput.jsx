import { useState } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import { TextInput, Button } from './ui'

// Edits a list of strings (tags, includes, highlights, document lists…).
// `value` is a string[]; `onChange` receives the new array.
export default function ArrayInput({ value = [], onChange, placeholder = 'Add an item…' }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (!v) return
    onChange([...value, v])
    setDraft('')
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
    <div>
      <ul className="mb-2 space-y-2">
        {value.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center gap-2 rounded-xl bg-navy-50 px-3 py-2 text-sm text-navy-800"
          >
            <button
              type="button"
              onClick={() => move(i, -1)}
              className="cursor-pointer text-navy-300 hover:text-navy-600"
              title="Move up"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <span className="flex-1">{item}</span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="text-navy-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  )
}

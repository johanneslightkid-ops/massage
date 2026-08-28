import { useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import type { Field } from '@shared/schema'
import { cn } from '@/lib/utils'

const inputBase =
  'w-full rounded-2xl border border-ocean-900/12 bg-white px-4 py-3 text-[0.92rem] text-ocean-900 placeholder:text-ocean-800/35 transition-colors focus:border-lagoon-400 focus:outline-none'

/* -------------------------------------------------------------- list of strings */

function ListEditor({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [draft, setDraft] = useState('')

  function add() {
    const clean = draft.trim()
    if (!clean) return
    onChange([...value, clean])
    setDraft('')
  }

  return (
    <div>
      <ul className="mb-2.5 flex flex-wrap gap-2">
        {value.map((entry, index) => (
          <li
            key={`${entry}-${index}`}
            className="inline-flex items-center gap-2 rounded-full bg-sand-100 py-1.5 pr-2 pl-3.5 text-[0.82rem] font-medium text-ocean-800"
          >
            {entry}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove ${entry}`}
              className="grid size-5 place-items-center rounded-full text-ocean-800/45 hover:bg-ocean-900/10 hover:text-ocean-900"
            >
              <X className="size-3" />
            </button>
          </li>
        ))}
        {value.length === 0 && <li className="text-[0.82rem] text-ocean-800/40">Nothing added yet.</li>}
      </ul>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          placeholder="Type and press Enter"
          className={inputBase}
        />
        <button
          type="button"
          onClick={add}
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ocean-900 text-sand-50 transition-colors hover:bg-ocean-800"
          aria-label="Add item"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- durations */

interface DurationRow {
  minutes: number
  price: number
}

function DurationEditor({ value, onChange }: { value: DurationRow[]; onChange: (next: DurationRow[]) => void }) {
  const rows = Array.isArray(value) ? value : []

  function update(index: number, patch: Partial<DurationRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minutes</span>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={row.minutes}
                onChange={(event) => update(index, { minutes: Number(event.target.value) })}
                className={cn(inputBase, 'pr-14')}
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[0.78rem] text-ocean-800/45">
                min
              </span>
            </div>
          </label>
          <label className="flex-1">
            <span className="sr-only">Price</span>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[0.85rem] text-ocean-800/45">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={row.price}
                onChange={(event) => update(index, { price: Number(event.target.value) })}
                className={cn(inputBase, 'pl-8')}
              />
            </div>
          </label>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            aria-label="Remove duration"
            className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ocean-900/12 text-ocean-800/50 hover:border-coral-400 hover:text-coral-500"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { minutes: 60, price: 50 }])}
        className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-[0.82rem] font-semibold text-ocean-800 transition-colors hover:bg-sand-200"
      >
        <Plus className="size-3.5" />
        Add a length
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ pairs */

interface PairRow {
  label: string
  value: string
}

function PairEditor({ value, onChange }: { value: PairRow[]; onChange: (next: PairRow[]) => void }) {
  const rows = Array.isArray(value) ? value : []

  function update(index: number, patch: Partial<PairRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={row.label}
            onChange={(event) => update(index, { label: event.target.value })}
            placeholder="Monday – Saturday"
            className={inputBase}
          />
          <input
            value={row.value}
            onChange={(event) => update(index, { value: event.target.value })}
            placeholder="9:00 – 21:00"
            className={inputBase}
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            aria-label="Remove row"
            className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ocean-900/12 text-ocean-800/50 hover:border-coral-400 hover:text-coral-500"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { label: '', value: '' }])}
        className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-[0.82rem] font-semibold text-ocean-800 transition-colors hover:bg-sand-200"
      >
        <Plus className="size-3.5" />
        Add a row
      </button>
    </div>
  )
}

/* ----------------------------------------------------------------- switch */

function Switch({ value, onChange, label }: { value: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="inline-flex items-center gap-3"
    >
      <span
        className={cn(
          'relative h-7 w-12 rounded-full transition-colors duration-300',
          value ? 'bg-lagoon-500' : 'bg-ocean-900/15',
        )}
      >
        <span
          className={cn(
            'absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-300',
            value ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </span>
      <span className="text-[0.9rem] font-medium text-ocean-800">{value ? 'On' : 'Off'}</span>
      <span className="sr-only">{label}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ entry */

async function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_SIZE = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width)
            width = MAX_SIZE
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height)
            height = MAX_SIZE
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('No canvas context'))
        
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/webp', 0.8))
      }
      img.onerror = () => reject(new Error('Image load failed'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field
  value: unknown
  onChange: (next: unknown) => void
}) {
  const control = (() => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={String(value ?? '')}
            rows={field.rows ?? 3}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputBase}
          />
        )

      case 'number':
      case 'money':
        return (
          <div className="relative">
            {field.type === 'money' && (
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[0.85rem] text-ocean-800/45">
                $
              </span>
            )}
            <input
              type="number"
              inputMode="numeric"
              value={Number(value ?? 0)}
              placeholder={field.placeholder}
              onChange={(event) => onChange(Number(event.target.value))}
              className={cn(inputBase, field.type === 'money' && 'pl-8')}
            />
          </div>
        )

      case 'boolean':
        return <Switch value={Boolean(value)} onChange={onChange} label={field.label} />

      case 'list':
        return <ListEditor value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />

      case 'durations':
        return <DurationEditor value={(value as DurationRow[]) ?? []} onChange={onChange} />

      case 'pairs':
        return <PairEditor value={(value as PairRow[]) ?? []} onChange={onChange} />

      case 'select':
        return (
          <select
            value={String(value ?? '')}
            onChange={(event) => onChange(event.target.value)}
            className={cn(inputBase, 'appearance-none')}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={String(value ?? '')}
                placeholder="https://…"
                onChange={(event) => onChange(event.target.value)}
                className={cn(inputBase, 'flex-1')}
              />
              <label className="cursor-pointer grid shrink-0 place-items-center rounded-2xl bg-ocean-900 px-5 text-sand-50 transition-colors hover:bg-ocean-800">
                <span className="sr-only">Upload image</span>
                <Upload className="size-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    try {
                      const base64 = await processImage(file)
                      onChange(base64)
                    } catch (err) {
                      console.error(err)
                      alert('Failed to process image')
                    }
                  }} 
                />
              </label>
            </div>
            {typeof value === 'string' && value.trim() !== '' && (
              <img
                src={value}
                alt=""
                className="h-32 w-full rounded-2xl border border-ocean-900/10 object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        )

      default:
        return (
          <input
            type={field.type === 'url' ? 'url' : 'text'}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={inputBase}
          />
        )
    }
  })()

  return (
    <div className={cn(field.full && 'sm:col-span-2')}>
      <label className="mb-2 block text-[0.78rem] font-bold tracking-wide text-ocean-800/70 uppercase">
        {field.label}
      </label>
      {control}
      {field.help && <p className="mt-2 text-[0.78rem] leading-relaxed text-ocean-800/45">{field.help}</p>}
    </div>
  )
}

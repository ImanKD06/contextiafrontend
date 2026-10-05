import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Send } from 'lucide-react'
import { listDocuments } from '../api/documents'
import { sendChat } from '../api/chat'
import { useAsync } from '../hooks/useAsync'
import { Btn, Card, Empty, Loading, PageHeader } from '../components/common/ui'
import type { ChatSource } from '../types'

interface Msg { role: 'user' | 'ai'; text: string; sources?: ChatSource[] }
const STAGES = ['Buscando información…', 'Analizando contexto…', 'Generando respuesta…']

export default function Chat() {
  const { data: docs, loading } = useAsync(listDocuments)
  const loc = useLocation()
  const initial = (loc.state as any)?.ids?.[0]
  
  const [sel, setSel] = useState<string | number | undefined>(initial)
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(-1)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: 'Hola, soy ContextIA.\nPuedo responder preguntas utilizando la información contenida en tus documentos.' }
  ])
  const end = useRef<HTMLDivElement>(null)

  // FIX 1: Envolver en llaves para evitar que retorne el scrollIntoView y cause "destroy is not a function"
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, busy])

  async function send() {
    if (!q.trim() || busy >= 0 || sel === undefined) return
    const question = q
    setQ('')
    setMsgs(m => [...m, { role: 'user', text: question }])
    setBusy(0)

    const t = setInterval(() => setBusy(b => Math.min(b + 1, 2)), 900)

    try {
      const r = await sendChat({ question, document_id: Number(sel) })
      // FIX 2: Validar que fuentes sea un Array siempre para evitar "TypeError: n is not a function"
      const sources = Array.isArray(r.sources) ? r.sources : []
      setMsgs(m => [...m, { role: 'ai', text: r.answer, sources }])
    } catch (e: any) {
      setMsgs(m => [...m, { role: 'ai', text: `No se pudo obtener respuesta: ${e.message}` }])
    }
    clearInterval(t)
    setBusy(-1)
  }

  // FIX 3: Validar que docs sea un Array plano
  const ready = Array.isArray(docs) ? docs : []

  return (
    <>
      <PageHeader light="Chat" title="con documentos" />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit p-4">
          <p className="mb-3 text-sm font-medium">Seleccionar documento</p>
          {loading ? (
            <Loading />
          ) : !ready.length ? (
            <Empty text="No hay documentos todavía." />
          ) : (
            <div className="space-y-1">
              {ready.map(d => (
                <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="chat-doc"
                    className="accent-neutral-950"
                    checked={String(sel) === String(d.id)}
                    onChange={() => setSel(d.id)}
                  />
                  <span className="truncate">{d.filename}</span>
                </label>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-neutral-500">La API responde sobre un único documento a la vez.</p>
        </Card>

        <Card className="flex h-[70vh] flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-neutral-950 text-white' : 'border border-neutral-200'}`}>
                  {m.text}
                  {m.sources && (
                    <details className="mt-3 text-xs">
                      <summary className="cursor-pointer font-medium">Ver fuentes ({m.sources.length})</summary>
                      {m.sources.length ? (
                        <div className="mt-2 space-y-2 text-neutral-950">
                          {m.sources.map((s, j) => (
  <details key={j} className="rounded-lg border border-neutral-200 bg-white p-3">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
      <span className="font-medium">{s.document_title}</span>
      <span className="text-xs text-neutral-500">
        Similitud {(s.similarity * 100).toFixed(0)}%
      </span>
    </summary>
  </details>
))}
                        </div>
                      ) : (
                        <p className="mt-2 text-neutral-500">No se han encontrado fuentes relevantes.</p>
                      )}
                    </details>
                  )}
                </div>
              </div>
            ))}
            {busy >= 0 && <p className="animate-pulse text-sm text-neutral-500">{STAGES[busy]}</p>}
            <div ref={end} />
          </div>

          <div className="flex gap-2 border-t border-neutral-200 p-3">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={sel !== undefined ? 'Escribe una pregunta sobre tus documentos...' : 'Selecciona un documento primero'}
              disabled={sel === undefined}
              className="flex-1 rounded-full border border-neutral-300 px-5 py-2.5 text-sm outline-none focus:border-neutral-950 disabled:bg-neutral-50"
            />
            <Btn onClick={send} disabled={busy >= 0 || sel === undefined} aria-label="Enviar">
              <Send size={16} />
            </Btn>
          </div>
        </Card>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { listDocuments } from '../api/documents'
import { generateProposal } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import { Btn, Empty, ErrorState, H2, Loading, PageHeader, Steps } from '../components/common/ui'

const STEPS = [
  'Analizando documentos',
  'Recuperando información relevante',
  'Generando análisis',
  'Generando gráficos',
  'Generando informe'
]

export default function Analysis() {
  const { data: docs, loading } = useAsync(listDocuments)
  const nav = useNavigate()
  const [sel, setSel] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [step, setStep] = useState(-1)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (step < 0 || step >= STEPS.length - 1) return
    const t = setTimeout(() => setStep(s => s + 1), 1300)
    return () => clearTimeout(t)
  }, [step])

  async function run() {
    // 💡 1. Asignar un prompt por defecto si el usuario lo deja en blanco
    const promptText = q.trim() || 'Analiza la situación de la empresa e identifica los principales problemas.'

    // 💡 2. Asegurar que enviamos IDs numéricos válidos (filtrando NaNs)
    const validDocumentIds = sel
      .map(id => Number(id))
      .filter(id => !isNaN(id))

    if (!validDocumentIds.length) {
      setErr('Debes seleccionar al menos un documento válido.')
      return
    }

    setErr('')
    setStep(0)

    try {
      const names = ready
        .filter(d => sel.includes(String(d.id)))
        .map(d => d.filename)

      const p = await generateProposal(
        {
          request: promptText,
          document_ids: validDocumentIds,
        },
        names
      )

      nav(`/analisis/${p.id}`)
    } catch (e: any) {
      setErr(e.message || 'Error al generar el análisis')
      setStep(-1)
    }
  }

const all = Array.isArray(docs) ? docs : (docs as any)?.documents || []
const ready = Array.from(new Map(all.map(d => [d.filename, d])).values())
  
  return (
    <>
      <PageHeader
        light="Análisis"
        title="documental"
        desc="Analiza uno o varios documentos utilizando inteligencia artificial."
      />

      {step >= 0 ? (
        <Steps items={STEPS} current={step} />
      ) : (
        <>
          <H2>¿Qué quieres analizar?</H2>
          <textarea
            value={q}
            onChange={e => setQ(e.target.value)}
            rows={4}
            placeholder="Analiza la situación de la empresa e identifica los principales problemas. / Resume los requisitos de esta convocatoria. / Compara los documentos e identifica diferencias."
            className="w-full rounded-xl border border-neutral-300 bg-white p-4 text-sm outline-none focus:border-neutral-950"
          />

          <H2>Selecciona documentos</H2>
          {loading ? (
            <Loading />
          ) : !ready.length ? (
            <Empty text="No hay documentos todavía." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ready.map(d => {
                const docIdStr = String(d.id)
                const on = sel.includes(docIdStr)
                return (
                  <button
                    key={docIdStr}
                    onClick={() =>
                      setSel(s =>
                        on ? s.filter(x => x !== docIdStr) : [...s, docIdStr]
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border bg-white p-4 text-left text-sm transition ${
                      on ? 'border-neutral-950' : 'border-neutral-200'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        on
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {on && <Check size={12} />}
                    </span>
                    <span className="truncate">{d.filename}</span>
                  </button>
                )
              })}
            </div>
          )}

          {err && (
            <div className="mt-4">
              <ErrorState msg={err} />
            </div>
          )}

          <Btn
            className="mt-5"
            disabled={!sel.length}
            onClick={run}
          >
            Generar análisis
          </Btn>
        </>
      )}
    </>
  )
}

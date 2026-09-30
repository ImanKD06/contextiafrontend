import type { ProposalResponse } from '../../types'
import { reportUrl } from '../../api/proposals'
import { fmtDate } from '../../utils/format'
import { H2 } from '../common/ui'
// Renderiza sections[], generated_charts[]/charts[] y sources[] de forma dinámica.
export default function AnalysisBody({ p }: { p: ProposalResponse }) {
  return (<>
    <section><H2>Análisis</H2>
      {p.sections.length ? <div className="space-y-8">{p.sections.map((s, i) => <div key={i}><h3 className="mb-2 font-bold">{s.title}</h3><ul className="list-disc space-y-1 pl-5 text-neutral-700">{s.content.map((c, j) => <li key={j}>{c}</li>)}</ul></div>)}</div> : <p className="text-sm text-neutral-500">La API no devolvió secciones.</p>}</section>
    <section><H2>Visualizaciones</H2>
      {p.generated_charts.length
        ? <div className="grid gap-4 sm:grid-cols-2">{p.generated_charts.map((c, i) => <figure key={i} className="rounded-xl border border-neutral-200 bg-white p-4"><img src={reportUrl(c.url)} alt={c.title} className="w-full rounded-lg" /><figcaption className="mt-2 text-sm font-medium">{c.title}</figcaption></figure>)}</div>
        : <p className="text-sm text-neutral-500">No se han generado visualizaciones para este análisis.</p>}</section>
    <section><H2>Fuentes utilizadas</H2>
      {p.sources.length ? <div className="space-y-2">{p.sources.map((s, i) => (
        <details key={i} className="rounded-lg border border-neutral-200 bg-white p-4 text-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3"><span className="font-medium">{s.document_title}</span><span className="text-xs text-neutral-500">Chunk {s.chunk_id}</span></summary>
          <p className="mt-3 border-l-2 border-neutral-300 pl-3 text-neutral-600">{s.relevant_content}</p>
        </details>
      ))}</div> : <p className="text-sm text-neutral-500">No se han encontrado fuentes relevantes.</p>}</section>
  </>)
}
export const Meta = ({ p }: { p: ProposalResponse }) => (
  <div className="mb-2 grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 text-sm sm:grid-cols-3">
    <div><p className="text-neutral-500">Pregunta</p><p className="mt-1 font-medium">{p.request}</p></div>
    <div><p className="text-neutral-500">Documentos</p><p className="mt-1 font-medium">{(p.document_names ?? []).join(', ') || p.document_ids.length}</p></div>
    <div><p className="text-neutral-500">Fecha</p><p className="mt-1 font-medium">{fmtDate(p.created_at)}</p></div></div>)

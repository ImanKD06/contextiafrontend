import { useNavigate, useParams } from 'react-router-dom'
import { getProposal, reportUrl } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import { Btn, ErrorState, Loading } from '../components/common/ui'
import { fmtDate } from '../utils/format'
export default function ReportDetail() {
  const { id } = useParams(); const nav = useNavigate(); const { data: p, loading, error } = useAsync(() => getProposal(id!), [id])
  if (loading) return <Loading />; if (error || !p) return <ErrorState msg={error ?? 'No encontrado'} />
  return (<>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden"><h1 className="display text-2xl font-black">Informe de análisis</h1>
      <div className="flex gap-2"><Btn v="line" onClick={() => nav(-1)}>Volver</Btn><Btn onClick={() => p.report_url ? window.open(reportUrl(p.report_url), '_blank') : window.print()}>Descargar PDF</Btn></div></div>
    <article className="mx-auto max-w-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-14">
      <p className="display text-sm font-black tracking-widest">CONTEXTIA</p>
      <h2 className="display mt-10 text-3xl font-black sm:text-4xl">INFORME DE ANÁLISIS DOCUMENTAL</h2><p className="mt-2 text-sm text-neutral-500">{fmtDate(p.created_at)} · {(p.document_names ?? []).join(', ')}</p>
      <h3 className="mt-10 text-sm font-bold text-neutral-500">Pregunta</h3><p className="mt-1">{p.request}</p>
      {p.sections.map((s, i) => <div key={i} className="mt-8"><h3 className="text-lg font-bold">{s.title}</h3><ul className="mt-2 list-disc space-y-1 pl-5">{s.content.map((c, j) => <li key={j}>{c}</li>)}</ul></div>)}
      {p.generated_charts.length > 0 && <><h3 className="mt-10 text-lg font-bold">Gráficos</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">{p.generated_charts.map((c, i) => <figure key={i}><img src={reportUrl(c.url)} alt={c.title} className="w-full rounded-lg border border-neutral-200" /><figcaption className="mt-1 text-sm text-neutral-500">{c.title}</figcaption></figure>)}</div></>}
      <h3 className="mt-10 text-lg font-bold">Fuentes utilizadas</h3>
      <div className="mt-3 space-y-2">{p.sources.length ? p.sources.map((s, i) => <p key={i} className="text-sm text-neutral-700">Documento: {s.document_title} · Chunk {s.chunk_id}</p>) : <p className="text-sm text-neutral-500">No se han encontrado fuentes relevantes.</p>}</div>
    </article></>)
}

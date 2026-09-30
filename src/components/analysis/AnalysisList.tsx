import { Link } from 'react-router-dom'
import type { ProposalResponse } from '../../types'
import { fmtDate } from '../../utils/format'
import { Card, Empty, LinkBtn, StatusBadge } from '../common/ui'
export default function AnalysisList({ items }: { items: ProposalResponse[] }) {
  if (!items.length) return <Empty text="No se han generado análisis." action={<LinkBtn to="/analisis" v="line">Generar análisis</LinkBtn>} />
  return <div className="space-y-3">{items.map(p => (
    <Card key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0"><p className="truncate font-medium">{p.request}</p><p className="text-sm text-neutral-500">{(p.document_names ?? []).join(', ') || `${p.document_ids.length} documento(s)`} · {fmtDate(p.created_at)}</p></div>
      <div className="flex items-center gap-3"><StatusBadge s="ready" /><Link to={`/analisis/${p.id}`} className="text-sm font-medium underline underline-offset-4">Ver análisis</Link></div></Card>))}</div>
}

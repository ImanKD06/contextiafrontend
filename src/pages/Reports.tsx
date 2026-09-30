import { Link } from 'react-router-dom'
import { listProposals, reportUrl } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import { Card, Empty, ErrorState, LinkBtn, PageHeader, Skeleton, StatusBadge } from '../components/common/ui'
import { fmtDate } from '../utils/format'
export default function Reports() {
  const { data, loading, error, reload } = useAsync(listProposals)
  return (<><PageHeader light="Informes" title="generados" desc="Consulta y descarga los informes de tus análisis." />
    {loading ? <Skeleton className="h-40" /> : error ? <ErrorState msg={error} retry={reload} /> : !data?.length ? <Empty text="No hay informes todavía." action={<LinkBtn to="/analisis" v="line">Generar análisis</LinkBtn>} /> :
      <Card className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b border-neutral-200 text-left text-neutral-500">{['Nombre', 'Fecha', 'Documentos', 'Estado', 'Acciones'].map(h => <th key={h} className="p-4 font-medium">{h}</th>)}</tr></thead>
        <tbody>{data.map(r => <tr key={r.id} className="border-b border-neutral-100 last:border-0"><td className="p-4 font-medium">{r.request.slice(0, 60)}</td><td className="p-4">{fmtDate(r.created_at)}</td><td className="p-4">{(r.document_names ?? []).length}</td><td className="p-4"><StatusBadge s="ready" /></td>
          <td className="flex gap-4 p-4"><Link className="underline underline-offset-4" to={`/informes/${r.id}`}>Ver</Link>{r.report_url ? <a className="underline underline-offset-4" href={reportUrl(r.report_url)} target="_blank" rel="noreferrer">Descargar informe PDF</a> : <span className="text-neutral-400">PDF no disponible</span>}</td></tr>)}</tbody></table></Card>}</>)
}

import { Link } from 'react-router-dom'
import { BarChart3, FileBarChart, MessagesSquare, Plus, Upload } from 'lucide-react'
import { listProposals } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import { H2, LinkBtn, PageHeader, Skeleton } from '../components/common/ui'
import AnalysisList from '../components/analysis/AnalysisList'
export default function Dashboard() {
  const props = useAsync(listProposals)
  const p = props.data ?? []
  const actions = [['/documentos', Upload, 'Subir documento'], ['/chat', MessagesSquare, 'Preguntar a un documento'], ['/analisis', BarChart3, 'Analizar documentos'], ['/informes', FileBarChart, 'Generar informe']] as const
  return (<>
    <PageHeader light="Buenos días" title="Tus documentos" desc="Analiza tus documentos, encuentra información y genera propuestas." action={<LinkBtn to="/documentos"><Plus size={16} />Nuevo documento</LinkBtn>} />
    <H2>Acciones rápidas</H2>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{actions.map(([to, I, l]) => <Link key={l} to={to} className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-950"><I size={20} /><p className="mt-6 font-medium">{l}</p></Link>)}</div>
    <H2>Últimos análisis</H2>{props.loading ? <Skeleton /> : <AnalysisList items={p.slice(0, 3)} />}
  </>)
}

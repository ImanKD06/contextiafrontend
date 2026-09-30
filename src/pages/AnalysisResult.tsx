import { Link, useParams } from 'react-router-dom'
import { Download, FileText } from 'lucide-react'
import { getProposal, reportUrl } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import AnalysisBody, { Meta } from '../components/analysis/AnalysisBody'
import { ErrorState, LinkBtn, Loading, PageHeader } from '../components/common/ui'
export default function AnalysisResult() {
  const { id } = useParams(); const { data: p, loading, error } = useAsync(() => getProposal(id!), [id])
  if (loading) return <Loading />; if (error || !p) return <ErrorState msg={error ?? 'No encontrado'} />
  return (<>
    <PageHeader light="Resultado" title="del análisis" action={<div className="flex gap-2"><LinkBtn v="line" to={`/informes/${p.id}`}><FileText size={16} />Ver informe</LinkBtn>{p.report_url && <a className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white" href={reportUrl(p.report_url)} target="_blank" rel="noreferrer"><Download size={16} />Descargar informe PDF</a>}</div>} />
    <Meta p={p} /><AnalysisBody p={p} /><Link to="/analisis" className="mt-10 inline-block text-sm underline underline-offset-4">Nuevo análisis</Link>
  </>)
}

import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getDocument } from '../api/documents'
import { useAsync } from '../hooks/useAsync'
import { Card, Empty, ErrorState, Loading, PageHeader, StatusBadge } from '../components/common/ui'
export default function DocumentDetail() {
  const { id } = useParams(); const { data: d, loading, error, reload } = useAsync(() => getDocument(id!), [id])
  if (loading) return <Loading />; if (error || !d) return <ErrorState msg={error ?? 'No encontrado'} retry={reload} />
  return (<>
    <Link to="/documentos" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600"><ArrowLeft size={14} />Documentos</Link>
    <PageHeader light={d.type.toUpperCase()} title={d.filename} action={<StatusBadge s={d.status} />} />
    {d.content ? <Card className="whitespace-pre-wrap p-6 text-sm leading-relaxed">{d.content}</Card> : <Empty text="El contenido no está disponible." />}
  </>)
}

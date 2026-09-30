import { listProposals } from '../api/proposals'
import { useAsync } from '../hooks/useAsync'
import AnalysisList from '../components/analysis/AnalysisList'
import { LinkBtn, Loading, PageHeader } from '../components/common/ui'
export default function Proposals() {
  const { data, loading } = useAsync(listProposals)
  return (<><PageHeader light="Propuestas" title="de actuación" desc="Historial de análisis y propuestas generadas." action={<LinkBtn to="/analisis">Nuevo análisis</LinkBtn>} />{loading ? <Loading /> : <AnalysisList items={data ?? []} />}</>)
}

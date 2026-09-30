import { USE_MOCK, delay, request, json, API_URL } from './client'
import type { ProposalRequest, ProposalResponse } from '../types'
export const EP = { create: '/proposals' }

const mockProposal = (req: ProposalRequest): ProposalResponse => ({
  id: 'demo-' + Date.now(), request: req.request, document_ids: req.document_ids, created_at: new Date().toISOString(), report_url: '',
  sections: [{ title: 'Sección de ejemplo', content: ['Punto de demostración A', 'Punto de demostración B'] }],
  charts: [{ title: 'Gráfico de demostración', chart_type: 'bar', description: 'Valores ficticios para probar el componente.', data: [{ label: 'Ejemplo A', value: 3 }, { label: 'Ejemplo B', value: 5 }], source_chunk_ids: [] }],
  generated_charts: [],
  sources: [{ document_id: req.document_ids[0] ?? 0, document_title: 'documento-demo-1.pdf', chunk_id: 2, relevant_content: 'Fragmento de demostración 2.' }],
})

// El historial de análisis no tiene endpoint propio en la API: se guarda en localStorage.
const KEY = 'ctx_proposals'
const read = (): ProposalResponse[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] } }
export const listProposals = async () => read()
export const getProposal = async (id: string) => { const p = read().find(x => x.id === id); if (!p) throw new Error('Análisis no encontrado'); return p }

export async function generateProposal(req: ProposalRequest, names: string[]): Promise<ProposalResponse> {
  const raw = USE_MOCK ? (await delay(5500), mockProposal(req)) : await request<any>(EP.create, json(req))
  const p: ProposalResponse = {
    id: String(Date.now()),
    request: raw.request ?? req.request,
    document_ids: raw.document_ids ?? req.document_ids,
    document_names: names,
    sections: raw.sections ?? [],
    charts: raw.charts ?? [],
    generated_charts: raw.generated_charts ?? [],
    sources: raw.sources ?? [],
    report_url: raw.report_url ?? '',
    created_at: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify([p, ...read()]))
  return p
}

export const reportUrl = (relative: string) => relative ? `${API_URL}${relative}` : ''

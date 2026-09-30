// Tipos alineados con la API real de ContextIA (FastAPI).

export interface Document {
  id: string          // la API usa number; se normaliza a string en el frontend
  filename: string     // = title del backend
  type: 'txt' | 'pdf' | 'docx'
  content?: string
  created_at: string   // la API no lo devuelve: se rellena al recibir el documento
  status: 'ready'       // la API no tiene estados intermedios reales
}

export interface ChatSource {
  chunk_id: number
  document_id: number
  document_title: string
  similarity: number
}
export interface ChatResponse {
  question: string
  document_id: number
  answer: string
  sources: ChatSource[]
}
export interface ChatRequest { question: string; document_id: number }

export interface ProposalRequest { document_ids: number[]; request: string }
export interface ProposalSection { title: string; content: string[] }
export interface ProposalChartData { label: string; value: number }
export interface ProposalChart { title: string; chart_type: 'bar' | 'pie' | 'comparison'; description: string; data: ProposalChartData[]; source_chunk_ids: number[] }
export interface GeneratedChart { title: string; chart_type: string; url: string }
export interface ProposalSource { document_id: number; document_title: string; chunk_id: number; relevant_content: string }
export interface ProposalResponse {
  id: string            // no la da la API: se genera en el cliente para poder enlazar la vista de resultado
  request: string
  document_ids: number[]
  document_names?: string[]
  sections: ProposalSection[]
  charts: ProposalChart[]
  generated_charts: GeneratedChart[]
  sources: ProposalSource[]
  report_url: string     // ruta relativa devuelta por la API (se combina con API_URL al usarla)
  created_at: string     // no la da la API: se añade en el cliente
}

// "Informes" se derivan de los análisis generados (la API no tiene endpoint propio de informes).
export interface Report { id: string; name: string; type: string; created_at: string; documents: string[]; status: 'ready'; report_url: string }

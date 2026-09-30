import { USE_MOCK, delay, request, API_URL } from './client'
import type { ChatRequest, ChatResponse } from '../types'
export const EP = { chat: '/chat' }

// La API espera "question" y "document_id" (un único documento) como query params, no como JSON.
export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  const n = Number(localStorage.getItem('ctx_queries') ?? 0) + 1; localStorage.setItem('ctx_queries', String(n))
  if (USE_MOCK) {
    await delay(1800)
    return { question: req.question, document_id: req.document_id, answer: 'Respuesta de demostración. Conecta la API (VITE_USE_MOCK=false) para obtener respuestas reales.', sources: [{ chunk_id: 2, document_id: req.document_id, document_title: 'documento-demo-1.pdf', similarity: 0.82 }] }
  }
  const qs = new URLSearchParams({ question: req.question, document_id: String(req.document_id) })
  const res = await fetch(`${API_URL}${EP.chat}?${qs.toString()}`, { method: 'POST' })
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}

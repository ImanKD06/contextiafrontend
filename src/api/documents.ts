import { USE_MOCK, delay, request, API_URL } from './client'
import { mockDocuments } from '../mocks/data'
import type { Document } from '../types'

// Endpoints reales: GET/POST /documents, GET/DELETE /documents/{id}, POST /documents/upload
export const EP = { list: '/documents', one: (id: string) => `/documents/${id}`, upload: '/documents/upload', remove: (id: string) => `/documents/${id}` }

// La API solo devuelve { id, title, content }. El resto se deduce aquí.
const normalize = (r: any): Document => {
  const filename = String(r.title ?? r.filename ?? 'Sin nombre')
  const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : 'txt'
  const type = (['pdf', 'docx', 'txt'].includes(ext) ? ext : 'txt') as Document['type']
  return { id: String(r.id), filename, type, content: r.content, created_at: new Date().toISOString(), status: 'ready' }
}

let store = [...mockDocuments]

export const listDocuments = async (): Promise<Document[]> =>
  USE_MOCK ? (await delay(), [...store]) : (await request<any[]>(EP.list)).map(normalize)

export const getDocument = async (id: string): Promise<Document> => {
  if (!USE_MOCK) return normalize(await request<any>(EP.one(id)))
  await delay(); const x = store.find(d => d.id === id); if (!x) throw new Error('Documento no encontrado'); return x
}

export const deleteDocument = async (id: string) => USE_MOCK ? (await delay(200), void (store = store.filter(d => d.id !== id))) : request<void>(EP.remove(id), { method: 'DELETE' })

// La API acepta varios archivos en una sola petición, bajo el campo "files".
export async function uploadDocuments(files: File[]): Promise<{ ok: Document[]; errors: { filename: string; error: string }[] }> {
  if (USE_MOCK) {
    await delay(1500)
    const ok = files.map(f => { const d: Document = { id: 'demo-' + Date.now() + Math.random(), filename: f.name, type: (f.name.split('.').pop() ?? 'txt').toLowerCase() as any, created_at: new Date().toISOString(), status: 'ready' }; return d })
    store = [...ok, ...store]
    return { ok, errors: [] }
  }
  const fd = new FormData()
  files.forEach(f => fd.append('files', f))
  const res = await fetch(API_URL + EP.upload, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  const ok: Document[] = (data.documents ?? []).map((d: any) => normalize({ id: d.document_id, title: d.filename }))
  return { ok, errors: data.errors ?? [] }
}

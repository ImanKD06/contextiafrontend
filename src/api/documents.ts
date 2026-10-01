import { USE_MOCK, delay, request, API_URL } from './client'
import { mockDocuments } from '../mocks/data'
import type { Document } from '../types'

// Endpoints reales: GET/POST /documents, GET/DELETE /documents/{id}, POST /documents/upload
export const EP = {
  list: '/documents',
  one: (id: string) => `/documents/${id}`,
  upload: '/documents/upload',
  remove: (id: string) => `/documents/${id}`,
}

// Asegurar que la URL base no termine en '/'
const baseUrl = API_URL.replace(/\/$/, '')

// La API devuelve { id, title, content } o { document_id, filename }. Se normaliza aquí.
const normalize = (r: any): Document => {
  const filename = String(r.title ?? r.filename ?? r.name ?? 'Sin nombre')
  const ext = filename.includes('.') ? filename.split('.').pop()!.toLowerCase() : 'txt'
  const type = (['pdf', 'docx', 'txt'].includes(ext) ? ext : 'txt') as Document['type']
  const docId = String(r.id ?? r.document_id ?? Date.now())

  return {
    id: docId,
    filename,
    type,
    content: r.content,
    created_at: r.created_at ?? new Date().toISOString(),
    status: 'ready',
  }
}

let store = [...mockDocuments]

export const listDocuments = async (): Promise<Document[]> => {
  if (USE_MOCK) {
    await delay()
    return [...store]
  }
  const res = await request<any>(EP.list)
  const list = Array.isArray(res) ? res : res?.documents || res?.data || []
  return list.map(normalize)
}

export const getDocument = async (id: string): Promise<Document> => {
  if (!USE_MOCK) return normalize(await request<any>(EP.one(id)))
  await delay()
  const x = store.find(d => d.id === id)
  if (!x) throw new Error('Documento no encontrado')
  return x
}

export const deleteDocument = async (id: string) => {
  if (USE_MOCK) {
    await delay(200)
    store = store.filter(d => d.id !== id)
    return
  }
  return request<void>(EP.remove(id), { method: 'DELETE' })
}

// La API acepta varios archivos en una sola petición, bajo el campo "files".
export async function uploadDocuments(
  files: File[]
): Promise<{ ok: Document[]; errors: { filename: string; error: string }[] }> {
  if (USE_MOCK) {
    await delay(1500)
    const ok = files.map(f => {
      const d: Document = {
        id: 'demo-' + Date.now() + Math.random(),
        filename: f.name,
        type: (f.name.split('.').pop() ?? 'txt').toLowerCase() as any,
        created_at: new Date().toISOString(),
        status: 'ready',
      }
      return d
    })
    store = [...ok, ...store]
    return { ok, errors: [] }
  }

  const fd = new FormData()
  
  // 💡 SOLUCIÓN: Cambiar 'files' por 'file' que es el nombre exacto que exige FastAPI
  files.forEach(f => fd.append('file', f))

  const uploadUrl = `${baseUrl}${EP.upload}`
  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) {
    let detail = `Error ${res.status}: ${res.statusText}`
    try {
      const errJson = await res.json()
      if (errJson.detail) {
        detail = typeof errJson.detail === 'string'
          ? errJson.detail
          : JSON.stringify(errJson.detail)
      }
    } catch (_) {}
    throw new Error(detail)
  }

  const data = await res.json()

  const rawOk = Array.isArray(data)
    ? data
    : data.documents || data.ok || data.uploaded || [data]

  const ok: Document[] = rawOk.map((d: any) =>
    normalize({ id: d.document_id ?? d.id, title: d.filename ?? d.title ?? d.name })
  )

  return { ok, errors: data.errors ?? [] }
}
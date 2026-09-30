// DATOS DE DEMOSTRACIÓN — no son datos reales. Se usan solo si VITE_USE_MOCK=true.
import type { Document } from '../types'
const d = (n: number) => new Date(Date.now() - n * 864e5).toISOString()
export const mockDocuments: Document[] = [
  { id: 'demo-1', filename: 'documento-demo-1.pdf', type: 'pdf', created_at: d(1), status: 'ready', content: 'Contenido de demostración del documento 1.' },
  { id: 'demo-2', filename: 'documento-demo-2.docx', type: 'docx', created_at: d(3), status: 'ready', content: 'Contenido de demostración del documento 2.' },
  { id: 'demo-3', filename: 'documento-demo-3.txt', type: 'txt', created_at: d(5), status: 'ready', content: 'Contenido de demostración del documento 3.' },
]

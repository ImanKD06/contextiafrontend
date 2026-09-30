import { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Inbox, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
export const btn = (v: 'solid' | 'line' | 'ghost' = 'solid') => `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:opacity-40 ${v === 'solid' ? 'bg-neutral-950 text-white hover:bg-neutral-700' : v === 'line' ? 'border border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white' : 'hover:bg-neutral-100'}`
export const Btn = ({ v, className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { v?: 'solid' | 'line' | 'ghost' }) => <button {...p} className={`${btn(v)} ${className}`} />
export const LinkBtn = ({ v, to, children, className = '' }: { v?: 'solid' | 'line' | 'ghost'; to: string; children: ReactNode; className?: string }) => <Link to={to} className={`${btn(v)} ${className}`}>{children}</Link>
export const Card = ({ className = '', ...p }: React.HTMLAttributes<HTMLDivElement>) => <div {...p} className={`rounded-xl border border-neutral-200 bg-white ${className}`} />
export const PageHeader = ({ light, title, desc, action }: { light: string; title: string; desc?: string; action?: ReactNode }) => (
  <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
    <div><h1 className="display text-4xl sm:text-5xl"><span className="font-light text-neutral-500">{light}</span><br /><span className="font-black">{title}</span></h1>
      {desc && <p className="mt-4 max-w-xl text-neutral-600">{desc}</p>}</div>{action}
  </div>)
export const H2 = ({ children, action }: { children: ReactNode; action?: ReactNode }) => <div className="mb-4 mt-12 flex items-center justify-between"><h2 className="display text-xl font-extrabold">{children}</h2>{action}</div>
const tone: Record<string, string> = { ready: 'bg-green-50 text-green-700 border-green-200', error: 'bg-red-50 text-red-700 border-red-200', uploading: 'bg-amber-50 text-amber-700 border-amber-200', processing: 'bg-amber-50 text-amber-700 border-amber-200', chunking: 'bg-amber-50 text-amber-700 border-amber-200', embedding: 'bg-amber-50 text-amber-700 border-amber-200' }
export const labels: Record<string, string> = { ready: 'Listo', error: 'Error' }
export const StatusBadge = ({ s }: { s: 'ready' | 'error' }) => <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone[s]}`}>{labels[s] ?? s}</span>
export const Loading = ({ text = 'Cargando…' }: { text?: string }) => <div className="flex items-center justify-center gap-2 py-16 text-sm text-neutral-500"><Loader2 className="animate-spin" size={16} />{text}</div>
export const Skeleton = ({ className = 'h-16' }: { className?: string }) => <div className={`animate-pulse rounded-xl bg-neutral-100 ${className}`} />
export const Empty = ({ text, action }: { text: string; action?: ReactNode }) => <Card className="flex flex-col items-center gap-4 border-dashed py-14 text-center"><Inbox className="text-neutral-400" /><p className="text-neutral-600">{text}</p>{action}</Card>
export const ErrorState = ({ msg, retry }: { msg: string; retry?: () => void }) => <Card className="flex flex-col items-center gap-3 border-red-200 py-12 text-center"><AlertCircle className="text-red-600" /><p className="text-sm text-red-700">{msg}</p>{retry && <Btn v="line" onClick={retry}>Reintentar</Btn>}</Card>
export const Success = ({ text }: { text: string }) => <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"><CheckCircle2 size={16} />{text}</div>
export const Steps = ({ items, current }: { items: string[]; current: number }) => (
  <Card className="p-6"><ol className="space-y-3">{items.map((t, i) => <li key={t} className={`flex items-center gap-3 text-sm ${i > current ? 'text-neutral-400' : ''}`}>
    {i < current ? <CheckCircle2 size={16} className="text-green-600" /> : i === current ? <Loader2 size={16} className="animate-spin" /> : <span className="h-4 w-4 rounded-full border border-neutral-300" />}{t}</li>)}</ol></Card>)
export const Source = ({ document, chunk_id, similarity, content }: { document: string; chunk_id: string; similarity: number; content?: string }) => (
  <details className="group rounded-lg border border-neutral-200 bg-white p-4 text-sm">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3"><span className="font-medium">{document}</span>
      <span className="text-xs text-neutral-500">Chunk {chunk_id} · similitud {(similarity * 100).toFixed(0)}%</span></summary>
    {content ? <p className="mt-3 border-l-2 border-neutral-300 pl-3 text-neutral-600">{content}</p> : <p className="mt-3 text-neutral-400">Sin contenido disponible.</p>}
  </details>)

import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Eye, MessagesSquare, Trash2, Upload } from 'lucide-react'
import { deleteDocument, listDocuments, uploadDocuments } from '../api/documents'
import { useAsync } from '../hooks/useAsync'
import { Btn, Card, Empty, ErrorState, PageHeader, Skeleton, StatusBadge, Success } from '../components/common/ui'
import { fmtDate } from '../utils/format'
const OK = ['pdf', 'txt', 'docx']
export default function Documents() {
  const { data, loading, error, reload } = useAsync(listDocuments)
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(''); const [errs, setErrs] = useState<{ filename: string; error: string }[]>([]); const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  async function handle(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter(f => OK.includes(f.name.split('.').pop()!.toLowerCase()))
    if (!files.length) return
    setBusy(true); setErrs([]); setMsg('')
    try { const { ok, errors } = await uploadDocuments(files); setErrs(errors); if (ok.length) setMsg(`${ok.length} documento(s) subido(s) correctamente.`); reload() }
    catch (e: any) { setErrs([{ filename: '', error: e.message }]) }
    setBusy(false)
  }
  return (<>
    <PageHeader light="Documentos" title="Biblioteca" desc="Gestiona los documentos utilizados por ContextIA." action={<Btn onClick={() => input.current?.click()} disabled={busy}><Upload size={16} />Subir documento</Btn>} />
    <input ref={input} type="file" multiple hidden accept=".txt,.pdf,.docx" onChange={e => handle(e.target.files)} />
    <div onDragOver={e => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files) }}
      className={`rounded-xl border border-dashed bg-white p-12 text-center transition ${drag ? 'border-neutral-950 bg-neutral-50' : 'border-neutral-300'}`}>
      <Upload className="mx-auto mb-4 text-neutral-400" /><p className="display text-xl font-extrabold">Arrastra tus documentos aquí</p>
      <button className="mt-2 text-sm underline underline-offset-4" onClick={() => input.current?.click()}>o selecciona archivos</button><p className="mt-3 text-xs text-neutral-500">TXT · PDF · DOCX</p>
      {busy && <p className="mt-3 animate-pulse text-sm text-neutral-500">Subiendo y procesando…</p>}</div>
    {errs.map((e, i) => <Card key={i} className="mt-3 flex items-center justify-between p-4 text-sm text-red-700">{e.filename ? `${e.filename}: ${e.error}` : e.error}</Card>)}
    {msg && <div className="mt-3"><Success text={msg} /></div>}
    <div className="mt-10">{loading ? <Skeleton className="h-48" /> : error ? <ErrorState msg={error} retry={reload} /> : !data?.length ? <Empty text="No hay documentos todavía." /> :
      <Card className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm"><thead><tr className="border-b border-neutral-200 text-left text-neutral-500">{['Documento', 'Tipo', 'Estado', 'Acciones'].map(h => <th key={h} className="p-4 font-medium">{h}</th>)}</tr></thead>
        <tbody>{data.map(d => <tr key={d.id} className="border-b border-neutral-100 last:border-0"><td className="p-4 font-medium">{d.filename}</td><td className="p-4">{d.type.toUpperCase()}</td><td className="p-4"><StatusBadge s={d.status} /></td>
          <td className="p-4"><div className="flex gap-3 text-neutral-600">
            <Link to={`/documentos/${d.id}`} title="Ver"><Eye size={16} /></Link><Link to="/analisis" state={{ ids: [d.id] }} title="Analizar"><BarChart3 size={16} /></Link><Link to="/chat" state={{ ids: [d.id] }} title="Chat"><MessagesSquare size={16} /></Link>
            <button title="Eliminar" className="hover:text-red-600" onClick={async () => { if (confirm(`¿Eliminar ${d.filename}?`)) { await deleteDocument(d.id); reload() } }}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></Card>}</div>
  </>)
}

import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, FileBarChart, FileText, LayoutDashboard, Menu, MessagesSquare, Sparkles, X } from 'lucide-react'
import { USE_MOCK } from '../../api/client'
const main = [['/', 'Panel', LayoutDashboard], ['/documentos', 'Documentos', FileText], ['/chat', 'Chat con documentos', MessagesSquare], ['/analisis', 'Análisis', BarChart3], ['/propuestas', 'Propuestas', Sparkles], ['/informes', 'Informes', FileBarChart]] as const
const link = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 rounded-full px-4 py-2 text-sm transition ${isActive ? 'border border-neutral-950 font-medium' : 'border border-transparent text-neutral-600 hover:text-neutral-950'}`
export default function Layout() {
  const [open, setOpen] = useState(false)
  const nav = (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8 px-2"><div className="display flex items-center gap-2 text-xl font-black"><FileText size={18} />CONTEXTIA</div></div>
      <nav className="space-y-1" onClick={() => setOpen(false)}>{main.map(([to, l, I]) => <NavLink key={to} to={to} end={to === '/'} className={link}><I size={16} />{l}</NavLink>)}</nav>
      {USE_MOCK && <p className="mt-auto px-4 pt-4 text-xs text-amber-700 border-t border-neutral-200">Modo demo · datos de ejemplo</p>}
    </div>)
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-200 bg-white lg:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-neutral-200 bg-white transition-transform lg:hidden ${open ? '' : '-translate-x-full'}`}><button className="absolute right-4 top-5" onClick={() => setOpen(false)}><X size={18} /></button>{nav}</aside>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 lg:hidden"><button onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button><span className="display font-black">CONTEXTIA</span></header>
      <main className="dots min-h-screen"><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"><Outlet /></div></main>
    </div>)
}

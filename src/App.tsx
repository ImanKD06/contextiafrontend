import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import DocumentDetail from './pages/DocumentDetail'
import Chat from './pages/Chat'
import Analysis from './pages/Analysis'
import AnalysisResult from './pages/AnalysisResult'
import Proposals from './pages/Proposals'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
export default function App() {
  return (
    <Routes><Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/documentos" element={<Documents />} />
      <Route path="/documentos/:id" element={<DocumentDetail />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/analisis" element={<Analysis />} />
      <Route path="/analisis/:id" element={<AnalysisResult />} />
      <Route path="/propuestas" element={<Proposals />} />
      <Route path="/informes" element={<Reports />} />
      <Route path="/informes/:id" element={<ReportDetail />} />
    </Route></Routes>)
}

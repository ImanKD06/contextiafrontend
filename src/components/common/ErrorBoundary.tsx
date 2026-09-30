import { Component, ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {}
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="text-xl font-black">Algo ha fallado al mostrar esta página</h1>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{this.state.error.message}</pre>
        <button className="mt-4 rounded-full border border-neutral-950 px-5 py-2 text-sm" onClick={() => location.assign('/')}>Volver al inicio</button>
      </div>
    )
  }
}
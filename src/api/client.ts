export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
export const USE_MOCK: boolean = import.meta.env.VITE_USE_MOCK !== 'false'
export const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, init)
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res.json()
}
export const json = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

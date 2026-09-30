import { useCallback, useEffect, useState } from 'react'
export function useAsync<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T>(); const [loading, setL] = useState(true); const [error, setE] = useState<string>()
  const run = useCallback(() => { setL(true); setE(undefined); fn().then(setData).catch(e => setE(e.message)).finally(() => setL(false)) }, deps)
  useEffect(run, [run])
  return { data, loading, error, reload: run }
}

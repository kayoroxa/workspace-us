import { useEffect, useState } from 'react'

interface Toggles {
  [key: string]: boolean
}

export default function useLocalStore(id: string, initialState: any) {
  // state persist in localstorage
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const localStorageState: Toggles = JSON.parse(
      localStorage.getItem('toggles') || '{}'
    )
    if (localStorageState?.[id]) {
      setState(localStorageState[id])
    }
  }, [id])

  useEffect(() => {
    const localStorageState: Toggles = JSON.parse(
      localStorage.getItem('toggles') || '{}'
    )
    localStorageState[id] = state
    localStorage.setItem('toggles', JSON.stringify(localStorageState))
  }, [id, state])

  return [state, setState]
}

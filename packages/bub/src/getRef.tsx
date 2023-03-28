import { useEffect, useRef } from 'react'
import useRefStore from './store/useRefStore'

export default function GetRef(name: string) {
  const ref = useRef<any>(null)

  const addRef = useRefStore(state => state.addRef)

  useEffect(() => {
    addRef(name, ref)
  }, [addRef, name])

  return ref
}

import useRefStore from '@/store/useRefStore'
import { useEffect, useRef } from 'react'

export default function GetRef(name: string) {
  const ref = useRef<HTMLDivElement>(null)

  const addRef = useRefStore(state => state.addRef)

  useEffect(() => {
    addRef(name, ref)
  }, [addRef, name])

  return ref
}

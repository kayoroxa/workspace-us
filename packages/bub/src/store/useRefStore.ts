import { RefObject } from 'react'
import { create } from 'zustand'

export type _Ref = RefObject<HTMLDivElement>

interface RefState {
  refs: [string, _Ref][]
  addRef: (name: string, ref: _Ref) => _Ref
}

const useRefStore = create<RefState>()(set => ({
  refs: [],
  addRef: (name, ref) => {
    set(state => ({
      refs: [...state.refs, [name, ref]],
    }))
    return ref
  },
}))

export default useRefStore

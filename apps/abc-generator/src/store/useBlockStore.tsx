import { create } from 'zustand'

type optionSelected = string

interface State {
  selectedIn: {
    [category: string]: optionSelected
  }
  setAsSelect: (category: string, optionSelected: string | false) => void
}

const useBlockStore = create<State>()(set => ({
  selectedIn: {},
  setAsSelect: (category, optionSelected) => {
    set(state => {
      const newSelectIn = { ...state.selectedIn }

      if (optionSelected === false) {
        delete newSelectIn[category]
      } else {
        newSelectIn[category] = optionSelected
      }

      return { selectedIn: newSelectIn }
    })
  },
}))

export default useBlockStore

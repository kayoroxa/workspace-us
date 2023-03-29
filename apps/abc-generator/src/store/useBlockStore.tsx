import { axiosApi } from '@/utils/axiosApi'
import { create } from 'zustand'

type optionSelected = string

interface State {
  selectedIn: {
    [category: string]: optionSelected
  }
  setAsSelect: (category: string, optionSelected: string | false) => void
  saveSentence: (sentenceKey: string) => void
  resetSelectedIn: () => void
}

const useBlockStore = create<State>()(set => ({
  selectedIn: {},
  resetSelectedIn: () => set(() => ({ selectedIn: {} })),
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

  saveSentence: async sentenceKey => {
    //add sentences on backend
    await axiosApi.post('/sentences', {
      sentence: sentenceKey,
    })
    set(() => {
      return { selectedIn: {} }
    })
  },
}))

export default useBlockStore

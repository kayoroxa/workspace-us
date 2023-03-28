import { axiosApi } from '@/utils/axiosApi'
import { create } from 'zustand'

type optionSelected = string

interface State {
  selectedIn: {
    [category: string]: optionSelected
  }
  setAsSelect: (category: string, optionSelected: string | false) => void
  saveSentence: (sentenceKey: string) => void
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
  saveSentence: sentenceKey => {
    //add sentences on backend
    axiosApi
      .post('/sentences', {
        sentence: sentenceKey,
      })
      .finally(() => {
        set(() => {
          return { selectedIn: {} }
        })
      })
  },
}))

export default useBlockStore

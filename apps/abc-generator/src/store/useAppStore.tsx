import { axiosApi } from '@/utils/axiosApi'
import { Category } from '@/utils/types/Category'
import { create } from 'zustand'

interface appState {
  modalCategoryId: number | null
  changeModalCategoryId: (by: number | null) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  setOptionOnBoard: (
    categoryId: number | string,
    optionName: string,
    isTrue?: boolean
  ) => void
  changeCountReview: (categoryId: number | string, optionName: string) => void
  sortOptions: () => void
  saveAllData: () => void
  addCountReviewAllSelected: (selectedOptions: string[]) => void
}

const useAppStore = create<appState>()((set, get) => ({
  modalCategoryId: null,
  changeModalCategoryId: by => set(() => ({ modalCategoryId: by })),
  blocksOnBoard: [],
  categories: [],

  setCategories: (categories: Category[]) => {
    set(() => ({ categories }))
  },
  addCountReviewAllSelected: selectedOptions => {
    set(store => {
      let newCategories = [...store.categories]

      newCategories = newCategories.map(category => {
        return {
          ...category,
          options: category.options.map(option => {
            const has = selectedOptions.find(q => q === option.name)
            return {
              ...option,
              countReview: has ? option.countReview + 1 : option.countReview,
            }
          }),
        }
      })

      return { categories: newCategories }
    })
  },
  changeCountReview: (categoryId, optionName: string) => {
    set(store => {
      const newCategories = [...store.categories]
      const category =
        typeof categoryId === 'string'
          ? newCategories.find(v => v.name === categoryId)
          : newCategories.find(v => v.id === categoryId)
      if (!category) return store
      const option = category.options.find(v => v.name === optionName)
      if (!option) return store
      option.countReview++

      return { categories: newCategories }
    })
  },
  setOptionOnBoard: async (categoryId, optionName, isTrue = true) => {
    set(store => {
      const newCategories = [...store.categories]

      const categoryIndex =
        typeof categoryId === 'number'
          ? newCategories.findIndex(v => String(v.id) === String(categoryId))
          : newCategories.findIndex(v => String(v.name) === String(categoryId))

      if (categoryIndex === -1) return store

      const category = newCategories[categoryIndex]

      const optionIndex = category.options.findIndex(
        v => String(v.name) === String(optionName)
      )

      if (optionIndex === -1) return store

      newCategories[categoryIndex].options[optionIndex].isOnBoard = isTrue

      return {
        categories: newCategories,
      }
    })
  },
  sortOptions: () => {
    set(store => {
      const newCategories = [...store.categories]

      for (let category of newCategories) {
        category.options = category.options.sort(
          (a, b) => a.countReview - b.countReview
        )
      }

      return {
        categories: newCategories,
      }
    })
  },
  saveAllData: () => {
    //get categories
    const categories = get().categories

    categories.forEach((category, i) => {
      axiosApi.put(`/categories/${i + 1}`, {
        ...category,
        options: category.options,
      })
    })
  },
}))

export default useAppStore

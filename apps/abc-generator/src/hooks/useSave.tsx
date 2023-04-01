import useAppStore from '@/store/useAppStore'
import useBlockStore from '@/store/useBlockStore'
import { axiosApi } from '@/utils/axiosApi'
import { Category } from '@/utils/types/Category'
import useSentence from './useSentence'

type SaveSelectIn =
  | {
      [category: string]: string
    }
  | false

async function saveAll(
  newCategories: Category[],
  saveSelectIn: SaveSelectIn = false
) {
  // for (let category of newCategories) {
  //   try {
  //     let options = category.options
  //     if (saveSelectIn && Object.keys(saveSelectIn).includes(category.name)) {
  //       options = category.options.map(option => {
  //         const has = Object.values(saveSelectIn).includes(option.name)
  //         return {
  //           ...option,
  //           countReview: has ? option.countReview + 1 : option.countReview,
  //         }
  //       })
  //     }
  //     const newData = {
  //       ...category,
  //       options,
  //     }
  //     const data = {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newData),
  //     }
  //     const response = await fetch(
  //       `http://localhost:4000/categories/${category.id}`,
  //       data
  //     )
  //     const result = await response.json()
  //     console.log(result)
  //     // await axiosApi.put(`/categories/${category.id}`, newData)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
}

async function saveCategory(id: number, newCategory: Category) {
  await axiosApi.put(`/categories/${id}`, {
    ...newCategory,
  })
}

async function saveSentence(sentenceWithKey: string) {
  try {
    await axiosApi.post('/sentences', {
      sentence: sentenceWithKey,
    })
  } catch (error) {
    console.log('error', error)
  }
}

export default function useSave() {
  const categories = useAppStore(s => s.categories)
  const addCountReviewAllSelected = useAppStore(
    s => s.addCountReviewAllSelected
  )
  const resetSelectedIn = useBlockStore(s => s.resetSelectedIn)
  const selectedIn = useBlockStore(s => s.selectedIn)
  const { sentenceWithKey } = useSentence()

  return {
    saveCategories: async (saveSelectIn?: boolean) => {
      try {
        addCountReviewAllSelected(Object.values(selectedIn))
        saveAll(categories, saveSelectIn ? selectedIn : false)
        resetSelectedIn()
      } catch (error) {
        console.log('error', error)
      }
    },
    saveCategory,
    saveSentence: async () => {
      try {
        await saveSentence(sentenceWithKey)
        resetSelectedIn()
      } catch (error) {
        console.log('Error', error)
      }
    },
  }
}

import useSave from '@/hooks/useSave'
import useSentence from '@/hooks/useSentence'
import ColumnBlocks from '@/organisms/ColumnBlocks'
import ShowSentenceResult from '@/organisms/showSentenceResult'
import { Category } from '@/utils/types/Category'
import ModalSelect from '../organisms/ModalSelect'

interface IProps {
  data: Category[]
}

export default function GenerateScriptTemplate({ data: categories }: IProps) {
  const { sentenceWithKey } = useSentence()
  const { saveSentence, saveCategories } = useSave()
  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <ShowSentenceResult />
      <main className="flex gap-4 px-5 justify-center">
        {categories.map(category => (
          <ColumnBlocks category={category} key={category.id} />
        ))}
      </main>
      <button
        className="
          py-4 px-10 rounded-2xl bg-green-600 fixed bottom-7 right-7
          hover:bg-green-500 transition-all
        "
        onClick={() => {
          if (sentenceWithKey.length === 0) return
          saveCategories(true)
          saveSentence()

          // Object.keys(selectedIn).forEach(key => {
          //   changeCountReview(key, selectedIn[key])
          // })
        }}
      >
        Save
      </button>
      <ModalSelect categories={categories} />
    </div>
  )
}

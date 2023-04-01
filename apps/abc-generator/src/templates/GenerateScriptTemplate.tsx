import useSave from '@/hooks/useSave'
import useSentence from '@/hooks/useSentence'
import ColumnBlocks from '@/organisms/ColumnBlocks'
import ShowSentenceResult from '@/organisms/showSentenceResult'
import { Category } from '@/utils/types/Category'
import { useQuery } from 'react-query'
import ModalSelect from '../organisms/ModalSelect'
interface IProps {
  data: Category[]
}

export default function GenerateScriptTemplate({ data: categories }: IProps) {
  const { sentenceWithKey } = useSentence()
  const { saveSentence, saveCategories } = useSave()

  const {
    isLoading,
    error,
    data: sentences,
    refetch,
  } = useQuery<{ sentence: string; id: number }[]>('sentences', () =>
    fetch('http://localhost:4000/sentences?_sort=id&_order=desc').then(res =>
      res.json()
    )
  )

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
        onClick={async () => {
          if (sentenceWithKey.length === 0) return
          await saveSentence()
          await saveCategories(true)
          refetch()
          // Object.keys(selectedIn).forEach(key => {
          //   changeCountReview(key, selectedIn[key])
          // })
        }}
      >
        Save
      </button>

      <ModalSelect categories={categories} />
      {sentences && (
        <div className="flex flex-col gap-4 p-10">
          {sentences.map(({ sentence, id }) => {
            return (
              <div key={id}>
                <p className="text-xl">{sentence}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

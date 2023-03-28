import useSentence from '@/hooks/useSentence'
import useBlockStore from '@/store/useBlockStore'
import { Category } from '@/utils/types/Category'
import CellOption from '../atoms/CellOption'
import ModalSelect from '../organisms/ModalSelect'
import useAppStore from '../store/useAppStore'

interface IProps {
  data: Category[]
}

export default function GenerateScriptTemplate({ data: categories }: IProps) {
  const changeModalCategoryId = useAppStore(s => s.changeModalCategoryId)
  const changeCountReview = useAppStore(s => s.changeCountReview)
  const selectedIn = useBlockStore(s => s.selectedIn)

  function handleClick(id: any) {
    changeModalCategoryId(id)
  }

  const { sentence, rawSentence, sentenceWithKey } = useSentence()
  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <h2 className="py-6 px-4 text-3xl w-full text-center mb-10">
        {sentence.length === 0 && <div>...</div>}
        {sentence.length > 0 && (
          <div className="flex gap-2 justify-center items-center">
            {rawSentence
              .filter(v => v.length > 0)
              .map(teachText => (
                <span className="bg-blue-600/50 p-1" key={teachText}>
                  {teachText}
                </span>
              ))}
          </div>
        )}
        {sentence.length > 0 && (
          <div className="flex gap-2 justify-center items-center">
            {sentenceWithKey}
          </div>
        )}
      </h2>
      <main className="flex gap-4 px-5 justify-center">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-zinc-800 flex flex-col gap-2 p-1"
          >
            <header className="flex gap-2 self-center">
              <h2 className="text-4xl text-center">{category.name}</h2>
              <button
                className="text-4xl bg-zinc-700 rounded-full w-10"
                onClick={() => handleClick(category.id)}
              >
                +
              </button>
            </header>
            {category.options
              .filter(op => op.isOnBoard)
              .map(option => (
                <CellOption
                  categoryName={category.name}
                  option={option}
                  key={option.name}
                  onCLick={() => {
                    changeCountReview(category.id, option.name)
                  }}
                />
              ))}
          </div>
        ))}
      </main>
      <ModalSelect categories={categories} />
    </div>
  )
}

import ColumnBlocks from '@/organisms/ColumnBlocks'
import ShowSentenceResult from '@/organisms/showSentenceResult'
import { Category } from '@/utils/types/Category'
import ModalSelect from '../organisms/ModalSelect'

interface IProps {
  data: Category[]
}

export default function GenerateScriptTemplate({ data: categories }: IProps) {
  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      <ShowSentenceResult />
      <main className="flex gap-4 px-5 justify-center">
        {categories.map(category => (
          <ColumnBlocks category={category} key={category.id} />
        ))}
      </main>
      <ModalSelect categories={categories} />
    </div>
  )
}

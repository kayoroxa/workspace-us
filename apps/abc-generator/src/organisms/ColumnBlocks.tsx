import CellOption from '@/atoms/CellOption'
import useAppStore from '@/store/useAppStore'
import { Category } from '@/utils/types/Category'

export default function ColumnBlocks({ category }: { category: Category }) {
  const changeModalCategoryId = useAppStore(s => s.changeModalCategoryId)
  const changeCountReview = useAppStore(s => s.changeCountReview)

  function handleClick(id: any) {
    changeModalCategoryId(id)
  }

  return (
    <div key={category.id} className="bg-zinc-800 flex flex-col gap-2 p-1">
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
  )
}

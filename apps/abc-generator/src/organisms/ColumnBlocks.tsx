import CellOption from '@/atoms/CellOption'
import useAppStore from '@/store/useAppStore'
import { Category, Option } from '@/utils/types/Category'
import { useQuery } from 'react-query'

export default function ColumnBlocks({ category }: { category: Category }) {
  const changeModalCategoryId = useAppStore(s => s.changeModalCategoryId)
  const changeCountReview = useAppStore(s => s.changeCountReview)

  const { data: options } = useQuery<Option[]>(['options', category.id], () =>
    fetch(
      `http://localhost:4000/options?_sort=countReview&_order=asc&category_id=${category.id}&isOnBoard=true`
    ).then(res => res.json())
  )

  function handleClick(id: any) {
    changeModalCategoryId(id)
  }
  return (
    <div
      key={category.id}
      className="bg-zinc-800 flex flex-col gap-2 p-1 whitespace-nowrap"
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
      {options &&
        options
          .filter(o => o.isOnBoard === true)
          .map(option => (
            <CellOption
              category={category}
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

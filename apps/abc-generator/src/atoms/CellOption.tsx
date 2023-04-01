import useQ from '@/hooks/useQ'
import useSave from '@/hooks/useSave'
import useAppStore from '@/store/useAppStore'
import useBlockStore from '@/store/useBlockStore'
import { Category, Option } from '@/utils/types/Category'
import { useEffect, useState } from 'react'

interface Props {
  option: Option
  onCLick: () => void
  category: Category
}

export default function CellOption({ option, onCLick, category }: Props) {
  const selectedIn = useBlockStore(s => s.selectedIn)
  const setAsSelect = useBlockStore(s => s.setAsSelect)
  const setOptionOnBoard = useAppStore(s => s.setOptionOnBoard)
  const { saveCategory } = useSave()

  const { changeDataOption } = useQ()

  const categoryName = category.name

  const isActive = selectedIn[categoryName] === option.name

  function handleCLick(e: any) {
    if (e.ctrlKey) {
      if (isActive) setAsSelect(categoryName, false)
      // setOptionOnBoard(categoryName, option.name, false)
      changeDataOption(option.id, { isOnBoard: false })
      // saveCategory(category.id, category)
    } else if (!isActive) {
      if (isActive) setAsSelect(categoryName, false)
      setAsSelect(categoryName, option.name)
    }

    if (isActive) setAsSelect(categoryName, false)
  }

  const [countReview, setCountReview] = useState(option.countReview)

  useEffect(() => {
    if (isActive) {
      setCountReview(option.countReview + 1)
    } else {
      setCountReview(option.countReview)
    }
  }, [isActive, option.countReview])

  return (
    <div
      key={option.name}
      className={`
        ${
          isActive
            ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-zinc-700/50 hover:bg-zinc-700'
        }
        flex flex-row gap-6 justify-between px-5 py-2 hover:cursor-pointer
      `}
      onClick={handleCLick}
    >
      <div>{option.name}</div>
      <div>{countReview}</div>
    </div>
  )
}

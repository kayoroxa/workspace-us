import useAppStore from '@/store/useAppStore'
import useBlockStore from '@/store/useBlockStore'
import { useEffect, useState } from 'react'

interface Props {
  option: {
    name: string
    countReview: number
  }
  onCLick: () => void
  categoryName: string
}

export default function CellOption({ option, onCLick, categoryName }: Props) {
  const selectedIn = useBlockStore(s => s.selectedIn)
  const setAsSelect = useBlockStore(s => s.setAsSelect)
  const setOptionOnBoard = useAppStore(s => s.setOptionOnBoard)

  const isActive = selectedIn[categoryName] === option.name

  function handleCLick(e: any) {
    if (e.ctrlKey) {
      if (isActive) setAsSelect(categoryName, '')
      setOptionOnBoard(categoryName, option.name, false)
    } else if (!isActive) {
      if (isActive) setAsSelect(categoryName, '')
      setAsSelect(categoryName, option.name)
    }

    if (isActive) setAsSelect(categoryName, '')
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

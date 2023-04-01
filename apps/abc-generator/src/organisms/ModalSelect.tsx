import useQ from '@/hooks/useQ'
import useSave from '@/hooks/useSave'
import { Category, Option } from '@/utils/types/Category'
import { useState } from 'react'
import Modal from 'react-modal'
import { useQuery } from 'react-query'
import useAppStore from '../store/useAppStore'

interface IProps {
  categories: Category[]
}

export default function ModalSelect() {
  const modalCategoryId = useAppStore(s => s.modalCategoryId)
  const changeModalCategoryId = useAppStore(s => s.changeModalCategoryId)
  const setOptionOnBoard = useAppStore(s => s.setOptionOnBoard)

  const { data: options } = useQuery<Option[]>(
    ['options', modalCategoryId],
    () =>
      fetch(`http://localhost:4000/options?categoryId=${modalCategoryId}`).then(
        res => res.json()
      )
  )

  const [addOptionsSession, setAddOptionsSession] = useState(false)

  // const category = categories.find(
  //   v => String(v.id) === String(modalCategoryId)
  // )
  const { saveCategory } = useSave()
  const { changeDataOption } = useQ()
  return (
    <Modal
      className="bg-zinc-800 w-fit h-fit fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center rounded-xl overflow-hidden text-white"
      isOpen={modalCategoryId !== null}
      onRequestClose={() => {
        changeModalCategoryId(null)
        // saveCategories()
      }}
    >
      <header>
        <button
          onClick={() => setAddOptionsSession(p => !p)}
          className="text-3xl"
        >
          🔃
        </button>
      </header>
      <main className="w-[40vw] flex flex-col gap-2 p-10">
        {addOptionsSession && <textarea />}
        {!addOptionsSession &&
          options &&
          options
            ?.filter(op => !op.isOnBoard)
            .map(option => (
              <div
                key={option.name}
                className="bg-zinc-700 p-2 hover:bg-zinc-600/70 hover:cursor-pointer"
                onClick={() => {
                  changeDataOption(option.id, { isOnBoard: true })
                  // setOptionOnBoard(category.id, option.name)
                  // saveCategory(category.id, category)
                }}
                // onClick={() => changeModalCategoryId(category.id, option.name)}
              >
                {option.name}
              </div>
            ))}
      </main>
    </Modal>
  )
}

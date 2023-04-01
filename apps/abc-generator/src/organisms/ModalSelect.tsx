import Input from '@/atoms/Input'
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
  const { deleteOptions } = useQ()

  const [addOptionsSession, setAddOptionsSession] = useState(false)

  // const category = categories.find(
  //   v => String(v.id) === String(modalCategoryId)
  // )
  const { saveCategory } = useSave()
  const { changeDataOption } = useQ()
  return (
    <Modal
      className="bg-zinc-800 w-fit h-fit fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col justify-center items-center rounded-xl overflow-hidden text-white p-10 gap-5"
      isOpen={modalCategoryId !== null}
      onRequestClose={() => {
        changeModalCategoryId(null)
        // saveCategories()
      }}
    >
      <header className="flex justify-center items-center gap-5 w-full">
        <Input />
      </header>
      <main className="w-[40vw] flex flex-col gap-2">
        {!addOptionsSession &&
          options &&
          options
            ?.filter(op => !op.isOnBoard)
            .map(option => (
              <div
                key={option.name}
                className="bg-zinc-700 p-2 hover:bg-zinc-600/70 hover:cursor-pointer flex justify-between"
                onClick={() => {
                  changeDataOption(option.id, { isOnBoard: true })
                  // setOptionOnBoard(category.id, option.name)
                  // saveCategory(category.id, category)
                }}
                // onClick={() => changeModalCategoryId(category.id, option.name)}
              >
                <span>{option.name}</span>
                <button onClick={() => deleteOptions(option.id)}>🚮</button>
              </div>
            ))}
      </main>
    </Modal>
  )
}

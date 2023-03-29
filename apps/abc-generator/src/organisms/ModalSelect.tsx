import useSave from '@/hooks/useSave'
import { Category } from '@/utils/types/Category'
import Modal from 'react-modal'
import useAppStore from '../store/useAppStore'

interface IProps {
  categories: Category[]
}

export default function ModalSelect({ categories }: IProps) {
  const modalCategoryId = useAppStore(s => s.modalCategoryId)
  const changeModalCategoryId = useAppStore(s => s.changeModalCategoryId)
  const setOptionOnBoard = useAppStore(s => s.setOptionOnBoard)
  const category = categories.find(
    v => String(v.id) === String(modalCategoryId)
  )
  const { saveCategory } = useSave()

  return (
    <Modal
      className="bg-zinc-800 w-fit h-fit fixed top-0 left-0 right-0 bottom-0 m-auto flex justify-center items-center rounded-xl overflow-hidden text-white"
      isOpen={modalCategoryId !== null}
      onRequestClose={() => {
        changeModalCategoryId(null)
        // saveCategories()
      }}
    >
      <main className="w-[40vw] flex flex-col gap-2 p-10">
        {category?.options
          ?.filter(op => !op.isOnBoard)
          .map(option => (
            <div
              key={option.name}
              className="bg-zinc-700 p-2 hover:bg-zinc-600/70 hover:cursor-pointer"
              onClick={() => {
                setOptionOnBoard(category.id, option.name)
                saveCategory(category.id, category)
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

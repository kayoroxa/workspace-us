import { AiFillDelete } from 'react-icons/ai'

interface Props {
  onDelete: () => void
}

export default function DeleteButton({ onDelete }: Props) {
  return (
    <>
      <AiFillDelete
        size={25}
        className="fill-zinc-200 absolute top-2 right-2 hidden group-hover:block hover:fill-red-500 hover:cursor-pointer z-10"
        onClick={(e: any) => {
          e.stopPropagation()
          onDelete()
        }}
      />
    </>
  )
}

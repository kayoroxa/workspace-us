import { useState } from 'react'
import { IoAddCircleSharp } from 'react-icons/io5'
import { DataObj } from '../utils/types/FormData'
import CrudForm from './CrudForm'

interface Props {
  title: string
  data: DataObj
  onSubmit: (v: any) => void
}

export default function CreateButton({ title, data, onSubmit }: Props) {
  const [showForm, setShowForm] = useState<boolean>(false)
  return (
    <>
      <button
        onClick={e => {
          e.stopPropagation()
          setShowForm(true)
        }}
        className="p-2 bg-orange-500 hover:bg-orange-600 rounded-xl flex justify-center items-center gap-3"
      >
        <span>{title}</span>
        <IoAddCircleSharp size={30} />
      </button>
      {showForm && (
        <CrudForm
          title={title}
          data={data}
          onSubmit={onSubmit}
          onRequestClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}

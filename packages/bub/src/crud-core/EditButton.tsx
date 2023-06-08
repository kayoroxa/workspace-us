import { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import CrudForm, { DataObj } from './CrudForm'

interface Props {
  title: string
  data: DataObj
  onSubmit: (v: any) => void
}

export default function EditButton({ title, data, onSubmit }: Props) {
  const [showForm, setShowForm] = useState<boolean>(false)
  return (
    <>
      <FaEdit
        size={25}
        className="fill-zinc-200 absolute top-2 right-10 hidden group-hover:block hover:fill-purple-500 hover:cursor-pointer z-10"
        onClick={(e: any) => {
          e.stopPropagation()
          setShowForm(true)
        }}
      />
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

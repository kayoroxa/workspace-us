import { FaEdit } from 'react-icons/fa'
import useFormStore from '../store/useForm'
import { DataObj } from '../utils/types/FormData'

interface Props {
  title: string
  data: DataObj
  onSubmit: (v: any) => void
}

export default function EditButton({ title, data, onSubmit }: Props) {
  const setFormData = useFormStore(state => state.setFormData)

  return (
    <>
      <FaEdit
        size={25}
        className="fill-zinc-200 absolute top-2 right-10 hidden group-hover:block hover:fill-purple-500 hover:cursor-pointer z-10"
        onClick={(e: any) => {
          e.stopPropagation()
          setFormData({
            data,
            title,
            onSubmit,
          })
        }}
      />
    </>
  )
}

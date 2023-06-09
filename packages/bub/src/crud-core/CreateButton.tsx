import { IoAddCircleSharp } from 'react-icons/io5'
import useFormStore from '../store/useForm'
import { DataObj } from '../utils/types/FormData'

interface Props {
  title: string
  data: DataObj
  onSubmit: (v: any) => void
  className?: string
}

export default function CreateButton({
  title,
  data,
  onSubmit,
  className = '',
}: Props) {
  // const [showForm, setShowForm] = useState<boolean>(false)
  const setFormData = useFormStore(state => state.setFormData)
  return (
    <>
      <button
        onClick={e => {
          e.stopPropagation()
          setFormData({
            data,
            title,
            onSubmit,
          })
        }}
        className={
          className +
          ' p-2 bg-orange-500 hover:bg-orange-600 rounded-xl flex justify-center items-center gap-3 w-fit'
        }
      >
        <span>{title}</span>
        <IoAddCircleSharp size={30} />
      </button>
    </>
  )
}

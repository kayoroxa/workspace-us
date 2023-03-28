import useBub from '../main'

interface Props {
  type: 'text' | 'password' | 'email'
  className?: string
  id?: string
  onClick?: () => void
}

export default function Input({ className, id, onClick, type }: Props) {
  const { getRef } = useBub()

  return (
    <input
      type={type}
      className={
        className ||
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      }
      onClick={onClick}
      ref={id ? getRef(id) : undefined}
    />
  )
}

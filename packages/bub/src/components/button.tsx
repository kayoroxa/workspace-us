import useBub from '../main'

interface Props {
  children?: React.ReactNode
  className?: string
  id?: string
  onClick?: () => void
}

export default function Button({ children, className, id, onClick }: Props) {
  const { getRef } = useBub()

  return (
    <button
      className={
        className ||
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      }
      onClick={onClick}
      ref={id ? getRef(id) : undefined}
    >
      {children}
    </button>
  )
}

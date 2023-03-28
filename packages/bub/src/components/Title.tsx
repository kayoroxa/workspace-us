import useBub from '../main'

interface Props {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function Title({ children, className, id }: Props) {
  const { getRef } = useBub()
  return (
    <h1
      className={className || 'text-2xl font-bold bg-black'}
      ref={id ? getRef(id) : undefined}
    >
      {children}
    </h1>
  )
}

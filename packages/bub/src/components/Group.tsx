import useBub from '../main'

interface Props {
  children: React.ReactNode
  className?: string
  id?: string
}

export default function Group({ children, className, id }: Props) {
  const { getRef } = useBub()

  return (
    <h1
      className={className || 'flex flex-col gap-4'}
      ref={id ? getRef(id) : undefined}
    >
      {children}
    </h1>
  )
}

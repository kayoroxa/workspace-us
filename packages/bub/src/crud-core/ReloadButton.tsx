import { IoReloadCircleSharp } from 'react-icons/io5'

interface Props {
  onReload: () => void
}

export default function ReloadButton({ onReload: onReload }: Props) {
  return (
    <>
      <IoReloadCircleSharp
        size={25}
        className="fill-zinc-200 absolute top-2 right-20 hidden group-hover:block hover:fill-green-500 hover:cursor-pointer z-10"
        onClick={(e: any) => {
          e.stopPropagation()
          onReload()
        }}
      />
    </>
  )
}

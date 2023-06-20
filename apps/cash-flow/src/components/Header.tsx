import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <div className="w-full bg-zinc-700 flex gap-5 p-3 text-lg">
        <Link href="/" className=" hover:text-blue-400">
          Home
        </Link>
        <Link href="/config" className=" hover:text-blue-400">
          Config
        </Link>
      </div>
    </header>
  )
}

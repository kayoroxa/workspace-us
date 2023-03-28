export default function Header() {
  return (
    <div className="flex gap-10 justify-end items-center w-full bg-green-600 py-4 px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">Cadeira</h1>
        <button className="bg-green-500 py-2 px-4 rounded-3xl">Hello</button>
      </div>

      <img
        src="https://conteudo.imguol.com.br/c/entretenimento/80/2017/04/25/a-atriz-zoe-saldana-como-neytiri-em-avatar-1493136439818_v2_4x3.jpg"
        alt=""
        className="h-[75px] w-[75px] rounded-3xl border border-2 border-white"
      />
    </div>
  )
}

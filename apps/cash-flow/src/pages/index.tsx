import useBub, { Button } from 'bub'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { action, createForm } = useBub()

  return (
    <div>
      <Button
        onClick={() => {
          action.toggleShowElement('title-1')

          createForm({
            title: 'criar nova transação',
            onSubmit: (e: any) => {
              // action.changeValue('title-1', e.name)
            },
            data: {
              name: {
                type: 'string',
              },
            },
          })
          // action.changeValue('title-1', ref['nome'])
        }}
        id="button-1"
        // className="
        //   bg-blue-500
        //   hover:bg-blue-700
        //   text-white
        //   font-bold
        //   py-2 px-4
        //   rounded"
      >
        CLick
      </Button>
    </div>
  )
}

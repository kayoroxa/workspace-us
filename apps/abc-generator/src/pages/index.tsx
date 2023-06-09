import styles from '@/styles/Home.module.css'
import useBub, { Button, Input, Title } from 'bub'
import {} from 'bub/crud'
import { Inter } from 'next/font/google'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { getRef, action, ref, createForm } = useBub()

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Input type="text" id="nome" />
        <Title className="text-3xl" id="title-1">
          Hello word
        </Title>
        <Button
          onClick={() => {
            action.toggleShowElement('title-1')

            createForm({
              title: 'criar nova transação',
              onSubmit: (e: any) => {
                action.changeValue('title-1', e.name)
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
      </main>
    </>
  )
}

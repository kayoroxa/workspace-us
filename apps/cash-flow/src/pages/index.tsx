import {
  Transaction,
  useAccount,
  useTransactions,
  useUser,
} from '@/hooks/useCruds'
import { CreateButton, DeleteButton, EditButton } from 'bub/crud'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface TransactionsProps {
  allTransactions: Transaction[]
  onClick?: (transaction: Transaction) => void
  type: 'income' | 'outcome'
}

export function GridTransactions({
  allTransactions,
  onClick,
  type,
}: TransactionsProps) {
  const deleteTransaction = useTransactions().delete
  const update = useTransactions().update
  const { data: allUsers } = useUser().get()

  const { data: allAccount } = useAccount().get()

  return (
    <div className="flex flex-col gap-3 w-fit">
      {allTransactions?.map(t => (
        <div
          key={t.id}
          className="flex gap-4 py-4 pl-3 pr-20 relative group bg-zinc-700 flex-1 hover:cursor-pointer"
          onClick={() => onClick && onClick(t)}
        >
          <DeleteButton onDelete={() => deleteTransaction(t.id)} />
          <EditButton
            title="Editar"
            data={{
              name: {
                type: 'string',
                initialValue: t.name,
              },
              amount: {
                type: 'number',
                initialValue: t.amount,
              },
              account_id: {
                type: 'datalist',
                options: allAccount?.map(a => ({ label: a.name, value: a.id })),
                initialValue: t.account_id,
              },
              user_id: {
                type: 'datalist',
                options: allUsers?.map(a => ({ label: a.name, value: a.id })),
                initialValue: t.user_id,
              },
            }}
            onSubmit={(newValue: Partial<Transaction>) => {
              update(t.id, newValue)
            }}
          />
          <div className="">🏛️: {t.account_id}</div>
          <div>{t.name}</div>
          <div className="">
            {type === 'outcome' && '-'}R${t.amount}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const create = useTransactions().create

  const { data: allReceitas } = useTransactions().get({
    params: { type: 'income' },
  })
  const { data: allDespesas } = useTransactions().get({
    params: { type: 'outcome' },
  })

  const { data: allUsers } = useUser().get()

  const { data: allAccount } = useAccount().get()

  // const sortedTransactions = allTransactions.sort((a, b) => a.amount - b.amount)
  // const { data: allTransactions } = useTransactions().get({
  //   id: 4,
  //   params: { name: 'uber' },
  // })

  const route = useRouter()

  const saldo = useMemo(() => {
    if (!allReceitas || !allDespesas) return 0

    return [...allReceitas, ...allDespesas]?.reduce((acc, transaction) => {
      if (transaction.type === 'outcome') {
        return acc - transaction.amount
      }
      return acc + transaction.amount
    }, 0)
  }, [allReceitas, allDespesas])

  return (
    <div className={`${inter.className} `}>
      <header className="flex gap-4 px-10 py-5 bg-green-700 text-3xl">
        <h1>Saldo:</h1>
        <h1>R$ {saldo}</h1>
      </header>
      <main className="flex justify-between w-full mt-5">
        <section className="flex flex-col items-center flex-1">
          <CreateButton
            title="criar nova DESPESA"
            data={{
              name: {
                type: 'string',
              },
              amount: {
                type: 'number',
              },
              account_id: {
                type: 'datalist',
                options: allAccount?.map(a => ({ label: a.name, value: a.id })),
              },
              user_id: {
                type: 'datalist',
                options: allUsers?.map(a => ({ label: a.name, value: a.id })),
                initialValue: 1,
              },
            }}
            onSubmit={(e: any) => {
              create({ ...e, type: 'outcome', date: new Date() })
            }}
          />
          {/* {JSON.stringify(allTransactions)} */}
          <h1>Todas as transações:</h1>
          <GridTransactions
            allTransactions={allDespesas}
            type="outcome"
            onClick={t => {
              if (t.account_id) route.push('/account/' + t.account_id)
            }}
          />
        </section>
        <section className="flex flex-col items-center flex-1">
          <CreateButton
            title="criar nova RECEITA"
            className="bg-green-500 hover:bg-green-600"
            data={{
              name: {
                type: 'string',
              },
              amount: {
                type: 'number',
              },
              account_id: {
                type: 'datalist',
                options: allAccount?.map(a => ({ label: a.name, value: a.id })),
              },
              user_id: {
                type: 'datalist',
                options: allUsers?.map(a => ({ label: a.name, value: a.id })),
                initialValue: 1,
              },
            }}
            onSubmit={(e: any) => {
              create({ ...e, type: 'income', date: new Date() })
            }}
          />
          {/* {JSON.stringify(allTransactions)} */}
          <h1>Todas as transações:</h1>
          <GridTransactions
            allTransactions={allReceitas}
            type="income"
            onClick={t => {
              if (t.account_id) route.push('/account/' + t.account_id)
            }}
          />
        </section>
      </main>
    </div>
  )
}

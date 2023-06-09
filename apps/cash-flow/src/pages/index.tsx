import { Transaction, useTransactions } from '@/hooks/useCruds'
import { CreateButton, DeleteButton, EditButton } from 'bub/crud'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

interface TransactionsProps {
  allTransactions: Transaction[]
  onClick?: (transaction: Transaction) => void
}

export function GridTransactions({
  allTransactions,
  onClick,
}: TransactionsProps) {
  const deleteTransaction = useTransactions().delete
  const update = useTransactions().update
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
                type: 'number',
                initialValue: t.account_id,
              },
            }}
            onSubmit={(newValue: Partial<Transaction>) => {
              update(t.id, newValue)
            }}
          />
          <div className="">🏛️: {t.account_id}</div>
          <div>{t.name}</div>
          <div className="">R${t.amount}</div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const create = useTransactions().create

  const { data: allTransactions } = useTransactions().get()

  // const sortedTransactions = allTransactions.sort((a, b) => a.amount - b.amount)
  // const { data: allTransactions } = useTransactions().get({
  //   id: 4,
  //   params: { name: 'uber' },
  // })

  const route = useRouter()

  return (
    <div className={`${inter.className} flex justify-between w-full mt-5`}>
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
              type: 'number',
            },
          }}
          onSubmit={(e: any) => {
            create(e)
          }}
        />
        {/* {JSON.stringify(allTransactions)} */}
        <h1>Todas as transações:</h1>
        <GridTransactions
          allTransactions={allTransactions}
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
              options: [
                {
                  label: 'Nubank',
                  value: 1,
                },
                {
                  label: 'Hotmart',
                  value: 2,
                },
              ],
            },
          }}
          onSubmit={(e: any) => {
            debugger
            create(e)
          }}
        />
        {/* {JSON.stringify(allTransactions)} */}
        <h1>Todas as transações:</h1>
        <GridTransactions
          allTransactions={allTransactions}
          onClick={t => {
            if (t.account_id) route.push('/account/' + t.account_id)
          }}
        />
      </section>
    </div>
  )
}

import { GridTransactions } from '@/components/GridTransactions'
import {
  useAccount,
  useLabels,
  useTransactions,
  useUser,
} from '@/hooks/useCruds'
import { CreateButton } from 'bub/crud'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const create = useTransactions().create

  const { data: allReceitas } = useTransactions().get({
    params: { type: 'income', _sort: 'id', _order: 'desc' },
  })
  const { data: allDespesas } = useTransactions().get({
    params: { type: 'outcome', _sort: 'id', _order: 'desc' },
  })

  const { data: allUsers } = useUser().get()

  const { data: allAccount } = useAccount().get()
  const { data: allLabels } = useLabels().get()

  // const sortedTransactions = allTransactions.sort((a, b) => a.amount - b.amount)
  // const { data: allTransactions } = useTransactions().get({
  //   id: 4,
  //   params: { name: 'uber' },
  // })

  const route = useRouter()

  const metrics = useMemo(() => {
    if (!allReceitas || !allDespesas)
      return {
        saldo: 0,
        today: { receitas: 0, despesas: 0 },
        unpaid: 0,
      }

    const saldo = [...allReceitas, ...allDespesas]?.reduce(
      (acc, transaction) => {
        if (transaction.type === 'outcome') {
          return acc - transaction.amount
        }
        return acc + transaction.amount
      },
      0
    )

    const todayReceitas = allReceitas
      .filter(t => new Date(t.date).getDate() === new Date().getDate())
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    const todayDespesas = allDespesas
      .filter(t => new Date(t.date).getDate() === new Date().getDate())
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    const allUnPaid = allDespesas
      .filter(t => t.isPaid === false)
      .reduce((acc, transaction) => acc + transaction.amount, 0)

    const totalDespesas = allDespesas.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    )

    return {
      saldo,
      today: { receitas: todayReceitas, despesas: todayDespesas },
      unpaid: allUnPaid,
      totalDespesas,
    }
  }, [allReceitas, allDespesas])

  const userDespesas = useMemo(() => {
    if (!allDespesas) return 0

    return allDespesas?.reduce((acc, transaction) => {
      acc[transaction.user_id] =
        (acc[transaction.user_id] || 0) + transaction.amount

      return acc
    }, {} as { [key: number]: number })
  }, [allDespesas])

  return (
    <div className={`${inter.className} `}>
      <header className="flex gap-4 px-36 py-5 bg-green-700 justify-between items-center">
        <div>
          <h1 className="text-3xl">
            Saldo:{' '}
            {metrics.saldo.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </h1>
          <h1 className="text-xl">
            ➕{' '}
            {metrics.today?.receitas.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </h1>
          {metrics.today?.despesas > 0 && (
            <h1 className="text-red-200 text-xl">
              ➖{' '}
              {metrics.today?.despesas.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </h1>
          )}
        </div>

        <div>
          <h1 className="text-3xl">
            Despesas:{' '}
            <span className="text-red-200">
              {metrics.totalDespesas
                ? metrics.totalDespesas.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : 0}
            </span>
          </h1>

          <h3 className="text-xl">
            fatura:{' '}
            <span className="text-red-200">
              {metrics.unpaid > 0 &&
                metrics.unpaid.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
            </span>
          </h3>
        </div>

        {userDespesas && (
          <ul className="flex flex-col items-end">
            {Object.entries(userDespesas).map(([key, value]) => (
              <li key={key} className="flex gap-4">
                <h1>
                  {allUsers.find(u => u.id === Number(key))?.name || 'Sem nome'}
                </h1>
                <h1 className="text-red-200">-R$ {value}</h1>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main className="flex justify-between w-full mt-5">
        <section className="flex flex-col items-center flex-1  gap-4">
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
              date: {
                type: 'date',
                initialValue: new Date(),
              },
              category_id: {
                type: 'datalist',
                options: allLabels?.map(a => ({ label: a.name, value: a.id })),
              },
            }}
            onSubmit={(e: any) => {
              create({
                ...e,
                type: 'outcome',
                date: new Date().toLocaleDateString('pt-BR'),
              })
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
        <section className="flex flex-col items-center flex-1 gap-4">
          <div className="flex gap-4">
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
                  options: allAccount?.map(a => ({
                    label: a.name,
                    value: a.id,
                  })),
                },
                user_id: {
                  type: 'datalist',
                  options: allUsers?.map(a => ({ label: a.name, value: a.id })),
                  initialValue: 1,
                },
                date: {
                  type: 'date',
                  initialValue: new Date(),
                },
              }}
              onSubmit={(e: any) => {
                create({
                  ...e,
                  type: 'income',
                  date: new Date().toLocaleDateString('pt-BR'),
                })
              }}
            />
            <button
              className="bg-green-600  p-2 rounded-md"
              onClick={() => {
                create({
                  type: 'income',
                  date: new Date().toLocaleDateString('pt-BR'),
                  amount: 328.51,
                  name: 'venda FDF',
                  account_id: 2,
                })
              }}
            >
              venda
            </button>
            <button
              className="bg-green-700 p-2 rounded-md"
              onClick={() => {
                create({
                  type: 'income',
                  date: new Date().toLocaleDateString('pt-BR'),
                  amount: 221.62,
                  name: 'venda afiliado FDF',
                  account_id: 2,
                })
              }}
            >
              venda afiliado
            </button>
          </div>
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

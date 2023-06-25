import { GridTransactions } from '@/components/GridTransactions'
import { useAccount, useTransactions } from '@/hooks/useCruds'
import { useRouter } from 'next/router'

export default function AccountPage() {
  //get params router
  const route = useRouter()
  const id = Number(route.query.id || -1)

  const { data: accounts, isLoading } = useAccount().get({ id })
  let account = accounts?.[0] || accounts

  const { data: allReceitas } = useTransactions().get({
    params: { account_id: id, type: 'income', _sort: 'id', _order: 'desc' },
  })

  const { data: allDespesas } = useTransactions().get({
    params: { account_id: id, type: 'outcome', _sort: 'id', _order: 'desc' },
  })

  if (isLoading) return <div className="animate-pulse">Carregando...</div>

  if (!account || !allReceitas || !allDespesas)
    return <div className="">Not found...</div>

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl p-5 mt-10 text-center">
        Bem vindo a sua conta:{' '}
        <span className="bg-yellow-500 text-zinc-900 px-3 py-1">
          {account.name}
        </span>
      </h1>
      <h2 className="text-3xl text-center">Transações:</h2>
      <div className="flex gap-20 justify-center">
        <GridTransactions allTransactions={allDespesas} type="outcome" />
        <GridTransactions allTransactions={allReceitas} type="income" />
      </div>
    </div>
  )
}

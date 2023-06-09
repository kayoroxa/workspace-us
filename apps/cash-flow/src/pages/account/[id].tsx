import { useAccount, useTransactions } from '@/hooks/useCruds'
import { useRouter } from 'next/router'
import { GridTransactions } from '..'
;[
  {
    name: 'restaurante',
    amount: 6.5,
    id: 9,
    account_id: 2,
  },
]
export default function AccountPage() {
  //get params router
  const route = useRouter()
  const id = Number(route.query.id || -1)

  const { data: accounts, isLoading } = useAccount().get({ id })
  let account = accounts?.[0] || accounts

  const { data: allTransactions } = useTransactions().get({
    params: { account_id: id },
  })

  if (isLoading) return <div className="animate-pulse">Carregando...</div>

  if (!account || !allTransactions) return <div className="">Not found...</div>

  return (
    <div>
      <h1>Bem vindo a sua conta: {account.name}</h1>
      <h2>Transações:</h2>
      <GridTransactions allTransactions={allTransactions} />
    </div>
  )
}

import myDate from '@/utils/myDate'

import {
  Transaction,
  useAccount,
  useLabels,
  useTransactions,
  useUser,
} from '@/hooks/useCruds'

import { DeleteButton, EditButton } from 'bub/crud'

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
  const { data: allLabels } = useLabels().get()

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
              category_id: {
                type: 'datalist',
                options: allLabels?.map(a => ({ label: a.name, value: a.id })),
              },
              date: {
                type: 'date',
                initialValue: t.date,
              },
            }}
            onSubmit={(newValue: Partial<Transaction>) => {
              update(t.id, newValue)
            }}
          />
          <div className="">
            {t.user_id === 1 ? '🤴🏽' : t.user_id === 2 ? '👩🏽🌹' : ''}
          </div>
          <div className="">🏛️: {t.account_id}</div>
          <div>{t.name}</div>
          <div className="">
            {type === 'outcome' && '-'}R${t.amount}
          </div>
          <div className="">📆{myDate(t.date).getMonth()}</div>
        </div>
      ))}
    </div>
  )
}

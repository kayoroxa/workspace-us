import { createUseCrud } from 'bub'

export interface User {
  id: number
  name: string
}

export interface Transaction {
  id: number
  name: string
  amount: number
  user_id: User['id']
  date: Date
  description: string
  type: 'income' | 'outcome'
  account_id: Account['id']
  order: number
  isPaid?: boolean
}

export interface Account {
  id: number
  name: string
}

export interface Label {
  id: number
  name: string
}

const data = {
  name: {
    type: 'string',
    initialValue: '',
  },
  amount: {
    type: 'number',
    initialValue: 0,
  },
  account_id: {
    type: 'datalist',
    options: [],
    initialValue: 0,
  },
  user_id: {
    type: 'datalist',
    options: [],
    initialValue: 0,
  },
  category_id: {
    type: 'datalist',
  },
}

export const useUser = () =>
  createUseCrud<User>({
    singularLabel: 'user',
    pluralLabel: 'users',
  })

export const useAccount = () =>
  createUseCrud<Account>({
    singularLabel: 'account',
    pluralLabel: 'accounts',
  })

export const useTransactions = () =>
  createUseCrud<Transaction>({
    singularLabel: 'transaction',
    pluralLabel: 'transactions',
  })

export const useLabels = () =>
  createUseCrud<Label>({
    singularLabel: 'label',
    pluralLabel: 'labels',
  })

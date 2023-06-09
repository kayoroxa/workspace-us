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
}

export interface Account {
  id: number
  name: string
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

// src/utils/types/eventBuy.ts
export type _EventBuy = {
  id?: string
  productName: string
  buyerName: string
  phone: string
  email: string
  event: string
  date: string
  pagamento?: string
  historic?: string
  reviewed?: boolean
  refusal_reason?: string
  recurrence_number?: number | null
  installments_number: number | null
  src?: string
  distinctId?: string
}

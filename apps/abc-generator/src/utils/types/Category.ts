export type Option = {
  name: string
  countReview: number
  isOnBoard?: boolean
}

export type Category = {
  id: number
  name: string
  options: Option[]
}

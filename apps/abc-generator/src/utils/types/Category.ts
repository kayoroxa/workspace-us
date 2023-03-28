export type Category = {
  id: number
  name: string
  options: {
    name: string
    countReview: number
    isOnBoard?: boolean
  }[]
}

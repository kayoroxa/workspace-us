import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import WrapperCrudForm from '../crud-core/WrapperCrudForm'

interface Props {
  children: ReactNode | ReactNode[]
}
export const queryClient = new QueryClient()

export default function BubWrapper({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <WrapperCrudForm>{children}</WrapperCrudForm>
    </QueryClientProvider>
  )
}

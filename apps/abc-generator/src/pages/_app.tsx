import '@/styles/globals.css'
import { WrapperCrudForm } from 'bub/crud'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <WrapperCrudForm>
        <Component {...pageProps} />
      </WrapperCrudForm>
    </QueryClientProvider>
  )
}

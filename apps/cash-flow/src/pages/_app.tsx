import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { WrapperCrudForm } from 'bub/crud'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WrapperCrudForm>
      <Component {...pageProps} />
    </WrapperCrudForm>
  )
}

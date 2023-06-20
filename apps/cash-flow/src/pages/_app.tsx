import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import Header from '@/components/Header'
import { BubWrapper } from 'bub'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BubWrapper>
      <Header />
      <Component {...pageProps} />
    </BubWrapper>
  )
}

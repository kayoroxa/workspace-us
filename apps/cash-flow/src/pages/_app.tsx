import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { BubWrapper } from 'bub'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BubWrapper>
      <Component {...pageProps} />
    </BubWrapper>
  )
}

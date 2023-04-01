import useBlockStore from '@/store/useBlockStore'
import { useState } from 'react'

export default function useSentence() {
  const selectedIn = useBlockStore(s => s.selectedIn)
  const [allSentences, setAllSentences] = useState<string[]>([])

  return {
    sentence: Object.values(selectedIn).join(' '),
    sentenceWithKey: Object.values(selectedIn)
      .filter(v => v.length > 0)
      .map(v => `{${v}}`)
      .join(' '),
    rawSentence: Object.values(selectedIn),
    allSentences: [],
    setSentence: (sentence: string) => {},
  }
}

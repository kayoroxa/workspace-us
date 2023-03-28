import useBlockStore from '@/store/useBlockStore'

export default function useSentence() {
  const selectedIn = useBlockStore(s => s.selectedIn)

  return {
    sentence: Object.values(selectedIn).join(' '),
    sentenceWithKey: Object.values(selectedIn)
      .filter(v => v.length > 0)
      .map(v => `{${v}}`)
      .join(' '),
    rawSentence: Object.values(selectedIn),
  }
}

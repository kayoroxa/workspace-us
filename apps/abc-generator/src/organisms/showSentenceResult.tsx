import useSentence from '@/hooks/useSentence'

export default function ShowSentenceResult() {
  const { sentence, rawSentence, sentenceWithKey } = useSentence()
  return (
    <div className="py-6 px-4 text-3xl w-full text-center mb-10 h-28">
      {/* {sentence.length === 0 && <div>...</div>} */}
      {sentence.length > 0 && (
        <div className="flex gap-2 justify-center items-center">
          {rawSentence.filter(v => v.length > 0).join(' ')}
        </div>
      )}

      <div className="flex gap-2 justify-center items-center">
        {sentence.length > 0 ? sentenceWithKey : '..'}
      </div>
    </div>
  )
}
